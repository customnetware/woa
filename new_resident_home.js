var woaFrame = document.getElementById("MyFrame");
const page_content = ["panel_news_content", "panel_messages_content", "panel_classifieds_content", "panel_resource_content", "panel_cal_content", "panel_discuss_content"];
for (let i = 0; i < page_content.length; i++) {
    checkContent(page_content[i])
}

function checkContent(contentToCheck) {
    var page_wait = window.setInterval(function () {
        let current_content = woaFrame.contentWindow.document.getElementById(contentToCheck);
        if (current_content !== null) {
            alert(current_content.innerText)
            window.clearInterval(page_wait);
        }
    }, 50)
}
