$(window).load(function () {
    try {
        getContent()
        showProfile()
        showPosts()
        showDocuments()
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
    let selGrps = ["8364", "11315", "8030"]
    $.get(residentPage, function () { })
        .done(function (responseText) {
            let profileDoc = new DOMParser().parseFromString(responseText, "text/html")
            let windowDoc = document.getElementById("fromWOA").getElementsByClassName("card-body")
            let residentNameFrm = profileDoc.getElementsByClassName("clsHeader")[0].innerText
            let residentName = document.getElementsByClassName("clsHeader")[0]
            showPhotos(profileDoc)
            for (let p = 0; p < windowDoc.length; p++) {
                let clientDoc = windowDoc[p].getElementsByTagName("div")[0]
                if (clientDoc.id !== "recentPhotos") { 
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
                        try {
                            if (currentDoc[i].className == "news") {
                                let newsTitle = selectedDoc.getAttribute("data-tooltip-title")
                                let detailItem = ["Parade", "Winter Concert", "Winter Dance", "Drama Club"]
                                let detailItemImg = ["parade.png", "singers.png", "2nd_chance.png", "drama_plays2.jpg"]
                                for (var d = 0; d < detailItem.length; d++) {
                                    if (newsTitle.includes(detailItem[d])) {
                                        let newsIcon = document.createElement("img")
                                        newsIcon.style.height = "2.75rem"
                                        newsIcon.style.float = "left"
                                        newsIcon.style.paddingRight = "5px"
                                        newsIcon.src = "https://customnetware.github.io/woa/" + detailItemImg[d]
                                        btmSpan.appendChild(newsIcon)
                                    }
                                }
                            }
                        } catch { }


                        btmSpan.appendChild(document.createTextNode(selectedDoc.getAttribute("data-tooltip-text")))
                        spanLink.href = selectedDoc.href
                        spanLink.className = "fa fa-external-link formatLink"

                        btmSpan.appendChild(spanLink)
                    }
                    clientDoc.appendChild(topSpan)
                    clientDoc.appendChild(btmSpan)
                }}
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
    let backGroundID = 0
    let currentDate = new Date()
    let selGrps = ["8030", "8364", "11315"]
    try {
        for (let g = 0; g < selGrps.length; g++) {
            let selectedPost = (window.location.hostname == "localhost") ? "/Discussion/28118~" + selGrps[g] + ".html" : "/Discussion/28118~" + selGrps[g]
            $.get(selectedPost, function () { })
                .done(function (responseText) {
                    let forumPosts = document.getElementById("post")
                    let forum = new DOMParser().parseFromString(responseText, "text/html")
                    let msgHeaderText = forum.querySelectorAll("[id^=msgHeader]")
                    let messageText = forum.querySelectorAll("[id^=contents]")

                    for (let k = 0; k < messageText.length; k++) {
                        let messageTexts = messageText[k].getElementsByClassName("clsBodyText")
                        let messageAuthor = messageText[k].getElementsByClassName("respAuthorWrapper")
                        let messageContacts = messageText[k].getElementsByClassName("respReplyWrapper")

                        let postDate = new Date(messageAuthor[messageAuthor.length - 1].innerText.split("-")[1])
                        let dayDiff = (currentDate - postDate) / (1000 * 3600 * 24)


                        if (dayDiff < 32) {
                            let topSpan = document.createElement("div")
                            let midSpan = document.createElement("div")
                            let btmSpan = document.createElement("div")

                            topSpan.className = (backGroundID % 2 == 0) ? "topEven" : "topOdd"
                            midSpan.className = (backGroundID % 2 == 0) ? "btmEven" : "btmOdd"
                            btmSpan.className = (backGroundID % 2 == 0) ? "btmEven classHide" : "btmOdd classHide"

                            topSpan.appendChild(document.createTextNode(msgHeaderText[k].innerText))

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

                                if (messageTexts.length > 1 && p == 0) {
                                    spanToUse.appendChild(document.createTextNode(" | "))
                                    let viewLink = document.createElement("a")
                                    viewLink.innerText = "View Replies - (" + (messageAuthor.length - 1) + ")"
                                    viewLink.href = "javascript:showReplies(" + backGroundID + ")"

                                    spanToUse.appendChild(viewLink)
                                }
                                spanToUse.appendChild(document.createElement("hr"))
                            }
                            forumPosts.appendChild(topSpan)
                            forumPosts.appendChild(midSpan)
                            forumPosts.appendChild(btmSpan)
                            backGroundID++
                        }

                    }

                })
        }
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
function showPhotos(galleryPage) {
    try {
        let newPicList = document.getElementById("recentPhotos").getElementsByTagName("div")
        let photoList = galleryPage.querySelectorAll("[id^=gallery_link_]")
        let galleryLink = galleryPage.querySelectorAll("[class^=gallery_txt_sub]")
        let galleryText = galleryPage.getElementsByClassName("left")
        for (let k = 0; k < photoList.length; k++) {
            newPicList[k].getElementsByTagName("img")[0].src = photoList[k].src
            newPicList[k].getElementsByTagName("span")[0].innerText = galleryText[k].innerText.replace(".jpg", "")
            newPicList[k].getElementsByTagName("a")[0].href = galleryLink[k].getElementsByTagName("a")[0].href
        }
    } catch (error) { }
}
function saveUser(saveKey, saveValue) {
    try {
        if (localStorage.getItem(saveKey) !== saveValue) { localStorage.setItem(saveKey, saveValue) }
    } catch { }
}
function getUser(saveKey) {
    return localStorage.getItem(saveKey)
}
