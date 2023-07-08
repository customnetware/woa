var woaFrame = document.getElementById("MyFrame");
var profileData = document.getElementById("profile_data").getElementsByClassName("card-body");
const page_content = [
    ["panel_news_content", "news"],
    ["panel_messages_content", "message"],
    ["panel_discuss_content", "post"],
    ["panel_classifieds_content", "classified"],
    ["profile_content", "profile"],
    ["panel_resource_content", "document"],
    ["panel_cal_content", "event"]
];

for (let i = 0; i < page_content.length; i++) {
    checkContent(page_content[i][0], page_content[i][1], i)
}

function checkContent(contentToCheck, classToCheck, contentDivNum) {
    var page_wait = window.setInterval(function () {
        let current_content = woaFrame.contentWindow.document.getElementById(contentToCheck);
        if (contentDivNum == 2) {
            let recentgroupsList = current_content.getElementsByClassName("discussion")
            if (recentgroupsList[0].innerText !== "a. General") { return }
        }
        if (current_content !== null) {
            let current_content_class = current_content.getElementsByClassName(classToCheck)
            if (current_content_class !== null) {
                if (current_content_class.length > 0) {
                    window.clearInterval(page_wait);
                    for (let i = 0; i < current_content_class.length; i++) {
                        let content_pp = document.createElement("p")
                        content_pp.setAttribute('style', 'padding: 0; margin-top: 0; px; margin-bottom: 3px;');
                        switch (contentDivNum) {
                            case 1:
                                let contentURL = current_content_class[i].getElementsByTagName("a")[0].getAttribute("onclick");
                                let contentText = current_content_class[i].getElementsByTagName("a")[0].getAttribute("data-tooltip-title").split("by");
                                let contentBody = current_content_class[i].getElementsByTagName("a")[0].getAttribute("data-tooltip-text")
                                content_pp.innerHTML = "<b>" + contentText[0] + "</b><br />" + contentBody + "<a onclick=" + contentURL + " href='#'>&nbsp;<i>Read More</i></a>";
                                break;
                            case 0:
                            case 3:
                                content_pp.innerHTML = current_content_class[i].innerHTML + "<br>" + current_content_class[i].getElementsByTagName("a")[0].getAttribute("data-tooltip-text");
                                break;
                            case 2:
                            case 5:
                            case 6:
                                content_pp.innerHTML = current_content_class[i].getElementsByTagName("a")[0].innerHTML;
                                break;
                            default:
                                content_pp.innerHTML = ""
                        }
                        profileData[contentDivNum].appendChild(content_pp)
                    }
                }
            }
        }
    }, 100)
}


