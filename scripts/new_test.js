document.getElementsByClassName("clsHeader")[0].style.visibility = "hidden"
let currentDate = new Date()
let emailCount = 0
let forumCount = 0
let forumArray = []
let isLocal = (window.location.hostname == "localhost") ? true : false
let memberName = ""

function pageLocation(URLString) {
    return (isLocal == true) ? URLString + ".html" : URLString
}
function updateHeader(headerID, headerClass, headerTitle, headerLen) {
    let cardHeader = document.getElementById(headerID).children

    if (headerClass.length > 5) { cardHeader[0].className = headerClass }
    if (headerTitle.length > 5) { cardHeader[1].innerHTML = headerTitle }
    cardHeader[2].innerHTML = "(" + headerLen + ")"

}
function emailNavigation(dir) {

    if (dir == "next") {
        let retrievedData = localStorage.getItem("emails")
        let emailData = (retrievedData !== null) ? JSON.parse(retrievedData) : []
        let emailList = document.getElementById("recentEmailsBody").getElementsByTagName("p")
        emailData.sort((a, b) => { return a.emailSort - b.emailSort })
        emailData.reverse()

        savedEmails: for (let i = 0; i < emailData.length; i++) {
            for (let p = 0; p < emailList.length; p++) {
                if (emailData[i].emailID === emailList[2].id) { emailCount = i + 1; break savedEmails }
                if (emailData[emailData.length - 1].emailID === emailList[p].id) { emailCount = 0; break savedEmails }
            }
        }

        if (emailCount >= emailData.length) { emailCount = 0 }
        for (let p = 0, e = emailCount; e < emailData.length, p < 3; e++, p++) {
            emailList[p].id = emailData[e].emailID
            emailList[p].children[0].innerHTML = emailData[e].emailSub
            emailList[p].children[0].href = "javascript:viewSavedMessages('" + emailData[e].emailURL + "')"
            emailList[p].children[1].innerHTML = emailData[e].emailBody
        }
    } else { document.getElementById("recentEmailsBody").innerHTML = sessionStorage.getItem("currentEmails") }
}
function viewSavedMessages(savedMessageURL) {
    let emailPopUp = document.getElementById("emailsSaved")
    while (emailPopUp.firstChild) { emailPopUp.removeChild(emailPopUp.firstChild) }
    $.get(pageLocation(savedMessageURL), function () { })
        .done(function (responseText) {
            let emailSaved = new DOMParser().parseFromString(responseText, "text/html")
            let emailContent = emailSaved.getElementById("AV").getElementsByTagName("td")
            let emailHeaders = emailSaved.getElementsByClassName("clsGridDetail")
            document.getElementById("showEmailAlertLabel").innerHTML = emailHeaders[3].innerHTML + " - " + emailHeaders[1].innerHTML + " - " + emailHeaders[0].innerHTML
            emailPopUp.innerHTML = emailContent[0].innerHTML
        })
        .fail(function () {
            document.getElementById("showEmailAlertLabel").innerHTML = "Email Not Found!"
            emailPopUp.innerHTML = "The requested email was not found on the server.  It may have been deleted or you do not have permission to view it."
        })
        .always(function () {
            if (!$("#showEmailAlert").is(":visible")) { $("#showEmailAlert").modal("show") }
        })
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
            memberName = document.getElementById("notificationHeader").getElementsByTagName("span")[1].innerHTML.split(",")[1]

            let recentItems = myWoodbridge.getElementsByClassName("message")
            for (let p = 0; p < recentItems.length; p++) {
                let itemContent = recentItems[p].getElementsByTagName("a")[0]
                emailList[p].id = itemContent.id.replace("link_", "")
                emailList[p].children[0].href = "javascript:viewSavedMessages('" + itemContent.href + "')"
                emailList[p].children[0].innerText = itemContent.getAttribute("data-tooltip-title").split("by")[0]
                emailList[p].children[1].innerText = itemContent.getAttribute("data-tooltip-text")

                let saved = false
                for (let i = 0; i < emailData.length; i++) {
                    if (emailData[i].emailID === emailList[p].id) { saved = true; break }
                }
                if (saved == false) {
                    let dateSort = new Date(emailList[p].children[0].innerText.split("Sent")[1].trim()).getTime()
                    emailData.push({
                        emailSort: dateSort,
                        emailDate: new Date(emailList[p].children[0].innerText.split("Sent")[1].trim()),
                        emailSub: emailList[p].children[0].innerText,
                        emailBody: emailList[p].children[1].innerText,
                        emailURL: itemContent.href,
                        emailID: emailList[p].id
                    })
                    let emailsToSave = JSON.stringify(emailData)
                    localStorage.setItem("emails", emailsToSave)
                }
            }
            updateHeader("emailHeader", "fa fa-envelope-o", "Association Emails", emailList.length)
            sessionStorage.setItem("currentEmails", document.getElementById("recentEmailsBody").innerHTML)
            showPhotos(myWoodbridge)
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
function newComment() {
    if (!$("#postSettingsAlert").is(":visible")) { $("#postSettingsAlert").modal("show") } else {

        addComments("replyContent", document.getElementById("selectGroup").value)
        $("#postSettingsAlert").modal("hide")
    }
}
function openForm() {
    document.getElementById("WOAComments").style.display = "block"
}
function closeForm(SendMessage) {
    let messageContent = document.getElementById("WOAComments").getElementsByTagName("textarea")[0]

    if (SendMessage == true) {
        if (messageContent.value.length > 5) {
            sendComment(messageContent.value)
            messageContent.value = ""
            messageContent.placeholder = "Please wait..."
            document.getElementById("woaSendButton").className = "fa fa-refresh fa-spin fa-fw fa-lg"
        }
    }
    if (SendMessage == false) {
        messageContent.value = ""
        messageContent.placeholder = "Type message.."
        document.getElementById("WOAComments").style.display = "none"
    }
}
function sendComment(messageToSend) {
    /*/form/28118~116540/ask-a-manager*/
    document.getElementById("woaFrame").src = pageLocation("/form/28118~327323/social-media-help")
    let frameWindow = document.getElementById('woaFrame').contentWindow
    let messageContent = document.getElementById("WOAComments").getElementsByTagName("textarea")[0]
    let formCount = 0
    let btnCount = 0

    let waitForCommentForm = setInterval(function () {
        formCount++
        let responseForm = frameWindow.document.getElementById("fld_5028954")
        let responseBtn = frameWindow.document.getElementById("btnSubmit")

        if (responseForm !== null && responseBtn !== null) {
            clearInterval(waitForCommentForm)
            responseForm.value = messageToSend
            responseBtn.click()
            let waitForConfirmation = setInterval(function () {
                btnCount++
                if (frameWindow.document.getElementById("frmSubmitFields") !== null || isLocal == true) {
                    clearInterval(waitForConfirmation)
                    document.getElementById("woaSendButton").className = "fa fa-share fa-lg"
                    messageContent.placeholder = "Your message has been sent.  Use the Close button to exit this form."
                }
            }, 1000)
        }

    }, 1000)
}
function getDiscussionGroups(selectedPostID, groupID) {
    let downLoadComple = false
    forumCount = 0
    forumArray = []
    let forums = ["8030", "8364", "11315"], forumNames = ["Recommendations", "General", "Using the HOA Portal"]
    for (let f = 0; f < forums.length; f++) {
        $.get(pageLocation("/Discussion/28118~" + forums[f]), function () { })
            .done(function (responseText) {
                let forum = new DOMParser().parseFromString(responseText, "text/html")
                let posts = forum.getElementsByClassName("ThreadContainer")[0]
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
                        postAuthor: posters[0].innerText.trim() + lastDate,
                        postID: contacts[0].getElementsByTagName("a")[0].id,
                        groupName: forumNames[f],
                        groupID: forums[f],
                        numOfPost: comments.length
                    })
                }

                downLoadComple = true
            })
    }
    let waitforPost = setInterval(function () {
        if (downLoadComple == true) {
            clearInterval(waitforPost)
            forumArray.sort((a, b) => { return a.postSort - b.postSort })
            forumArray.reverse()
            document.getElementById("newPostButton").getElementsByTagName("span")[0].className = "fa fa-plus"
            postNavigation(selectedPostID, groupID, "start")
        }
    }, 1000)
}
function postNavigation(selectedPostID, groupID, dir) {

    let currentPosts = document.getElementById("recentPostsBody").getElementsByTagName("p")

    if (forumCount >= forumArray.length || dir == "back") { forumCount = 0 } else {
        if (selectedPostID.indexOf("post") == 0) {
            for (let a = 0; a < forumArray.length; a++) {
                if (forumArray[a].postID.replace("lnkTopicReply", "post") == selectedPostID) { forumCount = a; break }
            }
        }
    }

    for (let p = 0, f = forumCount; p < currentPosts.length && f < forumArray.length; p++, f++) {
        let commentSpans = currentPosts[p].getElementsByClassName("commentSpan")
        while (commentSpans.length > 0) commentSpans[0].remove()

        let postContents = currentPosts[p].getElementsByTagName("span")
        currentPosts[p].id = forumArray[f].postID.replace("lnkTopicReply", "post")
        postContents[0].innerText = forumArray[f].postContent
        postContents[1].innerText = "Posted in  " + forumArray[f].groupName

        currentPosts[p].getElementsByTagName("a")[0].innerHTML = forumArray[f].postAuthor + " - Comments: (" + forumArray[f].numOfPost + ")"
        currentPosts[p].getElementsByTagName("a")[0].href = "javascript:showComments('" + currentPosts[p].id + "'," + forumArray[f].groupID + ",false)"
        currentPosts[p].getElementsByTagName("textarea")[0].id = forumArray[f].postID.replace("lnkTopicReply", "comment")
        currentPosts[p].getElementsByTagName("textarea")[0].value = ""
        currentPosts[p].getElementsByTagName("a")[1].className = ""
        currentPosts[p].getElementsByTagName("a")[1].innerHTML = "Reply"
        currentPosts[p].getElementsByTagName("a")[1].href = "javascript:addComments('" + currentPosts[p].id + "'," + forumArray[f].groupID + ")"
        forumCount = f + 1
    }
    if (selectedPostID.indexOf("post") == 0) { showComments(selectedPostID, groupID, true) }
    updateHeader("postHeader", "fa fa-comments-o fa-lg", "Discussion Group Posts", forumArray.length)
}
function showComments(selectedPostID, groupID, showLast) {
    if (selectedPostID !== "" && groupID !== "") {
        let selectedPost = document.getElementById(selectedPostID)
        let selectedText = selectedPost.getElementsByTagName("textarea")[0].value
        let allSpans = selectedPost.getElementsByTagName("span")
        if (allSpans.length === 2) {
            $.get(pageLocation("/Discussion/28118~" + groupID + "~" + selectedPostID.replace("post", "")), function () { })
                .done(function (responseText) {
                    let forum = new DOMParser().parseFromString(responseText, "text/html")
                    let comments = forum.getElementById(selectedPostID.replace("post", "contents"))
                    let replyText = comments.getElementsByClassName("respDiscChildPost")
                    let replyAuthor = comments.getElementsByClassName("respAuthorWrapper")
                    for (let p = 0; p < replyText.length; p++) {
                        let replySpan = document.createElement("span")
                        let authorSpan = document.createElement("span")
                        replySpan.className = "commentSpan"
                        authorSpan.className = "commentSpan"

                        if (showLast == true) {
                            lastPost = replyText.length - 1
                            replySpan.innerText = replyText[lastPost].innerText.trim()
                            authorSpan.innerText = replyAuthor[lastPost + 1].innerText.trim()
                        }
                        else {
                            replySpan.innerText = replyText[p].innerText.trim()
                            authorSpan.innerText = replyAuthor[p + 1].innerText.trim()
                        }
                        selectedPost.insertBefore(authorSpan, selectedPost.getElementsByTagName("textarea")[0])
                        selectedPost.insertBefore(replySpan, selectedPost.getElementsByTagName("textarea")[0])
                        if (showLast == true) { break }
                    }
                })
        } else {
            let commentSpans = selectedPost.getElementsByClassName("commentSpan")
            while (commentSpans.length > 0) commentSpans[0].remove()
        }
    }

}
function addComments(selectedPostID, groupID) {

    let commentSpans = document.getElementById(selectedPostID).getElementsByClassName("commentSpan")
    let commentText = document.getElementById((selectedPostID !== "replyContent") ? selectedPostID.replace("post", "comment") : selectedPostID).value
    while (commentSpans.length > 0) commentSpans[0].remove()

    if (selectedPostID !== "replyContent") {
        document.getElementById(selectedPostID).getElementsByTagName("a")[1].innerHTML = ""
        document.getElementById(selectedPostID).getElementsByTagName("a")[1].className = "fa fa-refresh fa-spin fa-fw fa-lg"
    } else { document.getElementById("newPostButton").getElementsByTagName("span")[0].className = "fa fa-refresh fa-spin fa-fw fa-lg" }

    if (selectedPostID == "replyContent" || isLocal == true) {
        document.getElementById("woaFrame").src = pageLocation("/Discussion/28118~" + groupID)
    } else { document.getElementById("woaFrame").src = pageLocation("/Discussion/28118~" + groupID + "~" + selectedPostID.replace("post", "")) }

    document.getElementById("woaFrame").onload = portalOpenForm(selectedPostID, groupID, commentText)



}
function portalOpenForm(selectedPostID, groupID, commentText) {
    let checkCount = 0

    let waitForForm = setInterval(function () {
        let portal = document.getElementById('woaFrame').contentWindow.document
        checkCount = checkCount + 1
        let buttonID = portal.getElementById((selectedPostID !== "replyContent") ? selectedPostID.replace("post", "lnkTopicReply") : "lnkAddTopic")
        if (portal !== null && buttonID !== null && commentText.length > 10) {
            clearInterval(waitForForm)
            if (isLocal == false) { buttonID.click() }
            portalFormInput(selectedPostID, groupID, commentText)
        }
    }, 500)
}


