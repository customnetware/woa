

function showPopUp(popUpType) {
    let localText = "This will open a form to post to the " + popUpType + " discussion group."
    if (popUpType == "webHelp") {
        $.get(pageLocation("/news/28118~796584/my-woodbridge-page-help"), function () { })
            .done(function (responseText) {
                let helpText = new DOMParser().parseFromString(responseText, "text/html")
                document.getElementById("appPopUpLabel").innerHTML = "My Woodbridge Page Help"
                document.getElementById("popUpBody").innerHTML = helpText.getElementById("contentInner").children[2].innerHTML
            })
        if (!$("#appPopUp").is(":visible")) { $("#appPopUp").modal("show") }
    }
    //if (popUpType == "general") { (window.location.hostname == "localhost") ? alert(localText) : AV.EditorLauncher.discussionTopic('', '8364', '20703', 'new', 'New Topic', 'lnkAddTopic') }
    //if (popUpType == "recommendations") { (window.location.hostname == "localhost") ? alert(localText) : AV.EditorLauncher.discussionTopic('', '8030', '19301', 'new', 'New Topic', 'lnkAddTopic') }
}
function pageLocation(URLString) {
    return (window.location.hostname == "localhost") ? URLString + ".html" : URLString
}
function getResidentHomePage() {
    $.get(pageLocation("/homepage/28118/resident-home-page"), function () { })
        .done(function (responseText) {
            let myWoodbridge = new DOMParser().parseFromString(responseText, "text/html")
            document.getElementById("profileHeader").getElementsByTagName("a")[0].className = "fa fa-check-circle fa-lg"
            document.getElementById("profileHeader").getElementsByTagName("span")[0].innerHTML = myWoodbridge.getElementsByClassName("clsHeader")[0].innerHTML
            let recentItems = myWoodbridge.getElementsByClassName("message")
            for (let p = 0; p < recentItems.length; p++) { getMessage(recentItems[p].getElementsByTagName("a")[0], p) }
            showPhotos(myWoodbridge)
        })
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

    $.get(pageLocation("news/list/28118/news-announcements"), function () { })
        .done(function (responseText) {
            let newsArticles = new DOMParser().parseFromString(responseText, "text/html")
            let articleTitle = newsArticles.getElementsByClassName("clsHeader")
            let articleContent = newsArticles.getElementsByClassName("clsBodyText")
            for (let p = 0; p < 3; p++) {
                if (p < articleTitle.length) {
                    document.getElementById("recentNews").getElementsByClassName("card-header")[p].style.display = "block"
                    document.getElementById("recentNews").getElementsByClassName("card-title")[p].innerText = articleTitle[p].innerText
                    document.getElementById("recentNews").getElementsByClassName("card-body")[p].getElementsByTagName("span")[0].innerHTML = articleContent[p].innerHTML
                }
            }
        })
}
function showComments(selectedPostID, groupID) {
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
                document.getElementById("popUpBody").appendChild(replySpan)
                document.getElementById("popUpBody").appendChild(authorSpan)
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
        let testArray = [responseText1, responseText2, responseText3]
        for (let f = 0; f < testArray.length; f++) {
            let forum = new DOMParser().parseFromString(testArray[f], "text/html")
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
    let profileImg = document.createElement("img")
    let profileID = /\(([^)]+)\)/.exec(document.getElementById("HeaderPublishAuthProfile").href)[1].split(",")[0]
    let grp1 = $.get(pageLocation("/news/28118~792554/webmaster-only"), function () { })
    let grp2 = $.get(pageLocation("/Member/28118~" + profileID), function () { })
    let grp3 = $.get(pageLocation("/news/28118~795372/lakeview-clubhouse-and-office-hours"), function () { })
    $.when(grp1, grp2, grp3).done(function (responseText1, responseText2, responseText3) {
        let userContent = new DOMParser().parseFromString(responseText1, "text/html")
        let imageFile = new DOMParser().parseFromString(responseText2, "text/html")
        let officeHours = new DOMParser().parseFromString(responseText3, "text/html")

        document.getElementById("userProfile").innerHTML = userContent.getElementById("contentInner").children[2].innerHTML

        profileImg.src = imageFile.getElementsByTagName("img")[0].src
        document.getElementById("userProfile").insertBefore(profileImg, document.getElementById("userProfile").firstChild)

        document.getElementById("card-hours").innerHTML = officeHours.getElementById("contentInner").children[2].innerHTML
    })
}
function getResourceCenter() {
    let resourceFolder = [{ pageID: "docCard", folderID: "540434" }, { pageID: "newsCard", folderID: "951754" }]
    $.get(pageLocation("/resourcecenter/28118/resource-center"), function () { })
        .done(function (responseText) {
            let documents = new DOMParser().parseFromString(responseText, "text/html")
            for (let f = 0; f < resourceFolder.length; f++) {
                if (documents.getElementById("contents" + resourceFolder[f].folderID) !== null) {
                    let documentName = documents.getElementById("contents" + resourceFolder[f].folderID).querySelectorAll("[id^=d]")
                    let documentLink = documents.getElementById("contents" + resourceFolder[f].folderID).querySelectorAll('a[title="View On-line"]')
                    for (p = documentName.length - 1; p >= 0; p--) {

                        let selectedDoc = document.createElement("a")
                        selectedDoc.innerHTML = documentName[p].innerHTML
                        selectedDoc.href = documentLink[p].href

                        document.getElementById(resourceFolder[f].pageID).getElementsByTagName("span")[0].appendChild(selectedDoc)
                        if (resourceFolder[f].pageID == "newsCard" && document.getElementById(resourceFolder[f].pageID).getElementsByTagName("span")[0].children.length > 5) { break }
                    }
                }
            }
        })
}
function showPhotos(galleryPage) {
    let newPicList = document.getElementById("photoList").getElementsByTagName("div")
    let photoList = galleryPage.querySelectorAll("[id^=gallery_link_]")
    let galleryLink = galleryPage.querySelectorAll("[class^=gallery_txt_sub]")
    let galleryText = galleryPage.getElementsByClassName("left")
    for (let k = 0; k < photoList.length; k++) {
        newPicList[k].getElementsByTagName("img")[0].src = photoList[k].src
        newPicList[k].getElementsByTagName("span")[0].innerText = galleryText[k].innerText.replace(".jpg", "")
        newPicList[k].getElementsByTagName("a")[0].href = galleryLink[k].getElementsByTagName("a")[0].href
    }
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
    let contactArray = ["10544936", "10551971", "10831154", "8108389", "10566484", "10854040"]
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
                let contactData = contactCards[c].getElementsByClassName("contactData")

                if (contactTitle.length > 0) { contactList[c + 1].children[1].innerHTML = "<a href='" + pageLocation("/Member/28118~" + contactArray[c]) + "'>" + contactTitle[0].innerText.trim() + "</a>" }
                if (contactName.length > 1) { contactList[c + 1].children[0].innerHTML = "<a href='" + pageLocation("/Member/28118~" + contactArray[c]) + "'>" + contactName[1].children[0].innerText.trim() + "</a>" }

                if (contactData.length > 1) {
                    contactList[c + 1].children[2].innerText = (contactData.length !== 3) ? contactData[1].innerText.trim() : contactData[1].innerText.trim() + " " + contactData[2].innerText.trim()
                    contactList[c + 1].children[3].innerHTML = "<a href='mailto:" + contactData[0].children[0].innerText.trim() + "'>" + contactData[0].children[0].innerText.trim() + "</a>"
                }
            }
        })
}
$(window).load(function () {
    document.getElementsByClassName("clsHeader")[0].style.display = "none"
    if (document.getElementById("resDisplayName") !== null) { document.getElementById("resDisplayName").innerText = "My Woodbridge" }
    if (document.getElementsByClassName("association-name") !== null) { document.getElementsByClassName("association-name")[0].getElementsByTagName("a")[0].innerText = "My Woodbridge" }
    getResidentHomePage()
    getProfilePage()
    getContacts()
    getResourceCenter()
    getNewsAndAnnouncements()
    getDiscussionGroups()
    getForSaleOrFree()

    $("#appPopUp").on("hide.bs.modal", function () {
        document.getElementById("appPopUpLabel").innerHTML = ""
        document.getElementById("popUpBody").innerHTML = ""
    })
    //$("#flyers, #newsletters").on("hide.bs.collapse", function () {
    //    this.parentElement.getElementsByTagName("div")[0].getElementsByTagName("span")[0].className = "fa fa-folder-o fa-lg"
    //})
    //$("#flyers, #newsletters").on("show.bs.collapse", function () {
    //    this.parentElement.getElementsByTagName("div")[0].getElementsByTagName("span")[0].className = "fa fa-folder-open-o fa-lg"
    //})


    $("#card-notify,#card-docs, #card-contacts,#card-hours").on("show.bs.collapse", function () {
        /*       this.parentElement.getElementsByTagName("span")[2].className = "fa fa-minus-circle fa-lg"*/
    })
    $("#card-notify,#card-docs,#card-contacts,#card-hours").on("hide.bs.collapse", function () {
        /*    this.parentElement.getElementsByTagName("span")[2].className = "fa fa-plus-circle fa-lg"*/
    })
    setTimeout(function () {
        /*   localStorage.setItem("recentNotifications", document.getElementById("recentNotifications").innerHTML)*/
        //localStorage.setItem("timeOfNotifications", new Date().getTime())
        //localStorage.setItem("recentFlyers", document.getElementById("flyers").innerHTML)
        //localStorage.setItem("timeOfFlyers", new Date().getTime())
    }, 2000)
})