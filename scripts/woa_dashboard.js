const woaCode = {
    completeFNs: 0,
    profileID: /\(([^)]+)\)/.exec(document.getElementById("HeaderPublishAuthProfile").href)[1].split(","),
    isLocal: (window.location.hostname == "localhost") ? ".html" : "",
    ldComplete: (fncName) => {
        let allComplete = false
        woaCode.completeFNs = woaCode.completeFNs + 1
        let testTxt = document.createElement("p")
        testTxt.innerText = woaCode.completeFNs + " - " + fncName
        if (woaCode.completeFNs == 8) {
            allComplete = true
            document.getElementById("profileHeader").getElementsByTagName("a")[0].className = "fa fa-check-circle fa-lg"
            localStorage.setItem("woaCache", document.getElementsByClassName("clsBodyText")[0].innerHTML)
        }
        return allComplete
    },
    formatTime: (eventTime) => {
        let eventDate = new Date()
        let amPM = eventTime.slice(-2)
        eventTime = eventTime.replace(amPM, "")
        eventHours = Number(eventTime.split(":")[0])
        eventMinutes = Number(eventTime.split(":")[1])
        if (amPM == "PM" && eventHours < 12) eventHours = eventHours + 12
        if (amPM == "AM" && eventHours == 12) eventHours = eventHours - 12
        eventDate.setHours(eventHours, eventMinutes, 0)
        return eventDate
    },
    addCard: (hdrId, bdyId, crdIcon, crdText, useCollapse, fnName) => {
        let rowDiv = document.createElement("div")
        let colDiv = document.createElement("div")
        let crdDiv = document.createElement("div")
        let hdrDiv = document.createElement("div")
        let bdyDiv = document.createElement("div")

        if (hdrId === "profileHeader") {
            for (let a = 1; a <= 5; a++) {
                let headerLinks = document.createElement("a")
                hdrDiv.appendChild(headerLinks)
            }
        } else {
            let cardIcon = document.createElement("span")
            let cardText = document.createElement("span")
            cardIcon.className = crdIcon
            cardText.innerText = crdText
            hdrDiv.appendChild(cardIcon)
            hdrDiv.appendChild(cardText)
        }
        rowDiv.className = "row"
        colDiv.className = "col-md-12"
        crdDiv.className = "card mb-1"
        hdrDiv.className = "card-header"
        bdyDiv.className = "card-body"
        rowDiv.id = hdrId.replace("Header", "Row"), hdrDiv.id = hdrId, bdyDiv.id = bdyId

        if (useCollapse == true) {
            hdrDiv.classList.add("collapsed")
            hdrDiv.setAttribute("data-toggle", "collapse")
            hdrDiv.setAttribute("data-target", "#" + bdyDiv.id)
            hdrDiv.setAttribute("aria-expanded", "false")
            bdyDiv.classList.add("collapse")
            bdyDiv.setAttribute("data-parent", "#customContainer")
        }

        crdDiv.appendChild(hdrDiv)
        crdDiv.appendChild(bdyDiv)
        colDiv.appendChild(crdDiv)
        rowDiv.appendChild(colDiv)

        document.getElementById("customContainer").appendChild(rowDiv)

        if (fnName !== "") { fnName() }

    },
    addModal: () => {
        let modalDiv = document.createElement("div")
        let modaldialogDiv = document.createElement("div")
        let modalContentDiv = document.createElement("div")
        let modalHeaderDiv = document.createElement("div")
        let modalBodyDiv = document.createElement("div")
        let modalFooterDiv = document.createElement("div")
        let modalTitle = document.createElement("strong")
        let modalClose = document.createElement("button")
        let btmClose = document.createElement("button")
        let modalSpan = document.createElement("span")

        modalDiv.className = "modal fade"
        modalDiv.id = "appDialog"
        modalFooterDiv.className = "modal-footer"
        modaldialogDiv.className = "modal-dialog-scrollable modal-lg"
        modalContentDiv.className = "modal-content"
        modalHeaderDiv.className = "modal-header"
        modalBodyDiv.id = "appDialogBody"
        modalTitle.className = "modal-title"
        modalTitle.id = "appDialogTitle"

        modalClose.appendChild(modalSpan)
        modalHeaderDiv.appendChild(modalTitle)
        modalHeaderDiv.appendChild(modalClose)
        modalClose.type = "button"
        modalClose.className = "close"
        modalClose.setAttribute("data-dismiss", "modal")
        modalSpan.className = "fa fa-times fa-lg"

        btmClose.type = "button"
        btmClose.className = "btn btn-secondary"
        btmClose.innerText = "Close"
        btmClose.setAttribute("data-dismiss", "modal")

        modalFooterDiv.appendChild(btmClose)


        modalContentDiv.appendChild(modalHeaderDiv)
        modalContentDiv.appendChild(modalBodyDiv)
        modalContentDiv.appendChild(modalFooterDiv)

        modaldialogDiv.appendChild(modalContentDiv)
        modalDiv.appendChild(modaldialogDiv)
        document.getElementById("customContainer").appendChild(modalDiv)

    },
    getProfile: () => {
        let profileID = /\(([^)]+)\)/.exec(document.getElementById("HeaderPublishAuthProfile").href)[1].split(",")
        let portalProfilePage = "/Member/Contact/" + profileID[1] + "~" + profileID[0] + "~" + profileID[2]
        let classArray = ["fa fa-refresh fa-spin fa-lg", "", "fa fa-question-circle fa-fw fa-lg", "fa fa-comment fa-fw fa-lg", "fa fa-envelope fa-fw fa-lg"]
        let hrefArray = ["#", portalProfilePage, "/form/28118~327323/social-media-help", "javascript:woaCode.showTheDialog()", "/form/28118~116540/ask-a-manager"]
        let textArray = ["", "Loading...", "", "", ""]
        for (let a = 0; a <= 4; a++) {
            let headerLinks = document.getElementById("profileHeader").getElementsByTagName("a")
            headerLinks[a].innerHTML = textArray[a]
            headerLinks[a].href = hrefArray[a]
            headerLinks[a].className = classArray[a]
        }
        let profileImage = document.createElement("img")
        let imageFile = $.get("/Member/28118~" + profileID[0] + woaCode.isLocal, function () { })
        let textFile = $.get("/news/28118~792554" + woaCode.isLocal, function () { })
        $.when(imageFile, textFile).done(function (responseIMG, responseTXT) {
            let imageFile = new DOMParser().parseFromString(responseIMG, "text/html")
            let userContent = new DOMParser().parseFromString(responseTXT, "text/html")
            let userText = document.createElement("span")
            profileImage.src = imageFile.getElementsByTagName("img")[0].src
            userText.innerHTML = userContent.getElementById("contentInner").children[2].innerHTML
            document.getElementById("profileBody").appendChild(profileImage)
            document.getElementById("profileBody").appendChild(userText)
            woaCode.ldComplete("profile")
        })
    },
    getContentFromPortal: (portalDocument) => {
        let portalIds = ["messages", "news", "classifieds", "gallery"]
        let contentIds = ["emailBody", "newsBody", "forSaleBody", "photoBody"]
        for (let i = 0; i < portalIds.length; i++) {
            let portalLinks = portalDocument.getElementById("panel_" + portalIds[i] + "_content").getElementsByTagName("a")
            if (portalLinks.length > 0) {
                if (portalIds[i] !== "gallery") {
                    for (let p = 0; p < portalLinks.length; p++) {
                        let pageLink = document.createElement("a")
                        let pageText = document.createElement("p")
                        let pageStamp = document.createElement("span")
                        pageStamp.style.float = "right"
                        pageLink.href = portalLinks[p].href
                        if (portalIds[i] == "messages") {
                            pageLink.innerHTML = portalLinks[p].getAttribute("data-tooltip-title").split("by")[0].split(",")[0]
                            pageStamp.innerText = portalLinks[p].getAttribute("data-tooltip-title").split("by")[0].split(",")[1]
                            pageStamp.className = "hideFromApp"
                            localStorage.setItem(portalLinks[p].id, portalLinks[p].getAttribute("data-tooltip-title").split("by")[0] + portalLinks[p].getAttribute("data-tooltip-text"))
                        } else {
                            pageLink.innerHTML = portalLinks[p].getAttribute("data-tooltip-title")
                        }
                        pageText.appendChild(pageLink)
                        pageText.appendChild(pageStamp)

                        document.getElementById(contentIds[i]).appendChild(pageText)
                    }
                } else {
                    for (let p = 0; p < portalLinks.length; p += 2) {
                        let img = document.createElement("img")
                        img.src = "https://ourwoodbridge.net/" + portalLinks[p].getAttribute("data-tooltip-text").split("|")[0]
                        document.getElementById(contentIds[i]).appendChild(img)
                    }
                }
            } else { document.getElementById(contentIds[i]).appendChild(document.createTextNode("No documents found")) }
            woaCode.ldComplete(portalIds[i])
        }
    },
    getResourceCenter: () => {
        let myDocs = ["Activities and Event Flyers", "Woodbridge Life Newsletter", "Board Documents - Agendas and Minutes"]
        let myLocallinks = ["/woa_documents.html?ff=contents540434", "/woa_documents.html?ff=contents951754", "/woa_documents.html?ff=contents328201"]
        let myDocsLinks = ["/page/28118~1105440?ff=contents540434", "/page/28118~1105440?ff=contents951754", "/page/28118~1105440?ff=contents328201"]
        let pageDocsLinks = (window.location.hostname == "localhost") ? myLocallinks : myDocsLinks
        for (let p = 0; p < pageDocsLinks.length; p++) {
            let selectedDoc = document.createElement("a")
            selectedDoc.innerHTML = myDocs[p]
            selectedDoc.href = pageDocsLinks[p]
            document.getElementById("fileBody").appendChild(selectedDoc)

        }
        woaCode.ldComplete("files")
    },
    getContacts: () => {
        woaCode.ldComplete("contacts")
    },
    getDiscussionGroups: () => {
        let forumArray = [], forums = ["8030", "8364", "11315"], forumNames = ["Recommendations", "General", "Using the HOA Portal"], currentDate = new Date()
        let grp1 = $.get("/Discussion/28118~" + forums[0] + woaCode.isLocal, function () { })
        let grp2 = $.get("/Discussion/28118~" + forums[1] + woaCode.isLocal, function () { })
        let grp3 = $.get("/Discussion/28118~" + forums[2] + woaCode.isLocal, function () { })
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
                woaCode.ldComplete("discussion")
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
                        view.href = "javascript:woaCode.showComments('" + forumArray[p].postID + "','" + forumArray[p].groupID + "')"
                        view.innerHTML = " | View Comments"
                        post.appendChild(reply)
                        post.appendChild(view)
                    }
                }
            }
        })
    },
    getEvents: () => {
        let woaCalendar = document.createElement("iframe"), waitIcon = document.createElement("i"), pageEvents = document.getElementById("eventsBody")
        woaCalendar.style.display = "none", waitIcon.className = "fa fa-refresh fa-fw fa-spin fa-4x waitClass"
        while (pageEvents.firstChild) { pageEvents.removeChild(pageEvents.firstChild) }
        pageEvents.appendChild(waitIcon)
        woaCalendar.onload = function () {
            calendarWait = setInterval(function () {
                let calendarDocument = woaCalendar.contentWindow.document, eventList = calendarDocument.getElementById("eventList"), todaysEvents = eventList.getElementsByClassName("event")
                if (calendarDocument !== null && calendarDocument.readyState == "complete" && eventList !== null, todaysEvents.length > 0) {
                    clearInterval(calendarWait)
                    woaCalendar.remove()
                    woaCode.showEvents(todaysEvents)
                    waitIcon.remove()
                }
            }, 250)
        }
        woaCalendar.src = "/Calendar/28118~19555" + woaCode.isLocal
        document.body.appendChild(woaCalendar)
    },
    showEvents: (selectedEvents) => {
        let pageEvents = document.getElementById("eventsBody"), calendarArray = [], eventLocation = "Location Not Available"
        for (let d = 0; d < selectedEvents.length; d++) {
            calendarArray.push({
                calTime: woaCode.formatTime(selectedEvents[d].children[0].innerText).getTime(),
                calTitle: selectedEvents[d].children[1].innerText,
                calLink: selectedEvents[d].getElementsByTagName("a")[0].href,
                calLocation: eventLocation
            })
        }
        calendarArray.sort((a, b) => { return a.calTime - b.calTime })

        for (let d = 0; d < calendarArray.length; d++) {
            let eventLink = document.createElement("a"), eventDiv = document.createElement("div"), nameDiv = document.createElement("div")
            let timeDiv = document.createElement("div"), placeDiv = document.createElement("div")

            eventLink.href = calendarArray[d].calLink, eventLink.innerHTML = calendarArray[d].calTitle
            timeDiv.innerText = new Date(calendarArray[d].calTime).toLocaleTimeString()
            placeDiv.className = "hideFromApp"

            $.get((window.location.hostname !== "localhost") ? calendarArray[d].calLink : "/Calendar/Event/event.html", function () { })
                .done(function (responseText) {
                    let woaEvent = new DOMParser().parseFromString(responseText, "text/html")
                    placeDiv.innerText = woaEvent.getElementsByClassName("clsInput clsBodyText")[0].innerText.trim()
                })
                .fail(function () {
                    placeDiv.innerText = "Event Location Not Avaiable (Error)"
                })
                .always(function () {
                    nameDiv.appendChild(eventLink)
                    eventDiv.appendChild(nameDiv)
                    eventDiv.appendChild(timeDiv)
                    eventDiv.appendChild(placeDiv)
                    pageEvents.appendChild(eventDiv)

                })
        }
        const firstRow = document.getElementById("customContainer").children[1]
        firstRow.parentNode.insertBefore(document.getElementById("eventsRow"), firstRow)
        woaCode.ldComplete("calendar")
    },
    showTheDialog: () => {
        document.getElementById("appDialogTitle").innerText = "My Woodbridge"
        document.getElementById("appDialogBody").innerText = "Test Text"
        if (!$("#appDialog").is(":visible")) { $("#appDialog").modal("show") }
    },
    showComments: (selectedPostID, groupID) => {
        let commentArea = document.getElementById("appDialogBody")
        while (commentArea.firstChild) { commentArea.removeChild(commentArea.firstChild) }
        $.get("/Discussion/28118~" + groupID + woaCode.isLocal, function () { })
            .done(function (responseText) {
                let forum = new DOMParser().parseFromString(responseText, "text/html")
                let comments = forum.getElementById(selectedPostID.replace("lnkTopicReply", "contents"))
                let title = forum.getElementById(selectedPostID.replace("lnkTopicReply", "msgHeader") + " ")

                let topic = comments.getElementsByClassName("respDiscTopic")
                let replyText = comments.getElementsByClassName("respDiscChildPost")
                let replyAuthor = comments.getElementsByClassName("respAuthorWrapper")
                let commentSpan = document.createElement("span")
                commentSpan.className = "commentSpan"
                commentSpan.style.fontWeight = "600"
                commentSpan.innerHTML = topic[0].innerText.trim() + "<br />" + replyAuthor[0].innerText + "<hr />"
                document.getElementById("appDialog").getElementsByClassName("modal-title")[0].innerHTML = title.innerText

                commentArea.appendChild(commentSpan)

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
                if (!$("#appDialog").is(":visible")) { $("#appDialog").modal("show") }
            })
    },
    showThePage: () => {
        let pageArea = document.getElementsByClassName("clsBodyText")[0]
        while (pageArea.firstChild) { pageArea.removeChild(pageArea.firstChild) }
        let getPageFromCache = (document.referrer.indexOf("https://ourwoodbridge.net/page/") == 0 && localStorage.getItem("woaCache") !== null) ? true : false

        if (getPageFromCache == false) {
            if (typeof (window.performance.getEntriesByType) != "undefined") {
                try {
                    let pageStatus = window.performance.getEntriesByType("navigation")[0].type
                    if (pageStatus == "navigate" || pageStatus == "reload" || localStorage.getItem("woaCache") === null) {
                        getPageFromCache = false
                    } else {
                        getPageFromCache = true
                    }
                } catch { getPageFromCache = false }
            } else { getPageFromCache = false }
        }
        if (getPageFromCache == false) {
            let appContainer = document.createElement("div"); appContainer.id = "customContainer", appContainer.className = "container"
            pageArea.appendChild(appContainer)
            woaCode.addCard("profileHeader", "profileBody", "fa fa-check-circle fa-lg", "Loading...", false, woaCode.getProfile)
            woaCode.addCard("emailHeader", "emailBody", "fa fa-envelope fa-lg", "Recent Emails", true, "")
            woaCode.addCard("newsHeader", "newsBody", "fa fa-newspaper-o fa-lg", "Recent News", true, "")
            woaCode.addCard("forSaleHeader", "forSaleBody", "fa fa-shopping-cart fa-lg", "For Sale or Free", true, "")
            woaCode.addCard("photoHeader", "photoBody", "fa fa-picture-o fa-lg", "Event Photos", true, "")
            woaCode.addCard("contactHeader", "contactBody", "fa fa-address-card-o fa-lg", "Office Contacts", true, woaCode.getContacts)
            woaCode.addCard("groupsHeader", "groupsBody", "fa fa-comments fa-lg", "Discussion Groups", true, woaCode.getDiscussionGroups)
            woaCode.addCard("eventsHeader", "eventsBody", "fa fa-calendar fa-lg", "Todays Calendar", true, "")
            woaCode.addCard("fileHeader", "fileBody", "fa fa-file fa-lg", "My Documents", true, woaCode.getResourceCenter)
            woaCode.addModal()
            $.get("/homepage/28118/resident-home-page" + woaCode.isLocal, function () { })
                .done(function (responseText) {
                    let portalContent = new DOMParser().parseFromString(responseText, "text/html")
                    document.getElementById("profileHeader").getElementsByTagName("a")[1].innerHTML = portalContent.getElementsByClassName("clsHeader")[0].innerHTML
                    woaCode.getContentFromPortal(portalContent)

                })
        } else { pageArea.innerHTML = localStorage.getItem("woaCache") }
        $("#contactBody").on("show.bs.collapse", function () {
            (window.location.hostname == "localhost") ? location.replace("woa_contacts.html") : location.replace("/page/28118~1105492")
        })
        $("#eventsBody").on("show.bs.collapse", function () {
            woaCode.getEvents()
        })
    },
}
woaCode.showThePage()












