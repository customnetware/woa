const woaFrame = document.getElementById("residentHome");
function getFrameContent(contentID, contentClass, ContentPos,ProfileID) {
    let selectedContent = woaFrame.contentWindow.document.getElementById(contentID).getElementsByClassName(contentClass)
    for (let p = 0; p < selectedContent.length; p++) {
        let selectedLink = selectedContent[p].getElementsByTagName("a")[0];
        let attr_href = selectedLink.getAttribute("href");
        let attr_onclick = selectedLink.getAttribute("onclick");
        let attr_text = selectedLink.getAttribute("data-tooltip-text");
        let attr_title = selectedLink.getAttribute("data-tooltip-title");
        let attr_viewurl = selectedLink.getAttribute("data-item-viewurl");
        let contentParagraph = document.createElement("p")
        contentParagraph.setAttribute('style', 'padding: 0; margin-top: 0; px; margin-bottom: 3px;');
        if (ContentPos == 0) { contentParagraph.innerHTML = "<b>" + attr_title + "</b><br />" + attr_text + "<a href=" + attr_href + ">&nbsp;<i class='fa fa-external-link'></i></a>"; }
        if (ContentPos == 1) { contentParagraph.innerHTML = "<b>" + attr_title.split("by")[0] + "</b><br />" + attr_text + "<a onclick=" + attr_onclick + " href='#'>&nbsp;<i class='fa fa-external-link'></i></a>"; }
        if (ContentPos == 2) { contentParagraph.innerHTML = "<b>" + attr_title + "</b><br />" + attr_text + "<a href=" + attr_href + ">&nbsp;<i class='fa fa-external-link'></i></a>"; }
        if (ContentPos == 3) { contentParagraph.innerHTML = "<b>" + attr_title + "</b><br />" + attr_text + "<a href=" + attr_href + ">&nbsp;<i class='fa fa-external-link'></i></a>"; }
        if (ContentPos == 6) { contentParagraph.innerHTML = "<a href=" + attr_href + ">" + selectedLink.innerText + "</a>"; }
        if (ContentPos == 5) {
            if (selectedLink.innerText.indexOf(".doc") >= 0) {
                contentParagraph.innerHTML = "<i class='fa fa-file-word-o'></i>&nbsp;<a href=" + attr_viewurl + ">" + selectedLink.innerText + "</a>";
            } else {
                contentParagraph.innerHTML = "<i class='fa fa-file-pdf-o'></i>&nbsp;<a href=" + attr_viewurl + ">" + selectedLink.innerText + "</a>";
            }
        }


        document.getElementById(ProfileID).appendChild(contentParagraph)
    }
}
function getContents() {
    getFrameContent("panel_news_content", "news", 0, "newsList")
    getFrameContent("panel_messages_content", "message", 1,"emailList")
    getFrameContent("panel_discuss_content", "post", 2,"groupList")
    getFrameContent("panel_classifieds_content", "classified", 3,"sellList")
    getFrameContent("panel_resource_content", "document", 5,"docList")
    getFrameContent("panel_cal_content", "event", 6,"eventList")

    let residentName = document.getElementsByClassName("clsHeader")[0]
    let residentNameFrm = woaFrame.contentWindow.document.getElementsByClassName("clsHeader")[0].innerText
    if (residentName.getElementsByTagName("a").length > 0) {
        residentName.getElementsByTagName("a")[0].innerText = residentNameFrm
    } else { residentName.innerText = residentNameFrm }
    findImage = setInterval(function () {
        let profileImage = woaFrame.contentWindow.document.getElementById("panel_acct_profile_ajax").getElementsByTagName("img")
        if (profileImage !== null) {
            if (profileImage.length > 0) {
                clearInterval(findImage);
                let displayImage = document.createElement("img")
                displayImage.src = profileImage[0].src
                displayImage.setAttribute("style", "float:left;padding:5px")
                document.getElementById("userProfile").insertBefore(displayImage, document.getElementById("userProfile").firstChild);
            }
        }
    }, 200);

}
if (woaFrame.attachEvent) { woaFrame.attachEvent("onload", getContents); }
else if (woaFrame.addEventListener) { woaFrame.addEventListener("load", getContents); }
else { woaFrame.contentWindow.document.addEventListener("load", getContents); }
