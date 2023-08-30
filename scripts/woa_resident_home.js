$(window).load(function () {
    try {
        getContent()
        showProfile()
        showPosts()
        if (document.getElementById("resDisplayName") !== null) {
            document.getElementById("resDisplayName").innerText = "My Woodbridge"
        }
        if (document.getElementsByClassName("association-name") !== null) {
            document.getElementsByClassName("association-name")[0].getElementsByTagName("a")[0].innerText = "My Woodbridge"
        }
    }
    catch (err) {
        document.getElementById("overlay").style.display = "none"
        if (window.location.hostname == "localhost") {
            document.getElementById("errText").innerHTML = err.message
        } else { location.replace("https://ourwoodbridge.net/homepage/28118/resident-home-page") }
    }
})
function getContent() {
    let residentPage = (window.location.hostname == "localhost") ? "/homepage/28118/resident-home-page.html" : "/homepage/28118/resident-home-page"
    let sentBy = "by Woodbridge HOA (Messenger@AssociationVoice.com)"
    let selGrps = ["8364", "11315","8030"]
    $.get(residentPage, function () { })
        .done(function (responseText) {
            let profileDoc = new DOMParser().parseFromString(responseText, "text/html")
            let windowDoc = document.getElementById("fromWOA").getElementsByClassName("card-body")
            let residentNameFrm = profileDoc.getElementsByClassName("clsHeader")[0].innerText
            let residentName = document.getElementsByClassName("clsHeader")[0]

            for (let p = 0; p < windowDoc.length; p++) {
                let clientDoc = windowDoc[p].getElementsByTagName("div")[0]
                let currentDoc = profileDoc.getElementById(clientDoc.className).getElementsByClassName(clientDoc.id)
                for (let i = 0; i < currentDoc.length; i++) {
                    let selectedDoc = currentDoc[i].getElementsByTagName("a")[0]
                    let topSpan = document.createElement("span")
                    let btmSpan = document.createElement("span")
                    let spanLink = document.createElement("a")
                    if (currentDoc[i].className == "document" || currentDoc[i].className == "event") {
                        spanLink.href = selectedDoc.href
                        spanLink.innerHTML = selectedDoc.innerHTML
                        topSpan.className = (i % 2 == 0) ? "btmEven" : "btmOdd"
                        topSpan.appendChild(spanLink)
                    } else if (currentDoc[i].className !== "post") {
                        topSpan.className = (i % 2 == 0) ? "topEven" : "topOdd"
                        btmSpan.className = (i % 2 == 0) ? "btmEven" : "btmOdd"
                        topSpan.appendChild(document.createTextNode(selectedDoc.getAttribute("data-tooltip-title").replace(sentBy, "")))
                        btmSpan.appendChild(document.createTextNode(selectedDoc.getAttribute("data-tooltip-text")))
                        spanLink.href = selectedDoc.href
                        spanLink.className = "fa fa-external-link formatLink"
                        btmSpan.appendChild(spanLink)
                    }
                    clientDoc.appendChild(topSpan)
                    clientDoc.appendChild(btmSpan)
                }
            }
            document.getElementById("overlay").style.display = "none"
            if (residentNameFrm !== null && residentName !== null) {
                if (residentName.getElementsByTagName("a").length > 0) {
                    residentName.getElementsByTagName("a")[0].innerText = residentNameFrm
                } else {
                    residentName.innerText = residentNameFrm
                }
            }
        })
        .fail(function () {
            if (window.location.hostname !== "localhost") { location.replace("/homepage/28118/resident-home-page") }
        })
}
function showProfile() {
    let profileID = document.getElementById("HeaderPublishAuthProfile").href.split("(")[1].split(",")[0]
    let profilePage = (window.location.hostname == "localhost") ? "/Member/28118~" + profileID + ".html" : "/Member/28118~" + profileID
    $.get(profilePage, function () {
    }).done(function (responseText) {
        let profileDoc = new DOMParser().parseFromString(responseText, "text/html")
        document.getElementById("profileImage").src = profileDoc.getElementsByTagName("img")[0].src
    })
}
function showPosts() {
    let currentDate = new Date()
    let selGrps = ["8030", "8364", "11315"]
    for (let p = 0; p < selGrps.length; p++) {
        let forumPage = (window.location.hostname == "localhost") ? "/Discussion/28118~" + selGrps[p] + ".html" : "/Discussion/28118~" + selGrps[p]
        $.get(forumPage, function () { })
            .done(function (responseText) {
                let forumPosts = document.getElementById("post")
                let forum = new DOMParser().parseFromString(responseText, "text/html")
                let forumPostheaders = forum.getElementsByClassName("ThreadContainer")[0].getElementsByClassName("MsgHeader")
                let forumPostcontent = forum.getElementsByClassName("ThreadContainer")[0].getElementsByClassName("clsBodyText")
                let forumPostreply = forum.getElementsByClassName("ThreadContainer")[0].getElementsByClassName("respReplyWrapper")
                let forumPostdate = forum.getElementsByClassName("ThreadContainer")[0].getElementsByClassName("respAuthorWrapper")
                for (let p = 0; p < forumPostheaders.length; p++) {
                    let postDate = new Date(forumPostdate[p].innerText.split("-")[1])
                    let dayDiff = (currentDate - postDate) / (1000 * 3600 * 24)

                    if (dayDiff < 100) {
                        let topSpan = document.createElement("span")
                        let btmSpan = document.createElement("span")
                        let postContent = forumPostcontent[p].innerText.replace(/\r?\n|\r/g, " ")
                        topSpan.className = (p % 2 == 0) ? "topEven" : "topOdd"
                        btmSpan.className = (p % 2 == 0) ? "btmEven" : "btmOdd"
                        let replyLink = forumPostreply[p].getElementsByTagName("a")
                        let spanLink = document.createElement("a")
                        spanLink.href = replyLink[1].href
                        spanLink.innerHTML = forumPostheaders[p].innerText + forumPostdate[p].innerText.split("-")[0] + " -" + forumPostdate[p].innerText.split("-")[1]

                        topSpan.appendChild(spanLink)
                        btmSpan.appendChild(document.createTextNode(postContent.trim()))


                        forumPosts.appendChild(topSpan)
                        forumPosts.appendChild(btmSpan)
                    }
                }
            })
    }
}
function saveUser(saveKey, saveValue) {
    try {
        if (localStorage.getItem(saveKey) !== saveValue) { localStorage.setItem(saveKey, saveValue) }
    } catch { }
}
function getUser(saveKey) {
    return localStorage.getItem(saveKey)
}
