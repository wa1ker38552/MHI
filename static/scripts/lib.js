const categories = ["Horror", "Historical Fiction", "Mystery", "Science Fiction", "Literary Fiction", "Romance", "Dystopian", "Adventure", "Memoir", "Contemporary", "History", "Classics", "Nonfiction", "Fiction"]

async function makeRequest(url) {
    const a = await fetch(url)
    const b = await a.json()
    return b
}


function setCookie(name, value) {
    document.cookie = name + "=" + (value || "") + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function toggleBookmark(e) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"))
    if (!bookmarks) {
        bookmarks = []
    }
    if (e.style.filter == "") {
        e.style.filter = "invert(37%) sepia(21%) saturate(6204%) hue-rotate(336deg) brightness(98%) contrast(104%)"
        bookmarks.push(e.parentElement.id)
    } else {
        e.style.filter = ""
        bookmarks.splice(bookmarks.indexOf(e.parentElement.id), 1)
    }
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
}

function toggleTheme() {
    if (getCookie("theme") == "dark") {
        setCookie("theme", "light")
    } else {
        setCookie("theme", "dark")
    }
    window.location.reload()
}

function dquery(selector) {
    return document.querySelector(selector)
  }
  
function dcreate(selector, classname=null) {
const e = document.createElement(selector)
if (classname) {
    e.className = classname
}
return e
}

function setReaction(e, type) {
    ld = JSON.parse(localStorage.getItem("data"))
    if (!ld) {
        ld = {
            "hearts": [],
            "likes": [],
            "dislikes": []
        }
    }
    pepe = e.parentElement.parentElement
    isbn = pepe.id

    if (type == 0) {
        if (ld.hearts.includes(isbn)) {
            ld.hearts.splice(ld.hearts.indexOf(isbn), 1)
            e.children[0].style.filter = ""
        } else {
            ld.hearts.push(isbn)
            e.children[0].style.filter = "none"
        }
    } else if (type == 1) {
        if (ld.likes.includes(isbn)) {
            ld.likes.splice(ld.likes.indexOf(isbn), 1)
            e.children[0].style.filter = ""
        } else {
            ld.likes.push(isbn)
            e.children[0].style.filter = "none"
        }
    } else {
        if (ld.dislikes.includes(isbn)) {
            ld.dislikes.splice(ld.dislikes.indexOf(isbn), 1)
            e.children[0].style.filter = ""
        } else {
            ld.dislikes.push(isbn)
            e.children[0].style.filter = "none"
        }
    }

    localStorage.setItem("data", JSON.stringify(ld))
}

function renderMainCard(item) {
    const e = dcreate("div", "card")
    ld = JSON.parse(localStorage.getItem("data"))
    if (!ld) {
        ld = {
            "hearts": [],
            "likes": [],
            "dislikes": []
        }
    }
    bookmarks = localStorage.getItem("bookmarks")
    if (!bookmarks) {
        bookmarks = []
    }
    if (bookmarks.includes(item.id)) {
        style = "filter: invert(37%) sepia(21%) saturate(6204%) hue-rotate(336deg) brightness(98%) contrast(104%)"
    } else {
        style = ""
    }
    e.innerHTML = `<svg class="bookmark" style="${style}" onclick="toggleBookmark(this)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px"><path d="M 37 48 C 36.824219 48 36.652344 47.953125 36.496094 47.863281 L 25 41.15625 L 13.503906 47.863281 C 13.195313 48.042969 12.8125 48.046875 12.503906 47.867188 C 12.191406 47.6875 12 47.359375 12 47 L 12 3 C 12 2.449219 12.449219 2 13 2 L 37 2 C 37.554688 2 38 2.449219 38 3 L 38 47 C 38 47.359375 37.808594 47.6875 37.496094 47.867188 C 37.34375 47.957031 37.171875 48 37 48 Z"/></svg>`
    const ct = dcreate("div", "card-tags")
    e.id = item.id
    
    item.tags.forEach(function(tag) {
        const t = dcreate("div", `card-tag tag-${tag.replaceAll(" ", "_").toLowerCase()}`)
        t.innerHTML = tag
        ct.append(t)
    })

    const cardTitle = dcreate("a", "card-title")
    cardTitle.href = `https://www.campusbooks.com/search/${item.id}?buysellrent=buy`
    cardTitle.target = "_blank"
    cardTitle.innerHTML = item.title
    const cardSummary = dcreate("div", "card-summary")
    cardSummary.innerHTML = item.summary
    const reactions = dcreate("div", "card-tags")

    heartStyle = ""
    thupstyle = ""
    thdownstyle = ""
    if (ld.hearts.includes(item.id.toString())) {heartStyle = "filter: none"}
    if (ld.likes.includes(item.id.toString())) {thupstyle = "filter: none"}
    if (ld.dislikes.includes(item.id.toString())) {thdownstyle = "filter: none"}

    const markButton = dcreate("div", "mark-done-button")
    completed = JSON.parse(localStorage.getItem("completed"))
    markButton.innerHTML = "Mark Done"
    if (!completed) {completed = []}
    if (completed.includes(item.id.toString())) {
        markButton.classList.add("completed-button")
        markButton.innerHTML = "Continue Reading"
    }

    markButton.onclick = function() {
        completed = JSON.parse(localStorage.getItem("completed"))
        progress = JSON.parse(localStorage.getItem("inprogress"))
        if (!progress) {progress = []}
        if (!completed) {
            completed = []
        }
        if (completed.includes(item.id.toString())) {
            completed.splice(completed.indexOf(item.id.toString()), 1)
            markButton.classList.remove("completed-button")
            markButton.innerHTML = "Mark Done"
            progress.push(item.id)
        } else {
            completed.push(item.id)
            markButton.classList.add("completed-button")
            markButton.innerHTML = "Continue Reading"

            if (progress.includes(item.id.toString())) {
                progress.splice(progress.indexOf(item.id.toString()))
            }
        }
        
        localStorage.setItem("inprogress", JSON.stringify(progress))
        localStorage.setItem("completed", JSON.stringify(completed))
        refreshProgress()
    }
    reactions.style.gap = "0.5rem"
    reactions.style.position = "relative"
    reactions.innerHTML = `<div class="reaction centered-children" onclick="setReaction(this, 0)"><img style="${heartStyle}" src="/static/assets/emoji_heart.png"></div>
    <div class="reaction centered-children" onclick="setReaction(this, 1)"><img style="${thupstyle}" src="/static/assets/emoji_thumbsup.png"></div>
    <div class="reaction centered-children" onclick="setReaction(this, 2)"><img style="${thdownstyle}" src="/static/assets/emoji_thumbsdown.png"></div>`
    reactions.append(markButton)
    e.append(ct, cardTitle, cardSummary, reactions)
    return e
}

