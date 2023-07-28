
const startTime = new Date().getTime();
const woaFrame = document.getElementById("residentHome");
const bgImage = "this.style.backgroundImage='url(/images/icons/icon-message.png)';"
const sentBy = "by Woodbridge HOA (Messenger@AssociationVoice.com)"
const selGrps = ["8364", "11315"]
const frameContent = [];
frameContent[0] = "panel_news_content,news";
frameContent[1] = "panel_messages_content,message";
frameContent[2] = "panel_discuss_content,post";
frameContent[3] = "panel_classifieds_content,classified";
frameContent[4] = "panel_resource_content,document";
frameContent[5] = "panel_cal_content,event";

function getFrameContent() {
    try {
        document.getElementById("resDisplayName").innerText = "My Woodbridge";
        document.getElementsByClassName("association-name")[0].getElementsByTagName("a")[0].innerHTML = "My Woodbridge"
        document.getElementById("profileImage").src = woaFrame.contentWindow.document.getElementById("panel_acct_profile_ajax").getElementsByTagName("img")[0].src
        for (let i = 0; i < frameContent.length; i++) {
            let contentID = frameContent[i].split(",")
            let selectedContent = woaFrame.contentWindow.document.getElementById(contentID[0]).getElementsByClassName(contentID[1]);

            for (let p = 0; p < selectedContent.length; p++) {
                let displayContent = document.getElementById(contentID[1])
                let displayLink = selectedContent[p].getElementsByTagName("a")[0]

                let tRow = document.createElement("tr")
                let tCell = document.createElement("td")
                let tLink = document.createElement("a")

                if (contentID[1] == "document" || contentID[1] == "event") {
                    tLink.href = displayLink.href
                    tLink.innerHTML = displayLink.innerHTML
                    tCell.appendChild(tLink)
                    tRow.appendChild(tCell)
                    displayContent.appendChild(tRow)
                } else {
                    if (contentID[1] !== "post" || (contentID[1] == "post" && selGrps.indexOf(displayLink.href.split("~")[1]) > -1)) {
                        let topSpan = document.createElement("span");
                        let btmSpan = document.createElement("span");
                        topSpan.setAttribute("style", "font-weight: bold; display: block;");
                        topSpan.appendChild(document.createTextNode(displayLink.getAttribute("data-tooltip-title").replace(sentBy, "")));
                        btmSpan.appendChild(document.createTextNode(displayLink.getAttribute("data-tooltip-text")));

                        tLink.href = displayLink.href;
                        tLink.className = "fa fa-external-link formatLink"

                        tCell.appendChild(topSpan);
                        tCell.appendChild(btmSpan);
                        tCell.appendChild(tLink)

                        tRow.appendChild(tCell)
                        displayContent.appendChild(tRow)
                    }
                }
            }
        }


        document.getElementById("overlay").style.display = "none";

    }
    catch (err) {
        document.getElementById("overlay").style.display = "none";
        document.getElementById("errText").innerHTML = err.message;
    }
}

if (woaFrame.attachEvent) { woaFrame.attachEvent("onload", getFrameContent); }
else if (woaFrame.addEventListener) { woaFrame.addEventListener("load", getFrameContent); }
else { woaFrame.contentWindow.document.addEventListener("load", getFrameContent); }