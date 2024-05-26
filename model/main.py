import ollama
from read_epub import parse_book
import os
import json
import numpy as np
from numpy.linalg import norm

def find_most_similar(needle, haystack):
    needle_norm = norm(needle)
    similarity_scores = [
        np.dot(needle, item) / (needle_norm * norm(item)) for item in haystack
    ]
    return sorted(zip(similarity_scores, range(len(haystack))), reverse=True)
def save_embedding(path, embeddings):
    if not os.path.exists("embeddings"):
        os.makedirs("embeddings")
    with open(f"embeddings/{path}.json", "w") as f:
        json.dump(embeddings, f)
def load_embedding(path):
    if not os.path.exists(f"embeddings/{path}.json"):
        return False
    with open(f"embeddings/{path}.json", "r") as f:
        return json.load(f)
def create_embedding(filepath, model_id, chunks):
    if (embeddings := load_embedding(filepath)) is not False:
        return embeddings
    embeddings = [ollama.embeddings(model=model_id, prompt=chunk)['embedding'] for chunk in chunks]
    save_embedding(filepath, embeddings)
    return embeddings

def main():
    filename = "batman_test.epub"
    paragraphs = parse_book(filename)
    embeddings = create_embedding(filename, "snowflake-arctic-embed", paragraphs)
    prompt = "Give me 15 key take aways from the book"
    prompt_embed = ollama.embeddings(model='snowflake-arctic-embed', prompt=prompt)['embedding']
    most_similar_chunk = find_most_similar(prompt_embed, embeddings)[:5]
    for item in most_similar_chunk:
        print(item[0], paragraphs[item[1]])
if __name__ == "__main__":
    main()
