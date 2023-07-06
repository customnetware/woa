var woaFrame = document.getElementById("MyFrame");
var profileData = document.getElementById("profile_data").getElementsByClassName("card-body");
const page_content = ["panel_news_content", "panel_messages_content", "panel_classifieds_content", "panel_resource_content", "panel_cal_content", "panel_discuss_content"];
const content_class = ["news", "message", "classified", "document", "event", "discussion"];
for (let i = 0; i < page_content.length; i++) {
    checkContent(page_content[i], content_class[i], i)
}

function checkContent(contentToCheck, classToCheck, contentDivNum) {
    var page_wait = window.setInterval(function () {
        let current_content = woaFrame.contentWindow.document.getElementById(contentToCheck);
        if (current_content !== null) {
            window.clearInterval(page_wait);
            let current_content_class = current_content.getElementsByClassName(classToCheck)
            let contentUL = document.createElement('ul');

            for (let i = 0; i < current_content_class.length; i++) {
                let contentLI = document.createElement('li');
                contentLI.innerHTML = current_content_class[i].innerHTML
                contentUL.appendChild(contentLI);
            }
            profileData[contentDivNum].appendChild(contentUL)
        }
    }, 50)
}


