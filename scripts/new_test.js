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
function viewSavedMessages(savedMessageURL) {
    let retrievedData = localStorage.getItem("emails")
    let emailData = (retrievedData !== null) ? JSON.parse(retrievedData) : []
    let emailPopUp = document.getElementById("emailsSaved")
    while (emailPopUp.firstChild) { emailPopUp.removeChild(emailPopUp.firstChild) }

    if (savedMessageURL.includes("/Messenger/MessageView/")) {
        $("#emailsSaved").load(pageLocation(savedMessageURL) + " div:first", function (responseTxt, statusTxt, xhr) {
            if (statusTxt == "error") { emailPopUp.innerHTML = "The requested email was not found on the server.  It may have been deleted or you do not have permission to view it." }
        })
    } else {
        for (let p = 0; p < emailData.length; p++) {
            let newParagraph = document.createElement("span")
            let emailURL = document.createElement("a")
            emailURL.innerHTML = emailData[p][1]
            emailURL.href = "javascript:viewSavedMessages('" + emailData[p][3] + "')"
            newParagraph.appendChild(emailURL)
            emailPopUp.appendChild(newParagraph)
        }
    }

    if (!$("#showEmailAlert").is(":visible")) { $("#showEmailAlert").modal("show") }
}
function getResidentHomePage() {
    $.get(pageLocation("/homepage/28118/resident-home-page"), function () { })
        .done(function (responseText) {
            let emailList = document.getElementById("recentEmailsBody").getElementsByTagName("p")
            let retrievedData = localStorage.getItem("emails")
            let emailData = (retrievedData !== null) ? JSON.parse(retrievedData) : []
            let myWoodbridge = new DOMParser().parseFromString(responseText, "text/html")
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
        })
        .always(function () {
            document.getElementById("newsHeader").children[2].innerHTML = "(" + newsList.childElementCount + ")"

        })
}
function getResourceCenter() {
    let eventFlyer = document.getElementById("recentFlyersBody"), newsLetter = document.getElementById("newsLettersBody")
    $.get(pageLocation("/resourcecenter/28118/resource-center"), function () { })
        .done(function (responseText) {
            let documents = new DOMParser().parseFromString(responseText, "text/html")

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
        })
        .always(function () {
            document.getElementById("flyersHeader").children[2].innerHTML = "(" + eventFlyer.getElementsByTagName("span").length + ")"
            document.getElementById("newsletterHeader").children[2].innerHTML = "(" + newsLetter.getElementsByTagName("span").length + ")"
        })
}
function showPhotos(galleryPage) {
    try {
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
    } catch (error) { }
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
        })
        .always(function () {
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
                            headerLink.href = "javascript:showComments('" + messageContacts[0].getElementsByTagName("a")[0].id.replace("lnkTopicReply", "post") + "',true)"
                            headerLink.innerHTML = postHeaders[h].innerText
                            postHeader.appendChild(headerLink)

                            postMessage.appendChild(document.createTextNode(messageTexts[0].innerText))
                            postAuthor.appendChild(document.createTextNode(messageAuthor[0].innerText))
                            currentPost.appendChild(postHeader)
                            currentPost.appendChild(postMessage)

                            postAuthor.appendChild(document.createTextNode(" - Comments: (" + (messageTexts.length - 1) + ")"))

                            let postReply = document.createElement("a")
                            postReply.style.display = "none"
                            postReply.innerHTML = messageContacts[0].getElementsByTagName("a")[0].innerHTML
                            postReply.href = messageContacts[0].getElementsByTagName("a")[0].href
                            postAuthor.appendChild(postReply)
                            currentPost.id = messageContacts[0].getElementsByTagName("a")[0].id.replace("lnkTopicReply", "post")





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
    let frameLink = /\(([^)]+)\)/.exec(selectedPost.getElementsByTagName("a")[1].href)[1].replaceAll("'", "")

    sessionStorage.setItem("selectedPostID", SelectedPostID)
    sessionStorage.setItem("portalPostID", frameLink.split(",")[0])
    sessionStorage.setItem("portalGroupID", frameLink.split(",")[1])
    sessionStorage.setItem("portalReplyID", frameLink.split(",")[5])

    document.getElementById("postComments").innerHTML = selectedPost.innerHTML
    document.getElementById("woaFrame").src = "/Discussion/28118~" + sessionStorage.getItem("portalPostID") + "~" + sessionStorage.getItem("portalReplyID").replace("lnkTopicReply", "")

    if (!$("#postSettingsAlert").is(":visible")) { $("#postSettingsAlert").modal("show") }
}
function addComments() {
    if (document.getElementById("replyContent").value.length < 2) { alert("Please enter your commments in the box below!"); return }
    if (window.location.hostname == "localhost") {
        alert("The comment cannot be saved because the application is being used on a local host.  This form will close and reopen to display your comment in the post feed.  The form does not currently have editing capabilities.")
        $("#postSettingsAlert").modal("hide")
        sessionStorage.setItem("showTheForm", "postSettingsAlert")
        location.reload()
    } else {
        try {
            let frameWindow = document.getElementById('woaFrame').contentWindow
            frameWindow.AV.EditorLauncher.discussionTopic(sessionStorage.getItem("portalPostID"), sessionStorage.getItem("portalGroupID"), '', 'reply', 'Reply to Post', sessionStorage.getItem("portalReplyID"))
            let waitforForm = setInterval(function () {
                if (frameWindow.document.getElementsByTagName("iframe").length > 0) {
                    frameWindow.document.getElementsByTagName("iframe")[0].contentWindow.document.getElementById("txt_post_body").innerHTML = document.getElementById("replyContent").value
                    frameWindow.document.getElementsByClassName("x-btn-text save-button")[0].click()
                    clearInterval(waitforForm)
                }
            }, 1000)
            let waitforConfirm = setInterval(function () {
                if (frameWindow.document.getElementsByClassName(" x-btn-text").length > 0) {
                    frameWindow.document.getElementsByClassName(" x-btn-text")[4].click()
                    clearInterval(waitforConfirm)
                    alert("Your comments have been posted.  This form will close and reopen to display your comment in the post feed.  The form does not currently have editing capabilities.")
                    $("#postSettingsAlert").modal("hide")
                    sessionStorage.setItem("showTheForm", "postSettingsAlert")
                    location.reload()
                }
            }, 1000)

        } catch (error) { alert(error.message) }
    }
}
function saveData() {
    localStorage.setItem("postRange", document.getElementById("formControlRange").value)
    getGroups()
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
    let waitforPosts = setInterval(function () {
        if (document.getElementById("emailHeader").children[2].innerHTML == "(3)") {
            clearInterval(waitforPosts)
            if (sessionStorage.getItem("showTheForm") === "postSettingsAlert") {
                showComments(sessionStorage.getItem("selectedPostID"))
                sessionStorage.removeItem("showTheForm")
                sessionStorage.removeItem("selectedPostID")
                $("#recentPosts").collapse("show")
            }

        }
    }, 1000)

})
