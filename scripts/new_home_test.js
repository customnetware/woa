const currentDate = new Date()
function pageLocation(URLString) { return (window.location.hostname == "localhost") ? URLString + ".html" : URLString }
function getResidentHomePage(pageToDownload) {
    $.get(pageLocation(pageToDownload), function () { })
        .done(function (responseText) {
            let myWoodbridge = new DOMParser().parseFromString(responseText, "text/html")
            let recentItems = document.getElementsByName("recentItem")
            for (let r = 0; r < recentItems.length; r++) {
                let selectedItems = myWoodbridge.querySelectorAll("[id^=" + recentItems[r].id + "]")
                let itemParagraph = document.getElementById(recentItems[r].id).getElementsByTagName("p")
                for (let k = 0; k < selectedItems.length; k++) {
                    itemParagraph[k].children[0].textContent = selectedItems[k].getAttribute("data-tooltip-title")
                    itemParagraph[k].children[1].textContent = selectedItems[k].getAttribute("data-tooltip-text")
                    itemParagraph[k].children[2].href = selectedItems[k].href
                    itemParagraph[k].id = selectedItems[k].id.replace("link_", "")
                    itemParagraph[k].style.display = "inline-block"
                }
                document.getElementsByName(recentItems[r].parentElement.id)[0].getElementsByTagName("span")[2].textContent = "(" + selectedItems.length + ")"
            }
            let newPicList = document.getElementById("recentPhotosBody").getElementsByTagName("div")
            let photoList = myWoodbridge.querySelectorAll("[id^=gallery_link_]")
            let galleryLink = myWoodbridge.querySelectorAll("[class^=gallery_txt_sub]")
            let galleryText = myWoodbridge.getElementsByClassName("left")
            for (let k = 0; k < photoList.length; k++) {
                newPicList[k].getElementsByTagName("img")[0].src = photoList[k].src
                newPicList[k].getElementsByTagName("span")[0].innerText = galleryText[k].innerText.replace(".jpg", "")
                newPicList[k].getElementsByTagName("a")[0].href = galleryLink[k].getElementsByTagName("a")[0].href
            }
            document.querySelector("[data-target='#recentPhotos']").getElementsByTagName("span")[2].innerHTML = "(3)"
            document.getElementById("currentProfile").getElementsByTagName("span")[0].className = "fa fa-check-circle fa-lg formatLink"
            document.getElementById("currentProfile").getElementsByTagName("span")[1].textContent = myWoodbridge.getElementsByClassName("clsHeader")[0].textContent
        })
        .always(function () {

        })
}
function getResourceCenter(pageToDownload) {
    let docList = document.getElementById("recentFlyersBody")
    let folderToGet = ["951754", "540434"]
    $.get(pageLocation(pageToDownload), function () { })
        .done(function (responseText) {
            let documents = new DOMParser().parseFromString(responseText, "text/html")
            for (let f = 0; f < folderToGet.length; f++) {
                let documentName = documents.getElementById("contents" + folderToGet[f]).querySelectorAll("[id^=d]")
                let documentLink = documents.getElementById("contents" + folderToGet[f]).querySelectorAll('a[title="View On-line"]')
                for (let p = 0; p < documentName.length; p++) {
                    if (f == 0) { p = documentName.length - 1 }
                    let resourceItem = document.createElement("span")
                    let selectedDoc = document.createElement("a")
                    selectedDoc.innerHTML = documentName[p].innerHTML
                    selectedDoc.href = documentLink[p].href
                    resourceItem.appendChild(selectedDoc)
                    docList.appendChild(resourceItem)
                }
            }
        })
        .always(function () {
            document.querySelector("[data-target='#recentFlyers']").getElementsByTagName("span")[2].innerHTML = "(" + docList.getElementsByTagName("span").length + ")"
        })
}
function getProfilePage() {
    var regExp = /\(([^)]+)\)/
    var profileID = regExp.exec(document.getElementById("HeaderPublishAuthProfile").href)[1].split(",")[0]
    $("#userProfileImage").load(pageLocation("/Member/28118~" + profileID) + " img:first", function () {
        $("#userProfileText").load(pageLocation("/news/28118~792554/webmaster-only") + " #contentInner", function () {
            document.getElementById("userProfileText").getElementsByTagName("div")[0].getElementsByTagName("div")[0].remove()
            document.getElementById("userProfileText").getElementsByTagName("div")[0].getElementsByTagName("div")[1].remove()
        })
    })
}
function getDiscussionGroupPosts() {
    const NumOfDays = +document.getElementById("rangeval").innerText * 30
    let selectedGroup = "8364"
    let selectedGroups = document.getElementsByName("optradio")
    for (g = 0; g < selectedGroups.length; g++) { if (selectedGroups[g].checked == true) { selectedGroup = selectedGroups[g].value } }
    $("#recentPostsBody").load(pageLocation("/Discussion/28118~" + selectedGroup) + " .ThreadContainer", function () {
        let currentPosts = document.getElementsByClassName("ThreadContainer")[0].children
        let currentDate = new Date()
        for (i = currentPosts.length - 1; i >= 0; i--) {
            let postDate = new Date(currentPosts[i].getElementsByTagName("div")[4].innerText.replace("Last Reply:", ""))
            let dayDiff = (currentDate - postDate) / (1000 * 3600 * 24)
            if (dayDiff > NumOfDays) { currentPosts[i].remove() }
        }
        for (c = 0; c < currentPosts.length; c++) {
            let currentPostLink = currentPosts[c].getElementsByClassName("MsgHeader")[0].getElementsByTagName("a")[0]
            currentPostLink.href = "javascript:getSelectedPost(" + c + ")"
        }
        document.getElementsByName("numOfPosts")[0].innerHTML = "(" + currentPosts.length + ")"
    })

}
function getSelectedPost(postIndex) {
    let currentPosts = document.getElementsByClassName("ThreadContainer")[0].children
    let linksToHide = currentPosts[postIndex].getElementsByClassName("respReplyWrapper")


    let test = currentPosts[postIndex].getElementsByClassName("respDiscChildPost")[0]
    test.classList=""
   
    let currentPost = currentPosts[postIndex].getElementsByClassName("row")[1]
    let postContent = currentPost.getElementsByTagName("p")

    for (i = linksToHide.length - 1; i >= 1; i--) { linksToHide[i].remove() }
    for (c = 0; c < currentPosts.length; c++) { if (c !== postIndex) { currentPosts[c].getElementsByClassName("row")[1].style.display = "none" } }
    for (i = postContent.length - 1; i >= 0; i--) { if (postContent[i].innerHTML == "&nbsp;") { postContent[i].remove() } }
    if (currentPost.style.display == "none") {
        currentPost.style.display = "inherit"
        for (i = 0; i < postContent.length;) {
            let selectedParagraph = postContent[i]
            let divTag = document.createElement('span')
            divTag.style.paddingLeft="0px"
            divTag.textContent = selectedParagraph.textContent.trim()
            selectedParagraph.parentNode.replaceChild(divTag, selectedParagraph)
        }


    } else { currentPost.style.display = "none" }
}
$(window).load(function () {
    getProfilePage()
    getDiscussionGroupPosts()
    getResourceCenter("/resourcecenter/28118/resource-center")
    getResidentHomePage("/homepage/28118/resident-home-page")


})

