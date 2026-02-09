""" Unified home for training and evaluation. Imports model and dataloader. """

import time
import math
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
import pickle
import random
import argparse
import sys

# Import network and data loader
sys.path.insert(1, './model')
from network import Network
from data_loader import MRIData

# ----------------- ARGUMENT PARSING -----------------
parser = argparse.ArgumentParser(description='Train and validate network.')
parser.add_argument('--disable-cuda', action='store_true', default=False,
                    help='Disable CUDA')
args = parser.parse_args()
args.device = None

print(args.disable_cuda)
if torch.cuda.is_available() and not args.disable_cuda:
    print("Using CUDA. : )")
    args.device = torch.device('cuda')
else:
    print("We aren't using CUDA.")
    args.device = torch.device('cpu')

# Set random seeds for reproducibility
torch.manual_seed(1)
random.seed(1)

# ----------------- HYPERPARAMETERS -----------------
BATCH_SIZE = 10
LSTM_output_size = 16
input_size = 1
output_dimension = 2
learning_rate = 0.1
training_epochs = 5
data_shape = (200, 200, 150)

# ----------------- LOAD DATA -----------------
MRI_images_list = pickle.load(open("./Data/Combined_MRI_List.pkl", "rb"))
random.shuffle(MRI_images_list)

train_size = int(0.7 * len(MRI_images_list))
training_list = MRI_images_list[:train_size]
test_list = MRI_images_list[train_size:]

DATA_ROOT_DIR = './'
train_dataset = MRIData(DATA_ROOT_DIR, training_list)
test_dataset = MRIData(DATA_ROOT_DIR, test_list)

train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=True)

training_data = train_loader
test_data = test_loader

# ----------------- MODEL, LOSS, OPTIMIZER -----------------
model = Network(input_size, data_shape, output_dimension).to(args.device)
loss_function = nn.CrossEntropyLoss()
optimizer = optim.SGD(model.parameters(), lr=learning_rate)

# ----------------- TRAIN FUNCTION -----------------
def train(model, training_data, optimizer, criterion):
    model.train()
    epoch_loss = 0
    epoch_length = len(training_data)

    for i, patient_data in enumerate(training_data):
        if i % (max(1, math.floor(epoch_length / 5))) == 0:
            print(f"\t\tTraining Progress:{i / len(training_data) * 100:.1f}%")

        optimizer.zero_grad()
        torch.cuda.empty_cache()

        # Keep as float32 to avoid type mismatch
        patient_MRIs = patient_data["images"].to(args.device, dtype=torch.float32)
        patient_classifications = patient_data["label"]
        patient_markers = patient_data['num_images']

        model.hidden = model.init_hidden()
        batch_losses = []

        print("Patient batch classes ", patient_classifications)

        for x in range(len(patient_MRIs)):
            try:
                model.hidden = model.init_hidden()
                single_patient_MRIs = patient_MRIs[x][:patient_markers[x]].view(
                    -1, 1, data_shape[0], data_shape[1], data_shape[2]
                )

                patient_diagnosis = patient_classifications[x]
                patient_endstate = torch.ones(single_patient_MRIs.size(0)) * patient_diagnosis
                patient_endstate = patient_endstate.long().to(args.device)

                out = model(single_patient_MRIs)
                if len(out.shape) == 1:
                    out = out[None, ...]

                loss = criterion(out, patient_endstate)
                batch_losses.append(loss)

            except Exception as e:
                print("EXCEPTION CAUGHT:", e)

        if batch_losses:  # If we collected any loss
            batch_loss = torch.stack(batch_losses).mean()
            batch_loss.backward()
            optimizer.step()
            epoch_loss += batch_loss.item()

    if epoch_length == 0:
        epoch_length = 1e-6
    return epoch_loss / epoch_length

# ----------------- TEST FUNCTION -----------------
def test(model, test_data, criterion):
    model.eval()
    epoch_loss = 0
    epoch_length = len(test_data)

    with torch.no_grad():
        for i, patient_data in enumerate(test_data):
            if i % (max(1, math.floor(epoch_length / 5))) == 0:
                print(f"\t\tTesting Progress:{i / len(test_data) * 100:.1f}%")

            patient_MRIs = patient_data["images"].to(args.device, dtype=torch.float32)
            patient_classifications = patient_data["label"]
            patient_markers = patient_data['num_images']

            model.hidden = model.init_hidden()
            batch_losses = []

            print("Patient batch classes ", patient_classifications)

            for x in range(len(patient_MRIs)):
                try:
                    model.hidden = model.init_hidden()
                    single_patient_MRIs = patient_MRIs[x][:patient_markers[x]].view(
                        -1, 1, data_shape[0], data_shape[1], data_shape[2]
                    )

                    patient_diagnosis = patient_classifications[x]
                    patient_endstate = torch.ones(single_patient_MRIs.size(0)) * patient_diagnosis
                    patient_endstate = patient_endstate.long().to(args.device)

                    out = model(single_patient_MRIs)
                    if len(out.shape) == 1:
                        out = out[None, ...]

                    loss = criterion(out, patient_endstate)
                    batch_losses.append(loss)

                except Exception as e:
                    epoch_length -= 1
                    print("EXCEPTION CAUGHT:", e)

            if batch_losses:
                epoch_loss += torch.stack(batch_losses).mean().item()

    if epoch_length == 0:
        epoch_length = 1e-6
    return epoch_loss / epoch_length

import os

# ----------------- TRAINING LOOP -----------------
best_test_loss = float('inf')

for epoch in range(training_epochs):
    start_time = time.time()

    train_loss = train(model, training_data, optimizer, loss_function)
    test_loss = test(model, test_data, loss_function)

    end_time = time.time()
    epoch_mins = math.floor((end_time - start_time) / 60)
    epoch_secs = math.floor((end_time - start_time) % 60)

    print(f"Hurrah! Epoch {epoch + 1}/{training_epochs} concludes. | Time: {epoch_mins}m {epoch_secs}s")
    print(f"\tTrain Loss: {train_loss:.3f} | Train Perplexity: {math.exp(train_loss):7.3f}")
    print(f"\tTest Loss: {test_loss:.3f} | Test Perplexity: {math.exp(test_loss):7.3f}")

    if test_loss < best_test_loss:
        print("...that was our best test loss yet! Saving model.")
        best_test_loss = test_loss
        save_path = os.path.join(os.getcwd(), "alzheimers_model.pth")
        torch.save(model.state_dict(), save_path)
        print(f"✅ Best model saved at: {save_path}")

# Final save after training
final_save_path = os.path.join(os.getcwd(), "alzheimers_model.pth")
torch.save(model.state_dict(), final_save_path)
print(f"✅ Final model saved at: {final_save_path}")
