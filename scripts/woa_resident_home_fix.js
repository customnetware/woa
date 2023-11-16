
postHistoryLen = 60
emailHistoryPos = 0
$(window).load(function () {
    try {
        showProfile()
        showDocuments()
        getGroups(61)
        getEmails()
        showClassifieds()
        showNews()
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

function getEmails() {
    let residentPage = (window.location.hostname == "localhost") ? "/homepage/28118/resident-home-page.html" : "/homepage/28118/resident-home-page"
    $.get(residentPage, function () { })
        .done(function (responseText) {
            let myWoodbridge = new DOMParser().parseFromString(responseText, "text/html")
            let photoList = myWoodbridge.querySelectorAll("[id^=gallery_link_]")
            let galleryLink = myWoodbridge.querySelectorAll("[class^=gallery_txt_sub]")
            let galleryText = myWoodbridge.getElementsByClassName("left")
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


            showPhotos(photoList, galleryLink, galleryText)

        })
        .always(function () {
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
function showProfile() {
    let profileID = document.getElementById("HeaderPublishAuthProfile").href.split("(")[1].split(",")[0]
    let profilePage = (window.location.hostname == "localhost") ? "/Member/28118~" + profileID + ".html" : "/Member/28118~" + profileID
    $.get(profilePage, function () {
    }).done(function (responseText) {
        let profileDoc = new DOMParser().parseFromString(responseText, "text/html")
        document.getElementById("profileImage").src = profileDoc.getElementsByTagName("img")[0].src
    })
}
function getGroups(NumOfDays) {
    try {
        let selectedGroups = [8030, 8364]
        for (let h = 0; h < selectedGroups.length; h++) { showPosts(selectedGroups[h], NumOfDays) }
    } catch { alert(error.message) }
}
function showPosts(groupID, NumOfDays) {
    try {
        let selectedPost = (window.location.hostname == "localhost") ? "/Discussion/28118~" + groupID + ".html" : "/Discussion/28118~" + groupID
        let currentDate = new Date()
        let forumPosts = document.getElementById("post")
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
                document.getElementById(forumPosts.id + "xIconx").className = "fa fa-comments-o"
            })
    } catch (error) {
        alert(error.message)
    }
}
function showPostHistory() {
    document.getElementById("post").innerHTML = ""
    postHistoryLen += 90
    getGroups(postHistoryLen)
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

                document.getElementById("newsletterxIconx").className = "fa fa-file-o"


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
            let classifiedBody = classifieds.getElementsByClassName("clsBodyText hidden-sm-down")
            for (let p = 0; p < classifiedTitle.length; p++) {
                let selectedAd = document.createElement("p")
                let adTitle = document.createElement("span")
                let adBody = document.createElement("span")
                adTitle.appendChild(document.createTextNode(classifiedTitle[p].innerText))
                selectedAd.appendChild(adTitle)
                selectedAd.appendChild(document.createTextNode(classifiedBody[p].innerText))
                documentList.appendChild(selectedAd)
            }
            document.getElementById("classifiedxIconx").className = "fa fa-cart-arrow-down"
        })
}
function showPhotos(photoList, galleryLink, galleryText) {
    try {
        let photoDisplay = document.getElementById("photo")
        let picList = photoDisplay.getElementsByTagName("div")
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