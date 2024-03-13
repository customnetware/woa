function pageLocation(URLString) {
    return (window.location.hostname == "localhost") ? URLString + ".html" : URLString
}
function showPopUp(pageContent) {
    const contentPage = ["796584", "796608", "796609"]
    sessionStorage.setItem("waitText", document.getElementById("popUpBody").innerHTML)
    $.get(pageLocation("/news/28118~" + contentPage[pageContent]), function () { })
        .done(function (responseText) {
            let helpText = new DOMParser().parseFromString(responseText, "text/html")
            document.getElementById("appPopUpLabel").innerHTML = helpText.getElementsByClassName("clsHeader")[0].innerText
            document.getElementById("popUpBody").innerHTML = helpText.getElementById("contentInner").children[2].innerHTML
        })
    if (!$("#appPopUp").is(":visible")) { $("#appPopUp").modal("show") }
}

function getMessage(rawMessage, cardID) {
    let title = rawMessage.getAttribute("data-tooltip-title").split("by")[0]
    let content = rawMessage.getAttribute("data-tooltip-text")
    $.get(pageLocation(rawMessage.href), function () { })
        .done(function (responseText) {
            let emailSaved = new DOMParser().parseFromString(responseText, "text/html")
            let emailContent = emailSaved.getElementById("AV").getElementsByTagName("td")
            content = emailContent[0].innerHTML
        })
        .always(function () {
            document.getElementById("recentEmails").getElementsByClassName("card-header")[cardID].style.display = "block"
            document.getElementById("recentEmails").getElementsByClassName("card-title")[cardID].innerText = title
            document.getElementById("recentEmails").getElementsByClassName("card-body")[cardID].getElementsByTagName("span")[0].innerHTML = content
            localStorage.setItem(rawMessage.id, title + content)
        })
}
function getNewsAndAnnouncements() {
    $.get(pageLocation("news/list/28118"), function () { })
        .done(function (responseText) {
            let newsArticles = new DOMParser().parseFromString(responseText, "text/html")
            let articleTitle = newsArticles.getElementsByClassName("clsHeader")
            let articleContent = newsArticles.getElementsByClassName("clsBodyText")
            for (let p = 0; p < 3; p++) {
                if (p < articleTitle.length) {
                    document.getElementById("recentNews").getElementsByClassName("card-header")[p].style.display = "block"
                    document.getElementById("recentNews").getElementsByClassName("card-title")[p].innerText = articleTitle[p].innerText.trim()
                    document.getElementById("recentNews").getElementsByClassName("card-body")[p].getElementsByTagName("span")[0].innerHTML = articleContent[p].innerHTML
                    getArticle(articleTitle[p].parentElement.getElementsByTagName("a")[1].href, p)
                }
            }
        })
}
function getArticle(pageContent, pageNum) {
    $.get(pageLocation(pageContent), function () { })
        .done(function (responseText) {
            let selectedArticle = new DOMParser().parseFromString(responseText, "text/html")
            document.getElementById("recentNews").getElementsByClassName("card-body")[pageNum].getElementsByTagName("span")[0].innerHTML = selectedArticle.getElementById("contentInner").children[2].innerHTML
        })
}
function showComments(selectedPostID, groupID) {
    let commentArea = document.getElementById("popUpBody")
    while (commentArea.firstChild) { commentArea.removeChild(commentArea.firstChild) }
    $.get(pageLocation("/Discussion/28118~" + groupID), function () { })
        .done(function (responseText) {
            let forum = new DOMParser().parseFromString(responseText, "text/html")
            let comments = forum.getElementById(selectedPostID.replace("lnkTopicReply", "contents"))
            let topic = comments.getElementsByClassName("respDiscTopic")
            let replyText = comments.getElementsByClassName("respDiscChildPost")
            let replyAuthor = comments.getElementsByClassName("respAuthorWrapper")

            document.getElementById("appPopUp").getElementsByClassName("modal-title")[0].innerHTML = topic[0].innerText.trim() + "<br />" + replyAuthor[0].innerText

            for (let p = 0; p < replyText.length; p++) {
                let replySpan = document.createElement("span")
                let authorSpan = document.createElement("span")
                replySpan.className = "commentSpan"
                authorSpan.className = "commentSpan"
                replySpan.innerHTML = replyText[p].innerText.trim() + "<br />"
                authorSpan.innerHTML = replyAuthor[p + 1].innerText.trim() + "<hr />"
                commentArea.appendChild(replySpan)
                commentArea.appendChild(authorSpan)
            }
            if (!$("#appPopUp").is(":visible")) { $("#appPopUp").modal("show") }
        })
}
function getDiscussionGroups() {
    let forumArray = [], forums = ["8030", "8364", "11315"], forumNames = ["Recommendations", "General", "Using the HOA Portal"], currentDate = new Date()
    let grp1 = $.get(pageLocation("/Discussion/28118~" + forums[0]), function () { })
    let grp2 = $.get(pageLocation("/Discussion/28118~" + forums[1]), function () { })
    let grp3 = $.get(pageLocation("/Discussion/28118~" + forums[2]), function () { })
    $.when(grp1, grp2, grp3).done(function (responseText1, responseText2, responseText3) {
        let groups = [responseText1, responseText2, responseText3]
        for (let f = 0; f < groups.length; f++) {
            let forum = new DOMParser().parseFromString(groups[f], "text/html")
            let posts = forum.getElementsByClassName("ThreadContainer")[0]
            for (let x = 0; x < posts.childElementCount; x++) {
                let post = posts.children[x]
                let lastDate = new Date(post.getElementsByClassName("respLastReplyDate")[0].innerText.trim().replace("Last Reply: ", ""))
                let dayDiff = (currentDate - lastDate) / (1000 * 3600 * 24)

                if (dayDiff < 365) {
                    let topic = post.getElementsByClassName("respDiscTopic")
                    let comments = post.getElementsByClassName("respDiscChildPost")
                    let posters = post.getElementsByClassName("respAuthorWrapper")
                    let contacts = post.getElementsByClassName("respReplyWrapper")
                    let dateSort = new Date(lastDate).getTime()
                    forumArray.push({
                        postSort: dateSort, lastPost: lastDate, subject: topic[0].innerText.trim(), postContent: topic[1].innerText.trim(), postAuthor: posters[0].innerText.trim(),
                        postID: contacts[0].getElementsByTagName("a")[0].id, replyLink: contacts[0].getElementsByTagName("a")[0].href, groupName: forumNames[f], groupID: forums[f],
                        numOfPost: comments.length
                    })
                }
            }
        }
        if (forumArray.length > 0) {
            forumArray.sort((a, b) => { return a.postSort - b.postSort })
            forumArray.reverse()
            for (let p = 0; p <= 2; p++) {
                if (p < forumArray.length) {
                    document.getElementById("recentPosts").getElementsByClassName("card-header")[p].style.display = "block"
                    document.getElementById("recentPosts").getElementsByClassName("card-title")[p].innerText = forumArray[p].subject + " (Comments: " + forumArray[p].numOfPost + ")"
                    document.getElementById("recentPosts").getElementsByClassName("card-body")[p].getElementsByTagName("span")[0].innerHTML = forumArray[p].postContent + "<br /><b>" + forumArray[p].postAuthor + "</b>"
                    document.getElementById("recentPosts").getElementsByClassName("card-body")[p].getElementsByTagName("a")[0].href = forumArray[p].replyLink
                    document.getElementById("recentPosts").getElementsByClassName("card-body")[p].getElementsByTagName("a")[1].href = "javascript:showComments('" + forumArray[p].postID + "','" + forumArray[p].groupID + "')"
                }
            }
        }
    })
}
function getProfilePage() {
    let profileImgLink = document.createElement("a")
    let profileImg = document.createElement("img")
    let profileID = /\(([^)]+)\)/.exec(document.getElementById("HeaderPublishAuthProfile").href)[1].split(",")
    let portalProfilePage = "/Member/Contact/" + profileID[1] + "~" + profileID[0] + "~" + profileID[2]
    sessionStorage.setItem("profileID", profileID)
    let grp1 = $.get(pageLocation("/news/28118~792554"), function () { })
    let grp2 = $.get(pageLocation("/Member/28118~" + profileID[0]), function () { })
    let grp3 = $.get(pageLocation("/news/28118~795372"), function () { })
    let grp4 = $.get(pageLocation(portalProfilePage), function () { })
    let grp5 = $.get(pageLocation("/homepage/28118/resident-home-page"), function () { })
    $.when(grp1, grp2, grp3, grp4).done(function (responseText1, responseText2, responseText3, responseText4) {
        let userContent = new DOMParser().parseFromString(responseText1, "text/html")
        let imageFile = new DOMParser().parseFromString(responseText2, "text/html")
        let officeHours = new DOMParser().parseFromString(responseText3, "text/html")
        let profilePage = new DOMParser().parseFromString(responseText4, "text/html")

        profileImgLink.href = "https://ourwoodbridge.net/Member/Edit/" + profileID[1] + "~" + profileID[0]
        profileImg.className = "rounded float-left img-fluid"
        profileImg.src = imageFile.getElementsByTagName("img")[0].src
        profileImgLink.appendChild(profileImg)
        document.getElementById("userProfile").innerHTML = userContent.getElementById("contentInner").children[2].innerHTML
        document.getElementById("userProfile").insertBefore(profileImgLink, document.getElementById("userProfile").firstChild)
        document.getElementById("card-hours").innerHTML = officeHours.getElementById("contentInner").children[2].innerHTML
        document.getElementById("profileHeader").getElementsByTagName("a")[1].href = portalProfilePage
        sessionStorage.setItem("profileSecurity", (profilePage.getElementById("sec_role_id") !== null) ? profilePage.getElementById("sec_role_id").selectedOptions[0].innerHTML : "resident")

    })
    $.when(grp5).done(function (responseText1) {
        let profileContent = new DOMParser().parseFromString(responseText1, "text/html")
        let recentItems = profileContent.getElementsByClassName("message")
        for (let p = 0; p < recentItems.length; p++) { getMessage(recentItems[p].getElementsByTagName("a")[0], p) }
        document.getElementById("profileHeader").getElementsByTagName("a")[1].innerHTML = profileContent.getElementsByClassName("clsHeader")[0].innerHTML


        sessionStorage.setItem("profileName", profileContent.getElementsByClassName("clsHeader")[0].innerHTML)
        document.getElementById("profileHeader").getElementsByTagName("a")[0].className = "fa fa-check-circle fa-lg"
    })
}
function getResourceCenter() {
    $.get(pageLocation("/resourcecenter/28118/resource-center"), function () { })
        .done(function (responseText) {
            let documents = new DOMParser().parseFromString(responseText, "text/html")
            let docsList = document.getElementById("docCard").getElementsByTagName("span")[0]
            let newsList = document.getElementById("newsCard").getElementsByTagName("span")[0]
            let documentName = documents.getElementById("contents540434").querySelectorAll("[id^=d]")
            let documentLink = documents.getElementById("contents540434").querySelectorAll('a[title="View On-line"]')
            let newsLetterName = documents.getElementById("contents951754").querySelectorAll("[id^=d]")
            let newsLetterLink = documents.getElementById("contents951754").querySelectorAll('a[title="View On-line"]')

            for (let p = 0; p < documentName.length; p++) {
                let selectedDoc = document.createElement("a")
                selectedDoc.innerHTML = documentName[p].innerHTML
                selectedDoc.href = documentLink[p].href
                docsList.appendChild(selectedDoc)
            }

            for (let p = newsLetterName.length - 1; p >= 0 && newsList.children.length < 6; p--) {
                let selectedDoc = document.createElement("a")
                selectedDoc.innerHTML = newsLetterName[p].innerHTML
                selectedDoc.href = newsLetterLink[p].href
                newsList.appendChild(selectedDoc)
            }
        })
}
function showPhotos() {
    $.get(pageLocation("/Gallery/28118~58961"), function () { })
        .done(function (responseText) {
            let photos = new DOMParser().parseFromString(responseText, "text/html")
            let currentPageHost = window.location.protocol + "//" + window.location.host
            let photoTitles = photos.getElementById("contentInner").getElementsByClassName("clsSmallText")
            let photoLocation = photos.getElementById("contentInner").getElementsByClassName("colorbox-photo")
            let pagePhotos = document.getElementById("photoList")

            for (let p = photoTitles.length - 1, i = 0; p >= 0 && i < 3; p--, i++) {
                pagePhotos.getElementsByClassName("caption")[i].getElementsByTagName("p")[0].innerText = photoTitles[p].children[0].innerText
                pagePhotos.getElementsByTagName("a")[i].href = photoLocation[p].href.replace(currentPageHost, "https://ourwoodbridge.net")
                pagePhotos.getElementsByTagName("img")[i].src = photoLocation[p].href.replace(currentPageHost, "https://ourwoodbridge.net")
            }
        })
}
function getForSaleOrFree() {
    $.get(pageLocation("/classified/search/28118~480182/classifieds"), function () { })
        .done(function (responseText) {
            let classifieds = new DOMParser().parseFromString(responseText, "text/html")
            let classifiedTitle = classifieds.querySelectorAll('.clsBodyText:not(.hidden-md-up,.hidden-sm-down)')
            let classifiedBody = classifieds.getElementsByClassName("clsBodyText hidden-sm-down")
            for (let p = 0; p < 3; p++) {
                if (p < classifiedTitle.length) {
                    document.getElementById("recentforSale").getElementsByClassName("card-header")[p].style.display = "block"
                    document.getElementById("recentforSale").getElementsByClassName("card-title")[p].innerText = classifiedTitle[p].getElementsByTagName("a")[0].innerText.trim()
                    document.getElementById("recentforSale").getElementsByClassName("card-body")[p].getElementsByTagName("span")[0].innerHTML = classifiedBody[p].childNodes[0].nodeValue
                }
            }
        })
}
function getContacts() {
    let contactArray = ["10544936", "10551971", "10863452", "8108389", "10566484", "10854040"]
    let contact1 = $.get(pageLocation("/Member/28118~" + contactArray[0]), function () { })
    let contact2 = $.get(pageLocation("/Member/28118~" + contactArray[1]), function () { })
    let contact3 = $.get(pageLocation("/Member/28118~" + contactArray[2]), function () { })
    let contact4 = $.get(pageLocation("/Member/28118~" + contactArray[3]), function () { })
    let contact5 = $.get(pageLocation("/Member/28118~" + contactArray[4]), function () { })
    let contact6 = $.get(pageLocation("/Member/28118~" + contactArray[5]), function () { })
    $.when(contact1, contact2, contact3, contact4, contact5, contact6)
        .done(function (card1, card2, card3, card4, card5, card6) {
            let contactCard1 = new DOMParser().parseFromString(card1, "text/html")
            let contactCard2 = new DOMParser().parseFromString(card2, "text/html")
            let contactCard3 = new DOMParser().parseFromString(card3, "text/html")
            let contactCard4 = new DOMParser().parseFromString(card4, "text/html")
            let contactCard5 = new DOMParser().parseFromString(card5, "text/html")
            let contactCard6 = new DOMParser().parseFromString(card6, "text/html")
            let contactCards = [contactCard1, contactCard2, contactCard3, contactCard4, contactCard5, contactCard6]
            let contactList = document.getElementById("contactsTable").getElementsByTagName("tr")
            for (let c = 0; c < contactCards.length; c++) {
                let contactName = contactCards[c].getElementsByClassName("clsDMHeader")
                let contactTitle = contactCards[c].getElementsByClassName("clsHeader")
                let contactData = contactCards[c].getElementsByClassName("contactComms")
                let currentContact = contactList[c + 1].children
                if (contactName.length > 1) { currentContact[0].innerHTML = "<a href='" + pageLocation("/Member/28118~" + contactArray[c]) + "'>" + contactName[1].children[0].innerText.trim() + "</a>" }
                if (contactTitle.length > 0) { currentContact[1].innerHTML = "<a href='" + pageLocation("/Member/28118~" + contactArray[c]) + "'>" + contactTitle[0].innerText.trim() + "</a>" }
                if (contactData.length > 0) {
                    let selectedData = contactData[0].getElementsByClassName("contactLabel")
                    if (selectedData.length > 0) {
                        for (let p = 0; p < selectedData.length; p++) {
                            if (selectedData[p].innerText == "Email" && selectedData[p].nextElementSibling.childElementCount == 2) {
                                currentContact[3].innerText = selectedData[p].nextElementSibling.children[0].innerText
                            }
                            if (selectedData[p].innerText == "Work") {
                                currentContact[2].innerText = selectedData[p].nextElementSibling.innerText.trim()
                            }
                            if (selectedData[p].innerText == "Other") {
                                currentContact[2].innerText = currentContact[2].innerText + " " + selectedData[p].nextElementSibling.innerText.trim()
                            }
                        }
                    }
                }
            }
        })
}

