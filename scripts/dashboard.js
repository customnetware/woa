
let profileID = /\(([^)]+)\)/.exec(document.getElementById("HeaderPublishAuthProfile").href)[1].split(",")
let appContainer = document.createElement("div")
appContainer.id = "customContainer", appContainer.className = "container"
document.getElementsByClassName("clsBodyText")[0].appendChild(appContainer)
function pageLocation(URLString) {
    return (window.location.hostname == "localhost") ? URLString + ".html" : URLString
}
function addCard(hdrId, bdyId, crdIcon, crdText, useCollapse, fnName) {
    let rowDiv = document.createElement("div")
    let colDiv = document.createElement("div")
    let crdDiv = document.createElement("div")
    let hdrDiv = document.createElement("div")
    let bdyDiv = document.createElement("div")

    if (hdrId === "profileHeader") {
        let classArray = ["", "fa fa-check-circle fa-lg", "", "fa fa-question-circle fa-fw fa-lg", "fa fa-comment fa-fw fa-lg", "fa fa-envelope fa-fw fa-lg"]
        for (let a = 1; a <= 5; a++) {
            let pLink = document.createElement("a")
            pLink.className = classArray[a]
            hdrDiv.appendChild(pLink)
        }
    } else {
        let cardIcon = document.createElement("span")
        let cardText = document.createElement("span")
        cardIcon.className = crdIcon
        cardText.innerText = crdText
        hdrDiv.appendChild(cardIcon)
        hdrDiv.appendChild(cardText)
    }
    crdDiv.appendChild(hdrDiv)
    crdDiv.appendChild(bdyDiv)
    colDiv.appendChild(crdDiv)
    rowDiv.appendChild(colDiv)
    rowDiv.className = "row"
    colDiv.className = "col-md-12"
    crdDiv.className = "card mb-1"
    hdrDiv.className = "card-header"
    bdyDiv.className = "card-body"
    hdrDiv.id = hdrId, bdyDiv.id = bdyId
    if (useCollapse == true) {
        hdrDiv.classList.add("collapsed")
        hdrDiv.setAttribute("data-toggle", "collapse")
        hdrDiv.setAttribute("data-target", "#" + bdyDiv.id)
        hdrDiv.setAttribute("aria-expanded", "false")
        bdyDiv.classList.add("collapse")
        bdyDiv.setAttribute("data-parent", "#customContainer")
    }
    appContainer.appendChild(rowDiv)
    if (fnName !== "") { fnName() }
}
function getProfile() {
    let profileImage = document.createElement("img")
    let imageFile = $.get(pageLocation("/Member/28118~" + profileID[0]), function () { })
    let textFile = $.get(pageLocation("/news/28118~792554"), function () { })
    $.when(imageFile, textFile).done(function (responseIMG, responseTXT) {
        let imageFile = new DOMParser().parseFromString(responseIMG, "text/html")
        let userContent = new DOMParser().parseFromString(responseTXT, "text/html")
        let userText = document.createElement("span")
        profileImage.src = imageFile.getElementsByTagName("img")[0].src
        userText.innerHTML = userContent.getElementById("contentInner").children[2].innerHTML
        document.getElementById("profileBody").appendChild(profileImage)
        document.getElementById("profileBody").appendChild(userText)
    })
}
function getContacts() {
    let contactArray = ["10544936", "10551971", "10863452", "8108389", "10566484", "10854040"]

    for (let p = 0; p < contactArray.length; p++) {
        let contactDiv = document.createElement("div")
        let nameDiv = document.createElement("div")
        let jobDiv = document.createElement("div")
        let phoneDiv = document.createElement("div")
        let emailDiv = document.createElement("div")
        contactDiv.appendChild(nameDiv)
        contactDiv.appendChild(jobDiv)
        contactDiv.appendChild(phoneDiv)
        contactDiv.appendChild(emailDiv)
        $.get(pageLocation("/Member/28118~" + contactArray[p]), function () { })
            .done(function (responseText) {
                let contactCard = new DOMParser().parseFromString(responseText, "text/html")
                let contactName = contactCard.getElementsByClassName("clsDMHeader")
                let contactTitle = contactCard.getElementsByClassName("clsHeader")
                let contactData = contactCard.getElementsByClassName("contactComms")


                if (contactName.length > 1) {
                    let contactLink = document.createElement("a")
                    contactLink.href = pageLocation("/Member/28118~" + contactArray[p])
                    contactLink.innerHTML = contactName[1].children[0].innerText.trim()
                    nameDiv.appendChild(contactLink)
                }
                if (contactTitle.length > 0) {
                    let contactLink = document.createElement("a")
                    contactLink.href = pageLocation("/Member/28118~" + contactArray[p])
                    contactLink.innerHTML = contactTitle[0].innerText.trim()
                    jobDiv.appendChild(contactLink)
                }
                if (contactData.length > 0) {
                    let selectedData = contactData[0].getElementsByClassName("contactLabel")
                    if (selectedData.length > 0) {
                        for (let p = 0; p < selectedData.length; p++) {
                            if (selectedData[p].innerText == "Email" && selectedData[p].nextElementSibling.childElementCount == 2) {
                                emailDiv.appendChild(document.createTextNode(selectedData[p].nextElementSibling.children[0].innerText))
                            }
                            if (selectedData[p].innerText == "Work") {
                                phoneDiv.appendChild(document.createTextNode(selectedData[p].nextElementSibling.innerText.trim()))
                            }
                            if (selectedData[p].innerText == "Other") {
                                phoneDiv.appendChild(document.createTextNode(selectedData[p].nextElementSibling.innerText.trim()))
                            }
                        }
                    }
                }
                document.getElementById("contactBody").appendChild(contactDiv)
               
            })

    }
}
function getContentFromPortal(portalDocument) {
    let portalIds = ["messages", "news", "classifieds", "gallery"]
    let contentIds = ["emailBody", "newsBody", "forSaleBody", "photoBody"]
    for (let i = 0; i < portalIds.length; i++) {
        let portalLinks = portalDocument.getElementById("panel_" + portalIds[i] + "_content").getElementsByTagName("a")
        if (portalIds[i] !== "gallery") {
            for (let p = 0; p < portalLinks.length; p++) {
                let pageLink = document.createElement("a")
                let pageText = document.createElement("p")
                let pageStamp = document.createElement("span")
                pageLink.href = portalLinks[p].href
                pageLink.innerHTML = portalLinks[p].getAttribute("data-tooltip-title")
                pageText.appendChild(pageLink)
                document.getElementById(contentIds[i]).appendChild(pageText)
            }
        } else {
            for (let p = 0; p < portalLinks.length; p += 2) {
                let img = document.createElement("img")
                img.src = "https://ourwoodbridge.net/" + portalLinks[p].getAttribute("data-tooltip-text").split("|")[0]
                document.getElementById(contentIds[i]).appendChild(img)
            }
        }
    }
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
                    let post = document.createElement("div")
                    post.style.marginBottom = "15px"
                    post.style.paddingLeft = "15px"
                    post.innerHTML = "<b>" + forumArray[p].subject + " (Comments: " + forumArray[p].numOfPost + ") </b>"
                    post.appendChild(document.createElement("br"))
                    post.appendChild(document.createTextNode(forumArray[p].postContent))
                    document.getElementById("groupsBody").appendChild(post)
                    post.appendChild(document.createElement("br"))
                    let reply = document.createElement("a")
                    let view = document.createElement("a")
                    reply.href = forumArray[p].replyLink
                    reply.innerHTML = forumArray[p].postAuthor + "  | Reply"
                    view.href = "javascript:showComments('" + forumArray[p].postID + "','" + forumArray[p].groupID + "')"
                    view.innerHTML = " | View Comments"

                    post.appendChild(reply)
                    post.appendChild(view)

                }
            }
        }
    })
}
function formatTime(eventTime) {
    let eventDate = new Date()
    let amPM = eventTime.slice(-2)
    eventTime = eventTime.replace(amPM, "")
    eventHours = Number(eventTime.split(":")[0])
    eventMinutes = Number(eventTime.split(":")[1])
    if (amPM == "PM" && eventHours < 12) eventHours = eventHours + 12
    if (amPM == "AM" && eventHours == 12) eventHours = eventHours - 12
    eventDate.setHours(eventHours, eventMinutes, 0)
    return eventDate
}
function getCalendar() {
    let woaCalendar = document.createElement("iframe")
    let calendarArray = []
    woaCalendar.id = "woaIFrame"
    woaCalendar.style.display = "none"
    woaCalendar.onload = function () {
        calendarWait = setInterval(function () {
            let calendarDocument = woaCalendar.contentWindow.document
            if (calendarDocument !== null) {
                if (calendarDocument.readyState == "complete") {
                    let eventList = calendarDocument.getElementById("eventList")
                    if (eventList !== null) {
                        let todaysEvents = eventList.getElementsByClassName("event")
                        if (todaysEvents.length > 0) {
                            clearInterval(calendarWait)
                            for (let d = 0; d < todaysEvents.length; d++) {
                                let eventLocation = ""
                                $.get(todaysEvents[d].getElementsByTagName("a")[0].href, function () { })
                                    .done(function (responseText) {
                                        let woaEvent = new DOMParser().parseFromString(responseText, "text/html")
                                        eventLocation = woaEvent.getElementsByClassName("clsInput clsBodyText")[0].innerText.trim()
                                    })
                                    .fail(function () {
                                        eventLocation = "Event Location Not Avaiable"
                                    })
                                    .always(function () {
                                        calendarArray.push({
                                            calTime: formatTime(todaysEvents[d].children[0].innerText).getTime(),
                                            calTitle: todaysEvents[d].children[1].innerText,
                                            calLink: todaysEvents[d].getElementsByTagName("a")[0].href,
                                            calLocation: eventLocation
                                        })
                                        if (d === todaysEvents.length - 1) {
                                            calendarArray.sort((a, b) => { return a.calTime - b.calTime })
                                            showCalendar(calendarArray)
                                        }
                                    })
                            }
                        }
                    }
                }
            }
        }, 1000)

    }
    woaCalendar.src = pageLocation("/Calendar/28118~19555")
    document.body.appendChild(woaCalendar)
}
function showCalendar(calenderEvents) {
    for (let d = 0; d < calenderEvents.length; d++) {
        let eventLink = document.createElement("a")
        let eventDiv = document.createElement("div")
        let nameDiv = document.createElement("div")
        let timeDiv = document.createElement("div")
        let placeDiv = document.createElement("div")
        eventDiv.appendChild(nameDiv)
        eventDiv.appendChild(timeDiv)
        eventDiv.appendChild(placeDiv)
        eventLink.href = calenderEvents[d].calLink
        eventLink.innerHTML = calenderEvents[d].calTitle
        nameDiv.appendChild(eventLink)
        timeDiv.innerText = new Date(calenderEvents[d].calTime).toLocaleTimeString()
        placeDiv.innerText = calenderEvents[d].calLocation
        document.getElementById("eventsBody").appendChild(eventDiv)
    }
    document.getElementById("woaIFrame").remove()
 
}
addCard("profileHeader", "profileBody", "fa fa-check-circle fa-lg", "Welcome", false, getProfile)
addCard("emailHeader", "emailBody", "fa fa-envelope fa-lg", "Recent Emails", true, "")
addCard("newsHeader", "newsBody", "fa fa-newspaper-o fa-lg", "Recent News", true, "")
addCard("forSaleHeader", "forSaleBody", "fa fa-shopping-cart fa-lg", "For Sale or Free", true, "")
addCard("photoHeader", "photoBody", "fa fa-picture-o fa-lg", "Event Photos", true, "")
addCard("contactHeader", "contactBody", "fa fa-address-card-o fa-lg", "Office Contacts", true, getContacts)
addCard("groupsHeader", "groupsBody", "fa fa-comments fa-lg", "Discussion Groups", true, getDiscussionGroups)
addCard("eventsHeader", "eventsBody", "fa fa-calendar fa-lg", "Todays Calendar", true, getCalendar)

$.get(pageLocation("/homepage/28118/resident-home-page"), function () { })
    .done(function (responseText) {
        let portalContent = new DOMParser().parseFromString(responseText, "text/html")
        document.getElementById("profileHeader").getElementsByTagName("a")[1].innerHTML = portalContent.getElementsByClassName("clsHeader")[0].innerHTML
        getContentFromPortal(portalContent)

    })












