
const woaCode = {
    pageLocation: (pageName) => {
        return (window.location.hostname == "localhost") ? pageName.replace("https://ourwoodbridge.net", "") + ".html" : pageName
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
        if (dataSource.includes("resourcecenter")) { dataFunction(""); return }
        if (dataSource.includes("resident-home-page") && woaCode.refreshCheck() < 10) {
            let cachedEmails = localStorage.getItem("pageEmails")
            if (cachedEmails !== null && cachedEmails.includes("<li>")) {
                dataFunction(cachedEmails)
                return
            }
        }
        if (dataSource.includes("classifieds") && woaCode.refreshCheck() < 30) {
            let cachedAds = localStorage.getItem("pageSales")
            if (cachedAds !== null && cachedAds.includes("<li>")) {
                dataFunction(cachedAds)
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
            .fail(function () {
                let errorContent = new DOMParser().parseFromString("<div id='failMessage'>The requested file was not found on this server!</div>", "text/html")
                dataFunction(errorContent)
            })
    },
    getProfile: (portalContent) => {
        let currentHour = new Date().getHours()
        let greeting = (currentHour < 12) ? "Good Morning, " : (currentHour >= 12 && currentHour <= 18) ? "Good Afternoon, " : "Good Evening, "
        let portalImage = portalContent.getElementsByClassName("mt-1")
        if (portalImage.length > 0) {
            if (portalImage[0].src.endsWith(".png") || portalImage[0].src.endsWith(".gif") || portalImage[0].src.endsWith(".jpg") || portalImage[0].src.endsWith(".jpeg")) {
                document.getElementById("headerRow").getElementsByTagName("img")[0].src = portalImage[0].src
            }

        } else {
            let firstName = portalContent.getElementsByName("fname")
            let lastName = portalContent.getElementsByName("lname")
            if (firstName.length > 0) {
                greeting = greeting.concat(firstName[0].value + " " + lastName[0].value)
                document.getElementById("headerRow").insertBefore(document.createTextNode(greeting + ".  "), document.getElementById("headerRow").firstChild)
                localStorage.setItem("userName", firstName[0].value + " " + lastName[0].value)
            }
        }
        localStorage.setItem("userImage", document.getElementById("headerRow").getElementsByTagName("img")[0].src)

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
    getFiles: (portalContent) => {
        let fileMenu = document.getElementById("mobile-menu-publish-links").children[1].getElementsByTagName("ul")[0].children
        let filesMenuLink = document.getElementsByClassName("recentFileLink")
        for (let f = 0; f < filesMenuLink.length; f++) {
            filesMenuLink[f].href = fileMenu[f].getElementsByTagName("a")[0].href
        } return
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
    getPosts: () => {
        let groups = ["8364", "8030", "11315", "000000"], forumArray = []
        function getPortalPosts() {
            let numOfDays = localStorage.getItem("customDiff"), currentDate = new Date()
            numOfDays = (numOfDays == null) ? 32 : numOfDays, historySlider.value = numOfDays
            sliderDays.innerHTML = historySlider.value

            if (groups.length > 0) {
                let groupID = groups.shift()
                if (groupID == "000000") { showPosts(); return }
                let groupURL = woaCode.pageLocation("/Discussion/28118~" + groupID)
                $.get(groupURL)
                    .done(function (groupsFromPortal) {
                        let portalContent = new DOMParser().parseFromString(groupsFromPortal, "text/html")
                        let groupPageLink = portalContent.getElementById("lnkAddTopic")
                        let forumID = /\(([^)]+)\)/.exec(groupPageLink.href)[1].split(",")
                        let posts = portalContent.getElementsByClassName("ThreadContainer")[0]

                        getPortalPosts()
                        for (let x = 0; x < posts.childElementCount; x++) {
                            let post = posts.children[x]
                            let lastDate = new Date(post.getElementsByClassName("respLastReplyDate")[0].innerText.trim().replace("Last Reply: ", ""))

                            let dayDiff = (currentDate - lastDate) / (1000 * 3600 * 24)

                            let topic = post.getElementsByClassName("respDiscTopic")
                            let comments = post.getElementsByClassName("respDiscChildPost")
                            let posters = post.getElementsByClassName("respAuthorWrapper")
                            let contacts = post.getElementsByClassName("respReplyWrapper")
                            let dateSort = new Date(lastDate).getTime()

                            if (dayDiff < numOfDays) {

                                forumArray.push({
                                    postSort: dateSort, lastPost: lastDate, subject: topic[0].innerText.trim(), postContent: topic[1].innerText.trim(), postAuthor: posters[0].innerText.trim(),
                                    postID: contacts[0].getElementsByTagName("a")[0].id, replyLink: contacts[0].getElementsByTagName("a")[0].href, groupName: groupPageLink.innerText,
                                    groupID: forumID[1].replaceAll("'", ""), numOfPost: comments.length
                                })
                            }
                        }
                    })
            }
        }

        function showPosts() {
            document.getElementById("recentPosts").getElementsByTagName("ul")[0].innerHTML = ""
            if (document.getElementById("postsWait") !== null) { document.getElementById("postsWait").remove() }
            if (forumArray.length > 0) {
                forumArray.sort((a, b) => { return a.postSort - b.postSort })
                forumArray.reverse()
                for (let p = 0; p < forumArray.length; p++) {
                    let post = document.createElement("li")
                    let postLink = document.createElement("a")
                    postLink.innerHTML = forumArray[p].subject + " (Comments: " + forumArray[p].numOfPost + ") - " + forumArray[p].postAuthor
                    postLink.href = "javascript:woaCode.showComments('" + forumArray[p].postID + "','" + forumArray[p].groupID + "')"
                    post.appendChild(postLink)
                    document.getElementById("recentPosts").getElementsByTagName("ul")[0].appendChild(post)
                }
                localStorage.setItem("pagePosts", document.getElementById("recentPosts").getElementsByTagName("ul")[0].innerHTML.trim())
            }
        }

        getPortalPosts()

    },
    showComments: (selectedPostID, groupID) => {
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
    getContacts: () => {
        let contacts = []
        let contactMenu = document.getElementById("mobile-menu-publish-links").children[3].getElementsByTagName("ul")[0].children
        for (let c = 0; c < contactMenu.length; c++) {
            contacts.push(woaCode.pageLocation(contactMenu[c].getElementsByTagName("a")[0].href))
        }
        function showContacts(contacts) {
            if (contacts.length > 0) {
                let contactUrl = contacts.shift()
                if (contactUrl.includes("/Member/28118~")) {
                    $.get(contactUrl)
                        .done(function (contactsFromPortal) {
                            let portalContent = new DOMParser().parseFromString(contactsFromPortal, "text/html")
                            let contactList = document.getElementById("officeContacts").getElementsByTagName("ul")[0]
                            let contactCard = document.createElement("li")
                            let contactLink = document.createElement("a")
                            let contactNames = portalContent.getElementsByClassName("clsDMHeader")
                            let contactTitles = portalContent.getElementsByClassName("clsHeader")
                            let contactData = portalContent.getElementsByClassName("contactComms")
                            let contactName = (contactNames.length > 1) ? contactNames[1].children[0].innerText.trim().replace(/\s\s+/g, ' ') : ""
                            let contactTitle = (contactTitles.length > 0) ? contactTitles[0].innerText.trim().replace(/\s\s+/g, ' ') : ""

                            contactCard.appendChild(contactLink)
                            contactList.appendChild(contactCard)
                            contactLink.href = contactUrl
                            contactLink.innerHTML = contactName + " - " + contactTitle


                            if (contactData.length > 0) {
                                let selectedData = contactData[0].getElementsByClassName("contactLabel")
                                if (selectedData.length > 0) {
                                    for (let p = 0; p < selectedData.length; p++) {
                                        if (selectedData[p].innerText == "Email" && selectedData[p].nextElementSibling.childElementCount == 2) {
                                            contactCard.appendChild(document.createTextNode(" " + selectedData[p].nextElementSibling.children[0].innerText.trim()))
                                        }
                                        if (selectedData[p].innerText == "Work") {
                                            contactCard.appendChild(document.createTextNode(" " + selectedData[p].nextElementSibling.innerText.trim()))
                                        }
                                        if (selectedData[p].innerText == "Other") {
                                            contactCard.appendChild(document.createTextNode(" " + selectedData[p].nextElementSibling.innerText.trim()))
                                        }
                                    }
                                }
                            }
                            localStorage.setItem("pageContacts", document.getElementById("officeContacts").getElementsByTagName("ul")[0].innerHTML.trim())
                            showContacts(contacts)
                        })
                        .fail(function () {

                            showContacts(contacts)
                        })
                        .always(function () { })
                }
            }
        }

        showContacts(contacts)

    },
    getForSaleOrFree: (portalContent) => {
        let contentType = typeof portalContent
        if (contentType == "object") {
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
        } else { document.getElementById("recentSales").getElementsByTagName("ul")[0].innerHTML = portalContent }
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
    },
}
localStorage.setItem("pageTime", new Date().getTime())
let historySlider = document.getElementById("postRange"), sliderDays = document.getElementById("historyDays")
historySlider.oninput = function () { sliderDays.innerHTML = this.value }
historySlider.onmouseup = function () {
    localStorage.setItem("customDiff", this.value)
    woaCode.getPosts()
}
woaCode.getContacts()
woaCode.getPosts()
woaCode.getPortalData(woaCode.pageLocation("/resourcecenter/28118/resource-center"), woaCode.getFiles)
woaCode.getPortalData(woaCode.pageLocation("/Member/28118~" + woaCode.getProfileID()[0]), woaCode.getProfile)
woaCode.getPortalData(woaCode.pageLocation("/Member/Contact/28118~" + woaCode.getProfileID()[0] + "~" + woaCode.getProfileID()[2]), woaCode.getProfile)
woaCode.getPortalData(woaCode.pageLocation("/homepage/28118/resident-home-page"), woaCode.getEmails)
woaCode.getPortalData(woaCode.pageLocation("/classified/search/28118~480182/classifieds"), woaCode.getForSaleOrFree)


//if (dataSource.includes("resourcecenter") && document.getElementById("filesWait").style.display == "none") {
//    let fileArea = document.getElementById("recentFiles").getElementsByTagName("ul")[0]
//    while (fileArea.firstChild) { fileArea.removeChild(fileArea.firstChild) }
//    document.getElementById("filesWait").style.display = ""


