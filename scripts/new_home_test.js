const currentDate = new Date()
function pageLocation(URLString) { return (window.location.hostname == "localhost") ? URLString + ".html" : URLString }
function getResidentHomePage(pageToDownload) {
    $.get(pageLocation(pageToDownload), function () { })
        .done(function (responseText) {
            let myWoodbridge = new DOMParser().parseFromString(responseText, "text/html")
            let recentItems = document.getElementsByName("recentItem")
            for (let r = 0; r < recentItems.length; r++) {
                let selectedItems = myWoodbridge.querySelectorAll("[id^=" + recentItems[r].id + "]")
                let itemParagraph = document.getElementById(recentItems[r].id).getElementsByTagName("p")
                for (let k = 0; k < selectedItems.length; k++) {
                    itemParagraph[k].children[0].textContent = selectedItems[k].getAttribute("data-tooltip-title")
                    itemParagraph[k].children[1].textContent = selectedItems[k].getAttribute("data-tooltip-text")
                    itemParagraph[k].children[2].href = selectedItems[k].href
                    itemParagraph[k].id = selectedItems[k].id.replace("link_", "")
                    itemParagraph[k].style.display = "inline-block"
                }
                document.getElementsByName(recentItems[r].parentElement.id)[0].getElementsByTagName("span")[2].textContent = "(" + selectedItems.length + ")"
            }
            let newPicList = document.getElementById("recentPhotosBody").getElementsByTagName("div")
            let photoList = myWoodbridge.querySelectorAll("[id^=gallery_link_]")
            let galleryLink = myWoodbridge.querySelectorAll("[class^=gallery_txt_sub]")
            let galleryText = myWoodbridge.getElementsByClassName("left")
            for (let k = 0; k < photoList.length; k++) {
                newPicList[k].getElementsByTagName("img")[0].src = photoList[k].src
                newPicList[k].getElementsByTagName("span")[0].innerText = galleryText[k].innerText.replace(".jpg", "")
                newPicList[k].getElementsByTagName("a")[0].href = galleryLink[k].getElementsByTagName("a")[0].href
            }
            document.querySelector("[data-target='#recentPhotos']").getElementsByTagName("span")[2].innerHTML = "(3)"
            document.getElementById("currentProfile").getElementsByTagName("span")[0].className = "fa fa-check-circle fa-lg formatLink"
            document.getElementById("currentProfile").getElementsByTagName("span")[1].textContent = myWoodbridge.getElementsByClassName("clsHeader")[0].textContent
        })
        .always(function () {

        })
}
function getResourceCenter(pageToDownload) {
    let docList = document.getElementById("recentFlyersBody")
    let folderToGet = ["951754", "540434"]
    $.get(pageLocation(pageToDownload), function () { })
        .done(function (responseText) {
            let documents = new DOMParser().parseFromString(responseText, "text/html")
            for (let f = 0; f < folderToGet.length; f++) {
                let documentName = documents.getElementById("contents" + folderToGet[f]).querySelectorAll("[id^=d]")
                let documentLink = documents.getElementById("contents" + folderToGet[f]).querySelectorAll('a[title="View On-line"]')
                for (let p = 0; p < documentName.length; p++) {
                    if (f == 0) { p = documentName.length - 1 }
                    let resourceItem = document.createElement("span")
                    let selectedDoc = document.createElement("a")
                    selectedDoc.innerHTML = documentName[p].innerHTML
                    selectedDoc.href = documentLink[p].href
                    resourceItem.appendChild(selectedDoc)
                    docList.appendChild(resourceItem)
                }
            }
        })
        .always(function () {
            document.querySelector("[data-target='#recentFlyers']").getElementsByTagName("span")[2].innerHTML = "(" + docList.getElementsByTagName("span").length + ")"
        })
}
function getDiscussionGroups() {
    const NumOfDays = +document.getElementById("rangeval").innerText * 30
    const selectedGroups = [8030, 8364]
    const postList = document.getElementById("recentPostsBody")
    postList.innerHTML = ""
    for (let h = 0; h < selectedGroups.length; h++) {
        $.get(pageLocation("/Discussion/28118~" + selectedGroups[h]), function () { })
            .done(function (responseText) {
                let forum = new DOMParser().parseFromString(responseText, "text/html")
                let postHeaders = forum.querySelectorAll("[id^=msgHeader]")
                let postContents = forum.querySelectorAll("[id^=contents]")
                for (let h = 0; h < postHeaders.length; h++) {
                    let messageTexts = postContents[h].getElementsByClassName("clsBodyText")
                    let messageAuthor = postContents[h].getElementsByClassName("respAuthorWrapper")
                    let messageContacts = postContents[h].getElementsByClassName("respReplyWrapper")
                    let postDate = new Date(messageAuthor[messageAuthor.length - 1].innerText.split("-")[1])
                    let dayDiff = (currentDate - postDate) / (1000 * 3600 * 24)
                    if (dayDiff <= NumOfDays) {
                        let currentPost = document.createElement("p")
                        let postHeader = document.createElement("span")
                        let postMessage = document.createElement("span")
                        let postAuthor = document.createElement("span")
                        let postReply = document.createElement("a")
                        postHeader.appendChild(document.createTextNode(postHeaders[h].innerText))
                        postReply.className = "fa fa-reply fa-lg formatLink"
                        postReply.href = messageContacts[0].getElementsByTagName("a")[0].href
                        postHeader.appendChild(postReply)
                        if (messageTexts.length > 1) {
                            let replys = document.createElement("a")
                            replys.className = "fa fa-comments fa-lg formatLink"
                            replys.href = "javascript:showReplies(" + document.getElementsByClassName("groupPost").length + ")"
                            postHeader.appendChild(replys)
                            postHeader.appendChild(document.createTextNode(" (" + (messageTexts.length - 1) + ") "))
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
                        currentPost.className = "groupPost"
                        postList.appendChild(currentPost)
                    }
                }
            })
            .always(function () {
                document.querySelector("[data-target='#recentPosts']").getElementsByTagName("span")[2].innerHTML = "(" + postList.getElementsByTagName("p").length + ")"
            })
    }
}
function getProfilePage() {
    var regExp = /\(([^)]+)\)/
    var profileID = regExp.exec(document.getElementById("HeaderPublishAuthProfile").href)[1].split(",")[0]
    $("#userProfileImage").load(pageLocation("/Member/28118~" + profileID) + " img:first", function () {
        $("#userProfileText").load(pageLocation("/news/28118~792554/webmaster-only") + " #contentInner", function () {
            document.getElementById("userProfileText").getElementsByTagName("div")[0].getElementsByTagName("div")[0].remove()
            document.getElementById("userProfileText").getElementsByTagName("div")[0].getElementsByTagName("div")[1].remove()
        })
    })

}

