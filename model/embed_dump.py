import os
import ollama
import json
from read_epub import parse_book
import time

def get_epub(dir):
    return [file for file in os.listdir(dir) if file.endswith('.epub') ]

def load_embed(epub_extension, modelname="snowflake-arctic-embed"):
    # print("epubs: ", len(epub_extension))
    # print("all epubs", epub_extension)
    chunks=[]
    for filename in epub_extension:
        t1 = time.time()
        # print("cur", filename)
        if not os.path.exists(f"embeddings/{filename}.json"):
            chunks = parse_book(filename)
            # print("chunks: ", len(chunks))
            embeddings= [ ollama.embeddings(model=modelname, prompt=chunk)["embedding"] for chunk in chunks]
            # print("embeddings: ", len(embeddings))
            with open(f"embeddings/{filename}.json", "w") as f:
                json.dump(embeddings, f)
        t2 = time.time()
        print(f"{filename} with {len(chunks)} took {t2-t1} seconds")
def main():
    load_embed(get_epub('.'))

if __name__ == "__main__":
    main()
