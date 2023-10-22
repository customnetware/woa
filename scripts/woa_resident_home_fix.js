 var postHistoryLen = 32
$(window).load(function () {
    try {
        getContent()
        showProfile()
        getGroups(32)
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
            let displayDivs = ["message", "classified", "news"]
            for (let d = 0; d < displayDivs.length; d++) {
                let recentItems = myWoodbridge.getElementsByClassName(displayDivs[d])
                let itemText = document.getElementById(displayDivs[d]).getElementsByTagName("p")

                document.getElementById(displayDivs[d]).removeChild(document.getElementById(displayDivs[d]).firstElementChild)
                if (recentItems.length == 0) { document.getElementById(displayDivs[d]).innerHTML = "No recent items found." }
                for (let p = 0; p < recentItems.length; p++) {
                    let itemContent = recentItems[p].getElementsByTagName("a")[0]
                    itemText[p].id = itemContent.id.replace("link_", "")
                    itemText[p].innerHTML = "<a href='" + itemContent.href + "'><b>" + itemContent.getAttribute("data-tooltip-title").replace(sentBy, "") + "</b></a><br />" + itemContent.getAttribute("data-tooltip-text")
                    if (displayDivs[d] == "message") {
                        let m_id = itemText[p].id
                        let m_content = itemContent.getAttribute("data-tooltip-title").replace(sentBy, "") + "|" + itemContent.getAttribute("data-tooltip-text") + "|" + itemContent.href
                        saveContent(m_id, m_content)
                    }
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
function getGroups(NumOfDays) {
    try {
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
                showPosts(selectedGroups, NumOfDays)
            })
    } catch { }
}
function showPosts(selectedGroup, NumOfDays) {
    try {
        let currentDate = new Date()
        for (let g = 0; g < selectedGroup.length; g++) {
            let selectedPost = (window.location.hostname == "localhost") ? "/Discussion/28118~" + selectedGroup[g].split("|")[0] + ".html" : "/Discussion/28118~" + selectedGroup[g].split("|")[0]

            $.get(selectedPost, function () { })
                .done(function (responseText) {
                    let forumPosts = document.getElementById("post")
                    let forum = new DOMParser().parseFromString(responseText, "text/html")
                    let postHeaders = forum.querySelectorAll("[id^=msgHeader]")
                    let postContents = forum.querySelectorAll("[id^=contents]")
                    for (let h = 0; h < postHeaders.length; h++) {
                        let messageTexts = postContents[h].getElementsByClassName("clsBodyText")
                        let messageAuthor = postContents[h].getElementsByClassName("respAuthorWrapper")
                        let messageContacts = postContents[h].getElementsByClassName("respReplyWrapper")
                        let postDate = new Date(messageAuthor[messageAuthor.length - 1].innerText.split("-")[1])
                        let dayDiff = (currentDate - postDate) / (1000 * 3600 * 24)
                        if (dayDiff < NumOfDays) {

                            let currentPost = document.createElement("p")
                            currentPost.className = (forumPosts.getElementsByTagName("p").length % 2 == 0) ? "btmEven" : "btmOdd"
                            let postHeader = document.createElement("b")
                            postHeader.appendChild(document.createTextNode(postHeaders[h].innerText))

                                let postReply = document.createElement("a")
                                postReply.className = "fa fa-reply fa-lg formatLink"
                                postReply.href = messageContacts[0].getElementsByTagName("a")[0].href
                            postHeader.appendChild(postReply)

                            currentPost.appendChild(postHeader)



                            if (messageTexts.length > 1) {
                                let replys = document.createElement("a")
                                replys.className = "fa fa-commenting-o fa-lg formatLink"
                                replys.href = "javascript:showReplies(" + forumPosts.getElementsByTagName("p").length + ")"
                                currentPost.appendChild(replys)
                            }
                            currentPost.appendChild(document.createElement("br"))
                            for (let p = 0; p < messageTexts.length; p++) {
                                let postContent = document.createElement("span")
                                if (p > 0) { postContent.className = "classHide" }
                                postContent.appendChild(document.createTextNode(messageTexts[p].innerText))
                                postContent.appendChild(document.createElement("br"))
                                postContent.appendChild(document.createTextNode(messageAuthor[p].innerText))
                                currentPost.appendChild(postContent)

                            }
                            forumPosts.appendChild(currentPost)
                        }
                    }
                })
        }
    } catch (error) {
    }
}
function showHistory() {
    let k = 2
    let emails = document.getElementById("message").getElementsByTagName("p")
    for (var i = 0; i < localStorage.length; ++i) {
        if (document.getElementById(localStorage.key(i)) == null) {
            let t_message = localStorage.getItem(localStorage.key(i)).split("|")
            emails[k].innerHTML = "<a href='" + t_message[2] + "'><b>" + t_message[0] + "</b></a><br />" + t_message[1]
            emails[k].id = localStorage.key(i)
            if (k == 0) { break } else { --k }
        }
    }
}
function showPostHistory() {
    if (postHistoryLen < 90) { postHistoryLen = postHistoryLen + 30 } else { postHistoryLen = postHistoryLen + 90 }

    document.getElementById("post").innerHTML = ""
    getGroups(postHistoryLen)
}
function showReplies(selectedP) {
    let currentForum = document.getElementById("post").getElementsByTagName("p")
    let hiddenItems = currentForum[(selectedP)].getElementsByClassName("classHide")
    for (let p = 0; p < hiddenItems.length; p++) {
        if (hiddenItems[p].style.display == "inline") { hiddenItems[p].style.display = "none" } else { hiddenItems[p].style.display = "inline" }
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
function saveContent(saveKey, saveValue) {
    try {
        if (localStorage.getItem(saveKey) == null) { localStorage.setItem(saveKey, saveValue) }
    } catch { }
}
