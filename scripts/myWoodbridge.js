



const woaCode = {
    addFolderLinks: () => {
        let fileMenu = document.getElementById("mobile-menu-publish-links").getElementsByClassName("menu-item has-sub")
        for (x = 0; x < fileMenu[1].getElementsByTagName("ul")[0].childElementCount; x++) {
            let menuName = fileMenu[1].getElementsByTagName("ul")[0].children[x].children[0].innerText
            let menuID = fileMenu[1].getElementsByTagName("ul")[0].children[x].children[0].href.split("/")
            if (menuName.includes("Flyers") || menuName.includes("Board Meeting") || menuName.includes("Newsletter") || menuName.includes("Step")) {
                let selectOption = document.createElement("option")
                selectOption.value = menuID[menuID.length - 2].replace("28118~", "")
                selectOption.text = menuName
                if (x == 1) { selectOption.selected = true }
                document.getElementById("selectedFolder").appendChild(selectOption)
            }
        }
        let savedFolder = localStorage.getItem("savedFolder")
        if (savedFolder !== null && savedFolder !== "0") { document.getElementById("selectedFolder").value = savedFolder }
    },
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
    refreshCheck: () => {
        let checkStatus = (window.performance) ? window.performance.getEntriesByType("navigation")[0].type : "no_data"
        let lastVisit = localStorage.getItem("pageTime")
        let currentDate = new Date()
        let pageDate = (lastVisit !== null) ? new Date(Number(lastVisit)) : currentDate
        let cacheAge = Math.round((currentDate - pageDate) / 60000)
        let pageUpdate = {
            pageAge: cacheAge,
            pageStatus: checkStatus,
        }
        if (checkStatus === "navigate") { localStorage.setItem("pageTime", new Date().getTime()) }
        return pageUpdate
    },
    getDataFromParen: (pageHref) => {
        let parenData = /\(([^)]+)\)/.exec(pageHref)[1].split(",")
        return parenData
    },
    getProfile: () => {
        let currentHour = new Date().getHours()
        let greeting = (currentHour < 12) ? "Good Morning, " : (currentHour >= 12 && currentHour <= 18) ? "Good Afternoon, " : "Good Evening, "
        let grp1 = $.get(woaCode.pageLocation("/Member/28118~" + woaCode.getDataFromParen(document.getElementById("HeaderPublishAuthProfile").href)[0]))
        let grp2 = $.get(woaCode.pageLocation("/Member/Contact/28118~" + woaCode.getDataFromParen(document.getElementById("HeaderPublishAuthProfile").href)[0] + "~" + woaCode.getDataFromParen(document.getElementById("HeaderPublishAuthProfile").href)[2]))
        $.when(grp1, grp2).done(function (responseText1, responseText2) {
            let imageFile = new DOMParser().parseFromString(responseText1, "text/html")
            let nameFile = new DOMParser().parseFromString(responseText2, "text/html")
            let portalImage = imageFile.getElementsByClassName("mt-1")
            let firstName = nameFile.getElementsByName("fname"), lastName = nameFile.getElementsByName("lname")
            if (portalImage.length > 0) {
                if (portalImage[0].src.endsWith(".png") || portalImage[0].src.endsWith(".gif") || portalImage[0].src.endsWith(".jpg") || portalImage[0].src.endsWith(".jpeg")) {
                    document.getElementById("headerRow").getElementsByTagName("img")[0].src = portalImage[0].src
                }
            }
            if (firstName.length > 0) {
                greeting = greeting.concat(firstName[0].value + " " + lastName[0].value)
                document.getElementById("headerRow").insertBefore(document.createTextNode(greeting + ".  "), document.getElementById("headerRow").firstChild)
                localStorage.setItem("userName", firstName[0].value + " " + lastName[0].value)
            }
            localStorage.setItem("userImage", document.getElementById("headerRow").getElementsByTagName("img")[0].src)
        })
    },
    getEmails: () => {
        let emailListing = document.getElementById("recentEmails").getElementsByTagName("ul")[0]
        let storedEmails = localStorage.getItem("pageEmails")
        let pageRefresh = woaCode.refreshCheck()

        $.get(woaCode.pageLocation("/homepage/28118/resident-home-page"))
            .done(function (emailsFromPortal) {
                document.getElementById("emailWait").style.display = "none"
                let portalContent = new DOMParser().parseFromString(emailsFromPortal, "text/html")
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
            })

    },
    getFiles: (selectedFolder, previousFolder, previousFolderName) => {
        document.getElementById("document").innerHTML = ""
        const fileLocation = (window.location.hostname == "localhost") ? "/resourcecenter/28118/resource-center.html" : "/resourcecenter/28118/resource-center"

        localStorage.setItem("savedFolder", document.getElementById("selectedFolder").value)
        let waitRow = document.createElement("div"), waitIcon = document.createElement("span")
        waitIcon.className = "fa fa-refresh fa-fw fa-spin"
        waitRow.append(waitIcon, "  The requested folders and files are loading...")
        document.getElementById("document").appendChild(waitRow)


        //let currentScreen = localStorage.getItem(selectedFolder)
        //if (currentScreen !== null) {
        //    let fileListing = JSON.parse(currentScreen)
        //    document.getElementById("document").innerHTML = ""
        //    for (let p = 0; p < fileListing.length; p++) {
        //        let currentFile = document.createElement("span")
        //        currentFile.innerHTML = fileListing[p]
        //        document.getElementById("document").appendChild(currentFile)
        //    }
        //} else {}
        $.get(fileLocation, function () { })
            .done(function (responseText) {
                document.getElementById("document").innerHTML = ""
                let documents = new DOMParser().parseFromString(responseText, "text/html"), sortScreens = []

                if (previousFolderName == "Recent Folder Files") {
                    let docs = documents.getElementById("contents" + selectedFolder).querySelectorAll('[id^="d"]'), fileArray = []
                    if (docs.length > 0) { for (let i = 0; i < docs.length; i++) { fileArray.push(docs[i].id) } }
                    fileArray.sort()
                    let folderSelected = documents.getElementById(fileArray[fileArray.length - 1]).parentElement.parentElement.parentElement.parentElement.id
                    previousFolderName = documents.getElementById(folderSelected.replace("contents", "f")).innerText
                    selectedFolder = folderSelected.replace("contents", "")
                }

                if (previousFolderName == "Recent Files") { selectedFolder = document.getElementById("selectedFolder").value } else { document.getElementById("selectedFolder").value = 0 }
                let currentDiv = (selectedFolder == "000000") ? documents.querySelector(".clsTree") : documents.getElementById("contents" + selectedFolder).querySelectorAll(":scope > div")[1]
                documentList = currentDiv.querySelectorAll(":scope > div")

                if (selectedFolder !== "000000") {
                    let folderId = currentDiv.parentElement.parentElement.parentElement.parentElement.id, pfName = ""
                    if (folderId == "contentInner") { previousFolder = "000000" }
                    else {
                        previousFolder = folderId.replace("contents", ""), pfName = documents.getElementById("f" + previousFolder).innerText
                    }
                    if (previousFolderName == "Recent Files") { previousFolderName = documents.getElementById("f" + document.getElementById("selectedFolder").value).innerText }
                    let docRow = document.createElement("div"), docLink = document.createElement("span"), docIcon1 = document.createElement("span")
                    let docIcon2 = document.createElement("a"), docIcon2a = document.createElement("span"), docIcon2b = document.createElement("span"), docIcon2c = document.createElement("a")

                    docLink.innerHTML = previousFolderName
                    docIcon2.href = "javascript:woaCode.getFiles('" + previousFolder + "','000000','" + pfName + "')"
                    docIcon1.className = "fa fa-folder-open-o formatIcon"
                    docIcon2a.className = "fa fa-arrow-up"
                    docIcon2b.className = "fa fa-list navIcon"
                    docIcon2c.className = "fa fa-search navIcon"
                    docIcon2c.href = "javascript:woaCode.getFiles('" + selectedFolder + "','000000','Recent Folder Files');"
                    docIcon2.append(docIcon2b, docIcon2a)
                    docRow.append(docIcon1, docLink, docIcon2)
                    document.getElementById("document").appendChild(docRow)
                }
                for (let d = 0; d < documentList.length; d++) {
                    let docRow = document.createElement("div")
                    let docLink = document.createElement("a")
                    let docIcon = document.createElement("i")
                    let remoteDoc = documentList[d].getElementsByTagName("span")[0]
                    let isFolder = remoteDoc.id.startsWith("f")
                    let localDocID = remoteDoc.id.replace("f", "").replace("d", "")
                    docLink.innerHTML = remoteDoc.innerText
                    if (isFolder == true) {
                        docIcon.className = "fa fa-folder-o formatIcon"
                        docLink.href = "javascript:woaCode.getFiles('" + localDocID + "','" + selectedFolder + "','" + remoteDoc.innerText + "');"
                    } else {
                        docIcon.className = "fa fa-file-pdf-o formatIcon"
                        docLink.href = documents.getElementById("contentsDoc" + localDocID).getElementsByTagName("a")[2].href
                        docRow.id = documents.getElementById("contentsDoc" + localDocID).id
                    }


                    docRow.appendChild(docIcon)
                    docRow.appendChild(docLink)
                    if (isFolder === true) { document.getElementById("document").appendChild(docRow) }
                    if (isFolder === false) { sortScreens.push({ rowID: docRow.id, rowText: docLink.innerHTML, rowContent: docRow.innerHTML }) }
                }
                //let screenToSave = []
                //let currentScreen = document.getElementById("document").getElementsByTagName("span")
                //for (let h = 0; h < currentScreen.length; h++) { screenToSave.push(currentScreen[h].innerHTML) }
                //let saveFileList = JSON.stringify(screenToSave)
                //localStorage.setItem(selectedFolder, saveFileList)
                if (selectedFolder !== "000000") { woaCode.screenSort(sortScreens) }
            })

    },
    getPosts: () => {
        document.getElementById("postsWait").style.display = ""
        document.getElementById("recentPosts").getElementsByTagName("ul")[0].innerHTML = ""
        let groups = ["8364", "8030", "11315", "000000"], forumArray = []
        function getPortalPosts() {
            let currentDate = new Date()
            let numOfDays = localStorage.getItem("customDiff") ?? 31
            document.getElementById("historyDays").innerHTML = numOfDays
            if (groups.length > 0) {
                let groupID = groups.shift()
                if (groupID == "000000") { showPosts(); return }
                let groupURL = woaCode.pageLocation("/Discussion/28118~" + groupID)
                $.get(groupURL)
                    .done(function (groupsFromPortal) {
                        let portalContent = new DOMParser().parseFromString(groupsFromPortal, "text/html")
                        let groupPageLink = portalContent.getElementById("lnkAddTopic")
                        let forumID = woaCode.getDataFromParen(groupPageLink.href)
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

                            if (dayDiff <= numOfDays) {
                                forumArray.push({
                                    postSort: dateSort, lastPost: lastDate, subject: topic[0].innerText.trim(), postContent: topic[1].innerHTML.trim(), postAuthor: posters[0].innerText.trim(),
                                    postID: contacts[0].getElementsByTagName("a")[0].id, replyLink: contacts[0].getElementsByTagName("a")[0].href, groupName: groupPageLink.innerText,
                                    groupID: forumID[1].replaceAll("'", ""), numOfPost: comments.length
                                })
                            }
                        }
                    })
            }
        }

        function showPosts() {
            document.getElementById("postsWait").style.display = "none"
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
    getForSaleOrFree: () => {
        $.get(woaCode.pageLocation("/classified/search/28118~480182/classifieds"))
            .done(function (itemsFromPortal) {
                let portalContent = new DOMParser().parseFromString(itemsFromPortal, "text/html")
                let classifiedTitle = portalContent.querySelectorAll('.clsBodyText:not(.hidden-md-up,.hidden-sm-down)')
                let classifiedBody = portalContent.getElementsByClassName("clsBodyText hidden-sm-down")
                for (let p = 0; p < 3; p++) {
                    if (p < classifiedTitle.length) {
                        let ad = document.createElement("li")
                        let adTitle = document.createElement("b")
                        adTitle.appendChild(document.createTextNode(classifiedTitle[p].getElementsByTagName("a")[0].innerText.trim()))
                        ad.appendChild(adTitle)
                        ad.appendChild(document.createElement("br"))


                        let adContent = document.createElement("span")
                        adContent.innerHTML = classifiedBody[p].childNodes[0].nodeValue
                        ad.appendChild(adContent)
                        /*ad.appendChild(document.createTextNode(classifiedBody[p].childNodes[0].nodeValue))*/

                        document.getElementById("recentSales").getElementsByTagName("ul")[0].appendChild(ad)
                    }
                } localStorage.setItem("pageSales", document.getElementById("recentSales").getElementsByTagName("ul")[0].innerHTML.trim())
            })
    },
    showEmail: (savedMessageURL) => {
        let commentArea = document.getElementById("appDialogBody")
        while (commentArea.firstChild) { commentArea.removeChild(commentArea.firstChild) }
        document.getElementById("appDialogLabel").innerText = ""
        document.getElementById("replyButton").style.display = "none"

        if (savedMessageURL.includes("/Messenger/MessageView/")) {
            $("#appDialogBody").load(woaCode.pageLocation(savedMessageURL) + " div:first", function (responseTxt, statusTxt, xhr) {
                if (statusTxt == "error") {
                    $("#appDialogBody").html("The requested email was not found on the server.It may have been deleted or you do not have permission to view it.")
                }
                if (statusTxt == "success") {
                    let fxw = document.getElementById("appDialogBody").getElementsByClassName("clsBodyText")
                    if (fxw.length > 0) {
                        fxw[0].style = ""
                        fxw[0].getElementsByTagName("td")[0].style = ""
                    }

                }
            })

        }
        if (!$("#appDialog").is(":visible")) { $("#appDialog").modal("show") }
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
                commentSpan.innerHTML = topic[0].innerHTML.trim() + "<br />" + replyAuthor[0].innerText + "<hr />"
                document.getElementById("appDialog").getElementsByClassName("modal-title")[0].innerHTML = title.innerText
                document.getElementById("replyButton").setAttribute("onclick", forum.getElementById(selectedPostID).href)
                commentArea.appendChild(commentSpan)
                for (let p = 0; p < replyText.length; p++) {
                    let replySpan = document.createElement("span")
                    let authorSpan = document.createElement("span")
                    replySpan.className = "commentSpan"
                    authorSpan.className = "commentSpan"
                    replySpan.innerHTML = replyText[p].innerHTML.trim() + "<br />"
                    authorSpan.innerHTML = replyAuthor[p + 1].innerText.trim() + "<hr />"
                    commentArea.appendChild(replySpan)
                    commentArea.appendChild(authorSpan)
                }
                document.getElementById("replyButton").style.display = ""
                if (!$("#appDialog").is(":visible")) { $("#appDialog").modal("show") }
            })
    },
    showPostHistory: () => {
        let lsNumber = localStorage.getItem("customDiff") ?? 0
        let currentHistory = Number(lsNumber)
        currentHistory = (currentHistory == 365) ? 31 : (currentHistory > 360) ? 365 : currentHistory + 30
        document.getElementById("historyDays").innerText = currentHistory
        localStorage.setItem("customDiff", currentHistory)
        woaCode.getPosts()
    },
    screenSort: (screenToSort) => {
        let screens = document.getElementById("document")

        screenToSort.sort((a, b) => {
            const sortCriteraA = (screens.children[0].innerText == "Step Sheets") ? a.rowID.toString() : a.rowText
            const sortCriteraB = (screens.children[0].innerText == "Step Sheets") ? b.rowID.toString() : b.rowText
            if (sortCriteraA < sortCriteraB) { return -1 }
            if (sortCriteraA > sortCriteraB) { return 1 }
            return 0
        })
        if (screens.children[0].innerText !== "Flyers (Events or Activities)") { screenToSort.reverse() }
        for (let s = 0; s < screenToSort.length && s < 5; s++) {

            let newRow = document.createElement("div")
            newRow.id = screenToSort[s].rowID
            newRow.innerHTML = screenToSort[s].rowContent
            screens.appendChild(newRow)
        }
    },
    getCloudflare: () => {
        const xhr = new XMLHttpRequest()
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                woaCode.parseCloudflare(this.responseText)
            }
        })
        xhr.open("GET", "https://d1-customnetware.customnetware.workers.dev/api/customnetware/" + woaCode.getDataFromParen(document.getElementById("HeaderPublishAuthProfile").href)[2])
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.send()

    },
    parseCloudflare: (parseData) => {
        if (parseData.length > 0) {
            let newObject = JSON.parse(parseData)


            console.log(newObject.success)
        }
    }
}
woaCode.addFolderLinks()
woaCode.getEmails()
woaCode.getContacts()
woaCode.getPosts()
woaCode.getProfile()
woaCode.getForSaleOrFree()
woaCode.getFiles('000000', '000000', 'Recent Files')
/*woaCode.getCloudflare()*/







