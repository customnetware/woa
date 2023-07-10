var woaFrame = document.getElementById("residentHome");
var profileData = document.getElementById("profile_data").getElementsByClassName("card-body");
var testWait = setInterval(function () {
    let current_content = woaFrame.contentWindow.document.getElementById("panel_messages_content");
    if (current_content !== null) {
        let current_content_class = current_content.getElementsByClassName("message")
        if (current_content_class !== null) {
            if (current_content_class.length > 0) {
                clearInterval(testWait)
                let content_pp = document.createElement("p")
                content_pp.setAttribute('style', 'padding: 0; margin-top: 0; px; margin-bottom: 3px;');
                let contentURL = current_content_class[0].getElementsByTagName("a")[0].getAttribute("onclick");
                let contentText = current_content_class[0].getElementsByTagName("a")[0].getAttribute("data-tooltip-title").split("by");
                let contentBody = current_content_class[0].getElementsByTagName("a")[0].getAttribute("data-tooltip-text");
            
                profileData[1].innerHTML = "<b>" + contentText[0] + "</b><br />" + contentBody + "<a onclick=" + contentURL + " href='#'>&nbsp;<i>Read More</i></a>";
            }
        }
    }
}, 200);