function renderInProgress(item) {
    const e = dcreate("div", "card small-card")
    const title = dcreate("div", "card-title")
    const author = dcreate("div", "card-author")
    title.innerHTML = item.title
    author.innerHTML = item.author
    e.append(title, author)
    e.onclick = function() {
        const m = dquery("#modal")
        m.children[0].innerHTML = ""
        makeRequest("/api/get/"+item.id)
            .then(data => {
                m.children[0].append(renderMainCard(data))
                openModal(m)
            })
    }
    return e
}

function renderSmallCard(item) {
    const e = dcreate("div", "card small-card")
    const title = dcreate("div", "card-title")
    e.id = item.id
    title.innerHTML = item.title
    const author = dcreate("div", "card-author")
    author.innerHTML = item.author
    const summary = dcreate("div", "card-summary small-summary")
    summary.innerHTML = '<div class="small-summary-overlay"></div>'
    summary.append(document.createTextNode(item.summary))
    const ct = dcreate("div", "card-tags likes-container")
    ct.style.gap = "0.5rem"
    ct.innerHTML = '<div class="reaction centered-children"><img class="no-hover" src="/static/assets/emoji_heart.png"></div>'
    const rd = dcreate("span", "reaction-data")
    rd.innerHTML = (item.likes > 1000) ? addSuffix(item.likes, 2) : item.likes
    ct.append(rd)
    e.onclick = function() {
        const m = dquery("#modal")
        m.children[0].innerHTML = ""
        inprogress = JSON.parse(localStorage.getItem("inprogress"))
        completed = JSON.parse(localStorage.getItem("completed"))
        if (!inprogress) {inprogress = []}
        if (!inprogress.includes(item.id.toString()) && !completed.includes(item.id.toString())) {
            inprogress.push(item.id)
        }
        localStorage.setItem("inprogress", JSON.stringify(inprogress))
        makeRequest("/api/get/"+item.id)
            .then(data => {
                m.children[0].append(renderMainCard(data))
                openModal(m)
            })
        refreshProgress()
    }
    e.append(title, author, summary, ct)
    return e
}

function addSuffix(value, round=2) {
    var suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qn'];
    var suffixIndex = 0;
    if (value > 999) {
      while (Math.abs(value) >= 1000 && suffixIndex < suffixes.length - 1) {
        value /= 1000;
        suffixIndex++;
      }
    }
    return value.toFixed(round) + suffixes[suffixIndex]
  }

function openModal(m) {
    m.style.display = ""
    m.style.opacity = "1"
    m.style.background = "rgba(0, 0, 0, 0.7)"
    m.style.animation = "fade-in 0.3s"
    m.children[0].style.animation = "move-up 0.3s"
}

function closeModal(m) {
    setTimeout(function() {
        m.style.display = "none"
    }, 301)
    m.children[0].style.animation = "move-down 0.3s"
    m.style.animation = "fade-out 0.3s"
    m.style.opacity = 0
}

function setupModal() {
    const m = dquery("#modal")
    window.onclick = function(e) {
        if (e.target == m) {
          closeModal(m)
        }
    }
}

function refreshProgress() {
    inprogress = JSON.parse(localStorage.getItem("inprogress"))
    if (!inprogress) {inprogress = []}
    const progressContainer = dquery("#progressContainer")
    progressContainer.innerHTML = ""
    makeRequest("/api/get-all")
        .then(data => {
            data.forEach(function(item) {
                if (inprogress.includes(item.id)) {
                    progressContainer.append(renderInProgress(item))
                }
            })
            if (progressContainer.innerHTML == "") {
                progressContainer.innerHTML = "<i>Nothing here yet!</i>"
            }
        })
}