const woaCode = {
    isLocal: (window.location.hostname == "localhost") ? ".html" : "",
    addHTML: () => {
        let divIDs = ["recentFiles", "recentEmails", "recentPosts"]
        let divTitles = ["Recent Documents", "Recent Association Emails", "Recent Comments"]
        let woaPageContent = document.getElementsByClassName("clsBodyText")[0]
        let woaContainer = document.createElement("div")
        let woaHeaderRow = document.createElement("div")
        let woaHeaderGreeting = document.createElement("div")
        let woaHeaderImg = document.createElement("img")
        let woaHeaderTxt = document.createElement("span")

        woaContainer.id = "customContainer"
        woaContainer.className = "container"
        woaHeaderRow.id = "woaHeaderRow"
        woaHeaderGreeting.className = "notifyHeader"
        woaHeaderGreeting.paddingBottom = "50px"

        woaHeaderRow.appendChild(woaHeaderGreeting)
        woaHeaderRow.appendChild(woaHeaderImg)
        woaHeaderRow.appendChild(woaHeaderTxt)
        woaContainer.appendChild(woaHeaderRow)


        for (let p = 0; p < divIDs.length; p++) {
            let notificationDiv = document.createElement("div")
            let notificationHdr = document.createElement("span")

            notificationDiv.id = divIDs[p]
            notificationHdr.className = "notifyHeader"
            notificationHdr.innerText = divTitles[p]
            notificationDiv.appendChild(notificationHdr)
            woaContainer.appendChild(notificationDiv)
        }

        woaPageContent.appendChild(woaContainer)

    },
    getProfile: () => {
        let timeNow = new Date().getHours()
        let greeting = timeNow >= 5 && timeNow < 12 ? "Good Morning" : timeNow >= 12 && timeNow < 18 ? "Good Afternoon" : "Good Evening"
        let profileID = /\(([^)]+)\)/.exec(document.getElementById("HeaderPublishAuthProfile").href)[1].split(",")
        let imageFile = $.get("/Member/28118~" + profileID[0] + woaCode.isLocal, function () { })
        let textFile = $.get("/news/28118~792554" + woaCode.isLocal, function () { })
        let nameFile = $.get("/Member/Contact/28118~" + profileID[0] + "~" + profileID[2] + woaCode.isLocal, function () { })
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
        $.get("/homepage/28118/resident-home-page" + woaCode.isLocal, function () { })
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
        $.get("/resourcecenter/28118/resource-center" + woaCode.isLocal, function () { })
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
                    currentFldr.href = "https://ourwoodbridge.net/ResourceCenter/28118~" + fileFolderID.replace("contents", "")
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
}
woaCode.addHTML()
woaCode.getProfile()
woaCode.getDiscussionGroups()
woaCode.getEmails()
woaCode.getFiles("540434")
woaCode.getFiles("328201")
woaCode.getFiles("951754")
