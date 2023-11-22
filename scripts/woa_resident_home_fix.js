
postHistoryLen = 60
emailHistoryPos = 0
$(window).load(function () {
    try {
        showProfile()
        showDocuments()
        showPosts(61, false)
        showClassifieds()
        showNews()
        getEmails()


        if (document.getElementById("resDisplayName") !== null) {
            document.getElementById("resDisplayName").innerText = "My Woodbridge"
        }
        if (document.getElementsByClassName("association-name") !== null) {
            document.getElementsByClassName("association-name")[0].getElementsByTagName("a")[0].innerText = "My Woodbridge"
        }
    }
    catch (error) {
        if (window.location.hostname == "localhost") {
            document.getElementById("errText").innerHTML = error.message
        } else { location.replace("https://ourwoodbridge.net/homepage/28118/resident-home-page") }
    }
})
function showPage() {
    document.getElementById("loadIcon").style.display="none"
    document.getElementById("pageRow").style.visibility = "visible"
}
function getEmails() {
    let residentPage = (window.location.hostname == "localhost") ? "/homepage/28118/resident-home-page.html" : "/homepage/28118/resident-home-page"
    $.get(residentPage, function () { })
        .done(function (responseText) {
            let myWoodbridge = new DOMParser().parseFromString(responseText, "text/html")
            document.getElementsByClassName("clsHeader")[0].innerHTML = myWoodbridge.getElementsByClassName("clsHeader")[0].innerHTML

            try {
                let recentItems = myWoodbridge.getElementsByClassName("message")
                for (let p = 0; p < recentItems.length; p++) {
                    let itemTitle = document.createElement("span")
                    let itemLink = document.createElement("a")
                    let recentItem = document.createElement("p")
                    let itemContent = recentItems[p].getElementsByTagName("a")[0]
                    let itemContentTitle = itemContent.getAttribute("data-tooltip-title").split("by")[0]
                    let itemContentText = itemContent.getAttribute("data-tooltip-text")
                    recentItem.id = itemContent.id.replace("link_", "")
                    itemTitle.appendChild(document.createTextNode(itemContentTitle))
                    recentItem.appendChild(itemTitle)
                    recentItem.appendChild(document.createTextNode(itemContentText))
                    itemLink.className = "fa fa-share fa-lg formatLink"
                    itemLink.href = itemContent.href
                    recentItem.appendChild(itemLink)
                    document.getElementById("message").appendChild(recentItem)

                    let retrievedData = localStorage.getItem("emails")
                    let emailData = (retrievedData !== null) ? JSON.parse(retrievedData) : []
                    if ((retrievedData !== null && retrievedData.includes(recentItem.id) == false) || emailData.length == 0) {
                        emailData.push([recentItem.id, itemContentTitle, itemContentText, itemContent.href])
                        let currentEmails = JSON.stringify(emailData)
                        localStorage.setItem("emails", currentEmails)
                    }
                }
            } catch (error) { }
            document.getElementById("messagexIconx").className = "fa fa-envelope-o"
            showPhotos(myWoodbridge)

        })
        .always(function () {
            showPage()
            let retrievedData = localStorage.getItem("emails")
            if (retrievedData !== null) {
                var emailData = JSON.parse(retrievedData)
                if (emailData.length > 3) {
                    emailData.sort()
                    let currentEmails = JSON.stringify(emailData)
                    localStorage.setItem("emails", currentEmails)
                    document.getElementsByClassName("fa fa-history formatRight")[0].style.display = "block"
                }
            }
        })
}
function showHistory() {
    let retrievedData = localStorage.getItem("emails")
    if (retrievedData !== null) {
        let emailData = JSON.parse(retrievedData)
        let recentList = document.getElementById("message")
        recentList.innerHTML = ""
        for (let p = 0; p < 3; p++) {
            if (emailHistoryPos == emailData.length) { emailHistoryPos = 0 }
            let recentItem = document.createElement("p")
            let itemTitle = document.createElement("span")
            let itemLink = document.createElement("a")

            itemTitle.appendChild(document.createTextNode(emailData[emailHistoryPos][1]))
            itemLink.className = "fa fa-share fa-lg formatLink"
            itemLink.href = emailData[emailHistoryPos][3]
            recentItem.id = emailData[emailHistoryPos][0]

            recentItem.appendChild(itemTitle)
            recentItem.appendChild(document.createTextNode(emailData[emailHistoryPos][2]))
            recentItem.appendChild(itemLink)
            recentList.appendChild(recentItem)
            emailHistoryPos++
        }
    }
}
function showProfile() {
    let profileID = document.getElementById("HeaderPublishAuthProfile").href.split("(")[1].split(",")[0]
    let profilePage = (window.location.hostname == "localhost") ? "/Member/28118~" + profileID + ".html" : "/Member/28118~" + profileID
    $.get(profilePage, function () {
    }).done(function (responseText) {
        let profileDoc = new DOMParser().parseFromString(responseText, "text/html")
        document.getElementById("profileImage").src = profileDoc.getElementsByTagName("img")[0].src
    })
}
function showPosts(NumOfDays, showHistory) {
    try {
        let forumPosts = document.getElementById("post")
        let currentDate = new Date()

        if (showHistory == true) {
            postHistoryLen += 90
            NumOfDays = postHistoryLen
            forumPosts.innerHTML = ""
        }
        let selectedGroups = [8030, 8364]
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
                                replys.href = "javascript:showReplies(" + document.getElementById("post").getElementsByTagName("p").length + ")"
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
                            forumPosts.appendChild(currentPost)
                        }
                    }

                })
        } document.getElementById("postxIconx").className = "fa fa-comments-o"
    } catch (error) {
        alert(error.message)
    }
}
function showReplies(p_id) {
    let posts = document.getElementById("post").getElementsByTagName("p")
    for (let p = 0; p < posts.length; p++) {
        let replies = posts[p].getElementsByTagName("span")
        if (replies.length > 3) {
            for (let r = 3; r < replies.length; r++) {
                if (p == p_id) { if (replies[r].style.display == "block") { replies[r].style.display = "none" } else { replies[r].style.display = "block" } } else { replies[r].style.display = "none" }
            }
        }
    }
}

