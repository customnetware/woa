const woaCode = {
    showTheModal: () => {

        //let emailPopUp = document.getElementById("emailsSaved")
        //while (emailPopUp.firstChild) { emailPopUp.removeChild(emailPopUp.firstChild) }

        //if (savedMessageURL.includes("/Messenger/MessageView/")) {
        //    $("#emailsSaved").load(pageLocation(savedMessageURL) + " div:first", function (responseTxt, statusTxt, xhr) {
        //        if (statusTxt == "error") { emailPopUp.innerHTML = "The requested email was not found on the server.  It may have been deleted or you do not have permission to view it." }
        //    })
        //}
        if (!$("#appPopUp").is(":visible")) { $("#appPopUp").modal("show") }
    },
    pageLocation: (pageName) => {
        return (window.location.hostname == "localhost") ? pageName + ".html" : pageName
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
        return profileID[0]
    },
    getPortalData: (dataSource, dataFunction) => {
        $.get(dataSource)
            .done(function (responseText) {
                let portalContent = new DOMParser().parseFromString(responseText, "text/html")
                dataFunction(portalContent)
            })
    },
    getProfile: (portalContent) => {
        document.getElementById("headerRow").getElementsByTagName("img")[0].src = portalContent.getElementsByTagName("img")[0].src
    },
    getEmails: (portalContent) => {
        document.getElementById("emailWait").remove()
        let recentEmails = portalContent.getElementById("panel_messages_content").getElementsByTagName("a")
        let emailListing = document.getElementById("recentEmails").getElementsByTagName("ul")[0]
        for (let p = 0; p < recentEmails.length; p++) {
            let currentEmail = document.createElement("li")
            let emailHeader = document.createElement("a")
            let emailTitle = recentEmails[p].getAttribute("data-tooltip-title").split("by")[0].split(",")
            emailHeader.href = recentEmails[p].href
            emailHeader.innerHTML = emailTitle[0] + " (" + emailTitle[1].trim() + ")"
            currentEmail.appendChild(emailHeader)
            emailListing.appendChild(currentEmail)
        }
    },
    getFiles: (portalContent) => {
        let fileArray = []
        let fileLink = "https://ourwoodbridge.net/ResourceCenter/Download/28118?doc_id=0000000&print=1&view=1"
        let folderLink = "https://ourwoodbridge.net/ResourceCenter/28118~"
        let docs = portalContent.getElementById("contents540434").querySelectorAll('[id^="d"]')

        for (let i = 0; i < docs.length; i++) {
            let parentId = docs[i].parentElement.parentElement.parentElement.parentElement.id
            let inFolder = portalContent.getElementById(parentId.replace("contents", "f")).innerHTML
            let folderURL = folderLink + parentId.replace("contents", "")
            let fileURL = fileLink.replace("0000000", docs[i].id.replace("d", ""))
            fileArray.push(docs[i].innerHTML + "|" + fileURL + "|" + inFolder + "|" + folderURL)
        }
        document.getElementById("filesWait").remove()
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

        let posts = portalContent.getElementsByClassName("ThreadContainer")[0], forumArray = []
        for (let x = 0; x < posts.childElementCount; x++) {
            let post = posts.children[x]
            let lastDate = new Date(post.getElementsByClassName("respLastReplyDate")[0].innerText.trim().replace("Last Reply: ", ""))

            let topic = post.getElementsByClassName("respDiscTopic")
            let comments = post.getElementsByClassName("respDiscChildPost")
            let posters = post.getElementsByClassName("respAuthorWrapper")
            let contacts = post.getElementsByClassName("respReplyWrapper")
            let dateSort = new Date(lastDate).getTime()
            forumArray.push({
                postSort: dateSort, lastPost: lastDate, subject: topic[0].innerText.trim(), postContent: topic[1].innerText.trim(), postAuthor: posters[0].innerText.trim(),
                postID: contacts[0].getElementsByTagName("a")[0].id, replyLink: contacts[0].getElementsByTagName("a")[0].href, groupName: "General", groupID: "8030",
                numOfPost: comments.length
            })
        }

        if (forumArray.length > 0) {
            if (document.getElementById("postsWait") !== null) { document.getElementById("postsWait").remove() }
            forumArray.sort((a, b) => { return a.postSort - b.postSort })
            forumArray.reverse()
            for (let p = 0; p <= 0; p++) {
                if (p < forumArray.length) {
                    let post = document.createElement("li")
                    let postLink = document.createElement("a")
                    postLink.innerHTML = forumArray[p].subject + " (Comments: " + forumArray[p].numOfPost + ") - " + forumArray[p].postAuthor

                    postLink.href = "javascript:woaCode.showTheModal();"
                    post.appendChild(postLink)
                    //let reply = document.createElement("a")
                    //let view = document.createElement("a")
                    //post.style.marginBottom = "15px"
                    //post.style.paddingLeft = "0px"
                    //post.innerHTML = "<b>" + forumArray[p].subject + " (Comments: " + forumArray[p].numOfPost + ") </b>"
                    //reply.href = forumArray[p].replyLink
                    //reply.innerHTML = forumArray[p].postAuthor + "  | Reply"
                    //view.href = "javascript:woaCode.showComments('" + forumArray[p].postID + "','" + forumArray[p].groupID + "')"
                    //view.innerHTML = " | View Comments"
                    //post.appendChild(document.createElement("br"))
                    //post.appendChild(document.createTextNode(forumArray[p].postContent))
                    //post.appendChild(document.createElement("br"))
                    //post.appendChild(reply)
                    //post.appendChild(view)
                    document.getElementById("recentPosts").getElementsByTagName("ul")[0].appendChild(post)
                }
            }
        }
    },
}
woaCode.getPortalData(woaCode.pageLocation("/Member/28118~" + woaCode.getProfileID()), woaCode.getProfile)
woaCode.getPortalData(woaCode.pageLocation("/homepage/28118/resident-home-page"), woaCode.getEmails)
woaCode.getPortalData(woaCode.pageLocation("/resourcecenter/28118/resource-center"), woaCode.getFiles)
woaCode.getPortalData(woaCode.pageLocation("/Discussion/28118~8364"), woaCode.getPosts)
woaCode.getPortalData(woaCode.pageLocation("/Discussion/28118~8030"), woaCode.getPosts)
woaCode.getPortalData(woaCode.pageLocation("/Discussion/28118~11315"), woaCode.getPosts)


