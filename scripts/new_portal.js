
 let replyButton = portal.getElementById((selectedPostID !== "replyContent") ? selectedPostID.replace("post", "lnkTopicReply") : "lnkAddTopic")
function portalOpenForm(buttonID,groupID,txtToPost) {
    document.getElementById("woaFrame").src = pageLocation("/Discussion/28118~"+groupID)
    let portal = document.getElementById('woaFrame').contentWindow.document
    setTimeout(function () {       
        if (buttonID !== null) {
            buttonID.click()
            postalFormInput()
        } else {
            portalOpenForm(portal)
        }
    }, 500)
}
function portalFormInput(portal) {
    setTimeout(function () {
        if (portal.getElementById("txt_post_body") !== null) {
            portal.getElementById("txt_post_body").innerHTML = txtToPost
            portal.getElementsByClassName("x-btn-text save-button")[0].click()
            portalInputConfirm(portal)
        } else {
            portalFormInput(portal)
        }
    }, 500)
}
function portalInputConfirm(portal) {
    setTimeout(function () {
        if (frameWindow.document.getElementsByClassName(" x-btn-text").length > 0) {
            frameWindow.document.getElementsByClassName(" x-btn-text")[4].click()
        } else {
            portalInputConfirm(portal)
        }
    }, 10000)
}