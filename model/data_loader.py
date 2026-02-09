import os
import numpy as np

import torch
from torch.utils.data import Dataset

import nibabel as nib
from scipy import ndimage

# Dimensions of neuroimages after resizing
STANDARD_DIM1 = 200
STANDARD_DIM2 = 200
STANDARD_DIM3 = 150

# Maximum number of images per patient
MAX_NUM_IMAGES = 10

class MRIData(Dataset):
    """
    MRI data
    The dictionaries AD_Img_Dict.pkl and MCI_Img_Dict.pkl contain key-value
      pairs of the following:
      key:      subject ID
      value:    paths to relevant images (i.e. multiple images per subject)
    These dictionaries are converted to arrays and passed into this dataset,
    where the paths will be accessed and their neuroimages processed into tensors.
    """

    def __init__(self, root_dir, data_array):
        """
        Args:
            root_dir (string): directory of all the images
            data_array (list): array that contains one [key, [value]*, label] entry for each patient,
                               where key:       subject ID
                                     value:     paths to patient's MRI .nii neuroimages
                                     label:     class label (AD or MCI)
        """
        self.root_dir = root_dir
        self.data_array = data_array

    def __len__(self):
        """Returns length of dataset"""
        return len(self.data_array)

    def __getitem__(self, index):
        """
        Returns a tensor that contains the patient's MRI neuroimages and their diagnosis (AD or MCI)
        """
        # Make a copy to avoid modifying original data
        current_patient = list(self.data_array[index])

        # Last element is label, rest are image paths
        patient_label = current_patient[-1]
        image_paths = current_patient[:-1]

        images_list = []

        # Load and process each MRI scan
        for image_path in image_paths:
            file_name = os.path.join(self.root_dir, image_path)
            neuroimage = nib.load(file_name)  # Load MRI
            image_data = neuroimage.get_fdata()  # Convert to numpy array

            # Resize MRI to standard dimensions
            current_dim1, current_dim2, current_dim3 = image_data.shape
            scale_factor1 = STANDARD_DIM1 / float(current_dim1)
            scale_factor2 = STANDARD_DIM2 / float(current_dim2)
            scale_factor3 = STANDARD_DIM3 / float(current_dim3)
            image_data = ndimage.zoom(image_data, (scale_factor1, scale_factor2, scale_factor3))

            # Convert to tensor
            image_data_tensor = torch.Tensor(image_data)
            images_list.append(image_data_tensor)

        # Pad with zero-tensors if fewer than MAX_NUM_IMAGES
        num_images = len(images_list)
        while len(images_list) < MAX_NUM_IMAGES:
            padding_tensor = torch.zeros((STANDARD_DIM1, STANDARD_DIM2, STANDARD_DIM3))
            images_list.append(padding_tensor)

        if len(images_list) > MAX_NUM_IMAGES:
            print("Error: More than 10 images for one patient. Update MAX_NUM_IMAGES if needed.")

        # Stack into a single tensor
        images_tensor = torch.stack(images_list, dim=0)

        # Return dictionary
        return {
            'images': images_tensor,
            'label': torch.tensor(patient_label, dtype=torch.long),
            'num_images': num_images
        }