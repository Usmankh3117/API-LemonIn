chrome.runtime.onMessage.addListener((request, sender, sendResponce) => {
    if (request.message === "changeColor") {
        console.log("changeColor");
        let links = document.getElementsByTagName("a");
        for (let i = 0; i < links.length; i++) {
            links[i].style.backgroundColor = "#90ee90";
        }
        sendResponce({ length: links.length });
    }
    // Blocked websites
    if (request.message === "blockedWebsites") {
        // console.log(request);
        let domainData = request.websitesDomain;
        // let hrefUrl = window.location.href;
        console.log("domainData", domainData);
        chrome.storage.local.get({ blockDOmiansList: [] }, function (result) {
            var blockDOmiansList = result.blockDOmiansList;
            blockDOmiansList.push({
                keyPairId: domainData,
                HasBeenUploadedYet: false,
            });
            chrome.storage.local.set(
                { blockDOmiansList: blockDOmiansList },
                function () {
                    chrome.storage.local.get("blockDOmiansList", function (result) {
                        console.log(result.blockDOmiansList);
                    });
                }
            );
        });
    }
    // }
    // Reolad page
    if (request.message === "reloadPage") {
        location.reload();
    }
    // links storage in chrome local storage
    if (request.message === "myLinksCheck") {
        var links = document.getElementsByTagName("a");
        var pageTitle = document.title;
        var sendLink = {
            id: Math.floor(Math.random() * 99999999 + 1),
            time: new Date().toLocaleString(),
            title: pageTitle,
            links: [],
        };
        for (let i = 0; i <= links.length; i++) {
            try {
                sendLink.links.push(links[i].getAttribute("href"));
            } catch (error) { }
        }
        console.log(sendLink);
        chrome.storage.local.get("keyData", (result) => {
            if (result.keyData) {
                let parse = JSON.parse(result.keyData);
                parse.push(sendLink);
                chrome.storage.local.set({ keyData: JSON.stringify(parse) }, () => {
                    console.log("sddgsfd");
                    sendResponce({ value: "okDone" });
                });
            } else {
                chrome.storage.local.set(
                    { keyData: JSON.stringify([sendLink]) },
                    function () {
                        console.log("Value is set to " + JSON.stringify([sendLink]));
                        console.log("dfsggfd");
                        sendResponce({ value: "okDone" });
                    }
                );
            }
        });
        // sendResponce({ value: "okDone" });
    }
    //  get all links
    if (request.message === "getAllLinks") {
        let externalLinks = 0;
        let internalLinks = 0;
        let nofollowLinks = 0;
        let dofollowLinks = 0;
        let sponsoredLinks = 0;
        let ugcLinks = 0;
        function link_is_external(link_element) {
            return link_element.host !== window.location.host;
        }
        var links = document.getElementsByTagName("a");
        for (var i = 0; i < links.length; i++) {
            if (link_is_external(links[i])) {
                externalLinks += 1;
            } else {
                internalLinks += 1;
            }
            if (links[i].rel == "nofollow") {
                nofollowLinks += 1;
            }
            else {
                dofollowLinks += 1;
            }
            if (links[i].rel == "sponsored") {
                sponsoredLinks += 1;
            }
            if (links[i].rel == "ugc") {
                ugcLinks += 1;
            }
        }

        sendResponce({
            response: "Response from background script",
            totalLinks: links.length,
            externalLinks: externalLinks,
            internalLinks: internalLinks,
            nofollowLinks: nofollowLinks,
            dofollowLinks: dofollowLinks,
            sponsoredLinks: sponsoredLinks,
            ugcLinks: ugcLinks,
        });
        console.log("total links  " + links.length);
        console.log(
            externalLinks +
            " " +
            internalLinks +
            " " +
            nofollowLinks +
            " " +
            sponsoredLinks +
            " " +
            ugcLinks
        );
    }
    //  status check
    if (request.message === "statusCheck") {
        var links = document.getElementsByTagName("a");

        var sendLink = [];
        for (let i = 0; i <= links.length; i++) {
            try {
                sendLink.push(links[i].getAttribute("href"));
            } catch (error) { }
        }
        sendResponce({
            responceMessage: "All links are here",
            linksAll: sendLink,
        });
    }
    // return all links
    if (request.message === "returnLink") {
        var links = document.getElementsByTagName("a");
        var sendLinks = [];
        for (let i = 0; i <= links.length; i++) {
            try {
                sendLinks.push(links[i].getAttribute("href"));
            } catch (error) { }
        }
        sendResponce({
            responceMessage: "Returning Links",
            linksAll: sendLinks,
        });
    }
    // change color of status
    if (request.message === "changeColorwithstatus") {
        console.log("request", request);
        var links = document.getElementsByTagName("a");
        let j = 0;
        console.log(
            "request with status",
            request,
            "fourOfourerrorLinks",
            request.fourOfourerrorLinks[3],
            "request.rightLink[i]",
            request.rightLinks[9]
        );
        for (let i = 0; i < request.rightLinks.length; i++) {
            $(`[href="${request.rightLinks[i]}"]`).css("background-color", "green");
        }
        for (let i = 0; i < request.fourOfourerrorLinks.length; i++) {
            $(`[href="${request.fourOfourerrorLinks[i]}"]`).css(
                "background-color",
                "yellow"
            );
        }
        for (let i = 0; i < request.clientErrorLinks.length; i++) {
            $(`[href="${request.clientErrorLinks[i]}"]`).css(
                "background-color",
                "red"
            );
        }
        for (let i = 0; i < request.wothoutHrefLinks.length; i++) {
            $(`[href="${request.wothoutHrefLinks[i]}"]`).css(
                "background-color",
                "grey"
            );
        }
        for (let i = 0; i < request.serverErrorLinks.length; i++) {
            $(`[href="${request.serverErrorLinks[i]}"]`).css(
                "background-color",
                "orange"
            );
        }
        for (let i = 0; i < request.reedirectLinks.length; i++) {
            $(`[href="${request.reedirectLinks[i]}"]`).css(
                "background-color",
                "purple"
            );
        }
        for (let i = 0; i < request.otherLinks.length; i++) {
            $(`[href="${request.otherLinks[i]}"]`).css("background-color", "blue");
        }
    }

    // for tabs show
    if (request.message === "showTabs") {
        var html = "";

        if (typeof window.getSelection != "undefined") {
            var sel = window.getSelection();

            if (sel.rangeCount) {
                var container = document.createElement("div");

                for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                    container.appendChild(sel.getRangeAt(i).cloneContents());
                }
                html = container.innerHTML;
            }
        } else if (typeof document.selection != "undefined") {
            if (document.selection.type == "Text") {
                html = document.selection.createRange().htmlText;
            }
        }
        var el = document.createElement("html");
        el.innerHTML = html;
        var hrefs = [];
        var A = el.getElementsByTagName("a");
        A = Array.from(A);
        A.forEach((element, index) => {
            hrefs.push(element.href);
        });
        console.log("Href : ", hrefs);
        if (hrefs.length == 0) {
            alert("Please Select Some Text for Open Links");
        } else {
            for (let i = 0; i <= hrefs.length; i++) {
                console.log("In Link Opener");
                window.open(hrefs[i]);
            }
        }
    }
    return true;
});
