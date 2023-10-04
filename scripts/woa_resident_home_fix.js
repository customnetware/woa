$(window).load(function () {
    try {
        getContent()
        showProfile()
        showPosts(document.getElementById("ViewCriteria").value, document.getElementById("SelectedGroup").value)
        showDocuments()
        showPhotos()
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
                    if (currentDoc[i].className == "event") {
                        spanLink.href = selectedDoc.href
                        spanLink.innerHTML = selectedDoc.innerHTML
                        topSpan.className = (i % 2 == 0) ? "btmEven" : "btmOdd"
                        topSpan.appendChild(spanLink)
                    } else if (currentDoc[i].className !== "post" && currentDoc[i].className !== "document") {
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
function showPosts(viewCriteria, selectedGroup) {
    let backGroundID = 0
    let currentDate = new Date()
    try {
        let selectedPost = (window.location.hostname == "localhost") ? "/Discussion/28118~" + selectedGroup + ".html" : "/Discussion/28118~" + selectedGroup
        $.get(selectedPost, function () { })
            .done(function (responseText) {
                let forumPosts = document.getElementById("post")
                let forum = new DOMParser().parseFromString(responseText, "text/html")
                let postHeaders = forum.querySelectorAll("[id^=msgHeader]")
                let postContents = forum.querySelectorAll("[id^=contents]")

                for (let k = 0; k < postContents.length; k++) {
                    let messageTexts = postContents[k].getElementsByClassName("clsBodyText")
                    let messageAuthor = postContents[k].getElementsByClassName("respAuthorWrapper")
                    let messageContacts = postContents[k].getElementsByClassName("respReplyWrapper")

                    let postDate = new Date(messageAuthor[messageAuthor.length - 1].innerText.split("-")[1])
                    let dayDiff = (currentDate - postDate) / (1000 * 3600 * 24)


                    if (dayDiff < viewCriteria) {
                        let topSpan = document.createElement("div")
                        let midSpan = document.createElement("div")
                        let btmSpan = document.createElement("div")

                        topSpan.className = (backGroundID % 2 == 0) ? "topEven" : "topOdd"
                        midSpan.className = (backGroundID % 2 == 0) ? "btmEven" : "btmOdd"
                        btmSpan.className = (backGroundID % 2 == 0) ? "btmEven classHide" : "btmOdd classHide"

                        topSpan.appendChild(document.createTextNode(postHeaders[k].innerText))

                        for (let p = 0; p < messageTexts.length; p++) {

                            let replyLink = document.createElement("a")
                            replyLink.innerText = "Reply"
                            replyLink.href = messageContacts[p].getElementsByTagName("a")[0].href

                            let emailLink = document.createElement("a")
                            emailLink.innerText = "Email Author"
                            emailLink.href = messageContacts[p].getElementsByTagName("a")[1].href

                            spanToUse = (p == 0) ? midSpan : btmSpan
                            spanToUse.appendChild(document.createTextNode(messageTexts[p].innerText))
                            spanToUse.appendChild(document.createElement("br"))
                            spanToUse.appendChild(document.createTextNode(messageAuthor[p].innerText))
                            spanToUse.appendChild(replyLink)
                            spanToUse.appendChild(document.createTextNode(" | "))
                            spanToUse.appendChild(emailLink)
                            spanToUse.appendChild(document.createTextNode(" | "))
                            if (messageTexts.length > 1 && p == 0) {
                                let viewLink = document.createElement("a")
                                viewLink.innerText = "View Replies"
                                viewLink.href = "javascript:showReplies(" + backGroundID + ")"

                                spanToUse.appendChild(viewLink)
                            
                            }
                                spanToUse.appendChild(document.createElement("br"))
                                spanToUse.appendChild(document.createElement("br"))
                        }
                        forumPosts.appendChild(topSpan)
                        forumPosts.appendChild(midSpan)
                        forumPosts.appendChild(btmSpan)
                        backGroundID++
                    }
                }
            })

    } catch (error) {
    }

}
function showReplies(clsToShow) {
    let currentForum = document.getElementById("post")
    let forumPosts = currentForum.getElementsByClassName("classHide")
    for (let p = 0; p < forumPosts.length; p++) {
        if (clsToShow !== p || (clsToShow == p && forumPosts[p].style.display == "block")) {
            forumPosts[p].style.display = "none"
        } else { forumPosts[clsToShow].style.display = "block" }
    }
}
function showDocuments() {
    try {
        let documentList = document.getElementById("document")
        let fileLocation = (window.location.hostname == "localhost") ? "/resourcecenter/28118/resource-center.html" : "/resourcecenter/28118/resource-center"
        $.get(fileLocation, function () { })
            .done(function (responseText) {
                let documents = new DOMParser().parseFromString(responseText, "text/html")
                let documentName = documents.getElementById("contents540434").getElementsByClassName("clsTreeNde")
                let documentLink = documents.getElementById("contents540434").querySelectorAll('a[title="View On-line"]')
                for (let p = 0; p < documentName.length; p++) {
                    let topSpan = document.createElement("span")
                    topSpan.className = (p % 2 == 0) ? "btmEven" : "btmOdd"
                    let selectedDoc = document.createElement("a")
                    selectedDoc.innerHTML = documentName[p].innerHTML
                    selectedDoc.href = documentLink[p].href
                    topSpan.appendChild(selectedDoc)
                    documentList.appendChild(topSpan)
                }

            })
    } catch (error) {
    }
}
function showPhotos() {
    let photoDisplay = document.getElementById("photo")
    let residentPage = (window.location.hostname == "localhost") ? "/homepage/28118/resident-home-page.html" : "/homepage/28118/resident-home-page"
    $.get(residentPage, function () { })
        .done(function (responseText) {
            let photos = new DOMParser().parseFromString(responseText, "text/html")
            let photoList = photos.querySelectorAll("[id^=gallery_link_]")
            let galleryLink = photos.querySelectorAll("[class^=gallery_txt_sub]")


            photoDisplay.appendChild(document.createElement("br"))
            for (let k = 0; k < photoList.length; k++) {
                let pic = document.createElement("img")
                pic.src = photoList[k].src
                pic.style.height = "100px"
                pic.style.paddingRight = "20px"
                photoDisplay.appendChild(pic)

            }
            photoDisplay.appendChild(document.createTextNode(galleryLink[0].getElementsByTagName("a")[0].href))

        })
}
function saveUser(saveKey, saveValue) {
    try {
        if (localStorage.getItem(saveKey) !== saveValue) { localStorage.setItem(saveKey, saveValue) }
    } catch { }
}
function getUser(saveKey) {
    return localStorage.getItem(saveKey)
}
