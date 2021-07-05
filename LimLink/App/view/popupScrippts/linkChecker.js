$(document).ready(function() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(
          activeTab.id,
          { message: "statusCheck" },
          (responce) => {
            console.log("responce", responce);
            let totalInfo = responce.linksAll;
            let goodLinks = 0;
            let fourOfourLinks = 0;
            let clientLinksError = 0;
            let redirectLinksError = 0;
            let hrefOutLinks = 0;
            let otherLinksStatus = 0;
            let linksNull = 0;
            let serverLinksError = 0;
            let allValues = 0;
  
            let i = 0;
            let nullLinks = [];
            let rightLinks = [];
            let fourOfourerrorLinks = [];
            let clientErrorLinks = [];
            let wothoutHrefLinks = [];
            let reedirectLinks = [];
            let serverErrorLinks = [];
            let otherLinks = [];

            $(".v1_558").text(`${totalInfo.length} total links`);
            async function requestFunction() {
            //   $("#extractedLinks").show();
            //   $("#totalExtracting").text(allValues - 1);
              if (i > totalInfo.length) {
                  $(".loader").css({ "display": "none" });
                // $("#statusDisplay").show();
                // console.log(
                //   "resoncse",
                //   responce,
                //   "clientLinksError",
                //   clientLinksError,
                //   "hrefOutLinks",
                //   hrefOutLinks,
                //   "serverLinksError",
                //   serverLinksError,
                //   "404",
                //   fourOfourLinks,
                //   "goodLink",
                //   goodLinks,
                //   "allValue",
                //   allValues
                // );
                // $("#linksGood").text(goodLinks);/
                // $("#fOfLinks").text(fourOfourLinks);/
                // $("#brokenLinks").text(clientLinksError);
                // $("#reDirect").text(redirectLinksError);
                // $("#serverLinks").text(serverErrorLinks);
                // $("#withoutHref").text(hrefOutLinks);
                // $("#otherLinks").text(otherLinksStatus);
                // $("#linkNull").text(linksNull - 1);
  
                chrome.tabs.sendMessage(activeTab.id, {
                  message: "changeColorwithstatus",
                  nullLinks: nullLinks,
                  rightLinks: rightLinks,
                  fourOfourerrorLinks: fourOfourerrorLinks,
                  clientErrorLinks: clientErrorLinks,
                  wothoutHrefLinks: wothoutHrefLinks,
                  reedirectLinks: reedirectLinks,
                  serverErrorLinks: serverErrorLinks,
                  otherLinks: otherLinks,
                });
                return;
              } else {
                // console.log("totalinfo", totalInfo);
                if (totalInfo == undefined) {
                  alert("Please Reload the Page!");
                  document.location.reload();
                } else if (totalInfo[i] == null) {
                  console.log("it's null!");
                  linksNull += 1;
                  nullLinks.push(totalInfo[i]);
  
                  i++;
                  allValues++;
                  requestFunction();
                } else {
                  var request = new XMLHttpRequest();
                  request.open("GET", totalInfo[i], true);
                  request.onreadystatechange = function () {
                    if (request.readyState === 4) {
                      console.log("kjsdfj");
                      if (request.status == 404) {
                        fourOfourLinks = fourOfourLinks + 1;
                        fourOfourerrorLinks.push(totalInfo[i]);
                        console.log("wrong request", fourOfourLinks);
                        $(".v1_547").text(fourOfourLinks);
                        i++;
                        allValues++;
                        requestFunction();
                      } else if (request.status >= 400 && request.status <= 499) {
                        clientLinksError += 1;
                        clientErrorLinks.push(totalInfo[i]);
                        $(".v1_551").text(clientLinksError);
                        console.log("wrong request", clientLinksError);
                        i++;
                        allValues++;
                        requestFunction();
                      } else if (request.status >= 200 && request.status <= 299) {
                        goodLinks = goodLinks + 1;
                        rightLinks.push(totalInfo[i]);
                        console.log("right request", goodLinks);
                        $(".v1_546").text(goodLinks);
                        i++;
                        allValues++;
                        requestFunction();
                      } else if (request.status == 0) {
                        hrefOutLinks += 1;
                        wothoutHrefLinks.push(totalInfo[i]);
                        console.log("null request");
                        $(".v1_549").text(hrefOutLinks);
                        i++;
                        allValues++;
                        requestFunction();
                      } else if (request.status >= 300 && request.status <= 399) {
                        redirectLinksError += 1;
                        reedirectLinks.push(totalInfo[i]);
                        console.log("redirect status");
                        $(".v1_550").text(redirectLinksError);
                        i++;
                        allValues++;
                        requestFunction();
                      } else if (request.status >= 500 && request.status <= 599) {
                        console.log("server error status");
                        serverLinksError += 1;
                        serverErrorLinks.push(totalInfo[i]);
                        $(".v1_552").text(serverErrorLinks);
                        i++;
                        allValues++;
                        requestFunction();
                      } else {
                        otherLinksStatus += 1;
                        otherLinks.push(totalInfo[i]);
  
                        console.log("this is other status", request.status);
                        i++;
                        allValues++;
                        requestFunction();
                      }
                    }
                  };
                  request.send();
                }
              }
            }
            requestFunction();
          }
        );
    });
});