function showDocuments() {
    try {
        let fileLocation = (window.location.hostname == "localhost") ? "/resourcecenter/28118/resource-center.html" : "/resourcecenter/28118/resource-center"
        $.get(fileLocation, function () { })
            .done(function (responseText) {
                let documents = new DOMParser().parseFromString(responseText, "text/html")
                let documentName = documents.getElementById("contents540434").querySelectorAll("[id^=d]")
                let documentLink = documents.getElementById("contents540434").querySelectorAll('a[title="View On-line"]')
                for (let p = 0; p < documentName.length; p++) {
                    let resourceItem = document.createElement("span")
                    let selectedDoc = document.createElement("a")
                    selectedDoc.innerHTML = documentName[p].innerHTML
                    selectedDoc.href = documentLink[p].href
                    resourceItem.appendChild(selectedDoc)
                    document.getElementById("document").appendChild(resourceItem)
                    if (document.getElementById("document").getElementsByTagName("span").length == 3) { break }
                }
                document.getElementById("documentxIconx").className = "fa fa-file-text-o"

                let newsLetterName = documents.getElementById("contents951754").querySelectorAll("[id^=d]")
                let newsLettertLink = documents.getElementById("contents951754").querySelectorAll('a[title="View On-line"]')

                for (var p = newsLetterName.length - 1; p >= 0; p--) {
                    let newsLetterItem = document.createElement("span")
                    let selectedDoc = document.createElement("a")
                    selectedDoc.innerHTML = newsLetterName[p].innerHTML
                    selectedDoc.href = newsLettertLink[p].href
                    newsLetterItem.appendChild(selectedDoc)
                    document.getElementById("wblife").appendChild(newsLetterItem)
                    if (document.getElementById("wblife").getElementsByTagName("span").length == 3) { break }
                }
                document.getElementById("wblifexIconx").className = "fa fa-file-o"
            })
    } catch (error) {
    }
}
function showNews() {
    let documentList = document.getElementById("news")
    let fileLocation = (window.location.hostname == "localhost") ? "/news/list/28118/news-announcements.html" : "/news/list/28118/news-announcements"
    $.get(fileLocation, function () { })
        .done(function (responseText) {
            let newsArticles = new DOMParser().parseFromString(responseText, "text/html")
            let newsHeader = newsArticles.getElementsByClassName("clsHeader")
            let NewsBody = newsArticles.getElementsByClassName("clsBodyText")
            if (NewsBody.length > 0) {
                for (let p = 0; p < NewsBody.length; p++) {
                    let selectedArticle = document.createElement("p")
                    let articleHeader = document.createElement("span")
                    articleHeader.appendChild(document.createTextNode(newsHeader[p].innerText))
                    selectedArticle.appendChild(articleHeader)
                    selectedArticle.appendChild(document.createTextNode(NewsBody[p].innerText))
                    documentList.appendChild(selectedArticle)
                }
            }
            let selectedArticle = document.createElement("p")
            let articleHeader = document.createElement("span")
            let submitLink = document.createElement("a")

            articleHeader.appendChild(document.createTextNode("Resident Group or Club News or Announcements"))
            selectedArticle.appendChild(articleHeader)
            selectedArticle.appendChild(document.createTextNode("Share your Del Webb residents club or group announcements here where the content is avaiable to all Del Webb residents.  "))
            submitLink.href = "/form/28118~169617/submit-a-news-announcements-posting"
            submitLink.innerHTML = "Click here to send your announcement."
            selectedArticle.appendChild(submitLink)
            selectedArticle.appendChild(document.createTextNode("   (All announcements are subject to HOA rules and regulations)"))
            documentList.appendChild(selectedArticle)
            document.getElementById("newsxIconx").className = "fa fa-newspaper-o"
        })
}
function showClassifieds() {
    let documentList = document.getElementById("classified")
    let fileLocation = (window.location.hostname == "localhost") ? "/classified/search/28118~480182/classifieds.html" : "/classified/search/28118~480182/classifieds"
    $.get(fileLocation, function () { })
        .done(function (responseText) {
            let classifieds = new DOMParser().parseFromString(responseText, "text/html")
            let classifiedTitle = classifieds.querySelectorAll('.clsBodyText:not(.hidden-md-up,.hidden-sm-down)')
            let classifiedSummary = classifieds.getElementsByClassName("clsBodyText hidden-md-up")
            let classifiedBody = classifieds.getElementsByClassName("clsBodyText hidden-sm-down")
            for (let p = 0; p < classifiedTitle.length; p++) {
                let selectedAd = document.createElement("p")
                let adTitle = document.createElement("span")
                let adSummary = document.createElement("span")
                let adBody = document.createElement("span")
                let adLink = document.createElement("a")

                adBody.style.display = "none"
                adLink.className = "fa fa-plus fa-lg formatLink"
                adLink.href = "javascript:showFullAd(" + document.getElementById("classified").getElementsByTagName("p").length + ")"
                adTitle.appendChild(document.createTextNode(classifiedTitle[p].getElementsByTagName("a")[0].innerHTML))
                adTitle.appendChild(adLink)
                adSummary.appendChild(document.createTextNode(classifiedSummary[p].innerText))
                adBody.appendChild(document.createTextNode(classifiedBody[p].childNodes[0].nodeValue))

                selectedAd.appendChild(adTitle)
                selectedAd.appendChild(adSummary)
                selectedAd.appendChild(adBody)

                documentList.appendChild(selectedAd)
            }
            document.getElementById("classifiedxIconx").className = "fa fa-cart-arrow-down"
        })
}
function showFullAd(adID) {
    let classifieds = document.getElementById("classified").getElementsByTagName("p")
    for (let p = 0; p < classifieds.length; p++) {
        let adSummaryText = classifieds[p].getElementsByTagName("span")[1]
        let adFullText = classifieds[p].getElementsByTagName("span")[2]
        let adIcon = classifieds[p].getElementsByTagName("a")[0]

        if (p !== adID) {
            adSummaryText.style.display = "inline"
            adFullText.style.display = "none"
            adIcon.className = "fa fa-plus fa-lg formatLink"
        } else {
            if (adSummaryText.style.display == "none") {
                adSummaryText.style.display = "inline"
                adFullText.style.display = "none"
                adIcon.className = "fa fa-plus fa-lg formatLink"
            } else {
                adSummaryText.style.display = "none"
                adFullText.style.display = "inline"
                adIcon.className = "fa fa-minus fa-lg formatLink"
            }
        }
    }
}
function showPhotos(galleryPage) {
    try {
        let photoDisplay = document.getElementById("photo")
        let picList = photoDisplay.getElementsByTagName("div")
        let photoList = galleryPage.querySelectorAll("[id^=gallery_link_]")
        let galleryLink = galleryPage.querySelectorAll("[class^=gallery_txt_sub]")
        let galleryText = galleryPage.getElementsByClassName("left")
        for (let k = 0; k < photoList.length; k++) {
            let picSpan = document.createElement("span")
            let picLink = document.createElement("a")
            let pic = document.createElement("img")
            picSpan.innerText = galleryText[k].innerText.replace(".jpg", "")
            pic.src = photoList[k].src
            picLink.href = galleryLink[k].getElementsByTagName("a")[0].href
            picLink.appendChild(pic)
            picLink.appendChild(picSpan)
            picList[k].appendChild(picLink)
        }
    } catch (error) { }
    document.getElementById("photoxIconx").className = "fa fa-picture-o"
}