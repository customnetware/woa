var woaFrame = document.getElementById("MyFrame");
var profileData = document.getElementById("profile_data").getElementsByClassName("card-body");
const page_content = ["panel_news_content", "panel_messages_content", "panel_classifieds_content", "panel_resource_content", "panel_cal_content", "panel_discuss_content"];
const content_class = ["news", "message", "classified", "document", "event", "discussion"];
const content_index = [0, 1, 2, 4, 5, 6];
for (let i = 0; i < page_content.length; i++) {
    checkContent(page_content[i], content_class[i], content_index[i])
}

function checkContent(contentToCheck, classToCheck, contentDivNum) {
    var page_wait = window.setInterval(function () {
        let current_content = woaFrame.contentWindow.document.getElementById(contentToCheck);
        if (current_content !== null) {
            let current_content_class = current_content.getElementsByClassName(classToCheck)
            if (current_content_class !== null) {
                if (current_content_class.length > 0) {
                    window.clearInterval(page_wait);
                    let contentUL = document.createElement('ul');
                    contentUL.setAttribute('style', 'padding: 0; margin: 0;');
                    for (let i = 0; i < current_content_class.length; i++) {
                        let contentLI = document.createElement('li');
                        contentLI.setAttribute('style', 'display: block;');
                        contentLI.innerHTML = current_content_class[i].innerHTML
                        contentUL.appendChild(contentLI);
                    }
                    profileData[contentDivNum].appendChild(contentUL)
                }
            }
        }
    }, 100)
}


