import os

def get_epub(dir):
    return [file for file in os.listdir(dir) if file.endswith('.epub') ]

print(get_epub(
    '.'
))