const woaCode = {
    pageLocation: (pageName) => {
        return (window.location.hostname == "localhost") ? pageName.replace("https://ourwoodbridge.net", "") + ".html" : pageName
    },
    showEmail: (savedMessageURL) => {
        let commentArea = document.getElementById("appDialogBody")
        while (commentArea.firstChild) { commentArea.removeChild(commentArea.firstChild) }
        document.getElementById("appDialogLabel").innerText = ""
        document.getElementById("replyButton").style.display = "none"

        if (savedMessageURL.includes("/Messenger/MessageView/")) {
            $("#appDialogBody").load(woaCode.pageLocation(savedMessageURL) + " div:first", function (responseTxt, statusTxt, xhr) {
                if (statusTxt == "error") { commentArea.innerHTML = "The requested email was not found on the server.  It may have been deleted or you do not have permission to view it." }
            })
        }
        if (!$("#appDialog").is(":visible")) { $("#appDialog").modal("show") }
    },

    isDescendant: (parent, child) => {
        let isParent = child.parentElement
        while (isParent != null) {
            if (isParent == parent) { return true }
            isParent = isParent.parentElement
        } return false
    },
    getProfileID: () => {
        let profileID = /\(([^)]+)\)/.exec(document.getElementById("HeaderPublishAuthProfile").href)[1].split(",")
        return profileID
    },
    getPortalData: (dataSource, dataFunction) => {
        if (dataSource.includes("resident-home-page") && woaCode.refreshCheck() < 10) {
            let cachedEmails = localStorage.getItem("pageEmails")
            if (cachedEmails !== null && cachedEmails.includes("<li>")) {
                dataFunction(cachedEmails)
                return
            }
        }

        $.get(dataSource)
            .done(function (responseText) {
                try {
                    let portalContent = new DOMParser().parseFromString(responseText, "text/html")

                    dataFunction(portalContent)
                } catch { }

            })
    },
    getProfile: (portalContent) => {
        let currentHour = new Date().getHours()
        let greeting = (currentHour < 12) ? "Good Morning, " : (currentHour >= 12 && currentHour <= 18) ? "Good Afternoon, " : "Good Evening, "

        if (portalContent.getElementsByClassName("mt-1").length > 0) {
            let noImage = document.createElement("span")
            noImage.className = "fa fa-user fa-4x"
            noImage.style.float = "left"
            noImage.style.paddingRight = "5px"
            if (portalContent.getElementsByClassName("mt-1")[0].src.includes("my")) {
                document.getElementById("headerRow").getElementsByTagName("img")[0].remove()
                document.getElementById("headerRow").insertBefore(noImage, document.getElementById("headerRow").firstChild)
            }
            else { document.getElementById("headerRow").getElementsByTagName("img")[0].src = portalContent.getElementsByClassName("mt-1")[0].src }
        } else {
            let firstName = portalContent.getElementsByName("fname")
            let lastName = portalContent.getElementsByName("lname")
            if (firstName.length > 0) {
                greeting = greeting.concat(firstName[0].value + " " + lastName[0].value)
                document.getElementById("headerRow").insertBefore(document.createTextNode(greeting + ".  "), document.getElementById("headerRow").firstChild)
            }

        }
    },
    getEmails: (portalContent) => {
        let contentType = typeof portalContent

        if (document.getElementById("emailWait") !== null) { document.getElementById("emailWait").remove() }
        let emailListing = document.getElementById("recentEmails").getElementsByTagName("ul")[0]
        if (contentType == "object") {
            let recentEmails = portalContent.getElementById("panel_messages_content").getElementsByTagName("a")
            for (let p = 0; p < recentEmails.length; p++) {
                let currentEmail = document.createElement("li")
                let emailHeader = document.createElement("a")
                let emailTitle = recentEmails[p].getAttribute("data-tooltip-title").split("by")[0].split(",")
                emailHeader.href = "javascript:woaCode.showEmail('" + recentEmails[p].href + "')"

                emailHeader.innerHTML = emailTitle[0] + " (" + emailTitle[1].trim() + ")"
                currentEmail.appendChild(emailHeader)
                emailListing.appendChild(currentEmail)
                localStorage.setItem(recentEmails[p].id, emailTitle + recentEmails[p].getAttribute("data-tooltip-text"))
            }
            localStorage.setItem("pageEmails", emailListing.innerHTML.trim())
        } else { emailListing.innerHTML = portalContent }
    },
    getFiles: (portalContent) => {
        let fileArray = []
        let fileLink = "https://ourwoodbridge.net/ResourceCenter/Download/28118?doc_id=0000000&print=1&view=1"
        let folderLink = "https://ourwoodbridge.net/ResourceCenter/28118~"
        let selectedFolders = document.getElementById("recentFiles").getElementsByTagName("input")
        let folderSelected = (selectedFolders[0].checked == true) ? selectedFolders[0].value : (selectedFolders[1].checked == true) ? selectedFolders[1].value : selectedFolders[2].value
        let docs = portalContent.getElementById(folderSelected).querySelectorAll('[id^="d"]')

        for (let i = 0; i < docs.length; i++) {
            let parentId = docs[i].parentElement.parentElement.parentElement.parentElement.id
            let inFolder = portalContent.getElementById(parentId.replace("contents", "f")).innerHTML
            let folderURL = folderLink + parentId.replace("contents", "")
            let fileURL = fileLink.replace("0000000", docs[i].id.replace("d", ""))
            if (folderSelected == "contents540434" || folderSelected == "contents951754" || (folderSelected == "contents328201" && (docs[i].innerHTML.includes("2024") && (docs[i].innerHTML.includes("Minutes") || docs[i].innerHTML.includes("Agenda") || docs[i].innerHTML.includes("Packets"))))) {
                fileArray.push(docs[i].innerHTML + "|" + fileURL + "|" + inFolder + "|" + folderURL)
            }
        }
        document.getElementById("filesWait").style.display = "none"
        if (folderSelected == "contents951754") { fileArray.reverse() }
        if (folderSelected == "contents328201") { fileArray.sort((a, b) => { return a - b }); fileArray.reverse() }
        for (let d = 0, s = 1; d < fileArray.length && s <= 5; d++, s++) {
            let linkSpan = document.createElement("li")
            let docLink = document.createElement("a")
            docLink.innerHTML = fileArray[d].split("|")[0].trim() + " - "
            docLink.href = fileArray[d].split("|")[1].trim()

            let inLink = document.createElement("a")
            inLink.innerHTML = fileArray[d].split("|")[2].trim()
            inLink.href = fileArray[d].split("|")[3].trim()

            linkSpan.appendChild(docLink)
            linkSpan.appendChild(inLink)
            document.getElementById("recentFiles").getElementsByTagName("ul")[0].appendChild(linkSpan)
        }
    },
    getPosts: (portalContent) => {
        let groupPageLink = portalContent.getElementById("lnkAddTopic")
        let forumID = /\(([^)]+)\)/.exec(groupPageLink.href)[1].split(",")
        let posts = portalContent.getElementsByClassName("ThreadContainer")[0], forumArray = [], currentDate = new Date()
        for (let x = 0; x < posts.childElementCount; x++) {
            let post = posts.children[x]
            let lastDate = new Date(post.getElementsByClassName("respLastReplyDate")[0].innerText.trim().replace("Last Reply: ", ""))
            let dayDiff = (currentDate - lastDate) / (1000 * 3600 * 24)
            let topic = post.getElementsByClassName("respDiscTopic")
            let comments = post.getElementsByClassName("respDiscChildPost")
            let posters = post.getElementsByClassName("respAuthorWrapper")
            let contacts = post.getElementsByClassName("respReplyWrapper")
            let dateSort = new Date(lastDate).getTime()
            if (dayDiff < 32) {
                forumArray.push({
                    postSort: dateSort, lastPost: lastDate, subject: topic[0].innerText.trim(), postContent: topic[1].innerText.trim(), postAuthor: posters[0].innerText.trim(),
                    postID: contacts[0].getElementsByTagName("a")[0].id, replyLink: contacts[0].getElementsByTagName("a")[0].href, groupName: groupPageLink.innerText, groupID: forumID[1].replaceAll("'", ""),
                    numOfPost: comments.length
                })
            }
        }
        if (document.getElementById("postsWait") !== null) { document.getElementById("postsWait").remove() }
        if (forumArray.length > 0) {

            forumArray.sort((a, b) => { return a.postSort - b.postSort })
            forumArray.reverse()
            for (let p = 0; p <= 0; p++) {
                if (p < forumArray.length) {
                    let post = document.createElement("li")
                    let postLink = document.createElement("a")
                    postLink.innerHTML = forumArray[p].subject + " (Comments: " + forumArray[p].numOfPost + ") - " + forumArray[p].postAuthor
                    postLink.href = "javascript:woaCode.showComments('" + forumArray[p].postID + "','" + forumArray[p].groupID + "')"
                    post.appendChild(postLink)
                    document.getElementById("recentPosts").getElementsByTagName("ul")[0].appendChild(post)
                }
            }
            localStorage.setItem("pagePosts", document.getElementById("recentPosts").getElementsByTagName("ul")[0].innerHTML.trim())
        }
    }, showComments: (selectedPostID, groupID) => {
        let commentArea = document.getElementById("appDialogBody")
        while (commentArea.firstChild) { commentArea.removeChild(commentArea.firstChild) }
        $.get(woaCode.pageLocation("/Discussion/28118~" + groupID), function () { })
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
                document.getElementById("replyButton").setAttribute("onclick", forum.getElementById(selectedPostID).href)
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
                document.getElementById("replyButton").style.display = ""
                if (!$("#appDialog").is(":visible")) { $("#appDialog").modal("show") }
            })
    },
    getContacts: (portalContent) => {
        let contactList = document.getElementById("officeContacts").getElementsByTagName("ul")[0]
        let contactName = portalContent.getElementsByClassName("clsDMHeader")
        let contactTitle = portalContent.getElementsByClassName("clsHeader")
        let contactData = portalContent.getElementsByClassName("contactComms")
        let contactForm = portalContent.getElementsByName("form1")
        let selectedLI = contactList.querySelectorAll("[href='" + "https://ourwoodbridge.net/Member/" + contactForm[0].action.split("/")[5] + "']")
        if (contactTitle.length > 0) { selectedLI[0].innerHTML = contactTitle[0].innerText.trim() + " - " }
        if (contactName.length > 1) { selectedLI[0].appendChild(document.createTextNode(contactName[1].children[0].innerText.trim())) }
        if (contactData.length > 0) {
            let selectedData = contactData[0].getElementsByClassName("contactLabel")
            if (selectedData.length > 0) {
                for (let p = 0; p < selectedData.length; p++) {
                    if (selectedData[p].innerText == "Email" && selectedData[p].nextElementSibling.childElementCount == 2) {
                        selectedLI[0].parentElement.appendChild(document.createTextNode(" " + selectedData[p].nextElementSibling.children[0].innerText.trim()))
                    }
                    if (selectedData[p].innerText == "Work") {
                        selectedLI[0].parentElement.appendChild(document.createTextNode(" " + selectedData[p].nextElementSibling.innerText.trim()))
                    }
                    if (selectedData[p].innerText == "Other") {
                        selectedLI[0].parentElement.appendChild(document.createTextNode(" " + selectedData[p].nextElementSibling.innerText.trim()))
                    }
                }
            }
        }
        localStorage.setItem("pageContacts", contactList.innerHTML.trim())
    },
    getForSaleOrFree: (portalContent) => {
        let classifiedTitle = portalContent.querySelectorAll('.clsBodyText:not(.hidden-md-up,.hidden-sm-down)')
        let classifiedBody = portalContent.getElementsByClassName("clsBodyText hidden-sm-down")
        for (let p = 0; p < 3; p++) {
            if (p < classifiedTitle.length) {
                let ad = document.createElement("li")
                let adTitle = document.createElement("b")

                adTitle.appendChild(document.createTextNode(classifiedTitle[p].getElementsByTagName("a")[0].innerText.trim()))
                ad.appendChild(adTitle)
                ad.appendChild(document.createElement("br"))
                ad.appendChild(document.createTextNode(classifiedBody[p].childNodes[0].nodeValue))
                document.getElementById("recentSales").getElementsByTagName("ul")[0].appendChild(ad)
            }
        } localStorage.setItem("pageSales", document.getElementById("recentSales").getElementsByTagName("ul")[0].innerHTML.trim())
    },
    refreshCheck: () => {
        let checkStatus = (window.performance) ? window.performance.getEntriesByType("navigation")[0].type : "no_data"
        let lastVisit = localStorage.getItem("pageTime")
        let currentDate = new Date()
        let pageDate = (lastVisit !== null) ? new Date(Number(lastVisit)) : currentDate
        let cacheAge = Math.round((currentDate - pageDate) / 60000)

        if (checkStatus == "reload") { cacheAge = 60 }
        if (checkStatus == "navigate" && cacheAge < 2) { cacheAge = 2 }

        return cacheAge
    }
}

