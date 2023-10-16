$(window).load(function () {
    try {
        getContent()
        showProfile()
        getGroups()
        showDocuments()
        if (document.getElementById("resDisplayName") !== null) {
            document.getElementById("resDisplayName").innerText = "My Woodbridge"
        }
        if (document.getElementsByClassName("association-name") !== null) {
            document.getElementsByClassName("association-name")[0].getElementsByTagName("a")[0].innerText = "My Woodbridge"
        }
    }
    catch (err) {
        if (window.location.hostname == "localhost") {
            document.getElementById("errText").innerHTML = err.message
        } else { location.replace("https://ourwoodbridge.net/homepage/28118/resident-home-page") }
    }
})
function getContent() {
    let residentPage = (window.location.hostname == "localhost") ? "/homepage/28118/resident-home-page.html" : "/homepage/28118/resident-home-page"
    let sentBy = "by Woodbridge HOA (Messenger@AssociationVoice.com)"
    let photoDisplay = document.getElementById("photo")

    $.get(residentPage, function () { })
        .done(function (responseText) {
            let myWoodbridge = new DOMParser().parseFromString(responseText, "text/html")
            let displayDivs = ["message","classified","news"]
            for (let d = 0; d < displayDivs.length; d++) {
                let recentItems = myWoodbridge.getElementsByClassName(displayDivs[d])
                let itemText = document.getElementById(displayDivs[d])
                if (recentItems.length > 0) { itemText.innerHTML = "" } else itemText.innerHTML = "No recent items found."
                for (let p = 0; p < recentItems.length; p++) {
                    let topSpan = document.createElement("span")
                    let btmSpan = document.createElement("span")
                    let spanLink = document.createElement("a")
                    topSpan.className = (p % 2 == 0) ? "topEven" : "topOdd"
                    btmSpan.className = (p % 2 == 0) ? "btmEven" : "btmOdd"
                    spanLink.className = "fa fa-arrow-right formatLink"
                    spanLink.href = recentItems[p].getElementsByTagName("a")[0].href
                    saveUser(recentItems[p].getElementsByTagName("a")[0].id, spanLink.href)

                    topSpan.appendChild(document.createTextNode(recentItems[p].getElementsByTagName("a")[0].getAttribute("data-tooltip-title").replace(sentBy, "")))
                    btmSpan.appendChild(document.createTextNode(recentItems[p].getElementsByTagName("a")[0].getAttribute("data-tooltip-text")))
                    btmSpan.appendChild(spanLink)
                    itemText.appendChild(topSpan)
                    itemText.appendChild(btmSpan)
                }
            }
            let photoList = myWoodbridge.querySelectorAll("[id^=gallery_link_]")
            let galleryLink = myWoodbridge.querySelectorAll("[class^=gallery_txt_sub]")
            if (photoList.length > 0) { photoDisplay.innerHTML = "" }
            for (let k = 0; k < photoList.length; k++) {
                let pic = document.createElement("img")
                pic.src = photoList[k].src
                pic.style.height = "100px"
                pic.style.paddingRight = "20px"
                photoDisplay.appendChild(pic)

            }

        })
}
function showProfile() {
    let profileID = document.getElementById("HeaderPublishAuthProfile").href.split("(")[1].split(",")[0]
    let profilePage = (window.location.hostname == "localhost") ? "/Member/28118~" + profileID + ".html" : "/Member/28118~" + profileID
    $.get(profilePage, function () {
    }).done(function (responseText) {
        let profileDoc = new DOMParser().parseFromString(responseText, "text/html")
        let residentNameText = profileDoc.getElementsByTagName("h2")[0].innerText
        let residentName = document.getElementsByClassName("clsHeader")[0]

        document.getElementById("profileImage").src = profileDoc.getElementsByTagName("img")[0].src


        if (residentName.getElementsByTagName("a").length > 0) {
            residentName.getElementsByTagName("a")[0].innerText = residentNameText
        } else {
            residentName.innerText = residentNameText
        }
    })
}
function getGroups() {
    let selectedGroups = []
    let fileLocation = (window.location.hostname == "localhost") ? "/Discussion/list/28118/discussion-groups.html" : "/Discussion/list/28118/discussion-groups"
    $.get(fileLocation, function () { })
        .done(function (responseText) {
            let forums = new DOMParser().parseFromString(responseText, "text/html")
            let forumName = forums.getElementsByClassName("clsBodyText")
            let groupCheck = "(Group is included on My Woodbridge)"
            for (let p = 2; p < forumName.length; p += 2) {
                let includeGroup = forumName[p].innerText.includes(groupCheck)
                if (includeGroup == true) {
                    let groupID = forumName[p - 1].getElementsByTagName("a")[0].id.replace("titleEditForum", "")
                    let groupName = forumName[p - 1].innerText
                    selectedGroups.push(groupID + "|" + groupName)
                }
            }
            showPosts(selectedGroups)
        })
}
function showPosts(selectedGroup) {
    let backGroundID = 0
    document.getElementById("post").innerHTML=""
    try {
        for (let g = 0; g < selectedGroup.length; g++) {
            let selectedPost = (window.location.hostname == "localhost") ? "/Discussion/28118~" + selectedGroup[g].split("|")[0] + ".html" : "/Discussion/28118~" + selectedGroup[g].split("|")[0]
            $.get(selectedPost, function () { })
                .done(function (responseText) {
                    let forumPosts = document.getElementById("post")
                    let forum = new DOMParser().parseFromString(responseText, "text/html")
                    let postHeaders = forum.querySelectorAll("[id^=msgHeader]")
                    let postContents = forum.querySelectorAll("[id^=contents]")
                    let numOfPosts = 0
                    
                    for (let k = 0; k < postContents.length; k++) {
                        let messageTexts = postContents[k].getElementsByClassName("clsBodyText")
                        let messageAuthor = postContents[k].getElementsByClassName("respAuthorWrapper")
                        let messageContacts = postContents[k].getElementsByClassName("respReplyWrapper")

                        //let postDate = new Date(messageAuthor[messageAuthor.length - 1].innerText.split("-")[1])




                        let topSpan = document.createElement("div")
                        let midSpan = document.createElement("div")
                        let btmSpan = document.createElement("div")

                        topSpan.className = (backGroundID % 2 == 0) ? "topEven" : "topOdd"
                        midSpan.className = (backGroundID % 2 == 0) ? "btmEven" : "btmOdd"
                        btmSpan.className = (backGroundID % 2 == 0) ? "btmEven classHide" : "btmOdd classHide"

                        topSpan.appendChild(document.createTextNode(postHeaders[k].innerText + "(" + selectedGroup[g].split("|")[1] + ")"))

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
                                viewLink.innerText = "View Replies - (" + (messageAuthor.length-1) + ")"
                                viewLink.href = "javascript:showReplies(" + backGroundID + ")"

                                spanToUse.appendChild(viewLink)

                            }
                            spanToUse.appendChild(document.createElement("hr"))
                        }
                        forumPosts.appendChild(topSpan)
                        forumPosts.appendChild(midSpan)
                        forumPosts.appendChild(btmSpan)
                        backGroundID++
                        numOfPosts++
                        if (numOfPosts === 2) { break }
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

function saveUser(saveKey, saveValue) {
    try {
        if (localStorage.getItem(saveKey) !== saveValue) { localStorage.setItem(saveKey, saveValue) }
    } catch { }
}
function getUser(saveKey) {
    return localStorage.getItem(saveKey)
}
