let currentDate = new Date()
let residentHomePage = (window.location.hostname == "localhost") ? "/homepage/28118/resident-home-page.html" : "/homepage/28118/resident-home-page"
let resourceCenter = (window.location.hostname == "localhost") ? "/resourcecenter/28118/resource-center.html" : "/resourcecenter/28118/resource-center"
let classifiedAds = (window.location.hostname == "localhost") ? "/classified/search/28118~480182/classifieds.html" : "/classified/search/28118~480182/classifieds"
let newsAndAnnouncements = (window.location.hostname == "localhost") ? "/news/list/28118/news-announcements.html" : "/news/list/28118/news-announcements"
function getSavedEmails() {
    let retrievedData = localStorage.getItem("emails")
    if (retrievedData !== null) {
        let emailData = JSON.parse(retrievedData)
        let emailList = document.getElementById("recentEmails").getElementsByClassName("card-body")
        emailList[0].innerHTML = ""
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
            emailList[0].appendChild(currentItem)
        }
        if (emailData.length <= 3) { $('#saveEmailAlert').modal('show') }
    } else { $('#saveEmailAlert').modal('show') }
}
function getResidentHomePage() {
    let emailList = document.getElementById("recentEmails").getElementsByClassName("card-body")[0]
    emailList.innerHTML = ""
    $.get(residentHomePage, function () { })
        .done(function (responseText) {
            let myWoodbridge = new DOMParser().parseFromString(responseText, "text/html")
            let recentItems = myWoodbridge.getElementsByClassName("message")
            let nameHeader = document.getElementById("notificationHeader").getElementsByClassName("card-header")[0]
            nameHeader.innerHTML = ""
            let nameCheck = document.createElement("span")
            nameCheck.style.marginRight = "5px"
            nameCheck.className = "fa fa-check-circle formatLink"
            nameHeader.appendChild(nameCheck)
            nameHeader.appendChild(document.createTextNode(myWoodbridge.getElementsByClassName("clsHeader")[0].innerHTML))
            showPhotos(myWoodbridge)
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
        })
        .always(function () {
            let numOfItems = document.getElementById("recentEmails").getElementsByClassName("card-body")[0].getElementsByTagName("p").length
            document.querySelector("[data-target='#recentEmails']").getElementsByTagName("span")[2].innerHTML = " <b>(" + numOfItems + ")</b> "

            let retrievedData = localStorage.getItem("emails")
            let emailData = (retrievedData !== null) ? JSON.parse(retrievedData) : []
            let currentEmails = document.getElementById("recentEmails").getElementsByClassName("card-body")[0].getElementsByTagName("p")
            for (let p = 0; p < currentEmails.length; p++) {
                if ((retrievedData !== null && retrievedData.includes(currentEmails[p].id) == false) || emailData.length == 0) {
                    let emailTitle = currentEmails[p].getElementsByTagName("span")[0].innerHTML
                    let emailLink = currentEmails[p].getElementsByTagName("a")[0].href
                    let emailBody = currentEmails[p].innerText.replace(emailTitle, "")
                    emailData.push([currentEmails[p].id, emailTitle, emailBody, emailLink])
                    let emailsToSave = JSON.stringify(emailData)
                    localStorage.setItem("emails", emailsToSave)
                }
            }
        })
}
function getNewsAndAnnouncements() {
    let newsList = document.getElementById("recentNews").getElementsByClassName("card-body")[0]
    newsList.innerHTML = ""
    $.get(newsAndAnnouncements, function () { })
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
            let numOfItems = document.getElementById("recentNews").getElementsByClassName("card-body")[0].getElementsByTagName("p").length
            document.querySelector("[data-target='#recentNews']").getElementsByTagName("span")[2].innerHTML = " <b>(" + numOfItems + ")</b> "
        })
}
function getResourceCenter() {
    let docList = document.getElementById("recentFlyers").getElementsByClassName("card-body")[0]
    $.get(resourceCenter, function () { })
        .done(function (responseText) {
            let documents = new DOMParser().parseFromString(responseText, "text/html")
            let documentName = documents.getElementById("contents540434").querySelectorAll("[id^=d]")
            let documentLink = documents.getElementById("contents540434").querySelectorAll('a[title="View On-line"]')
            let newsLetterName = documents.getElementById("contents951754").querySelectorAll("[id^=d]")
            let newsLettertLink = documents.getElementById("contents951754").querySelectorAll('a[title="View On-line"]')
            let newsLetterItem = document.createElement("span")
            let selectedDoc = document.createElement("a")
            selectedDoc.innerHTML = newsLetterName[newsLetterName.length - 1].innerHTML
            selectedDoc.href = newsLettertLink[newsLetterName.length - 1].href
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
            let numOfItems = document.getElementById("recentFlyers").getElementsByClassName("card-body")[0].getElementsByTagName("span").length
            document.querySelector("[data-target='#recentFlyers']").getElementsByTagName("span")[2].innerHTML = " <b>(" + numOfItems + ")</b> "
        })
}
function showPhotos(galleryPage) {
    try {
        let newPicList = document.getElementById("recentPhotos").getElementsByTagName("div")
        let photoList = galleryPage.querySelectorAll("[id^=gallery_link_]")
        let galleryLink = galleryPage.querySelectorAll("[class^=gallery_txt_sub]")
        let galleryText = galleryPage.getElementsByClassName("left")
        for (let k = 0; k < photoList.length; k++) {
            newPicList[k + 1].getElementsByTagName("img")[0].src = photoList[k].src
            newPicList[k + 1].getElementsByTagName("span")[0].innerText = galleryText[k].innerText.replace(".jpg", "")
            newPicList[k + 1].getElementsByTagName("a")[0].href = galleryLink[k].getElementsByTagName("a")[0].href
        }
        document.querySelector("[data-target='#recentPhotos']").getElementsByTagName("span")[2].innerHTML = " <b>(3)</b> "
    } catch (error) { }

}
function getProfilePage() {
    let profileID = document.getElementById("HeaderPublishAuthProfile").href.split("(")[1].split(",")[0]
    let profilePage = (window.location.hostname == "localhost") ? "/Member/28118~" + profileID + ".html" : "/Member/28118~" + profileID
    $.get(profilePage, function () {
    }).done(function (responseText) {
        let profileDoc = new DOMParser().parseFromString(responseText, "text/html")
        document.getElementById("profileImage").src = profileDoc.getElementsByTagName("img")[0].src
    })
}
function getClassifiedAds() {
    let classifiedsList = document.getElementById("recentAds").getElementsByClassName("card-body")[0]
    classifiedsList.innerHTML = ""
    $.get(classifiedAds, function () { })
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
            let numOfItems = document.getElementById("recentAds").getElementsByClassName("card-body")[0].getElementsByTagName("p").length
            document.querySelector("[data-target='#recentAds']").getElementsByTagName("span")[2].innerHTML = " <b>(" + numOfItems + ")</b> "
        })
}
function getDiscussionGroups() {
    let NumOfDays = document.getElementById("rangeval").innerText
    NumOfDays = NumOfDays * 30

    let selectedGroups = [8030, 8364]
    let postList = document.getElementById("recentPosts").getElementsByClassName("card-body")[0]
    postList.innerHTML = ""
    for (let h = 0; h < selectedGroups.length; h++) {
        let selectedPost = (window.location.hostname == "localhost") ? "/Discussion/28118~" + selectedGroups[h] + ".html" : "/Discussion/28118~" + selectedGroups[h]
        $.get(selectedPost, function () { })
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
                let numOfItems = document.getElementById("recentPosts").getElementsByClassName("card-body")[0].getElementsByTagName("p").length
                document.querySelector("[data-target='#recentPosts']").getElementsByTagName("span")[2].innerHTML = " <b>(" + numOfItems + ")</b> "
            })
    }
}
function getEmail(messageID) {
    let currentEmail = (window.location.hostname == "localhost") ? messageID + ".html" : messageID
    $.get(currentEmail, function () { })
        .done(function (responseText) {
            let emailDisplay = document.getElementById("recentEmails").getElementsByClassName("card-body")[0]
            let selectedEmail = new DOMParser().parseFromString(responseText, "text/html")
            let emailHeader = selectedEmail.getElementById("tblMsgHeader")
            let emailBody = selectedEmail.getElementsByTagName("table")[1]
            let emailSubHeader = emailHeader.getElementsByClassName("clsGridDetail")
            document.getElementById("recentEmails").getElementsByTagName("span")[2] = emailSubHeader[3].innerHTML
            emailDisplay.innerHTML = ""

            var pTags = emailBody.getElementsByTagName('p')
            for (i = 0; i < pTags.length;) {
                var p = pTags[i], div = document.createElement('div')
                div.innerHTML = p.innerHTML
                p.parentNode.replaceChild(div, p)
            }

            emailDisplay.innerHTML = emailBody.innerHTML

            //let emailDisplay = document.getElementById("showEmailAlert").getElementsByClassName("modal-body")[0]
            //let emailSubject = document.getElementById("showEmailAlertLabel")
            //emailSubject.innerHTML = emailSubHeader[3].innerHTML
            ////emailDisplay.innerHTML = emailBody.innerHTML
            ////$('#showEmailAlert').modal('show')
        })
        .fail(function () {
            alert("The requested email was not found on the server.  It may have been deleted or you do not have permission to view it.")
        })
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
