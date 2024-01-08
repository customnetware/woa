document.getElementsByClassName("clsHeader")[0].style.visibility = "hidden"
let currentDate = new Date()
let emailCount = 0

function pageLocation(URLString) {
    return (window.location.hostname == "localhost") ? URLString + ".html" : URLString
}
function updateHeader(headerID, headerClass, headerTitle, headerLen) {
    let cardHeader = document.getElementById(headerID).children
    cardHeader[0].className = headerClass
    cardHeader[1].innerHTML = headerTitle
    cardHeader[2].innerHTML = "(" + headerLen + ")"
}
function emailNavigation(dir) {
    if (dir == "next") {
        let retrievedData = localStorage.getItem("emails")
        let emailData = (retrievedData !== null) ? JSON.parse(retrievedData) : []
        let emailList = document.getElementById("recentEmailsBody").getElementsByTagName("p")
        if (emailCount >= emailData.length) { emailCount = 0 }
        for (let p = 0, e = emailCount; e < emailData.length, p < 3; e++, p++) {
            emailList[p].id = emailData[e][0]
            emailList[p].children[0].innerHTML = emailData[e][1]
            emailList[p].children[0].href = "javascript:viewSavedMessages('" + emailData[e][3] + "')"
            emailList[p].children[1].innerHTML = emailData[e][2]
            emailCount++
            if (emailCount >= emailData.length) { emailCount = 0 }
        }
    } else { document.getElementById("recentEmailsBody").innerHTML = sessionStorage.getItem("currentEmails") }
}
function viewSavedMessages(savedMessageURL) {
    let emailPopUp = document.getElementById("emailsSaved")
    while (emailPopUp.firstChild) { emailPopUp.removeChild(emailPopUp.firstChild) }

    if (savedMessageURL.includes("/Messenger/MessageView/")) {
        $("#emailsSaved").load(pageLocation(savedMessageURL) + " div:first", function (responseTxt, statusTxt, xhr) {
            if (statusTxt == "error") { emailPopUp.innerHTML = "The requested email was not found on the server.  It may have been deleted or you do not have permission to view it." }
        })
    }
    if (!$("#showEmailAlert").is(":visible")) { $("#showEmailAlert").modal("show") }
}
function getResidentHomePage() {
    $.get(pageLocation("/homepage/28118/resident-home-page"), function () { })
        .done(function (responseText) {
            let myWoodbridge = new DOMParser().parseFromString(responseText, "text/html")
            let emailList = document.getElementById("recentEmailsBody").getElementsByTagName("p")
            let retrievedData = localStorage.getItem("emails")
            let emailData = (retrievedData !== null) ? JSON.parse(retrievedData) : []

            document.getElementById("notificationHeader").getElementsByTagName("span")[0].className = "fa fa-check-circle fa-lg formatLink"
            document.getElementById("notificationHeader").getElementsByTagName("span")[1].innerHTML = myWoodbridge.getElementsByClassName("clsHeader")[0].innerHTML
            showPhotos(myWoodbridge)
            let recentItems = myWoodbridge.getElementsByClassName("message")
            for (let p = 0; p < recentItems.length; p++) {
                let itemContent = recentItems[p].getElementsByTagName("a")[0]
                emailList[p].id = itemContent.id.replace("link_", "")
                emailList[p].children[0].href = "javascript:viewSavedMessages('" + itemContent.href + "')"
                emailList[p].children[0].innerHTML = itemContent.getAttribute("data-tooltip-title").split("by")[0]
                emailList[p].children[1].innerHTML = itemContent.getAttribute("data-tooltip-text")
                if ((retrievedData !== null && retrievedData.includes(emailList[p].id) == false) || emailData.length == 0) {
                    emailData.push([emailList[p].id, emailList[p].children[0].innerHTML, emailList[p].children[1].innerHTML, itemContent.href])
                    let emailsToSave = JSON.stringify(emailData)
                    localStorage.setItem("emails", emailsToSave)
                }

            }
            updateHeader("emailHeader", "fa fa-envelope-o", "Association Emails", emailList.length)
            sessionStorage.setItem("currentEmails", document.getElementById("recentEmailsBody").innerHTML)
        })
}
function getNewsAndAnnouncements() {
    let newsList = document.getElementById("recentNewsBody")
    $.get(pageLocation("/news/list/28118/news-announcements"), function () { })
        .done(function (responseText) {
            let newsArticles = new DOMParser().parseFromString(responseText, "text/html")
            let articleTitle = newsArticles.getElementsByClassName("clsHeader")
            let articleContent = newsArticles.getElementsByClassName("clsBodyText")
            for (let p = 0; p < articleContent.length; p++) {
                let currentItem = document.createElement("p")
                let itemTitle = document.createElement("span")
                let itemLink = document.createElement("a")
                itemLink.href = articleTitle[p].parentElement.getElementsByTagName("div")[2].getElementsByTagName("a")[0].href
                itemLink.className = "fa fa-arrow-right fa-lg formatLink"
                itemTitle.appendChild(document.createTextNode(articleTitle[p].innerText))
                currentItem.appendChild(itemTitle)
                currentItem.appendChild(document.createTextNode(articleContent[p].innerText))
                currentItem.appendChild(itemLink)
                newsList.appendChild(currentItem)
            }
            document.getElementById("newsHeader").children[2].innerHTML = "(" + newsList.childElementCount + ")"
        })
}
function getResourceCenter() {
    let eventFlyer = document.getElementById("recentFlyersBody"), newsLetter = document.getElementById("newsLettersBody")
    $.get(pageLocation("/resourcecenter/28118/resource-center"), function () { })
        .done(function (responseText) {
            let documents = new DOMParser().parseFromString(responseText, "text/html")
            if (documents.getElementById("contents540434") !== null) {
                let documentName = documents.getElementById("contents540434").querySelectorAll("[id^=d]")
                let documentLink = documents.getElementById("contents540434").querySelectorAll('a[title="View On-line"]')
                for (p = documentName.length - 1; p >= 0; p--) {
                    let resourceItem = document.createElement("span")
                    let selectedDoc = document.createElement("a")
                    selectedDoc.innerHTML = documentName[p].innerHTML
                    selectedDoc.href = documentLink[p].href
                    resourceItem.appendChild(selectedDoc)
                    eventFlyer.appendChild(resourceItem)
                }
                document.getElementById("flyersHeader").children[2].innerHTML = "(" + eventFlyer.getElementsByTagName("span").length + ")"
            }
            if (documents.getElementById("contents951754") !== null) {
                let newsLetterName = documents.getElementById("contents951754").querySelectorAll("[id^=d]")
                let newsLetterLink = documents.getElementById("contents951754").querySelectorAll('a[title="View On-line"]')
                for (i = newsLetterName.length - 1; i >= 0; i--) {
                    let resourceItem = document.createElement("span")
                    let selectedDoc = document.createElement("a")
                    selectedDoc.innerHTML = newsLetterName[i].innerHTML
                    selectedDoc.href = newsLetterLink[i].href
                    resourceItem.appendChild(selectedDoc)
                    newsLetter.appendChild(resourceItem)
                    if (newsLetter.getElementsByTagName("span").length > 5) { break }
                }
                document.getElementById("newsletterHeader").children[2].innerHTML = "(" + newsLetter.getElementsByTagName("span").length + ")"
            }
        })
}
function showPhotos(galleryPage) {
    let newPicList = document.getElementById("recentPhotosBody").getElementsByTagName("div")
    let photoList = galleryPage.querySelectorAll("[id^=gallery_link_]")
    let galleryLink = galleryPage.querySelectorAll("[class^=gallery_txt_sub]")
    let galleryText = galleryPage.getElementsByClassName("left")
    for (let k = 0; k < photoList.length; k++) {
        newPicList[k].getElementsByTagName("img")[0].src = photoList[k].src
        newPicList[k].getElementsByTagName("span")[0].innerText = galleryText[k].innerText.replace(".jpg", "")
        newPicList[k].getElementsByTagName("a")[0].href = galleryLink[k].getElementsByTagName("a")[0].href
    }
    document.getElementById("photoHeader").children[2].innerHTML = "(3)"
}
function getProfilePage() {
    let profileImg = document.createElement("img")
    let profileID = /\(([^)]+)\)/.exec(document.getElementById("HeaderPublishAuthProfile").href)[1].split(",")[0]
    $.get(pageLocation("/news/28118~792554/webmaster-only"), function () { })
        .done(function (responseText) {
            let profileDoc = new DOMParser().parseFromString(responseText, "text/html")
            document.getElementById("userProfile").innerHTML = profileDoc.getElementById("contentInner").children[2].innerHTML
            $.get(pageLocation("/Member/28118~" + profileID), function () { })
                .done(function (responseText) {
                    let profileDoc = new DOMParser().parseFromString(responseText, "text/html")
                    profileImg.src = profileDoc.getElementsByTagName("img")[0].src
                    document.getElementById("userProfile").insertBefore(profileImg, document.getElementById("userProfile").firstChild)
                })
        })
}
function getClassifiedAds() {
    let classifiedsList = document.getElementById("recentAdsBody")
    classifiedsList.innerHTML = ""
    $.get(pageLocation("/classified/search/28118~480182/classifieds"), function () { })
        .done(function (responseText) {
            let classifieds = new DOMParser().parseFromString(responseText, "text/html")
            let classifiedTitle = classifieds.querySelectorAll('.clsBodyText:not(.hidden-md-up,.hidden-sm-down)')
            let classifiedSummary = classifieds.getElementsByClassName("clsBodyText hidden-md-up")
            let classifiedBody = classifieds.getElementsByClassName("clsBodyText hidden-sm-down")
            for (let p = 0; p < classifiedTitle.length; p++) {
                let currentItem = document.createElement("p")
                let itemTitle = document.createElement("span")
                let itemLink = document.createElement("a")
                itemTitle.appendChild(document.createTextNode(classifiedTitle[p].getElementsByTagName("a")[0].innerHTML))
                currentItem.appendChild(itemTitle)
                currentItem.appendChild(document.createTextNode(classifiedBody[p].childNodes[0].nodeValue))
                classifiedsList.appendChild(currentItem)
            }
            document.getElementById("classifiedHeader").children[2].innerHTML = "(" + classifiedsList.childElementCount + ")"
        })
}
function getDiscussionGroups() {
    let forums = ["8030", "8364", "11315"], forumNames = ["Recommendations", "General", "Using the HOA Portal"], forumArray = []
    for (let f = 0; f < forums.length; f++) {
        $.get("/Discussion/28118~" + forums[f], function () { })
            .done(function (responseText) {
                let forum = new DOMParser().parseFromString(responseText, "text/html")
                let posts = forum.getElementsByClassName("ThreadContainer")[0]
                let lst = document.getElementById("post")
                for (let x = 0; x < posts.childElementCount; x++) {
                    let post = posts.children[x]
                    let lastDate = post.getElementsByClassName("respLastReplyDate")[0].innerText.trim().replace("Last Reply: ", "")
                    let topic = post.getElementsByClassName("respDiscTopic")
                    let comments = post.getElementsByClassName("respDiscChildPost")
                    let posters = post.getElementsByClassName("respAuthorWrapper")
                    let contacts = post.getElementsByClassName("respReplyWrapper")
                    let dateSort = new Date(lastDate).getTime()
                    forumArray.push({
                        postSort: dateSort,
                        lastPost: lastDate,
                        subject: topic[0].innerText.trim(),
                        postContent: topic[1].innerText.trim(),
                        postAuthor: posters[0].innerText.trim(),
                        postID: contacts[0].getElementsByTagName("a")[0].id,
                        groupName: forumNames[f],
                        groupID: forums[f]
                    })
                }
            })
    }
    let waitforPost = setInterval(function () {
        if (forumArray.length > 0) {
            clearInterval(waitforPost)

            let postList = document.getElementById("recentPostsBody")
            while (postList.firstChild) { postList.removeChild(postList.firstChild) }
            forumArray.sort((a, b) => { return a.postSort - b.postSort })
            forumArray.reverse()
            for (let f = 0, c = 1; f < forumArray.length, c <= 3; f++, c++) {

                let currentPost = document.createElement("p")
                let postHeader = document.createElement("span")
                let postMessage = document.createElement("span")
                let postAuthor = document.createElement("span")
                let headerLink = document.createElement("a")
                currentPost.id = forumArray[f].postID.replace("lnkTopicReply", "post")
                headerLink.href = "javascript:showComments('" + currentPost.id + "'," + forumArray[f].groupID + ")"
                headerLink.innerHTML = forumArray[f].subject + " - Posted in  " + forumArray[f].groupName
                postHeader.appendChild(headerLink)
                postMessage.appendChild(document.createTextNode(forumArray[f].postContent))
                postAuthor.appendChild(document.createTextNode(forumArray[f].postAuthor))

                currentPost.appendChild(postHeader)
                currentPost.appendChild(postMessage)
                currentPost.appendChild(postAuthor)

                let commentBox = document.createElement("textarea")
                commentBox.id = forumArray[f].postID.replace("lnkTopicReply", "comment")
                let saveButton = document.createElement("a")
                saveButton.innerHTML = "Reply"
                saveButton.href = "javascript:addComments('" + currentPost.id + "'," + forumArray[f].groupID + ")"
                currentPost.appendChild(commentBox)
                currentPost.appendChild(saveButton)

                postList.appendChild(currentPost)
            } document.getElementById("postHeader").children[2].innerHTML = "(" + postList.childElementCount + ")"
        }
    }, 1000)
}
function showComments(selectedPostID, groupID) {
    let selectedPost = document.getElementById(selectedPostID)
    let groupPostContent = selectedPost.getElementsByTagName("span")
    if (groupPostContent.length == 3) {
        $.get("/Discussion/28118~" + groupID, function () { })
            .done(function (responseText) {
                let forum = new DOMParser().parseFromString(responseText, "text/html")
                let comments = forum.getElementById(selectedPostID.replace("post", "contents"))
                let replyText = comments.getElementsByClassName("respDiscChildPost")
                let replyAuthor = comments.getElementsByClassName("respAuthorWrapper")
                for (let p = 0; p < replyText.length; p++) {
                    let replySpan = document.createElement("span")
                    let authorSpan = document.createElement("span")
                    replySpan.innerText = replyText[p].innerText.trim()
                    authorSpan.innerText = replyAuthor[p + 1].innerText.trim()
                    selectedPost.insertBefore(replySpan, document.getElementById(selectedPostID.replace("post", "comment")))
                    selectedPost.insertBefore(authorSpan, document.getElementById(selectedPostID.replace("post", "comment")))
                }
            })
    } else {
        for (r = groupPostContent.length - 1; r = 3; r--) { groupPostContent[r].remove() }
    }
}
function addComments(selectedPostID, groupID) {
    if (window.location.hostname !== "localhost") {
        document.getElementById("woaFrame").src = "/Discussion/28118~" + groupID + "~" + selectedPostID.replace("post", "")
    }
    let commentForm = document.getElementById(selectedPostID).getElementsByTagName("textarea")[0]
    if (commentForm.value.length == 0) { return }
    if (window.location.hostname == "localhost") {
        getDiscussionGroups()
        let waitforForm = setInterval(function () {
            if (document.getElementById(selectedPostID) !== "null") {
                clearInterval(waitforForm)
                document.getElementById(selectedPostID).scrollIntoView()
            }
        }, 1000)
    } else {
        try {
            let frameWindow = document.getElementById('woaFrame').contentWindow
            let waitforButton = setInterval(function () {
                let replyButton = frameWindow.document.getElementById(selectedPostID.replace("post", "lnkTopicReply"))
                if (replyButton !== null) {
                    clearInterval(waitforButton)
                    replyButton.click()
                }
            }, 1000)
            let waitforForm = setInterval(function () {
                if (frameWindow.document.getElementsByTagName("iframe").length > 0) {
                    frameWindow.document.getElementsByTagName("iframe")[0].contentWindow.document.getElementById("txt_post_body").innerHTML = commentForm.value
                    frameWindow.document.getElementsByClassName("x-btn-text save-button")[0].click()
                    clearInterval(waitforForm)
                    let waitforConfirm = setInterval(function () {
                        if (frameWindow.document.getElementsByClassName(" x-btn-text").length > 0) {
                            frameWindow.document.getElementsByClassName(" x-btn-text")[4].click()
                            clearInterval(waitforConfirm)
                            getDiscussionGroups()
                            let waitforPost = setInterval(function () {
                                if (document.getElementById(selectedPostID) !== "null") {
                                    clearInterval(waitforPost)
                                    document.getElementById(selectedPostID).scrollIntoView()
                                }
                            }, 1000)
                        }
                    }, 1000)
                }
            }, 1000)
        } catch (error) { alert(error.message) }
    }
}
$(window).load(function () {
    $("#postSettingsAlert").on("hide.bs.modal", function () {
        document.getElementById("postComments").innerHTML = ""
        document.getElementById("replyContent").value = ""
    })
    $("#recentFlyers, #newsLetters").on("hide.bs.collapse", function () {
        this.parentElement.getElementsByTagName("div")[0].getElementsByTagName("span")[0].className = "fa fa-folder-o fa-lg"
    })
    $("#recentFlyers, #newsLetters").on("show.bs.collapse", function () {
        this.parentElement.getElementsByTagName("div")[0].getElementsByTagName("span")[0].className = "fa fa-folder-open-o fa-lg"
    })
    getProfilePage()
    getResourceCenter()
    getNewsAndAnnouncements()
    getDiscussionGroups()
    getClassifiedAds()
    getResidentHomePage()
})
