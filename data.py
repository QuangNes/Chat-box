from datasets import load_dataset

dataset = load_dataset("jkhedri/psychology-dataset",split="train")

dataset.to_json("data.jsonl")

# for split, split_dataset in dataset.items():
#     split_dataset.to_json(f"squad-{split}.jsonl")

# print(dataset)