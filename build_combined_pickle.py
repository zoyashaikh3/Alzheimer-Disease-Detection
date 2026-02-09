import os, pickle, sys

# Change these if your folder names differ
DATA_SAMPLES_FOLDER = os.path.join(os.getcwd(), "data_sample", "Data")
OUT_FOLDER = os.path.join(os.getcwd(), "Data")
OUT_PICKLE = os.path.join(OUT_FOLDER, "Combined_MRI_List.pkl")

if not os.path.isdir(DATA_SAMPLES_FOLDER):
    print("ERROR: cannot find your data folder here:")
    print(DATA_SAMPLES_FOLDER)
    print("Make sure you're running this script from the project root.")
    sys.exit(1)

entries = []
label_toggle = 0  # will alternate labels if we cannot infer

for root, dirs, files in os.walk(DATA_SAMPLES_FOLDER):
    for fname in files:
        if fname.lower().endswith((".nii", ".nii.gz")):
            full_path = os.path.abspath(os.path.join(root, fname))
            lowroot = root.lower()
            # try to infer label from folder name if it contains 'ad' or 'mci'
            if "ad" in lowroot:
                lbl = 1
            elif "mci" in lowroot:
                lbl = 0
            else:
                lbl = label_toggle
                label_toggle = 1 - label_toggle
            # Each entry is [path_to_nifti_file, label]
            entries.append([full_path, lbl])

os.makedirs(OUT_FOLDER, exist_ok=True)
with open(OUT_PICKLE, "wb") as f:
    pickle.dump(entries, f)

print(f"WROTE {len(entries)} entries to {OUT_PICKLE}")
if len(entries) > 0:
    print("\nFirst 5 entries (path, label):")
    for e in entries[:5]:
        print(e)
else:
    print("No .nii files were found. Check the DATA_SAMPLES_FOLDER path above.")