function portalFormInput(selectedPostID, groupID, commentText) {
    let checkCount = 0
    let waitForInput = setInterval(function () {
        checkCount = checkCount + 1
        let portal = document.getElementById('woaFrame').contentWindow.document
        let post_subject = portal.getElementsByClassName("x-form-text x-form-field form-items-container")
        let post_body = portal.getElementsByTagName("iframe")[0].contentWindow.document.getElementById("txt_post_body")
        /*     let post_body = portal.getElementsByClassName("clsMainPane clsBodyText editorOverrides")[0]*/

        //let frameWindow = document.getElementById('woaFrame').contentWindow
        //frameWindow.AV.EditorLauncher.discussionTopic(id01, id02, '', 'reply', 'Reply to Post', id03)


        if (portal !== null && post_body !== null || isLocal == true) {

            clearInterval(waitForInput)
            if (isLocal == false) {
                post_body.innerHTML = document.getElementById('replyContent').value

                //if (portal.getElementsByTagName("iframe").length > 0) {
                //    portal.getElementsByTagName("iframe")[0].contentWindow.document.getElementById("txt_post_body").innerHTML = document.getElementById('replyContent').innerHTML
                //    portal.getElementsByClassName("x-btn-text save-button")[0].click()
                //}
                //const position = post_body.selectionStart
                //const before = post_body.value.substring(0, position)
                //const after = post_body.value.substring(position, post_body.value.length)
                //post_body.value = before + commentText + after
                //post_body.selectionStart = post_body.selectionEnd = position + post_body.length
                /*    post_body.innerText = commentText*/
                /* if (post_subject.length > 0) { post_subject[0].value = post_body.value.substring(0, 10) + " ..." }*/

            }
            /* portalSaveButton(selectedPostID, groupID, commentText)*/
        }
    }, 750)
}
function portalSaveButton(selectedPostID, groupID, commentText) {

    let checkCount = 0
    let waitForSave = setInterval(function () {
        checkCount = checkCount + 1
        let portal = document.getElementById('woaFrame').contentWindow.document
        let post_body = portal.getElementById("txt_post_body")
        if ((portal !== null && post_body !== null && post_body.value.length > 10) || isLocal == true) {
            clearInterval(waitForSave)
            if (isLocal == false) { portal.getElementsByClassName(" x-btn-text save-button")[0].click() }
            portalInputConfirm(selectedPostID, groupID, commentText)
        }
    }, 500)
}
function portalInputConfirm(selectedPostID, groupID, commentText) {
    let checkCount = 0
    let waitForConfirm = setInterval(function () {
        checkCount = checkCount + 1
        let portal = document.getElementById('woaFrame').contentWindow.document
        let confirmBtn = portal.getElementsByClassName(" x-btn-text")
        if (portal !== null && confirmBtn.length > 0 || isLocal == true) {
            clearInterval(waitForConfirm)
            if (isLocal == false) { confirmBtn[4].click() }
            portalClient(selectedPostID, groupID, commentText)
        }
    }, 500)
}
function portalClient(selectedPostID, groupID, commentText) {
    let checkCount = 0
    let waitForClient = setInterval(function () {
        checkCount = checkCount + 1
        let portal = document.getElementById('woaFrame').contentWindow.document
        let buttonID = portal.getElementById((selectedPostID !== "replyContent") ? selectedPostID.replace("post", "lnkTopicReply") : "lnkAddTopic")
        if ((portal !== null && buttonID !== null) || isLocal == true) {
            clearInterval(waitForClient)
            document.getElementById("woaFrame").src = pageLocation("/discussion/list/28118/discussion-groups")
            getDiscussionGroups(selectedPostID, groupID)
        }
    }, 500)
}
$(window).load(function () {
    $("#recentFlyers, #newsLetters").on("hide.bs.collapse", function () {
        this.parentElement.getElementsByTagName("div")[0].getElementsByTagName("span")[0].className = "fa fa-folder-o fa-lg"
    })
    $("#recentFlyers, #newsLetters").on("show.bs.collapse", function () {
        this.parentElement.getElementsByTagName("div")[0].getElementsByTagName("span")[0].className = "fa fa-folder-open-o fa-lg"
    })
    getProfilePage()
    getResourceCenter()
    getNewsAndAnnouncements()
    getDiscussionGroups("", "")
    getClassifiedAds()
    getResidentHomePage()

})
