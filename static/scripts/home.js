

window.onload = function() {
    setupModal()
    const rc = dquery("#recommendationContainer")
    const tc = dquery("#trendingContainer")
    
    makeRequest("/api/get-recommended")  
        .then(data => {
            data.forEach(function(item) {
                rc.append(renderMainCard(item))
            })
        })

    makeRequest("/api/get-trending")  
        .then(data => {
            data.forEach(function(item) {
                tc.append(renderSmallCard(item))
            })
        })

    refreshProgress()
}