// function requestFunction(links) {
//     return new Promise((resolve, reject) => {
         
//     });

//     $("#extractedLinks").show();
//     $("#totalExtracting").text(allValues - 1);
//     if (i > totalInfo.length) {
//       $("#statusDisplay").show();
//       console.log(
//         "resoncse",
//         responce,
//         "clientLinksError",
//         clientLinksError,
//         "hrefOutLinks",
//         hrefOutLinks,
//         "serverLinksError",
//         serverLinksError,
//         "404",
//         fourOfourLinks,
//         "goodLink",
//         goodLinks,
//         "allValue",
//         allValues
//       );
//       $("#linksGood").text(goodLinks);
//       $("#fOfLinks").text(fourOfourLinks);
//       $("#brokenLinks").text(clientLinksError);
//       $("#reDirect").text(redirectLinksError);
//       $("#serverLinks").text(serverErrorLinks);
//       $("#withoutHref").text(hrefOutLinks);
//       $("#otherLinks").text(otherLinksStatus);
//       $("#linkNull").text(linksNull - 1);

//       chrome.tabs.sendMessage(activeTab.id, {
//         message: "changeColorwithstatus",
//         nullLinks: nullLinks,
//         rightLinks: rightLinks,
//         fourOfourerrorLinks: fourOfourerrorLinks,
//         clientErrorLinks: clientErrorLinks,
//         wothoutHrefLinks: wothoutHrefLinks,
//         reedirectLinks: reedirectLinks,
//         serverErrorLinks: serverErrorLinks,
//         otherLinks: otherLinks,
//       });
//       return;
//     } else {
//       // console.log("totalinfo", totalInfo);
//       if (totalInfo == undefined) {
//         alert("Please Reload the Page!");
//         document.location.reload();
//       } else if (totalInfo[i] == null) {
//         console.log("it's null!");
//         linksNull += 1;
//         nullLinks.push(totalInfo[i]);

//         i++;
//         allValues++;
//         requestFunction();
//       } else {
//         var request = new XMLHttpRequest();
//         request.open("GET", totalInfo[i], true);
//         request.onreadystatechange = function () {
//           if (request.readyState === 4) {
//             console.log("kjsdfj");
//             if (request.status == 404) {
//               fourOfourLinks = fourOfourLinks + 1;
//               fourOfourerrorLinks.push(totalInfo[i]);
//               console.log("wrong request", fourOfourLinks);
//               i++;
//               allValues++;
//               requestFunction();
//             } else if (request.status >= 400 && request.status <= 499) {
//               clientLinksError += 1;
//               clientErrorLinks.push(totalInfo[i]);

//               console.log("wrong request", clientLinksError);
//               i++;
//               allValues++;
//               requestFunction();
//             } else if (request.status >= 200 && request.status <= 299) {
//               goodLinks = goodLinks + 1;
//               rightLinks.push(totalInfo[i]);
//               console.log("right request", goodLinks);
//               i++;
//               allValues++;
//               requestFunction();
//             } else if (request.status == 0) {
//               hrefOutLinks += 1;
//               wothoutHrefLinks.push(totalInfo[i]);
//               console.log("null request");
//               i++;
//               allValues++;
//               requestFunction();
//             } else if (request.status >= 300 && request.status <= 399) {
//               redirectLinksError += 1;
//               reedirectLinks.push(totalInfo[i]);
//               console.log("redirect status");
//               i++;
//               allValues++;
//               requestFunction();
//             } else if (request.status >= 500 && request.status <= 599) {
//               console.log("server error status");
//               serverLinksError += 1;
//               serverErrorLinks.push(totalInfo[i]);

//               i++;
//               allValues++;
//               requestFunction();
//             } else {
//               otherLinksStatus += 1;
//               otherLinks.push(totalInfo[i]);

//               console.log("this is other status", request.status);
//               i++;
//               allValues++;
//               requestFunction();
//             }
//           }
//         };
//         request.send();
//       }
//     }
//   }