let fileMenu = document.getElementsByClassName("menu-sub-group")[1].getElementsByTagName("li")
let contactMenu = document.getElementsByClassName("menu-sub-group")[4].getElementsByTagName("li")
let contactList = document.getElementById("officeContacts").getElementsByTagName("ul")[0]
let filesMenuLink = document.getElementsByClassName("recentFileLink")

woaCode.getPortalData(woaCode.pageLocation("/homepage/28118/resident-home-page"), woaCode.getEmails)
woaCode.getPortalData(woaCode.pageLocation("/Member/28118~" + woaCode.getProfileID()[0]), woaCode.getProfile)
woaCode.getPortalData(woaCode.pageLocation("/Member/Contact/28118~" + woaCode.getProfileID()[0] + "~" + woaCode.getProfileID()[2]), woaCode.getProfile)

for (let f = 0; f < filesMenuLink.length; f++) {
    filesMenuLink[f].href = fileMenu[f].getElementsByTagName("a")[0].href
}
let cachedContacts = localStorage.getItem("pageContacts")
if (cachedContacts !== null && cachedContacts.includes("<li>") && woaCode.refreshCheck() < 30) { contactList.innerHTML = cachedContacts } else {
    for (let p = 0; p < contactMenu.length; p++) {
        let currentContact = woaCode.pageLocation(contactMenu[p].getElementsByTagName("a")[0].href)
        if (currentContact.includes("/Member/28118~")) {
            let currentInfo = document.createElement("li")
            currentInfo.innerHTML = contactMenu[p].innerHTML
            currentInfo.getElementsByTagName("a")[0].className = ""
            contactList.appendChild(currentInfo)
            woaCode.getPortalData(woaCode.pageLocation(contactList.getElementsByTagName("a")[p].href), woaCode.getContacts)

        }
    }
    
}
woaCode.getPortalData(woaCode.pageLocation("/Discussion/28118~8364"), woaCode.getPosts)
woaCode.getPortalData(woaCode.pageLocation("/Discussion/28118~8030"), woaCode.getPosts)
woaCode.getPortalData(woaCode.pageLocation("/Discussion/28118~11315"), woaCode.getPosts)
woaCode.getPortalData(woaCode.pageLocation("/classified/search/28118~480182/classifieds"), woaCode.getForSaleOrFree)
localStorage.setItem("pageTime", new Date().getTime())



//if (dataSource.includes("resourcecenter") && document.getElementById("filesWait").style.display == "none") {
//    let fileArea = document.getElementById("recentFiles").getElementsByTagName("ul")[0]
//    while (fileArea.firstChild) { fileArea.removeChild(fileArea.firstChild) }
//    document.getElementById("filesWait").style.display = ""
//}




/*try {} catch { } */