function showCalendar() {
    console.log("loading iframe")
    let eventTable = document.getElementById("eventTable")
    let woaEvents = document.getElementById("WOACalendar")

    while (eventTable.firstChild) { eventTable.removeChild(eventTable.firstChild) }
    woaEvents.src = (window.location.hostname == "localhost") ? "Calendar/28118~19555.html" : "https://ourwoodbridge.net/Calendar/28118~19555/Community-Calendar#events"



    $("#WOACalendar").on("load", function () {
        console.log("iframe loaded")
        let woaEventsList = woaEvents.contentWindow.document
        console.log("start looping")
        calendarWait = setInterval(function () {
            console.log("still looping")
            if (woaEventsList.getElementById("bodyFooter") !== null) {
                clearInterval(calendarWait)
                console.log("end looping")
                let todaysEvents = woaEventsList.getElementsByClassName("event")

                for (let d = 0; d < todaysEvents.length; d++) {
                    let newRow = document.createElement("tr")
                    let newCol1 = document.createElement("td")
                    let newCol2 = document.createElement("td")
                    let newCol3 = document.createElement("td")
                    let eventLink = document.createElement("a")
                    eventLink.href = todaysEvents[d].getElementsByTagName("a")[0].href
                    eventLink.innerHTML = todaysEvents[d].children[1].innerText
                    newCol1.appendChild(eventLink)
                    newCol2.innerText = todaysEvents[d].children[0].innerText
                    $.get(eventLink.href, function () { })
                        .done(function (responseText) {
                            let woaEvent = new DOMParser().parseFromString(responseText, "text/html")
                            newCol3.innerText = woaEvent.getElementsByClassName("clsInput clsBodyText")[0].innerText.trim()
                        })
                        .fail(function () {
                            newCol3.innerText = "Event Location Not Avaiable"
                        })
                        .always(function () {
                            newRow.appendChild(newCol1)
                            newRow.appendChild(newCol2)
                            newRow.appendChild(newCol3)
                            eventTable.appendChild(newRow)
                            if (d == todaysEvents.length - 1) { sessionStorage.setItem("pageEvents", eventTable.innerHTML.trim()) }
                        })
                }
            }
        }, 1000)
    });

}
$(window).load(function () {
    if (document.getElementsByClassName("clsHeader").length > 0) { document.getElementsByClassName("clsHeader")[0].style.display = "none" }
    if (document.getElementById("resDisplayName") !== null) { document.getElementById("resDisplayName").innerText = "My Woodbridge" }
    if (document.getElementsByClassName("association-name").length > 0) { document.getElementsByClassName("association-name")[0].getElementsByTagName("a")[0].innerText = "My Woodbridge" }
    getProfilePage()
    showPhotos()
    showCalendar()
    getResourceCenter()
    getContacts()
    getNewsAndAnnouncements()
    getDiscussionGroups()
    getForSaleOrFree()
    setTimeout(function () {
        localStorage.setItem("pageTime", new Date().getTime())
        localStorage.setItem("pageEmails", document.getElementById("recentEmails").innerHTML.trim())
        localStorage.setItem("pagePhotos", document.getElementById("recentPhotos").innerHTML.trim())
    }, 2000)




    $("#appPopUp").on("hidden.bs.modal", function () {
        document.getElementById("appPopUpLabel").innerHTML = ""
        document.getElementById("popUpBody").innerHTML = sessionStorage.getItem("waitText")
    })

    $("#card-events").on("show.bs.collapse", function () {
        let eventList = document.getElementById("eventTable"), savedEvents = sessionStorage.getItem("pageEvents")
        if (document.getElementById("profileHeader").children[0].className === "fa fa-check-circle fa-lg") {
            if (eventList.childElementCount === 0 && savedEvents !== null) { eventList.innerHTML = savedEvents }
        }
    })
    window.addEventListener("beforeunload", function (e) {

    })

})