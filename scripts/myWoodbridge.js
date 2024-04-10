const woaContainer = document.createElement("div")
const isLocal = (window.location.hostname == "localhost") ? ".html" : ""
const urlParams = new URLSearchParams(window.location.search)
woaContainer.id = "customContainer", woaContainer.className = "container"
document.getElementsByClassName("clsBodyText")[0].appendChild(woaContainer)
let pageSource
switch (window.location.pathname) {
    case "/page/28118~1105492":
    case "/woa_contacts.html":
        pageSource = "contacts"
        break
    case "/page/28118~1105440":
    case "/woa_documents.html":
        pageSource = "documents"
        break
    case "/page/28118~1101528":
    case "/myWoodbridge.html":
    default:
        pageSource = "home"
        break

        (isLocal == "") ? "/page/28118~1101528?ff=" + fileFolderID : "/woa_documents.html?ff=" + fileFolderID
}
const woaCode = {
    addHTML: (start, end) => {
        let divIDs = ["recentFiles", "recentEmails", "recentPosts", "officeContacts", "documents"]
        let divTitles = ["Recent Documents", "Recent Association Emails", "Recent Comments", "Clubhouse Office Contacts", "My Documents"]
        let woaHeaderRow = document.createElement("div")
        let woaHeaderGreeting = document.createElement("div")
        let woaHeaderTxt = document.createElement("span")
        let woaHeaderImg = document.createElement("img")
        woaHeaderRow.id = "woaHeaderRow"
        woaHeaderGreeting.className = "notifyHeader"
        woaHeaderGreeting.paddingBottom = "50px"
        woaHeaderRow.appendChild(woaHeaderGreeting)
        if (end < 3) { woaHeaderRow.appendChild(woaHeaderImg) }
        woaHeaderRow.appendChild(woaHeaderTxt)
        woaContainer.appendChild(woaHeaderRow)
        for (let p = start; p <= end; p++) {
            let notificationDiv = document.createElement("div")
            notificationDiv.id = divIDs[p]
            if (notificationDiv.id !== "documents") {
                let notificationHdr = document.createElement("span")
                notificationHdr.className = "notifyHeader"
                notificationHdr.innerText = divTitles[p]
                notificationDiv.appendChild(notificationHdr)
            }
            woaContainer.appendChild(notificationDiv)
        }
    },
    getProfile: () => {
        let timeNow = new Date().getHours()
        let greeting = timeNow >= 5 && timeNow < 12 ? "Good Morning" : timeNow >= 12 && timeNow < 18 ? "Good Afternoon" : "Good Evening"
        let profileID = /\(([^)]+)\)/.exec(document.getElementById("HeaderPublishAuthProfile").href)[1].split(",")
        let imageFile = $.get("/Member/28118~" + profileID[0] + isLocal, function () { })
        let textFile = $.get("/news/28118~792554" + isLocal, function () { })
        let nameFile = $.get("/Member/Contact/28118~" + profileID[0] + "~" + profileID[2] + isLocal, function () { })
        $.when(imageFile, textFile, nameFile).done(function (responseIMG, responseTXT, responseNM) {
            let imageFile = new DOMParser().parseFromString(responseIMG, "text/html")
            let userContent = new DOMParser().parseFromString(responseTXT, "text/html")
            let userName = new DOMParser().parseFromString(responseNM, "text/html")

            document.getElementById("woaHeaderRow").getElementsByTagName("div")[0].innerText = greeting + ", " + userName.getElementsByName("fname")[0].value + " " + userName.getElementsByName("lname")[0].value
            document.getElementById("woaHeaderRow").getElementsByTagName("img")[0].src = imageFile.getElementsByTagName("img")[0].src
            document.getElementById("woaHeaderRow").getElementsByTagName("span")[0].innerHTML = userContent.getElementById("contentInner").children[2].innerHTML

        })

    },
    getEmails: () => {
        $.get("/homepage/28118/resident-home-page" + isLocal, function () { })
            .done(function (responseText) {
                let portalContent = new DOMParser().parseFromString(responseText, "text/html")
                let recentEmails = portalContent.getElementById("panel_messages_content").getElementsByTagName("a")
                for (let p = 0; p < recentEmails.length; p++) {
                    let emailDiv = document.createElement("div")
                    emailDiv.style.width = "100%"
                    emailDiv.style.marginBottom = "10px"
                    let emailHeader = document.createElement("a")
                    emailHeader.href = recentEmails[p].href
                    emailHeader.innerHTML = recentEmails[p].getAttribute("data-tooltip-title").split("by")[0].split(",")[0]
                    emailDiv.appendChild(emailHeader)
                    emailDiv.appendChild(document.createElement("br"))
                    emailDiv.appendChild(document.createTextNode(recentEmails[p].getAttribute("data-tooltip-text")))
                    emailDiv.appendChild(document.createElement("br"))
                    emailDiv.appendChild(document.createTextNode(recentEmails[p].getAttribute("data-tooltip-title").split("by")[0].split(",")[1]))
                    document.getElementById("recentEmails").appendChild(emailDiv)
                }
            })
    },
    getFiles: (folderID) => {
        let doclink = "/ResourceCenter/Download/28118?doc_id=0000000&print=1&view=1"
        $.get("/resourcecenter/28118/resource-center" + isLocal, function () { })
            .done(function (responseText) {
                let documents = new DOMParser().parseFromString(responseText, "text/html")
                let docArray = []
                let allDocs = documents.getElementById("contents" + folderID).getElementsByTagName("span")

                for (let d = 0; d < allDocs.length; d++) { if (allDocs[d].id.charAt(0) == "d") { docArray.push(allDocs[d].id) } }
                if (folderID == "328201" || folderID == "951754") { docArray.sort() } else { docArray.reverse() }
                for (p = docArray.length - 1, c = 1; p >= 0 && c < 4; p--, c++) {
                    let fileFolderID = documents.getElementById(docArray[p]).parentElement.parentElement.parentElement.parentElement.id
                    let folderName = documents.getElementById(fileFolderID.replace("contents", "f")).innerText
                    let leftRow = document.createElement("span"), rightRow = document.createElement("span")
                    let currentDoc = document.createElement("a"), currentFldr = document.createElement("a")
                    let currentDocId = documents.getElementById(docArray[p]).id.replace("d", "")
                    let currentDocName = documents.getElementById(docArray[p]).innerText, currentDocUrl = doclink.replace("0000000", currentDocId)
                    currentFldr.href = (isLocal == "") ? "/page/28118~1105440?ff=" + fileFolderID : "/woa_documents.html?ff=" + fileFolderID
                    currentDoc.innerHTML = currentDocName, currentDoc.href = currentDocUrl, currentFldr.innerHTML = folderName
                    rightRow.appendChild(currentFldr)
                    leftRow.appendChild(currentDoc)
                    document.getElementById("recentFiles").appendChild(rightRow)
                    document.getElementById("recentFiles").appendChild(leftRow)

                }
                document.getElementById("recentFiles").appendChild(document.createElement("hr"))
            })
    },
    getDiscussionGroups: () => {
        let forumArray = [], forums = ["8030", "8364", "11315"], forumNames = ["Recommendations", "General", "Using the HOA Portal"], currentDate = new Date()
        let grp1 = $.get("/Discussion/28118~" + forums[0] + isLocal, function () { })
        let grp2 = $.get("/Discussion/28118~" + forums[1] + isLocal, function () { })
        let grp3 = $.get("/Discussion/28118~" + forums[2] + isLocal, function () { })
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
                        let reply = document.createElement("a")
                        let view = document.createElement("a")
                        post.style.marginBottom = "15px"
                        post.style.paddingLeft = "0px"
                        post.innerHTML = "<b>" + forumArray[p].subject + " (Comments: " + forumArray[p].numOfPost + ") </b>"
                        reply.href = forumArray[p].replyLink
                        reply.innerHTML = forumArray[p].postAuthor + "  | Reply"
                        view.href = "javascript:woaCode.showComments('" + forumArray[p].postID + "','" + forumArray[p].groupID + "')"
                        view.innerHTML = " | View Comments"
                        post.appendChild(document.createElement("br"))
                        post.appendChild(document.createTextNode(forumArray[p].postContent))
                        post.appendChild(document.createElement("br"))
                        post.appendChild(reply)
                        post.appendChild(view)
                        document.getElementById("recentPosts").appendChild(post)
                    }
                }
            }
        })
    },
    getPageCache: () => {
        let getPageFromCache = false
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
        return getPageFromCache
    },
    getContactHdr: () => {
        let textFile = $.get("/news/28118~799909" + isLocal, function () { })
        $.when(textFile).done(function (responseTXT) {
            let userContent = new DOMParser().parseFromString(responseTXT, "text/html")
            document.getElementById("woaHeaderRow").getElementsByTagName("div")[0].innerText = "Silvercreek Association Management"
            document.getElementById("woaHeaderRow").getElementsByTagName("span")[0].innerHTML = userContent.getElementById("contentInner").children[2].innerHTML
        })

    },
    getContacts: () => {
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
            $.get("/Member/28118~" + contactArray[p] + isLocal, function () { })
                .done(function (responseText) {
                    let contactCard = new DOMParser().parseFromString(responseText, "text/html")
                    let contactName = contactCard.getElementsByClassName("clsDMHeader")
                    let contactTitle = contactCard.getElementsByClassName("clsHeader")
                    let contactData = contactCard.getElementsByClassName("contactComms")


                    if (contactName.length > 1) {
                        let contactLink = document.createElement("a")
                        contactLink.href = "/Member/28118~" + contactArray[p] + isLocal
                        contactLink.innerHTML = contactName[1].children[0].innerText.trim()
                        nameDiv.appendChild(contactLink)
                    }
                    if (contactTitle.length > 0) {
                        let contactLink = document.createElement("a")
                        contactLink.href = "/Member/28118~" + contactArray[p] + isLocal
                        contactLink.innerHTML = contactTitle[0].innerText.trim()
                        jobDiv.appendChild(contactLink)
                    }
                    if (contactData.length > 0) {
                        let selectedData = contactData[0].getElementsByClassName("contactLabel")
                        if (selectedData.length > 0) {
                            for (let p = 0; p < selectedData.length; p++) {
                                //if (selectedData[p].innerText == "Email" && selectedData[p].nextElementSibling.childElementCount == 2) {
                                //    emailDiv.appendChild(document.createTextNode(selectedData[p].nextElementSibling.children[0].innerText))
                                //}
                                if (selectedData[p].innerText == "Work") {
                                    phoneDiv.appendChild(document.createTextNode(selectedData[p].nextElementSibling.innerText.trim()))
                                }
                                if (selectedData[p].innerText == "Other") {
                                    phoneDiv.appendChild(document.createTextNode(" " + selectedData[p].nextElementSibling.innerText.trim()))
                                }
                            }
                        }
                    }
                    document.getElementById("officeContacts").appendChild(contactDiv)

                })

        }

    },
    getDocumentHdr: () => {
        let textFile = $.get("/news/28118~799897" + isLocal, function () { })
        $.when(textFile).done(function (responseTXT) {
            let userContent = new DOMParser().parseFromString(responseTXT, "text/html")
            document.getElementById("woaHeaderRow").getElementsByTagName("div")[0].innerText = "My Documents"
            document.getElementById("woaHeaderRow").getElementsByTagName("span")[0].innerHTML = userContent.getElementById("contentInner").children[2].innerHTML
        })

    },
    getPortalDocuments: (docID, getLatest) => {
        let docArray = []
        let pageDocuments = document.getElementById("documents")
        let waitSpan = document.createElement("i")
        waitSpan.className = "fa fa-refresh fa-fw fa-spin fa-4x waitClass"
        while (pageDocuments.firstChild) { pageDocuments.removeChild(pageDocuments.firstChild) }
        pageDocuments.appendChild(waitSpan)
        if (docID === "") { docID = "contentInner" }
        $.get("/resourcecenter/28118/resource-center" + isLocal, function () { })
            .done(function (responseText) {
                waitSpan.remove()
                let documents = new DOMParser().parseFromString(responseText, "text/html")
                if (getLatest == true) {
                    let selectedDocs = documents.getElementById(docID).getElementsByTagName("span")
                    for (let d = 0; d < selectedDocs.length; d++) {
                        if (selectedDocs[d].id.charAt(0) == "d") {
                            docArray.push(selectedDocs[d].id)
                        }
                    }
                    docArray.sort()
                    docID = documents.getElementById(docArray[docArray.length - 1]).parentElement.parentElement.parentElement.parentElement.id
                }
                let allDocuments = documents.getElementById(docID).getElementsByClassName("clsTreeNde")
                if (docID !== "contentInner") {
                    let folderIcon = document.createElement("i")
                    let folderLink = document.createElement("a")
                    let lastFolder = document.createElement("span")
                    folderLink.href = "javascript:woaCode.getPortalDocuments('" + documents.getElementById(docID).parentElement.parentElement.parentElement.id + "',false)"
                    folderLink.innerHTML = documents.getElementById(docID.replace("contents", "f")).innerText
                    folderIcon.className = "fa fa-folder-open-o fa-lg"
                    folderIcon.style.marginRight = "10px"
                    lastFolder.appendChild(folderIcon)
                    lastFolder.appendChild(folderLink)
                    pageDocuments.appendChild(lastFolder)
                }
                for (let d = 0; d < allDocuments.length; d++) {
                    let parentFolderID = allDocuments[d].parentElement.parentElement.parentElement.parentElement.id
                    if (parentFolderID !== "contents465149" && parentFolderID == docID) {
                        let pageIcon = document.createElement("i")
                        let pageLink = document.createElement("a")
                        let pageDocument = document.createElement("span")
                        pageIcon.style.marginRight = "10px"
                        pageIcon.id = allDocuments[d].id
                        pageLink.innerHTML = allDocuments[d].innerHTML
                        if (allDocuments[d].id.charAt(0) == "f") {
                            pageIcon.className = "fa fa-folder-o fa-lg"
                            pageLink.href = "javascript:woaCode.getPortalDocuments('" + allDocuments[d].id.replace("f", "contents") + "',false)"
                        } else {
                            pageIcon.className = "fa fa-file-o fa-lg"
                            pageLink.href = documents.getElementById(allDocuments[d].id.replace("d", "contentsDoc")).getElementsByTagName("a")[2].href
                        }
                        pageDocument.appendChild(pageIcon)
                        pageDocument.appendChild(pageLink)
                        pageDocuments.appendChild(pageDocument)
                        if (d == allDocuments.length - 1) {
                            woaCode.screenSort()
                        }
                    }
                }
            })
    },
    screenSort: () => {

        let startNumber = (document.getElementById("documents").getElementsByTagName("i")[0].className == "fa fa-folder-o fa-lg") ? 0 : 1
        let screens = document.getElementById("documents").getElementsByTagName("span")
        let sortScreens = []
        for (let s = startNumber; s < screens.length; s++) {
            sortScreens.push(screens[s].innerHTML)
        }
        sortScreens.sort(function (a, b) { return a - b })

        if (document.getElementById("documents").getElementsByTagName("a")[0].innerText !== "Flyers (Events or Activities)") { sortScreens.reverse() }

        for (let s = 0; s < sortScreens.length; s++) {
            screens[s + startNumber].innerHTML = sortScreens[s]
        }
    },
}
if (pageSource == "home") {
    woaCode.addHTML(0, 2)
    woaCode.getProfile()
    woaCode.getDiscussionGroups()
    woaCode.getEmails()
    woaCode.getFiles("540434")
    woaCode.getFiles("328201")
    woaCode.getFiles("951754")
}
if (pageSource == "contacts") {
    woaCode.addHTML(3, 3)
    woaCode.getContactHdr()
    woaCode.getContacts()
}
if (pageSource == "documents") {
    woaCode.addHTML(4, 4)
    woaCode.getDocumentHdr()
    if (urlParams.get("ff") !== null) {
        woaCode.getPortalDocuments(urlParams.get("ff"), true)
    } else { woaCode.getPortalDocuments("", false) }
}
