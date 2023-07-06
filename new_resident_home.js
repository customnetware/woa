var woaFrame = document.getElementById("MyFrame");
const page_content = ["panel_news_content", "panel_messages_content", "panel_classifieds_content", "panel_resource_content", "panel_cal_content", "panel_discuss_content"];
const content_class = ["news", "message", "classified", "document", "event", "discussion"];
for (let i = 0; i < page_content.length; i++) {
    checkContent(page_content[i], content_class[i])
}

function checkContent(contentToCheck,classToCheck) {
    var page_wait = window.setInterval(function () {
        let current_content = woaFrame.contentWindow.document.getElementById(contentToCheck);
        if (current_content !== null) {
            let current_content_class = current_content.getElementsByClassName(classToCheck)
            alert(current_content_class.innerText)
            window.clearInterval(page_wait);
        }
    }, 50)
}
