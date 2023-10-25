var postHistoryLen = 31
$(window).load(function () {
    try {


        getContent()
        showProfile()
        showPosts(8364, 31)
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
    let itemListID = ["message", "classified", "news"]
    let itemListIcon = ["fa fa-envelope-o", "fa fa-shopping-cart", "fa fa-newspaper-o"]
    for (let i = 0; i < itemListID.length; i++) { document.getElementById(itemListID[i]).parentElement.parentElement.getElementsByTagName("span")[0].className = "fa fa-spinner fa-pulse fa-fw" }
    
    $.get(residentPage, function () { })

        .done(function (responseText) {
            let myWoodbridge = new DOMParser().parseFromString(responseText, "text/html")
            let photoList = myWoodbridge.querySelectorAll("[id^=gallery_link_]")
            let galleryLink = myWoodbridge.querySelectorAll("[class^=gallery_txt_sub]")

            for (let d = 0; d < itemListID.length; d++) {
                let recentList = document.getElementById(itemListID[d])
                let recentItems = myWoodbridge.getElementsByClassName(itemListID[d])                    

                for (let p = 0; p < recentItems.length; p++) {
                    let recentItem = document.createElement("p")
                    let itemContent = recentItems[p].getElementsByTagName("a")[0]
                    let itemContentTitle = itemContent.getAttribute("data-tooltip-title").replace(sentBy, "")
                    let itemContentText = itemContent.getAttribute("data-tooltip-text")
                    let itemTitle = document.createElement("span")
                    recentItem.id = itemContent.id.replace("link_", "")

                    itemTitle.appendChild(document.createTextNode(itemContentTitle))
                    recentItem.appendChild(itemTitle)
                    recentItem.appendChild(document.createTextNode(itemContentText))
                    recentList.appendChild(recentItem)

                    let itemLink = document.createElement("a")
                    itemLink.className = "fa fa-share fa-lg formatLink"
                    itemLink.href = itemContent.href
                    recentItem.appendChild(itemLink)
                    saveContent(recentItem.id, (itemContentTitle + "|" + itemContentText + "|" + itemContent.href), itemListID[d])
                }
                recentList.parentElement.parentElement.getElementsByTagName("span")[0].className = itemListIcon[d]
            }

            for (let k = 0; k < photoList.length; k++) {
                let picLink = document.createElement("a")
                picLink.href = galleryLink[k].getElementsByTagName("a")[0].href
                let pic = document.createElement("img")
                pic.src = photoList[k].src
                pic.className = "recentPic"
                picLink.appendChild(pic)
                photoDisplay.appendChild(picLink)
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

function showPosts(groupID, NumOfDays) {
    try {
        let selectedPost = (window.location.hostname == "localhost") ? "/Discussion/28118~" + groupID + ".html" : "/Discussion/28118~8364"
        let currentDate = new Date()
        $.get(selectedPost, function () { })
            .done(function (responseText) {
                let forumPosts = document.getElementById("post")
                forumPosts.parentElement.parentElement.getElementsByTagName("span")[0].className = "fa fa-spinner fa-pulse fa-fw"
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
                        let postHeader = document.createElement("span")
                        let postMessage = document.createElement("span")
                        let postAuthor = document.createElement("span")

                        postHeader.appendChild(document.createTextNode(postHeaders[h].innerText))

                        let postReply = document.createElement("a")
                        postReply.className = "fa fa-reply fa-lg formatLink"
                        postReply.href = messageContacts[0].getElementsByTagName("a")[0].href
                        postHeader.appendChild(postReply)

                        if (messageTexts.length > 1) {
                            let replys = document.createElement("a")
                            replys.className = "fa fa-comments fa-lg formatLink"
                            replys.href = "javascript:showReplies(" + document.getElementById("post").getElementsByTagName("p").length + ")"
                            postHeader.appendChild(replys)
                        }

                        postMessage.appendChild(document.createTextNode(messageTexts[0].innerText))
                        postAuthor.appendChild(document.createTextNode(messageAuthor[0].innerText))
                        currentPost.appendChild(postHeader)
                        currentPost.appendChild(postMessage)
                        currentPost.appendChild(postAuthor)
                        for (let p = 1; p < messageTexts.length; p++) {
                            let replyMessage = document.createElement("span")
                            let replyAuthor = document.createElement("span")
                            replyMessage.appendChild(document.createTextNode(messageTexts[p].innerText))
                            replyAuthor.appendChild(document.createTextNode(messageAuthor[p].innerText))
                            currentPost.appendChild(replyMessage)
                            currentPost.appendChild(replyAuthor)
                        }
                        forumPosts.appendChild(currentPost)
                    }
                }
                forumPosts.parentElement.parentElement.getElementsByTagName("span")[0].className = "fa fa-comments-o"
            })

    } catch (error) {
        alert(error.message)
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
    document.getElementById("post").innerHTML = ""
    postHistoryLen += 90
    showPosts(8364, postHistoryLen)
}
function showReplies(p_id) {
    var testSpans = document.getElementById("post").getElementsByTagName("p")[p_id].getElementsByTagName("span")
    for (let p = 3; p < testSpans.length; p++) {
        if (testSpans[p].style.display == "block") { testSpans[p].style.display = "none" } else { testSpans[p].style.display = "block" }
    }
}
function showDocuments() {
    try {
        let fileLocation = (window.location.hostname == "localhost") ? "/resourcecenter/28118/resource-center.html" : "/resourcecenter/28118/resource-center"
        let documentList = document.getElementById("document")

        documentList.parentElement.parentElement.getElementsByTagName("span")[0].className = "fa fa-spinner fa-pulse fa-fw"
        $.get(fileLocation, function () { })
            .done(function (responseText) {
                let documents = new DOMParser().parseFromString(responseText, "text/html")
                let documentName = documents.getElementById("contents540434").getElementsByClassName("clsTreeNde")
                let documentLink = documents.getElementById("contents540434").querySelectorAll('a[title="View On-line"]')
                for (let p = 0; p < documentName.length; p++) {
                    let resourceItem = document.createElement("span")
                    let selectedDoc = document.createElement("a")
                    selectedDoc.innerHTML = documentName[p].innerHTML
                    selectedDoc.href = documentLink[p].href
                    resourceItem.appendChild(selectedDoc)
                    documentList.appendChild(resourceItem)
                } documentList.parentElement.parentElement.getElementsByTagName("span")[0].className = "fa fa-file-text-o"

            })
    } catch (error) {
    }
}
function saveContent(saveKey, saveValue, saveType) {
    try {
        if (localStorage.getItem(saveKey) == null && saveType == "message") { localStorage.setItem(saveKey, saveValue) }
    } catch { }
}
