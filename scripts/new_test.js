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
function getGroups() {
    const numOfDays = +document.getElementById("rangeval").innerText * 30
    try {
        let fileLocation = (window.location.hostname == "localhost") ? "/Discussion/list/28118/discussion-groups.html" : "/Discussion/list/28118/discussion-groups"
        let selectedGroups = ["8364"]
        let currentDate = new Date()
        $.get(fileLocation, function () { })
            .done(function (responseText) {
                let forum = new DOMParser().parseFromString(responseText, "text/html")
                let groups = forum.getElementById("contentInner").children
                for (let p = 2; p < groups.length; p++) {
                    let lastPost = groups[p].getElementsByClassName("clsBodyItalic")[0].innerText
                    let groupName = groups[p].getElementsByClassName("clsBodyText")[0].innerText
                    let groupID = groups[p].getElementsByClassName("clsBodyText")[0].getElementsByTagName("a")[0].id.replace("titleEditForum", "")
                    let dateStart = lastPost.indexOf("Last Post:")
                    let postDate = (dateStart > -1) ? new Date(lastPost.substr(dateStart + 10, 18)) : new Date("01/01/2001")
                    let dayDiff = (currentDate - postDate) / (1000 * 3600 * 24)
                    groupName = (groupName.includes(".")) ? groupName.split(".")[1] : groupName
                    if (dayDiff < numOfDays && groupID !== "8364") { selectedGroups.push(groupID + "|" + groupName + "|" + postDate.toLocaleDateString) }
                } getGroupPosts(selectedGroups, numOfDays)
            })
    } catch { }
}
function getGroupPosts(selectedGroups, numOfDays) {
    let postList = document.getElementById("recentPostsBody")
    while (postList.firstChild) { postList.removeChild(postList.firstChild) }

    for (let h = 0; h < selectedGroups.length; h++) {
        if (selectedGroups[h].split("|")[0] !== "6493") {
            $.get(pageLocation("/Discussion/28118~" + selectedGroups[h].split("|")[0]), function () { })
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
                        if (dayDiff <= numOfDays || (selectedGroups.length == 1 && dayDiff > numOfDays)) {
                            let currentPost = document.createElement("p")
                            let postHeader = document.createElement("span")
                            let postMessage = document.createElement("span")
                            let postAuthor = document.createElement("span")
                            let headerLink = document.createElement("a")
                            headerLink.href = "javascript:showComments('" + messageContacts[0].getElementsByTagName("a")[0].id.replace("lnkTopicReply", "post") + "')"
                            headerLink.innerHTML = postHeaders[h].innerText
                            postHeader.appendChild(headerLink)

                            postMessage.appendChild(document.createTextNode(messageTexts[0].innerText))
                            postAuthor.appendChild(document.createTextNode(messageAuthor[0].innerText))
                            currentPost.appendChild(postHeader)
                            currentPost.appendChild(postMessage)



                            let postReply = document.createElement("a")
                            postReply.style.display = "none"
                            postReply.innerHTML = messageContacts[0].getElementsByTagName("a")[0].innerHTML
                            postReply.href = messageContacts[0].getElementsByTagName("a")[0].href
                            postAuthor.appendChild(postReply)
                            currentPost.id = messageContacts[0].getElementsByTagName("a")[0].id.replace("lnkTopicReply", "post")


                            let postComment = document.createElement("a")
                            postComment.innerHTML = " - Comments: (" + (messageTexts.length - 1) + ")"
                            postComment.href = "javascript:showReplies('" + currentPost.id + "')"
                            postAuthor.appendChild(postComment)


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
                        if (selectedGroups.length == 1 && dayDiff > numOfDays) { break }
                    }
                })
                .always(function () {
                    document.getElementById("postHeader").children[2].innerHTML = "(" + postList.childElementCount + ")"
                })
        }
    }
}
function showComments(SelectedPostID) {
    let selectedPost = document.getElementById(SelectedPostID)
    let allPosts = document.getElementById("recentPostsBody").getElementsByTagName("p")
    for (let p = 0; p < allPosts.length; p++) {
        if (allPosts[p].id !== SelectedPostID) {
            if (allPosts[p].getElementsByClassName("postForm").length > 0) { allPosts[p].getElementsByClassName("postForm")[0].remove() }
        }
    }

    if (selectedPost.getElementsByClassName("postForm").length == 0) {
        let formDiv = document.createElement("div")
        let commentBox = document.createElement("textarea")
        let saveButton = document.createElement("a")
        let cancelButton = document.createElement("a")
        let frameLink = /\(([^)]+)\)/.exec(selectedPost.getElementsByTagName("a")[1].href)[1].replaceAll("'", "")


        saveButton.innerHTML = "Save Comment"
        saveButton.href = "javascript:addComments()"
        saveButton.className = "btn btn-primary"
        cancelButton.innerHTML = "Cancel"
        cancelButton.className = "btn btn-primary"
        cancelButton.href = "javascript:showComments('" + SelectedPostID + "')"

        formDiv.appendChild(commentBox)
        formDiv.appendChild(saveButton)
        formDiv.appendChild(cancelButton)
        formDiv.className = "postForm"
        selectedPost.appendChild(formDiv)

        sessionStorage.setItem("selectedPostID", SelectedPostID)
        sessionStorage.setItem("portalPostID", frameLink.split(",")[0])
        sessionStorage.setItem("portalGroupID", frameLink.split(",")[1])
        sessionStorage.setItem("portalReplyID", frameLink.split(",")[5])
        if (window.location.hostname !== "localhost") {
            document.getElementById("woaFrame").src = "/Discussion/28118~" + sessionStorage.getItem("portalPostID") + "~" + sessionStorage.getItem("portalReplyID").replace("lnkTopicReply", "")
        }

    } else {
        selectedPost.getElementsByClassName("postForm")[0].remove()
    }

}
function addComments() {
    let commentForm = document.getElementById(sessionStorage.getItem("selectedPostID")).getElementsByTagName("textarea")[0]
    if (commentForm.value.length == 0) { return }
    if (window.location.hostname == "localhost") {
        getGroups()
        let waitforForm = setInterval(function () {
            if (document.getElementById(sessionStorage.getItem("selectedPostID")) !== "null") {
                clearInterval(waitforForm)
                document.getElementById(sessionStorage.getItem("selectedPostID")).scrollIntoView()
            }
        }, 1000)
    } else {
        try {
            let frameWindow = document.getElementById('woaFrame').contentWindow
            frameWindow.AV.EditorLauncher.discussionTopic(sessionStorage.getItem("portalPostID"), sessionStorage.getItem("portalGroupID"), '', 'reply', 'Reply to Post', sessionStorage.getItem("portalReplyID"))
            let waitforForm = setInterval(function () {
                if (frameWindow.document.getElementsByTagName("iframe").length > 0) {
                    frameWindow.document.getElementsByTagName("iframe")[0].contentWindow.document.getElementById("txt_post_body").innerHTML = commentForm.value
                    frameWindow.document.getElementsByClassName("x-btn-text save-button")[0].click()
                    clearInterval(waitforForm)
                    let waitforConfirm = setInterval(function () {
                        if (frameWindow.document.getElementsByClassName(" x-btn-text").length > 0) {
                            frameWindow.document.getElementsByClassName(" x-btn-text")[4].click()
                            clearInterval(waitforConfirm)
                            getGroups()
                            let waitforPost = setInterval(function () {
                                if (document.getElementById(sessionStorage.getItem("selectedPostID")) !== "null") {
                                    clearInterval(waitforPost)
                                    document.getElementById(sessionStorage.getItem("selectedPostID")).scrollIntoView()
                                }
                            }, 1000)
                        }
                    }, 1000)
                }
            }, 1000)


        } catch (error) { alert(error.message) }
    }
}
function saveData() {
    localStorage.setItem("postRange", document.getElementById("formControlRange").value)
    getGroups()
}
function showReplies(postID) {
    let posts = document.getElementsByClassName("groupPost")
    for (let p = 0; p < posts.length; p++) {
        let replies = posts[p].getElementsByTagName("span")
        if (replies.length > 3) {
            for (let r = 3; r < replies.length; r++) {
                if (posts[p].id == postID) {
                    if (replies[r].style.display == "block") {
                        replies[r].style.display = "none"
                    } else { replies[r].style.display = "block" }
                } else { replies[r].style.display = "none" }
            }
        }
    }
}
$(window).load(function () {
    let postRange = localStorage.getItem("postRange")
    if (postRange !== null) {
        document.getElementById("formControlRange").value = postRange
        document.getElementById("rangeval").innerText = postRange
    }
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
    getGroups()
    getClassifiedAds()
    getResidentHomePage()


})
