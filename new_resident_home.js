var woaFrame = document.getElementById("MyFrame");
const page_content = ["panel_news_content", "panel_messages_content", "panel_classifieds_content", "panel_resource_content", "panel_cal_content", "panel_discuss_content"];
for (let i = 0; i < page_content.length; i++) {
    var page_wait = window.setInterval(function () {
        let current_content = woaFrame.contentWindow.document.getElementById(page_content[i]);
        if (current_content !== null) {
            window.clearInterval(page_wait);
            alert(current_content.innerText)
        }
    }, 50)
}