function getDiscussionGroupPosts() {

    $("#recentPostsBody").load(pageLocation("/Discussion/28118~8364") + " .ThreadContainer", function () {
        let currentPosts = document.getElementsByClassName("ThreadContainer")[0].children
        let currentDate = new Date()
        for (i = currentPosts.length - 1; i >= 0; i--) {
            let postDate = new Date(currentPosts[i].getElementsByTagName("div")[4].innerText.replace("Last Reply:", ""))
            let dayDiff = (currentDate - postDate) / (1000 * 3600 * 24)
            if (dayDiff > 1000) { currentPosts[i].remove() }
        }
        for (c = 0; c < currentPosts.length; c++) {
            let currentPostLink = currentPosts[c].getElementsByClassName("MsgHeader")[0].getElementsByTagName("a")[0]
            currentPostLink.href = "javascript:getSelectedPost(" + c + ")"
        }
    })
}
function getSelectedPost(postIndex) {
    let currentPosts = document.getElementsByClassName("ThreadContainer")[0].children
    let currentPost = currentPosts[postIndex].getElementsByClassName("row")[1]
    if (currentPost.style.display == "none") {
        let postContent = currentPost.getElementsByTagName("p")
        for (i = postContent.length - 1; i >= 0; i--) { if (postContent[i].innerHTML == "&nbsp;") { postContent[i].remove() } }
        for (i = 0; i < postContent.length;) {
            let selectedParagraph = postContent[i]
            let divTag = document.createElement('div')
            divTag.textContent = selectedParagraph.textContent
            selectedParagraph.parentNode.replaceChild(divTag, selectedParagraph)
        }
        currentPost.style.display = "inline"
    } else { currentPost.style.display = "none" }
}
$(window).load(function () {
    getProfilePage()
    getDiscussionGroupPosts()
    getResourceCenter("/resourcecenter/28118/resource-center")
    getResidentHomePage("/homepage/28118/resident-home-page")


})

