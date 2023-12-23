let currentDate = new Date()
function pageLocation(URLString) {
    return (window.location.hostname == "localhost") ? URLString + ".html" : URLString
}
function updateHeader(headerID, headerClass, headerTitle, headerLen) {
    let cardHeader = document.querySelector("[data-target='#" + headerID + "']").getElementsByTagName("span")
    cardHeader[0].className = headerClass
    cardHeader[1].innerHTML = headerTitle
    cardHeader[2].innerHTML = "(" + headerLen + ")"
}
function getCurrentEmails() {
    let emailDisplay = document.getElementById("recentEmailsBody")
    let savedIDs = document.getElementById("currentEmailIDs").value
    let emailToRemove = emailDisplay.getElementsByTagName("table")
    let hiddenEmails = emailDisplay.getElementsByTagName("p")

    while (emailToRemove.length > 0) { emailToRemove[0].remove() }

    for (p = 0; p < hiddenEmails.length; p++) {
        if (savedIDs.includes(hiddenEmails[p].id)) { hiddenEmails[p].style.display = "inline-block" } else hiddenEmails[p].className = "removeHidden"
    }
    let removeSave = emailDisplay.getElementsByClassName("removeHidden")
    while (removeSave.length > 0) { removeSave[0].remove() }


    updateHeader(document.getElementById("recentEmails").id, "fa fa-envelope-o", "Association Emails", emailDisplay.childElementCount)

    document.getElementById("viewSaveButton").style.display = "inline"
    document.getElementById("viewCurrentButton").style.display = "none"
}
function getEmail(messageID) {
    $.get(pageLocation(messageID), function () { })
        .done(function (responseText) {
            let emailDisplay = document.getElementById("recentEmailsBody")
            let emailHTML = new DOMParser().parseFromString(responseText, "text/html")
            let emailBody = emailHTML.getElementsByTagName("table")[1]
            let emailSubHeader = emailHTML.getElementById("tblMsgHeader").getElementsByClassName("clsGridDetail")
            updateHeader("recentEmails", "fa fa-envelope-open-o", emailSubHeader[3].innerHTML, emailSubHeader[0].innerHTML)
            emailsToHide = emailDisplay.getElementsByTagName("p")
            for (p = 0; p < emailsToHide.length; p++) { emailsToHide[p].style.display = "none" }
            var requestedEmail = emailBody.getElementsByTagName('p')
            for (i = 0; i < requestedEmail.length;) {
                let selectedParagraph = requestedEmail[i], divTag = document.createElement('div')
                divTag.innerHTML = selectedParagraph.innerHTML
                selectedParagraph.parentNode.replaceChild(divTag, selectedParagraph)
            }
            emailDisplay.appendChild(emailBody)
            document.getElementById("viewSaveButton").style.display = "none"
            document.getElementById("viewCurrentButton").style.display = "inline"
        })
        .fail(function () {
            alert("The requested email was not found on the server.  It may have been deleted or you do not have permission to view it.")
        })
}
function getSavedEmails() {
    let retrievedData = localStorage.getItem("emails")
    if (retrievedData !== null) {
        let emailData = JSON.parse(retrievedData)
        let emailList = document.getElementById("recentEmailsBody")
        emailList.innerHTML = ""
        for (let p = 0; p < emailData.length; p++) {
            let currentItem = document.createElement("p")
            let itemTitle = document.createElement("span")
            let itemLink = document.createElement("a")
            itemLink.className = "fa fa-arrow-right fa-lg formatLink"
            itemLink.href = "javascript:getEmail('" + emailData[p][3] + "')"
            itemTitle.appendChild(document.createTextNode(emailData[p][1]))
            currentItem.appendChild(itemTitle)
            currentItem.appendChild(document.createTextNode(emailData[p][2]))
            currentItem.appendChild(itemLink)
            currentItem.id = emailData[p][0]
            emailList.appendChild(currentItem)
        }
        updateHeader("recentEmails", "fa fa-envelope-o", "Association Emails", emailList.childElementCount)
        if (emailData.length <= 3) {
            $('#saveEmailAlert').modal('show')
        } else {
            document.getElementById("viewSaveButton").style.display = "none"
            document.getElementById("viewCurrentButton").style.display = "inline"
        }
    } else { $('#saveEmailAlert').modal('show') }
}
function getResidentHomePage() {
    let emailList = document.getElementById("recentEmailsBody")
    emailList.innerHTML = ""
    $.get(pageLocation("/homepage/28118/resident-home-page"), function () { })
        .done(function (responseText) {
            let myWoodbridge = new DOMParser().parseFromString(responseText, "text/html")
            let recentItems = myWoodbridge.getElementsByClassName("message")
            let nameHeader = document.getElementById("notificationHeader").getElementsByClassName("card-header")[0]
            let nameCheck = document.createElement("span")
            nameCheck.style.marginRight = "5px"
            nameCheck.className = "fa fa-check-circle formatLink"
            nameHeader.innerHTML = ""
            nameHeader.appendChild(nameCheck)
            nameHeader.appendChild(document.createTextNode(myWoodbridge.getElementsByClassName("clsHeader")[0].innerHTML))
            for (let p = 0; p < recentItems.length; p++) {
                let itemContent = recentItems[p].getElementsByTagName("a")[0]
                let currentItem = document.createElement("p")
                let itemTitle = document.createElement("span")
                let itemLink = document.createElement("a")
                itemTitle.appendChild(document.createTextNode(itemContent.getAttribute("data-tooltip-title").split("by")[0]))
                itemLink.href = "javascript:getEmail('" + itemContent.href + "')"
                itemLink.className = "fa fa-arrow-right fa-lg formatLink"
                currentItem.id = itemContent.id.replace("link_", "")
                currentItem.appendChild(itemTitle)
                currentItem.appendChild(document.createTextNode(itemContent.getAttribute("data-tooltip-text")))
                currentItem.appendChild(itemLink)
                emailList.appendChild(currentItem)
            }
            showPhotos(myWoodbridge)
        })
        .always(function () {
            let currentEmails = emailList.getElementsByTagName("p")
            let retrievedData = localStorage.getItem("emails")
            let emailData = (retrievedData !== null) ? JSON.parse(retrievedData) : []
            updateHeader("recentEmails", "fa fa-envelope-o", "Association Emails", currentEmails.length)

            document.getElementById("currentEmailIDs").value = currentEmails[0].id.concat(currentEmails[1].id, currentEmails[2].id)

            for (let p = 0; p < currentEmails.length; p++) {
                if ((retrievedData !== null && retrievedData.includes(currentEmails[p].id) == false) || emailData.length == 0) {
                    let emailTitle = currentEmails[p].getElementsByTagName("span")[0].innerHTML
                    let emailLink = currentEmails[p].getElementsByTagName("a")[0].href.replace("javascript:getEmail('", "").replace("')", "")
                    let emailBody = currentEmails[p].innerText.replace(emailTitle, "")
                    emailData.push([currentEmails[p].id, emailTitle, emailBody, emailLink])
                    let emailsToSave = JSON.stringify(emailData)
                    localStorage.setItem("emails", emailsToSave)
                }
            }
        })
}
function getNewsAndAnnouncements() {
    let newsList = document.getElementById("recentNewsBody")
    newsList.innerHTML = ""
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
            document.querySelector("[data-target='#recentNews']").getElementsByTagName("span")[2].innerHTML = "(" + newsList.childElementCount + ")"
        })
}
function getResourceCenter() {
    let docList = document.getElementById("recentFlyersBody")
    $.get(pageLocation("/resourcecenter/28118/resource-center"), function () { })
        .done(function (responseText) {
            let documents = new DOMParser().parseFromString(responseText, "text/html")
            let documentName = documents.getElementById("contents540434").querySelectorAll("[id^=d]")
            let documentLink = documents.getElementById("contents540434").querySelectorAll('a[title="View On-line"]')
            let newsLetterName = documents.getElementById("contents951754").querySelectorAll("[id^=d]")
            let newsLetterLink = documents.getElementById("contents951754").querySelectorAll('a[title="View On-line"]')
            let newsLetterItem = document.createElement("span")
            let selectedDoc = document.createElement("a")

            selectedDoc.innerHTML = newsLetterName[newsLetterName.length - 1].innerHTML
            selectedDoc.href = newsLetterLink[newsLetterName.length - 1].href
            newsLetterItem.appendChild(selectedDoc)
            docList.appendChild(newsLetterItem)

            for (let p = 0; p < documentName.length; p++) {
                let resourceItem = document.createElement("span")
                let selectedDoc = document.createElement("a")
                selectedDoc.innerHTML = documentName[p].innerHTML
                selectedDoc.href = documentLink[p].href
                resourceItem.appendChild(selectedDoc)
                docList.appendChild(resourceItem)
            }
        })
        .always(function () {
            document.querySelector("[data-target='#recentFlyers']").getElementsByTagName("span")[2].innerHTML = "(" + docList.getElementsByTagName("span").length + ")"
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
        document.querySelector("[data-target='#recentPhotos']").getElementsByTagName("span")[2].innerHTML = "(3)"
    } catch (error) { }
}
function getProfilePage() {
    let profileImg = document.createElement("img")
    var regExp = /\(([^)]+)\)/
    var profileID = regExp.exec(document.getElementById("HeaderPublishAuthProfile").href)[1].split(",")[0]
    $("#userProfile").load(pageLocation("/news/28118~792554/webmaster-only") + " #contentInner", function () {
        document.getElementById("userProfile").getElementsByClassName("clsPageMenu")[0].remove()
        document.getElementById("userProfile").getElementsByClassName("clsHeader")[0].remove()
        $.get(pageLocation("/Member/28118~" + profileID), function () {
        }).done(function (responseText) {
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
            document.querySelector("[data-target='#recentAds']").getElementsByTagName("span")[2].innerHTML = "(" + classifiedsList.getElementsByTagName("p").length + ")"
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
function showReplies(p_id) {
    let posts = document.getElementsByClassName("groupPost")
    for (let p = 0; p < posts.length; p++) {
        let replies = posts[p].getElementsByTagName("span")
        if (replies.length > 3) {
            for (let r = 3; r < replies.length; r++) {
                if (p == p_id) {
                    if (replies[r].style.display == "block") {
                        replies[r].style.display = "none"
                    } else { replies[r].style.display = "block" }
                } else { replies[r].style.display = "none" }
            }
        }
    }
}
$(window).load(function () {
    document.getElementsByClassName("clsHeader")[0].style.visibility = "hidden"
    getProfilePage()
    getResourceCenter()
    getNewsAndAnnouncements()
    getDiscussionGroups()
    getClassifiedAds()
    getResidentHomePage()
})
