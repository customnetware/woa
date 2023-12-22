const currentDate = new Date()
function pageLocation(URLString) { return (window.location.hostname == "localhost") ? URLString + ".html" : URLString }

function getDiscussionGroupPosts() {
    let selectedGroup = "8364"
    $("#recentPosts").load(pageLocation("/Discussion/28118~" + selectedGroup) + " .ThreadContainer", function () {
        let currentPosts = document.getElementsByClassName("ThreadContainer")[0].children
        for (c = 0; c < currentPosts.length; c++) {
            let currentPostLink = currentPosts[c].getElementsByClassName("MsgHeader")[0].getElementsByTagName("a")[0]
            currentPostLink.href = "javascript:getSelectedPost(" + c + ")"
        }
    })
}
function getSelectedPost(postIndex) {
    let currentPosts = document.getElementsByClassName("ThreadContainer")[0].children
    let currentPost = currentPosts[postIndex].getElementsByClassName("row")[1]
    let postContent = currentPost.getElementsByTagName("p")
    let imgToRemove = currentPost.getElementsByTagName("img")
    let authorFontSize = currentPosts[postIndex].getElementsByClassName("respDiscTopic")[1].getElementsByTagName("span")
    let indentToRemove = currentPosts[postIndex].getElementsByClassName("respDiscChildPost")
    let replyLinks = currentPosts[postIndex].getElementsByClassName("respReplyWrapper")
    let replyName = currentPosts[postIndex].getElementsByClassName("respAuthorWrapper")
for (i = 1; i < replyLinks.length; i++) {
    replyLinks[i].insertBefore(document.createTextNode(replyName[i].innerHTML), replyLinks[i].firstChild);
    replyName[i].style.display = "none"
}

    for (c = 0; c < indentToRemove.length; c++) {
       indentToRemove[c].classList = "respDiscChildPost"
        indentToRemove[c].removeAttribute("style")
    }

    let replyFontSize = currentPost.getElementsByTagName("span")
    let replyBorder = currentPosts[postIndex].getElementsByClassName("respDiscWrapper")
    for (c = 0; c < currentPosts.length; c++) { if (c !== postIndex) { currentPosts[c].getElementsByClassName("row")[1].style.display = "none" } }
    if (currentPost.style.display == "none") {

        currentPost.style.display = ""
        currentPost.style.border = ""
        currentPost.style.paddingLeft = "20px"
        for (c = 0; c < replyBorder.length; c++) {
            replyBorder[c].classList = "col-12 respDiscWrapper"
            replyBorder[c].style.paddingTop = '10px'
        }
        for (i = postContent.length - 1; i >= 0; i--) { if (postContent[i].innerHTML == "&nbsp;") { postContent[i].remove() } }
        for (i = imgToRemove.length - 1; i >= 0; i--) { imgToRemove[i].remove() }
        for (rf = 0; rf < replyFontSize.length; rf++) { if (replyFontSize[rf].style.fontSize) { replyFontSize[rf].style.fontSize = "" } }
        for (rf = 0; rf < authorFontSize.length; rf++) { if (authorFontSize[rf].style.fontSize) { authorFontSize[rf].style.fontSize = "" } }
        for (i = 0; i < postContent.length;) {
            let selectedParagraph = postContent[i]
            let divTag = document.createElement('div')
            divTag.innerText = selectedParagraph.innerText.replace('"', '').trim()
            selectedParagraph.parentNode.replaceChild(divTag, selectedParagraph)
        }

    } else { currentPost.style.display = "none" }
}

let linksToHide = currentPosts[postIndex].getElementsByClassName("respReplyWrapper")respDiscTopic
let authorToShow = currentPosts[postIndex].getElementsByClassName("respAuthorWrapper")
let testCSS = currentPosts[postIndex].getElementsByClassName("respDiscChildPost")



for (c = 0; c < testCSS.length; c++) {
    testCSS[c].style.paddingTop = "10px"
    let testSpan = document.createElement("div")
    testSpan.style.fontWeight = "700"
    testSpan.innerHTML = authorToShow[c + 1].textContent
    testSpan.appendChild(document.createElement("hr"))
    testCSS[c].appendChild(testSpan)
}

for (i = 1; i < linksToHide.length; i++) {
    linksToHide[i].textContent = authorToShow[i].textContent

    linksToHide[i].style.paddingLeft = "15px"
    authorToShow[i].style.display = "none"
    linksToHide[i].style.display = "none"
}



for (i = linksToHide.length - 1; i >= 1; i--) {
    linksToHide[i].innerHTML = authorToShow[i].innerHTML
    linksToHide[i].style.paddingLeft = "15px"
    authorToShow[i].style.display = "none"
}respDiscTopic



$(window).load(function () {
    getDiscussionGroupPosts()


})   

