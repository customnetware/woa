document.getElementById("overlay").addEventListener("click", function () { document.getElementById("overlay").style.display = "none"; }, false);
document.getElementById("overlay").style.display = "block";

var loginStatus = document.getElementById("HeaderPublishAuthLogout");
if (loginStatus !== null) { loginStatus.href = "https://ourwoodbridge.net/page/28118~1094081/logging-out" }

var m_loginStatus = document.getElementById("head-mobile").getElementsByClassName("mobile-menu-word-link");
if (m_loginStatus !== null) { m_loginStatus.href = "https://ourwoodbridge.net/page/28118~1094081/logging-out" }

var woaFrame = document.getElementById("residentHome");
var profileData = document.getElementById("profile_data").getElementsByClassName("card-body");
const page_content = [
    ["panel_news_content", "news"],
    ["panel_messages_content", "message"],
    ["panel_discuss_content", "post"],
    ["panel_classifieds_content", "classified"],
    ["panel_resource_content", "document"],
    ["panel_cal_content", "event"]
];

woaFrame.addEventListener("load", displayPage)
function displayPage() {
    var nameWait = window.setInterval(function () {
        var profileTitle = document.getElementsByClassName("clsHeader")[0]
        if (profileTitle !== null) {
            window.clearInterval(nameWait);
            if (profileTitle.getElementsByTagName("a").length > 0) {
                profileTitle.getElementsByTagName("a")[0].innerText = woaFrame.contentWindow.document.getElementsByClassName("clsHeader")[0].innerText
            } else { profileTitle.innerText = woaFrame.contentWindow.document.getElementsByClassName("clsHeader")[0].innerText }
        }
    }, 50)
    for (let i = 0; i < page_content.length; i++) {
        checkContent(page_content[i][0], page_content[i][1], i)
    }
    document.getElementById("overlay").style.display = "none";
}
function checkContent(contentToCheck, classToCheck, contentDivNum) {
    var frameWait = window.setInterval(function () {
        let current_content = woaFrame.contentWindow.document.getElementById(contentToCheck);
        if (current_content !== null) {
            if (contentDivNum == 2) {
                let recentgroupsList = current_content.getElementsByClassName("discussion")
                if (recentgroupsList[0].innerText !== "a. General") { window.clearInterval(frameWait); return }
            }
            let current_content_class = current_content.getElementsByClassName(classToCheck)
            if (current_content_class !== null) {
                if (current_content_class.length > 0) {
                    window.clearInterval(frameWait);
                    for (let i = 0; i < current_content_class.length; i++) {
                        let content_pp = document.createElement("p")
                        content_pp.setAttribute('style', 'padding: 0; margin-top: 0; px; margin-bottom: 3px;');
                        switch (contentDivNum) {
                            case 0:
                                content_pp.innerHTML = current_content_class[i].innerHTML + "<br>" + current_content_class[i].getElementsByTagName("a")[0].getAttribute("data-tooltip-text");
                                break;
                            case 1:
                                let contentURL = current_content_class[i].getElementsByTagName("a")[0].getAttribute("onclick");
                                let contentText = current_content_class[i].getElementsByTagName("a")[0].getAttribute("data-tooltip-title").split("by");
                                let contentBody = current_content_class[i].getElementsByTagName("a")[0].getAttribute("data-tooltip-text")
                                content_pp.innerHTML = "<b>" + contentText[0] + "</b><br />" + contentBody + "<a onclick=" + contentURL + " href='#'>&nbsp;<i>Read More</i></a>";
                                break;
                            case 2:
                                content_pp.innerHTML = current_content_class[i].getElementsByTagName("a")[0].innerHTML;
                                break;
                            case 3:
                                content_pp.innerHTML = current_content_class[i].innerHTML + "<br>" + current_content_class[i].getElementsByTagName("a")[0].getAttribute("data-tooltip-text");
                                break;
                            case 4:
                                let documentURL = current_content_class[i].getElementsByTagName("a")[0].getAttribute("data-item-viewurl");
                                let documentText = current_content_class[i].getElementsByTagName("a")[0].innerText;
                                content_pp.innerHTML = "<a href='" + documentURL + "'>" + documentText + "</a>";
                                break;
                            case 5:
                                let eventURL = current_content_class[i].getElementsByTagName("a")[0].href
                                let eventText = current_content_class[i].getElementsByTagName("a")[0].innerText;
                                content_pp.innerHTML = "<a href=" + eventURL + ">" + eventText + "</a>";
                                break;
                            default:
                        }
                        profileData[contentDivNum].appendChild(content_pp)
                    }
                }
            }
        }
    }, 50)
}
