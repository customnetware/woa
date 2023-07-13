const woaFrame = document.getElementById("residentHome");
var contentDisplay = document.getElementById("profile_data").getElementsByClassName("card-body");

getFrameContent("panel_news_content", "news", 0)
getFrameContent("panel_messages_content", "message", 1)
getFrameContent("panel_resource_content", "document", 2)
getFrameContent("panel_cal_content", "event", 3)
getFrameContent("panel_discuss_content", "post", 4)
getFrameContent("panel_classifieds_content", "classified", 5)

function getFrameContent(contentID, contentClass, ContentPos) {
    for (let p = 0; p < recentsellsText.length; p++) {
        let selectedContent = woaFrame.contentWindow.document.getElementById(contentID).getElementsByClassName(contentClass)[p];
        let selectedLink = selectedContent.getElementsByTagName("a")[0];
        let attr_href = selectedLink.getAttribute("href");
        let attr_onclick = selectedLink.getAttribute("onclick");
        let attr_text = selectedLink.getAttribute("data-tooltip-text");
        let attr_title = selectedLink.getAttribute("data-tooltip-title");
        let attr_viewurl = selectedLink.getAttribute("data-item-viewurl");

        if (ContentPos == 0) { contentDisplay[ContentPos].innerHTML = "<p><b>" + attr_title + "</b><br />" + attr_text + "<a href=" + attr_href + ">&nbsp;<i>Read More</i></a></p>"; }
        if (ContentPos == 1) { contentDisplay[ContentPos].innerHTML = "<p><a onclick=" + attr_onclick + " href='#'>" + attr_title.split("by")[0].replace(",", "<br />") + "</a></p>"; }
        if (ContentPos == 2) { contentDisplay[ContentPos].innerHTML = "<p><a href='" + attr_viewurl + "'>" + selectedLink.innerText + "</a></p>"; }
        if (ContentPos == 3) { contentDisplay[ContentPos].innerHTML = "<p><a href=" + attr_href + ">" + selectedLink.innerText + "</a></p>"; }
        if (ContentPos == 4) { contentDisplay[ContentPos].innerHTML = "<p><a href=" + attr_href + ">" + selectedLink.innerText + "</a></p>"; }
        if (ContentPos == 5) { contentDisplay[ContentPos].innerHTML = "<p><a href=" + attr_href + ">" + selectedLink.innerText + "</a><br />" + attr_title + "</p>"; }
    }
}