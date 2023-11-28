let currentDate = new Date()
$.get("/homepage/28118/resident-home-page", function () { })
    .done(function (responseText) {
        let myWoodbridge = new DOMParser().parseFromString(responseText, "text/html")
        let recentItems = myWoodbridge.getElementsByClassName("message")
        for (let p = 0; p < recentItems.length; p++) {
            let itemContent = recentItems[p].getElementsByTagName("a")[0]
            addToNotifications(itemContent.getAttribute("data-tooltip-title").split("by")[0], itemContent.getAttribute("data-tooltip-text"), itemContent.href, "fa fa-envelope-o")
        }
        showPhotos(myWoodbridge)
        document.getElementsByClassName("clsHeader")[0].innerHTML = myWoodbridge.getElementsByClassName("clsHeader")[0].innerHTML
    })
$.get("/news/list/28118/news-announcements", function () { })
    .done(function (responseText) {
        let newsArticles = new DOMParser().parseFromString(responseText, "text/html")
        let articleTitle = newsArticles.getElementsByClassName("clsHeader")
        let articleContent = newsArticles.getElementsByClassName("clsBodyText")
        for (let p = 0; p < articleContent.length; p++) {
            addToNotifications(articleTitle[p].innerText, articleContent[p].innerText, "#", "fa fa-newspaper-o")
        }
    })
$.get("/Discussion/28118~8364", function () { })
    .done(function (responseText) {
        let forum = new DOMParser().parseFromString(responseText, "text/html")
        let postHeaders = forum.querySelectorAll("[id^=msgHeader]")
        let postContents = forum.querySelectorAll("[id^=contents]")
        for (let h = 0; h < postHeaders.length; h++) {
            let messageTexts = postContents[h].getElementsByClassName("clsBodyText")
            let messageAuthor = postContents[h].getElementsByClassName("respAuthorWrapper")
            let messageContacts = postContents[h].getElementsByClassName("respReplyWrapper")
            let postDate = new Date(messageAuthor[messageAuthor.length - 1].innerText.split("-")[1])
            let dayDiff = (currentDate - postDate) / (1000 * 3600 * 24)
            if (dayDiff <= 90) {
                addToNotifications(postHeaders[h].innerText, messageTexts[0].innerText + messageAuthor[0].innerText, "#", "fa fa-comments-o fa-lg")
            }
        }

    })
$.get("/resourcecenter/28118/resource-center", function () { })
    .done(function (responseText) {
        let documents = new DOMParser().parseFromString(responseText, "text/html")
        let documentName = documents.getElementById("contents540434").querySelectorAll("[id^=d]")
        let documentLink = documents.getElementById("contents540434").querySelectorAll('a[title="View On-line"]')
        let newsLetterName = documents.getElementById("contents951754").querySelectorAll("[id^=d]")
        let newsLettertLink = documents.getElementById("contents951754").querySelectorAll('a[title="View On-line"]')

        let newsLetterItem = document.createElement("span")
        let selectedDoc = document.createElement("a")
        selectedDoc.innerHTML = newsLetterName[newsLetterName.length - 1].innerHTML
        selectedDoc.href = newsLettertLink[newsLetterName.length - 1].href
        newsLetterItem.appendChild(selectedDoc)
        document.getElementById("recentNewsletters").appendChild(newsLetterItem)

        for (let p = 0; p < documentName.length; p++) {
            let resourceItem = document.createElement("span")
            let selectedDoc = document.createElement("a")
            selectedDoc.innerHTML = documentName[p].innerHTML
            selectedDoc.href = documentLink[p].href
            resourceItem.appendChild(selectedDoc)
            document.getElementById("document").appendChild(resourceItem)
            if (document.getElementById("document").getElementsByTagName("span").length == 15) { break }
        }
        document.getElementById("documentIcon").className = "fa fa-file-text-o"
    })

$.get("/classified/search/28118~480182/classifieds", function () { })
    .done(function (responseText) {
        let classifieds = new DOMParser().parseFromString(responseText, "text/html")
        let classifiedTitle = classifieds.querySelectorAll('.clsBodyText:not(.hidden-md-up,.hidden-sm-down)')
        let classifiedSummary = classifieds.getElementsByClassName("clsBodyText hidden-md-up")
        let classifiedBody = classifieds.getElementsByClassName("clsBodyText hidden-sm-down")
        for (let p = 0; p < classifiedTitle.length; p++) {
            addToNotifications(classifiedTitle[p].getElementsByTagName("a")[0].innerHTML, classifiedBody[p].childNodes[0].nodeValue, "#", "fa fa-shopping-cart")
        }
    })


let profileID = document.getElementById("HeaderPublishAuthProfile").href.split("(")[1].split(",")[0]
let profilePage = (window.location.hostname == "localhost") ? "/Member/28118~" + profileID + "" : "/Member/28118~" + profileID
$.get(profilePage, function () {
}).done(function (responseText) {
    let profileDoc = new DOMParser().parseFromString(responseText, "text/html")
    document.getElementById("profileImage").src = profileDoc.getElementsByTagName("img")[0].src
})


function showPhotos(galleryPage) {
    try {

        let picList = document.createElement("p")
        let photoList = galleryPage.querySelectorAll("[id^=gallery_link_]")
        let galleryLink = galleryPage.querySelectorAll("[class^=gallery_txt_sub]")
        let galleryText = galleryPage.getElementsByClassName("left")
        for (let k = 0; k < photoList.length; k++) {
            let picSpan = document.createElement("span")
            let pic = document.createElement("img")
            let picLink = document.createElement("a")
            pic.src = photoList[k].src
            picSpan.appendChild(document.createTextNode(galleryText[k].innerText.replace(".jpg", "")))
            picLink.href = galleryLink[k].getElementsByTagName("a")[0].href
            picLink.appendChild(pic)

            /*    picLink.appendChild(picSpan)*/

            picList.appendChild(picLink)

        } document.getElementById("recentPhotos").appendChild(picList)
    } catch (error) { }

}
function addToNotifications(title, content, link, iconType) {
    let itemType = document.createElement("i")
    let itemTitle = document.createElement("span")
    let itemLink = document.createElement("a")
    let recentItem = document.createElement("p")

    itemType.className = iconType
    itemType.style.paddingRight = "7px"

    itemTitle.appendChild(itemType)
    itemTitle.appendChild(document.createTextNode(title))
    itemLink.className = "fa fa-share fa-lg formatLink"
    itemLink.href = link

    recentItem.appendChild(itemTitle)
    recentItem.appendChild(document.createTextNode(content))
    recentItem.appendChild(itemLink)
    if (iconType.includes("envelope")) {
        document.getElementById("message").insertBefore(recentItem, document.getElementById("message").children[0])
    } else {
        document.getElementById("message").appendChild(recentItem)
    }
}

$(window).load(function () {
    document.getElementById("loadIcon").style.display = "none"
    document.getElementById("pageRow").style.visibility = "visible"

})