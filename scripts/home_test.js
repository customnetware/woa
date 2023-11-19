``
$(window).load(function () {
    if (document.getElementById("resDisplayName") !== null) {
        document.getElementById("resDisplayName").innerText = "My Woodbridge"
    }
    if (document.getElementsByClassName("association-name") !== null) {
        document.getElementsByClassName("association-name")[0].getElementsByTagName("a")[0].innerText = "My Woodbridge"
    }
    let profileID = document.getElementById("HeaderPublishAuthProfile").href.split("(")[1].split(",")[0]
    let profilePage = (window.location.hostname == "localhost") ? "/Member/28118~" + profileID + ".html" : "/Member/28118~" + profileID
    let residentPage = (window.location.hostname == "localhost") ? "/homepage/28118/resident-home-page.html" : "/homepage/28118/resident-home-page"
    let fileLocation = (window.location.hostname == "localhost") ? "/resourcecenter/28118/resource-center.html" : "/resourcecenter/28118/resource-center"
    let adLocation = (window.location.hostname == "localhost") ? "/classified/search/28118~480182/classifieds.html" : "/classified/search/28118~480182/classifieds"
    let newsLocation = (window.location.hostname == "localhost") ? "/news/list/28118/news-announcements.html" : "/news/list/28118/news-announcements"

    residentHome = $.get(residentPage), resourceCenter = $.get(fileLocation), classifieds = $.get(adLocation), announcements = $.get(newsLocation), profile = $.get(profilePage)
    $.when(residentHome, resourceCenter, classifieds, profile).done(function (residentHome, resourceCenter, classifieds, profile) {
        let myWoodbridge = new DOMParser().parseFromString(residentHome, "text/html")
        let allDocuments = new DOMParser().parseFromString(resourceCenter, "text/html")
        let allClassifieds = new DOMParser().parseFromString(classifieds, "text/html")
        let allAnnouncements = new DOMParser().parseFromString(announcements, "text/html")
        let currentProfile = new DOMParser().parseFromString(profile, "text/html")
        showEmails(myWoodbridge)
        showPhotos(myWoodbridge)
        showDocuments(allDocuments)
        showClassifieds(allClassifieds)
        showNews(allAnnouncements)
        showProfile(currentProfile)
    })
})
function showProfile(fileHTML) {
    document.getElementById("profileImage").src = fileHTML.getElementsByTagName("img")[0].src
}
function showEmails(fileHTML) {
    document.getElementsByClassName("clsHeader")[0].innerHTML = fileHTML.getElementsByClassName("clsHeader")[0].innerHTML
    let recentItems = fileHTML.getElementsByClassName("message")
    for (let p = 0; p < recentItems.length; p++) {
        let itemTitle = document.createElement("span")
        let itemLink = document.createElement("a")
        let recentItem = document.createElement("p")
        let itemContent = recentItems[p].getElementsByTagName("a")[0]
        let itemContentTitle = itemContent.getAttribute("data-tooltip-title").split("by")[0]
        let itemContentText = itemContent.getAttribute("data-tooltip-text")
        recentItem.id = itemContent.id.replace("link_", "")
        itemTitle.appendChild(document.createTextNode(itemContentTitle))
        recentItem.appendChild(itemTitle)
        recentItem.appendChild(document.createTextNode(itemContentText))
        itemLink.className = "fa fa-share fa-lg formatLink"
        itemLink.href = itemContent.href
        recentItem.appendChild(itemLink)
        document.getElementById("message").appendChild(recentItem)

        let retrievedData = localStorage.getItem("emails")
        let emailData = (retrievedData !== null) ? JSON.parse(retrievedData) : []
        if ((retrievedData !== null && retrievedData.includes(recentItem.id) == false) || emailData.length == 0) {
            emailData.push([recentItem.id, itemContentTitle, itemContentText, itemContent.href])
            let currentEmails = JSON.stringify(emailData)
            localStorage.setItem("emails", currentEmails)
        }
    }
    let retrievedData = localStorage.getItem("emails")
    if (retrievedData !== null) {
        var emailData = JSON.parse(retrievedData)
        if (emailData.length > 3) {
            emailData.sort()
            let currentEmails = JSON.stringify(emailData)
            localStorage.setItem("emails", currentEmails)
            document.getElementsByClassName("fa fa-history formatRight")[0].style.display = "block"
        }
    }
    document.getElementById("messagexIconx").className = "fa fa-envelope-o"
}
function showDocuments(fileHTML) {
    let documentName = fileHTML.getElementById("contents540434").querySelectorAll("[id^=d]")
    let documentLink = fileHTML.getElementById("contents540434").querySelectorAll('a[title="View On-line"]')
    for (let p = 0; p < documentName.length; p++) {
        let resourceItem = document.createElement("span")
        let selectedDoc = document.createElement("a")
        selectedDoc.innerHTML = documentName[p].innerHTML
        selectedDoc.href = documentLink[p].href
        resourceItem.appendChild(selectedDoc)
        document.getElementById("document").appendChild(resourceItem)
        if (document.getElementById("document").getElementsByTagName("span").length == 3) { break }
    }
    document.getElementById("documentxIconx").className = "fa fa-file-text-o"

    let newsLetterName = fileHTML.getElementById("contents951754").querySelectorAll("[id^=d]")
    let newsLettertLink = fileHTML.getElementById("contents951754").querySelectorAll('a[title="View On-line"]')
    for (var p = newsLetterName.length - 1; p >= 0; p--) {
        let newsLetterItem = document.createElement("span")
        let selectedDoc = document.createElement("a")
        selectedDoc.innerHTML = newsLetterName[p].innerHTML
        selectedDoc.href = newsLettertLink[p].href
        newsLetterItem.appendChild(selectedDoc)
        document.getElementById("wblife").appendChild(newsLetterItem)
        if (document.getElementById("wblife").getElementsByTagName("span").length == 3) { break }
    }
    document.getElementById("wblifexIconx").className = "fa fa-file-o"
}
function showPhotos(fileHTML) {
    try {
        let photoList = fileHTML.querySelectorAll("[id^=gallery_link_]")
        let galleryLink = fileHTML.querySelectorAll("[class^=gallery_txt_sub]")
        let galleryText = fileHTML.getElementsByClassName("left")
        let photoDisplay = document.getElementById("photo")
        let picList = photoDisplay.getElementsByTagName("div")
        for (let k = 0; k < photoList.length; k++) {
            let picSpan = document.createElement("span")
            let picLink = document.createElement("a")
            let pic = document.createElement("img")
            picSpan.innerText = galleryText[k].innerText.replace(".jpg", "")
            pic.src = photoList[k].src
            picLink.href = galleryLink[k].getElementsByTagName("a")[0].href
            picLink.appendChild(pic)
            picLink.appendChild(picSpan)
            picList[k].appendChild(picLink)
        }
    } catch (error) { }
    document.getElementById("photoxIconx").className = "fa fa-picture-o"
}
function showClassifieds(fileHTML) {
    let documentList = document.getElementById("classified")
    let classifiedTitle = fileHTML.querySelectorAll('.clsBodyText:not(.hidden-md-up,.hidden-sm-down)')
    let classifiedSummary = fileHTML.getElementsByClassName("clsBodyText hidden-md-up")
    let classifiedBody = fileHTML.getElementsByClassName("clsBodyText hidden-sm-down")
    for (let p = 0; p < classifiedTitle.length; p++) {
        let selectedAd = document.createElement("p")
        let adTitle = document.createElement("span")
        let adSummary = document.createElement("span")
        let adBody = document.createElement("span")
        let adLink = document.createElement("a")

        adBody.style.display = "none"
        adLink.className = "fa fa-plus fa-lg formatLink"
        adLink.href = "javascript:showFullAd(" + document.getElementById("classified").getElementsByTagName("p").length + ")"
        adTitle.appendChild(document.createTextNode(classifiedTitle[p].getElementsByTagName("a")[0].innerHTML))
        adTitle.appendChild(adLink)
        adSummary.appendChild(document.createTextNode(classifiedSummary[p].innerText))
        adBody.appendChild(document.createTextNode(classifiedBody[p].childNodes[0].nodeValue))

        selectedAd.appendChild(adTitle)
        selectedAd.appendChild(adSummary)
        selectedAd.appendChild(adBody)

        documentList.appendChild(selectedAd)
    }
    document.getElementById("classifiedxIconx").className = "fa fa-cart-arrow-down"

}
function showFullAd(adID) {
    let classifieds = document.getElementById("classified").getElementsByTagName("p")
    for (let p = 0; p < classifieds.length; p++) {
        let adSummaryText = classifieds[p].getElementsByTagName("span")[1]
        let adFullText = classifieds[p].getElementsByTagName("span")[2]
        let adIcon = classifieds[p].getElementsByTagName("a")[0]

        if (p !== adID) {
            adSummaryText.style.display = "inline"
            adFullText.style.display = "none"
            adIcon.className = "fa fa-plus fa-lg formatLink"
        } else {
            if (adSummaryText.style.display == "none") {
                adSummaryText.style.display = "inline"
                adFullText.style.display = "none"
                adIcon.className = "fa fa-plus fa-lg formatLink"
            } else {
                adSummaryText.style.display = "none"
                adFullText.style.display = "inline"
                adIcon.className = "fa fa-minus fa-lg formatLink"
            }
        }
    }
}
function showNews(fileHTML) {
    let documentList = document.getElementById("news")
    let newsHeader = fileHTML.getElementsByClassName("clsHeader")
    let NewsBody = fileHTML.getElementsByClassName("clsBodyText")
    if (NewsBody.length > 0) {
        for (let p = 0; p < NewsBody.length; p++) {
            let selectedArticle = document.createElement("p")
            let articleHeader = document.createElement("span")
            articleHeader.appendChild(document.createTextNode(newsHeader[p].innerText))
            selectedArticle.appendChild(articleHeader)
            selectedArticle.appendChild(document.createTextNode(NewsBody[p].innerText))
            documentList.appendChild(selectedArticle)
        }
    }
    let selectedArticle = document.createElement("p")
    let articleHeader = document.createElement("span")
    let submitLink = document.createElement("a")

    articleHeader.appendChild(document.createTextNode("Resident Group or Club News or Announcements"))
    selectedArticle.appendChild(articleHeader)
    selectedArticle.appendChild(document.createTextNode("Share your Del Webb residents club or group announcements here where the content is avaiable to all Del Webb residents.  "))
    submitLink.href = "/form/28118~169617/submit-a-news-announcements-posting"
    submitLink.innerHTML = "Click here to send your announcement."
    selectedArticle.appendChild(submitLink)
    selectedArticle.appendChild(document.createTextNode("   (All announcements are subject to HOA rules and regulations)"))

    documentList.appendChild(selectedArticle)
    document.getElementById("newsxIconx").className = "fa fa-newspaper-o"

}