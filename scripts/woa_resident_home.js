const woaFrame = document.getElementById("residentHome");
const serverUsed = window.location.hostname;
const serverURL = window.location.href;
document.getElementById("overlay").style.display = "block";
alert(serverURL.slice(-4));
function getFrameContent(contentID, contentClass, ProfileID) {
    let selectedContent = woaFrame.contentWindow.document.getElementById(contentID).getElementsByClassName(contentClass)
    for (let p = 0; p < selectedContent.length; p++) {
        let selectedLink = selectedContent[p].getElementsByTagName("a")[0];
        let attr_href = selectedLink.getAttribute("href");
        let attr_onclick = selectedLink.getAttribute("onclick");
        let attr_text = selectedLink.getAttribute("data-tooltip-text");
        let attr_title = selectedLink.getAttribute("data-tooltip-title");
        let attr_viewurl = selectedLink.getAttribute("data-item-viewurl");

        let tRow = document.createElement("tr");
        let tCell = document.createElement("td");

        if (ProfileID == "newsList") { tCell.innerHTML = "<b>" + attr_title + "</b><br />" + attr_text + "<a href=" + attr_href + ">&nbsp;<i class='fa fa-external-link'></i></a>"; }
        if (ProfileID == "emailList") { tCell.innerHTML = "<b>" + attr_title.split("by")[0] + "</b><br />" + attr_text + "<a onclick=" + attr_onclick + " href='#'>&nbsp;<i class='fa fa-external-link'></i></a>"; }
        if (ProfileID == "sellList") { tCell.innerHTML = "<b>" + attr_title + "</b><br />" + attr_text + "<a href=" + attr_href + ">&nbsp;<i class='fa fa-external-link'></i></a>"; }
        if (ProfileID == "groupList") { tCell.innerHTML = "<b>" + attr_title + "</b><br />" + attr_text + "<a href=" + attr_href + ">&nbsp;<i class='fa fa-external-link'></i></a>"; }
        if (ProfileID == "docList") { tCell.innerHTML = "<a href=" + attr_viewurl + ">" + selectedLink.innerHTML + "</a>"; }
        if (ProfileID == "eventList") { tCell.innerHTML = "<a href=" + attr_href + ">" + selectedLink.innerHTML + "</a>"; }
        tRow.appendChild(tCell);

        document.getElementById(ProfileID).getElementsByTagName("tbody")[0].appendChild(tRow)

    }
}
function getContents() {
    try {

        getFrameContent("panel_news_content", "news", "newsList");
        getFrameContent("panel_messages_content", "message", "emailList");
        getFrameContent("panel_discuss_content", "post", "groupList");
        getFrameContent("panel_classifieds_content", "classified", "sellList");
        getFrameContent("panel_resource_content", "document", "docList");
        getFrameContent("panel_cal_content", "event", "eventList");

        let residentName = document.getElementsByClassName("clsHeader")[0];
        let residentNameFrm = woaFrame.contentWindow.document.getElementsByClassName("clsHeader")[0].innerText;
        if (residentName.getElementsByTagName("a").length > 0) {
            residentName.getElementsByTagName("a")[0].innerText = residentNameFrm
        } else { residentName.innerText = residentNameFrm }

        findImage = setInterval(function () {
            let profileImage = woaFrame.contentWindow.document.getElementById("panel_acct_profile_ajax").getElementsByTagName("img");
            if (profileImage !== null) {
                if (profileImage.length > 0) {
                    clearInterval(findImage);
                    let displayImage = document.createElement("img");
                    displayImage.src = profileImage[0].src
                    displayImage.setAttribute("style", "float:left;padding:5px")
                    document.getElementById("userProfile").insertBefore(displayImage, document.getElementById("userProfile").firstChild);
                }
            }
        }, 200);

    }
    catch (err) {
        document.getElementById("overlay").style.display = "none";
        if (serverUsed == "localhost") {
            document.getElementById("errText").innerHTML = err.message;
        } else {
            location.replace("https://ourwoodbridge.net/homepage/28118/resident-home-page")
        };
    }
    document.getElementById("overlay").style.display = "none";
}
if (woaFrame.attachEvent) { woaFrame.attachEvent("onload", getContents); }
else if (woaFrame.addEventListener) { woaFrame.addEventListener("load", getContents); }
else { woaFrame.contentWindow.document.addEventListener("load", getContents); }