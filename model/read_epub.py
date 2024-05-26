import ebooklib
from ebooklib import epub
from bs4 import BeautifulSoup

def parse_book(filename):
#filename = "batman_test.epub"
    book = epub.read_epub(filename)
    items = list(book.get_items_of_type(ebooklib.ITEM_DOCUMENT))

    full_book = []
    for chapter in range(len(items)):
        soup = BeautifulSoup(items[chapter].get_body_content(), 'html.parser')
        text = []
        for para in soup.find_all('p'):
            if len(para.get_text().split(" ")) > 15 and para.get_text()[0] not in "0123456789":
                full_book.append(para.get_text())

    return full_book
