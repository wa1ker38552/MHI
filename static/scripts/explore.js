function matchAll(q, target) {
    for (t of targets) {
        if (!q.includes(t)) {
            return false
        }
    }
    return true
}

function reFilter(parent, cc) {
    parent.innerHTML = ""
    targets = []
    for (let i=0; i<cc.children.length; i++) {
        if (cc.children[i].style.background == "") {targets.push(cc.children[i].innerHTML)}
    }

    itemData.forEach(function(item) {
        if (matchAll(item.tags, targets)) {
            parent.append(renderSmallCard(item))
        }
    })

    if (parent.innerHTML == "") {
        parent.innerHTML = "<i>No results found</i>"
    }
}


var itemData
window.onload = function() {
    setupModal()
    categoryContainer = dquery("#categoriesContainer")
    dquery("#lenCategories").innerHTML = categories.length
    const tc = dquery("#trendingContainer")
    const ac = dquery("#allContainer")

    makeRequest("/api/get-latest")  
        .then(data => {
            itemData = data
            data.forEach(function(item) {
                tc.append(renderSmallCard(item))
            })
        })

    makeRequest("/api/get-all")  
        .then(data => {
            data.forEach(function(item) {
                ac.append(renderSmallCard(item))
            })
        })

    categories.forEach(function(c) {
        const e = dcreate("div", `card-tag tag-${c.replaceAll(" ", "_").toLowerCase()}`)
        e.innerHTML = c
        e.style.background = "transparent"
        e.onclick = function() {
            if (e.style.background == "transparent") {
                e.style.background = ""
                e.style.color = "var(--accent-dark)"
            } else {
                e.style.background = "transparent"
                e.style.color = ""
            }
            reFilter(tc, categoryContainer)
        }
        categoryContainer.append(e)
    })
}