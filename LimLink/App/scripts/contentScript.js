chrome.runtime.onMessage.addListener((request, sender, sendResponce) => {
    if (request.message === "changeColor") {
        console.log("changeColor");

        let blockedDomains = request.BlockedDomain;
        let blockedWords = request.BlockedWords;

        var currentPage = location.href;
        for (var i = 0; i < blockedDomains.length; i++) {
            if (currentPage.indexOf(blockedDomains[i]) != -1) {
                sendResponce(false);
                return true;
            }
        }

        let links = document.getElementsByTagName("a");
        let validLinks = [];

        function link_is_external(link_element) {
            return link_element.host !== window.location.host;
        }

        let allUnBlockedLinks = [];
        for (let i = 0; i < links.length; i++) {
            var href = $(links[i]).attr('href');
            if (href != undefined && href != "") {
                var myArray = blockedWords.filter(function (el) {
                    return href.indexOf(el) < 0;
                });
                if (myArray != undefined && myArray.length == blockedWords.length)
                    allUnBlockedLinks.push(links[i]);
            }
        }

        for (let i = 0; i < allUnBlockedLinks.length; i++) {
            if (allUnBlockedLinks[i].style != undefined)
                allUnBlockedLinks[i].style.backgroundColor = "#ffcc00";

            var href = $(allUnBlockedLinks[i]).attr('href');

            if (link_is_external(allUnBlockedLinks[i])) {
                validLinks.push(href);
            }
            else {
                if (href == "/") {
                    validLinks.push(allUnBlockedLinks[i].host);
                }
                else if (href.indexOf(allUnBlockedLinks[i].host) == -1) {
                    if (href.startsWith("/"))
                        validLinks.push(allUnBlockedLinks[i].host + href);
                    else
                        validLinks.push(allUnBlockedLinks[i].host + "/" + href);
                }
                else {
                    validLinks.push(href);
                }
            }
            //if ($(allUnBlockedLinks[i]).attr('href') != "" && $(allUnBlockedLinks[i]).attr('href') != undefined) {

            //    var href = $(allUnBlockedLinks[i]).attr('href');
            //    if (link_is_external(allUnBlockedLinks[i])) {
            //        if (href != "#" && href != "javascript:void(0)" && href != "javascript:;" && href != "javascript:void(0);")
            //            validLinks.push(href);
            //    }
            //    else {
            //        if (href != "#" && href != "javascript:void(0)" && href != "javascript:;" && href != "javascript:void(0);") {
            //            if (href == "/") {
            //                validLinks.push(allUnBlockedLinks[i].host);
            //            }
            //            else if (href.indexOf(allUnBlockedLinks[i].host) == -1) {
            //                validLinks.push(allUnBlockedLinks[i].host + "/" + href);
            //            }
            //            else {
            //                validLinks.push(href);
            //            }
            //        }
            //    }
            //}
        }

        sendResponce({ length: allUnBlockedLinks.length, allLink: validLinks });
    }
    if (request.message === "resetColor") {

        let blockedDomains = request.BlockedDomain;
        let blockedWords = request.BlockedWords;

        var currentPage = location.href;
        for (var i = 0; i < blockedDomains.length; i++) {
            if (currentPage.indexOf(blockedDomains[i]) != -1) {
                sendResponce(false);
                return true;
            }
        }

        let links = document.getElementsByTagName("a");
        let validLinks = [];

        function link_is_external(link_element) {
            return link_element.host !== window.location.host;
        }

        let allUnBlockedLinks = [];
        for (let i = 0; i < links.length; i++) {
            var href = $(links[i]).attr('href');
            if (href != undefined && href != "") {
                var myArray = blockedWords.filter(function (el) {
                    return href.indexOf(el) < 0;
                });
                if (myArray != undefined && myArray.length == blockedWords.length)
                    allUnBlockedLinks.push(links[i]);
            }
        }

        for (let i = 0; i < allUnBlockedLinks.length; i++) {
            if (allUnBlockedLinks[i].style != undefined)
                allUnBlockedLinks[i].style.backgroundColor = "";

            var href = $(allUnBlockedLinks[i]).attr('href');

            if (link_is_external(allUnBlockedLinks[i])) {
                validLinks.push(href);
            }
            else {
                if (href == "/") {
                    validLinks.push(allUnBlockedLinks[i].host);
                }
                else if (href.indexOf(allUnBlockedLinks[i].host) == -1) {
                    if (href.startsWith("/"))
                        validLinks.push(allUnBlockedLinks[i].host + href);
                    else
                        validLinks.push(allUnBlockedLinks[i].host + "/" + href);
                }
                else {
                    validLinks.push(href);
                }
            }
            
        }

        sendResponce({ length: allUnBlockedLinks.length, allLink: validLinks });
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

        let blockedDomains = request.BlockedDomain;
        let blockedWords = request.BlockedWords;

        var currentPage = location.href;
        for (var i = 0; i < blockedDomains.length; i++) {
            if (currentPage.indexOf(blockedDomains[i]) != -1) {
                sendResponce(false);
                return true;
            }
        }

        var links = document.getElementsByTagName("a");

        let allUnBlockedLinks = [];
        for (let i = 0; i < links.length; i++) {
            var href = $(links[i]).attr('href');
            if (href != undefined && href != "") {
                var myArray = blockedWords.filter(function (el) {
                    return href.indexOf(el) < 0;
                });
                if (myArray != undefined && myArray.length == blockedWords.length)
                    allUnBlockedLinks.push(links[i]);
            }
        }

        let responseLinks = [], lstInternalLink = [], lstExternalLink = [], lstDoFollowLink = [], lstNoFollowLink = [], lstSponsoredLink = [], lstUserGeneratedLink = [];
        for (var i = 0; i < allUnBlockedLinks.length; i++) {
            var href = $(allUnBlockedLinks[i]).attr('href');
            var newHREF = "";
            if (href == "/") {
                newHREF = allUnBlockedLinks[i].host;
            }
            else if (href.indexOf(allUnBlockedLinks[i].host) == -1) {
                if (href.startsWith("/"))
                    newHREF = allUnBlockedLinks[i].host + href;
                else
                    newHREF = allUnBlockedLinks[i].host + "/" + href;
            }
            else {
                newHREF = href;
            }

            if (link_is_external(allUnBlockedLinks[i])) {
                externalLinks += 1;
                lstExternalLink.push(newHREF);
                //$(allUnBlockedLinks[i]).css("background-color", "rgba(90, 216, 13, 1)");
            } else {
                internalLinks += 1;
                lstInternalLink.push(newHREF);
                //$(allUnBlockedLinks[i]).css("background-color", "rgba(255, 204, 0, 1)");
            }
            if (allUnBlockedLinks[i].rel.indexOf("nofollow") != -1) {
                nofollowLinks += 1;
                lstNoFollowLink.push(newHREF);
                //$(allUnBlockedLinks[i]).css("background-color", "rgba(255, 91, 110, 1)");
            }
            else {
                dofollowLinks += 1;
                lstDoFollowLink.push(newHREF);
                //$(allUnBlockedLinks[i]).css("background-color", "rgba(124, 137, 255, 1)");
            }
            if (allUnBlockedLinks[i].rel.indexOf("sponsored") != -1) {
                sponsoredLinks += 1;
                lstSponsoredLink.push(newHREF);
                //$(allUnBlockedLinks[i]).css("background-color", "rgba(244, 160, 160, 1)");
            }
            if (allUnBlockedLinks[i].rel.indexOf("ugc") != -1) {
                ugcLinks += 1;
                lstUserGeneratedLink.push(newHREF);
                //$(allUnBlockedLinks[i]).css("background-color", "rgba(119, 214, 197, 1)");
            }
            console.log(allUnBlockedLinks[i].rel);

            if (href == "/") {
                responseLinks.push(allUnBlockedLinks[i].host);
            }
            else if (href.indexOf(allUnBlockedLinks[i].host) == -1) {
                if (href.startsWith("/"))
                    responseLinks.push(allUnBlockedLinks[i].host + href);
                else
                    responseLinks.push(allUnBlockedLinks[i].host + "/" + href);
            }
            else {
                responseLinks.push(href);
            }
        }

        sendResponce({
            response: "Response from background script",
            totalLinks: allUnBlockedLinks.length,
            allLinks: responseLinks,
            externalLinks: externalLinks,
            internalLinks: internalLinks,
            nofollowLinks: nofollowLinks,
            dofollowLinks: dofollowLinks,
            sponsoredLinks: sponsoredLinks,
            ugcLinks: ugcLinks,
            lstInternal: lstInternalLink,
            lstExternal: lstExternalLink,
            lstDoFollow: lstDoFollowLink,
            lstNoFollow: lstNoFollowLink,
            lstSponsored: lstSponsoredLink,
            lstUserGenerated: lstUserGeneratedLink,
        });
        console.log("total links  " + allUnBlockedLinks.length);
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

    //  get all links
    if (request.message === "HightLightByType") {
        let externalLinks = 0;
        let internalLinks = 0;
        let nofollowLinks = 0;
        let dofollowLinks = 0;
        let sponsoredLinks = 0;
        let ugcLinks = 0;
        function link_is_external(link_element) {
            return link_element.host !== window.location.host;
        }

        let blockedDomains = request.BlockedDomain;
        let blockedWords = request.BlockedWords;

        var currentPage = location.href;
        for (var i = 0; i < blockedDomains.length; i++) {
            if (currentPage.indexOf(blockedDomains[i]) != -1) {
                sendResponce(false);
                return true;
            }
        }

        var links = document.getElementsByTagName("a");

        let allUnBlockedLinks = [];
        for (let i = 0; i < links.length; i++) {
            var href = $(links[i]).attr('href');
            if (href != undefined && href != "") {
                var myArray = blockedWords.filter(function (el) {
                    return href.indexOf(el) < 0;
                });
                if (myArray != undefined && myArray.length == blockedWords.length)
                    allUnBlockedLinks.push(links[i]);
            }
        }

        let responseLinks = [];
        for (var i = 0; i < allUnBlockedLinks.length; i++) {

            $(allUnBlockedLinks[i]).css("background-color", "");

            if (link_is_external(allUnBlockedLinks[i])) {
                externalLinks += 1;
                if (request.type == "External")
                    $(allUnBlockedLinks[i]).css("background-color", "rgba(90, 216, 13, 1)");
            } else {
                internalLinks += 1;
                if (request.type == "Internal")
                    $(allUnBlockedLinks[i]).css("background-color", "rgba(255, 204, 0, 1)");
            }
            if (allUnBlockedLinks[i].rel.indexOf("nofollow") != -1) {
                nofollowLinks += 1;
                if (request.type == "NoFollow")
                    $(allUnBlockedLinks[i]).css("background-color", "rgba(255, 91, 110, 1)");
            }
            else {
                dofollowLinks += 1;
                if (request.type == "DoFollow")
                    $(allUnBlockedLinks[i]).css("background-color", "rgba(124, 137, 255, 1)");
            }
            if (allUnBlockedLinks[i].rel.indexOf("sponsored") != -1) {
                sponsoredLinks += 1;
                if (request.type == "Sponsored")
                    $(allUnBlockedLinks[i]).css("background-color", "rgba(244, 160, 160, 1)");
            }
            if (allUnBlockedLinks[i].rel.indexOf("ugc") != -1) {
                ugcLinks += 1;
                if (request.type == "UGC")
                    $(allUnBlockedLinks[i]).css("background-color", "rgba(119, 214, 197, 1)");
            }
            console.log(allUnBlockedLinks[i].rel);

            var href = $(allUnBlockedLinks[i]).attr('href');
            if (href == "/") {
                responseLinks.push(allUnBlockedLinks[i].host);
            }
            else if (href.indexOf(allUnBlockedLinks[i].host) == -1) {
                if (href.startsWith("/"))
                    responseLinks.push(allUnBlockedLinks[i].host + href);
                else
                    responseLinks.push(allUnBlockedLinks[i].host + "/" + href);
            }
            else {
                responseLinks.push(href);
            }
        }

        sendResponce({
            response: "Response from background script",
            totalLinks: allUnBlockedLinks.length,
            allLinks: responseLinks,
            externalLinks: externalLinks,
            internalLinks: internalLinks,
            nofollowLinks: nofollowLinks,
            dofollowLinks: dofollowLinks,
            sponsoredLinks: sponsoredLinks,
            ugcLinks: ugcLinks,
        });
    }

    //  status check
    if (request.message === "statusCheck") {
        let blockedDomains = request.BlockedDomain;
        let blockedWords = request.BlockedWords;

        var currentPage = location.href;
        for (var i = 0; i < blockedDomains.length; i++) {
            if (currentPage.indexOf(blockedDomains[i]) != -1) {
                sendResponce(false);
                return true;
            }
        }

        var links = document.getElementsByTagName("a");

        let allUnBlockedLinks = [];
        for (let i = 0; i < links.length; i++) {
            var href = $(links[i]).attr('href');
            if (href != undefined && href != "") {
                var myArray = blockedWords.filter(function (el) {
                    return href.indexOf(el) < 0;
                });
                if (myArray != undefined && myArray.length == blockedWords.length)
                    allUnBlockedLinks.push(links[i]);
            }
        }

        var sendLink = [];
        let responseLinks = [];
        for (let i = 0; i <= allUnBlockedLinks.length; i++) {
            try {
                sendLink.push(allUnBlockedLinks[i].getAttribute("href"));

                var href = $(allUnBlockedLinks[i]).attr('href');
                if (href == "/") {
                    responseLinks.push(allUnBlockedLinks[i].host);
                }
                else if (href.indexOf(allUnBlockedLinks[i].host) == -1) {
                    if (href.startsWith("/"))
                        responseLinks.push(allUnBlockedLinks[i].host + href);
                    else
                        responseLinks.push(allUnBlockedLinks[i].host + "/" + href);
                }
                else {
                    responseLinks.push(href);
                }

            } catch (error) { }
        }
        sendResponce({
            responceMessage: "All links are here",
            linksAll: sendLink,
            fullLinks: responseLinks,
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

    // change color of status
    if (request.message === "HightLightByStatus") {
        console.log("request", request);
        var links = document.getElementsByTagName("a");
        let j = 0;

        for (let i = 0; i < request.rightLinks.length; i++) {
            $(`[href="${request.rightLinks[i]}"]`).css("background-color", "");
            if (request.type == "Valid")
                $(`[href="${request.rightLinks[i]}"]`).css("background-color", "green");
        }

        for (let i = 0; i < request.fourOfourerrorLinks.length; i++) {
            $(`[href="${request.fourOfourerrorLinks[i]}"]`).css("background-color", "");
            if (request.type == "404")
                $(`[href="${request.fourOfourerrorLinks[i]}"]`).css(
                    "background-color",
                    "yellow"
                );
        }
        for (let i = 0; i < request.clientErrorLinks.length; i++) {
            $(`[href="${request.clientErrorLinks[i]}"]`).css("background-color", "");
            if (request.type == "NoDomain")
                $(`[href="${request.clientErrorLinks[i]}"]`).css(
                    "background-color",
                    "red"
                );
        }
        for (let i = 0; i < request.wothoutHrefLinks.length; i++) {
            $(`[href="${request.wothoutHrefLinks[i]}"]`).css("background-color", "");
            if (request.type == "Empty")
                $(`[href="${request.wothoutHrefLinks[i]}"]`).css(
                    "background-color",
                    "grey"
                );
        }
        for (let i = 0; i < request.serverErrorLinks.length; i++) {
            $(`[href="${request.serverErrorLinks[i]}"]`).css("background-color", "");
            if (request.type == "ServerError")
                $(`[href="${request.serverErrorLinks[i]}"]`).css(
                    "background-color",
                    "orange"
                );
        }
        for (let i = 0; i < request.reedirectLinks.length; i++) {
            $(`[href="${request.reedirectLinks[i]}"]`).css("background-color", "");
            if (request.type == "Redirect")
                $(`[href="${request.reedirectLinks[i]}"]`).css(
                    "background-color",
                    "purple"
                );
        }
        for (let i = 0; i < request.otherLinks.length; i++) {
            $(`[href="${request.otherLinks[i]}"]`).css("background-color", "");
            if (request.type == "Broken")
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



(function () {

    var init = function () {

        chrome.storage.local.get(['ApppState', 'UserSetting'], function (result) {
            if (result != undefined && result.ApppState != undefined && result.ApppState == true) {
                if (result.UserSetting != undefined) {
                    Settings = result.UserSetting;
                    if (Settings.GoogleURLs) {
                        var prerenderText = 'Lemlinks: Google has added a prerender tag to this URL which means that Google believes that users are mostly going to click through this result. This happens generally for brand queries and means that the keyword is very difficult to rank for';
                        processPage({
                            preRenderText: prerenderText
                        });
                    }
                }
            }
        });
    };

    var Prefix = (function () {

        var _prefix = '';

        var init = function (prefix) {
            _prefix = prefix;
        };

        var get = function (s) { return _prefix + '-' + s; };
        var id = function (s) { return '#' + get(s); };
        var cc = function (s) { return '.' + get(s); };
        var data = function (s) {
            return _prefix + '_' + s.replace(/-/g, '_');
        };

        return {
            init: init,
            _: get,
            get: get,
            id: id,
            cc: cc,
            data: data
        };

    })();

    Prefix.init('smin');

    var processPage = function (params) {
        $('#ires .g, #res .g').map(function (i, node) {
            var $node = $(node);
            var link = $node.find('link[rel=prerender]')[0];
            if (!link) return;
            var $icon = $('<span>', { class: Prefix.get('google-prerender') });
            $icon.attr('title', params.preRenderText);
            $icon.css({
                display: 'inline-block',
                width: '24px',
                height: '16px',
                background: 'url(' + chrome.extension.getURL('img/prerender.png') + ') left no-repeat',
                backgroundSize: 'contain',
                marginLeft: '16px'
            });
            let $parent = $node.find('cite').parent();
            let $next = $node.next();
            if ($next.hasClass('B6fmyf')) {
                if ($next.find('.fl')[0]) {
                    $parent = $next.find('.eFM0qc');
                }
            }
            $parent.append($icon);
        });
    };


    return {
        init: init
    };

})().init();


