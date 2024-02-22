# from datasets import load_dataset

# dataset = load_dataset("jkhedri/psychology-dataset",split="train")

# dataset.to_json("data.jsonl")

import json

def convert_to_new_format(original_jsonl_file, new_json_file):
    new_data = []

    with open(original_jsonl_file, 'r') as f:
        for line in f:
            entry = json.loads(line.strip())
            question = entry.get('question', '')
            response_j = entry.get('response_j', '') #nhẹ nhàng
            response_k = entry.get('response_k', '') #mạnh bạo

            # Add user question
            new_data.append({
                "messages" : [
                    {"role": "system", "content":"You are a psychologist"},
                    {"role": "user", "content":question},
                    {"role": "assistant", "content":response_j}
                ]
            })

    # Write to new JSON file
    with open(new_json_file, 'w') as f:
        for item in new_data:
            json.dump(item, f)
            f.write("\n")

# Example usage:
original_jsonl_file = 'data copy.jsonl'
new_json_file = 'final_test_data.jsonl'

convert_to_new_format(original_jsonl_file, new_json_file)