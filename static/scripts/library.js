
window.onload = function() {
    libraryContainer = dquery("#libraryContainer")
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"))
    console.log(bookmarks)

    makeRequest("/api/get-all")  
        .then(data => {
            data.forEach(function(item) {
                if (bookmarks.includes(item.id.toString())) {
                    libraryContainer.append(renderMainCard(item))
                }
            })
        })
}