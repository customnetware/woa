
const startTime = new Date().getTime();
const woaFrame = document.getElementById("residentHome");
const bgImage = "this.style.backgroundImage='url(/images/icons/icon-message.png)';"
const sentBy = "by Woodbridge HOA (Messenger@AssociationVoice.com)"
const selGrps = ["8364", "11315"]
function getFrameContent() {
    let woaDocument = woaFrame.contentWindow.document
    const pagePanel = {
        news: woaDocument.getElementById("panel_news_content").getElementsByClassName("news"),
        message: woaDocument.getElementById("panel_messages_content").getElementsByClassName("message"),
        post: woaDocument.getElementById("panel_discuss_content").getElementsByClassName("post"),
        classified: woaDocument.getElementById("panel_classifieds_content").getElementsByClassName("classified"),
        document: woaDocument.getElementById("panel_resource_content").getElementsByClassName("document"),
        event: woaDocument.getElementById("panel_cal_content").getElementsByClassName("event")
    }
    for (const contentKey in pagePanel) {
        const contentText = pagePanel[contentKey]
        for (let p = 0; p < contentText.length; p++) {
            let displayContent = document.getElementById(contentKey)
            let displayLink = contentText[p].getElementsByTagName("a")[0]

            let tRow = document.createElement("tr")
            let tCell = document.createElement("td")
            let tLink = document.createElement("a")

            if (displayContent.id == "document" || displayContent.id == "event") {
                tLink.href = displayLink.href
                tLink.innerHTML = displayLink.innerHTML
                tCell.appendChild(tLink)
                tRow.appendChild(tCell)
            } else {
                if (displayContent.id !== "post" || (displayContent.id == "post" && selGrps.indexOf(displayLink.href.split("~")[1]) > -1)) {
                    let topSpan = document.createElement("span")
                    let btmSpan = document.createElement("span")
                    topSpan.setAttribute("style", "font-weight: bold; display: block;")
                    topSpan.appendChild(document.createTextNode(displayLink.getAttribute("data-tooltip-title").replace(sentBy, "")))
                    btmSpan.appendChild(document.createTextNode(displayLink.getAttribute("data-tooltip-text")))

                    tLink.href = displayLink.href
                    tLink.className = "fa fa-external-link formatLink"

                    tCell.appendChild(topSpan)
                    tCell.appendChild(btmSpan)
                    tCell.appendChild(tLink)

                    tRow.appendChild(tCell)
                    displayContent.appendChild(tRow)
                }
            }
            displayContent.appendChild(tRow)
        }
    }
    document.getElementById("overlay").style.display = "none"
    getProfileInfo();
}
function getProfileInfo() {

    findImage = setInterval(function () {
        if (woaFrame.contentWindow.document.getElementById("panel_acct_profile_ajax") !== null) {
            document.getElementById("profileImage").src = woaFrame.contentWindow.document.getElementById("panel_acct_profile_ajax").getElementsByTagName("img")[0].src;
            clearInterval(findImage);
            if (new Date().getTime() - startTime > 15000) { clearInterval(findImage); }
        }
    }, 25);

    if (document.getElementById("resDisplayName") !== null) {
        document.getElementById("resDisplayName").innerText = "My Woodbridge";
    }

    if (document.getElementsByClassName("association-name") !== null) {
        document.getElementsByClassName("association-name")[0].getElementsByTagName("a")[0].innerHTML = "My Woodbridge"
    }

    let residentName = document.getElementsByClassName("clsHeader")[0];
    let residentNameFrm = woaFrame.contentWindow.document.getElementsByClassName("clsHeader")[0].innerText;
    if (residentNameFrm !== null && residentName !== null) {
        if (residentName.getElementsByTagName("a").length > 0) {
            residentName.getElementsByTagName("a")[0].innerText = residentNameFrm
        } else {
            residentName.innerText = residentNameFrm
        }
    }
}



if (window.attachEvent) { window.attachEvent("onload", getFrameContent); }
else if (window.addEventListener) { window.addEventListener("load", getFrameContent); }
else { window.contentWindow.document.addEventListener("load", getFrameContent); }


    //try { }
    //catch (err) {
    //    document.getElementById("overlay").style.display = "none";
    //    document.getElementById("errText").innerHTML = err.message;
    //}




