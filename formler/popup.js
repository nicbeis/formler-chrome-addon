// Initialize button
 let executeBtn = document.getElementById("execute");
//  let openFill = document.getElementById("openAndFill");

// When the button is clicked, inject fillForm() into current page
executeBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: fillForm,
  });
});

// openFill.addEventListener("click",  () => {
  
// });

// The body of this function will be execuetd as a content script inside the
// current page
function fillForm() {
  

  chrome.storage.sync.get("dynamicIdList", ({ dynamicIdList }) => {
    chrome.storage.sync.get("dynamicValueList", ({ dynamicValueList}) => {
      for (let i = 0; i < dynamicIdList.length; i++) {
        let target = document.getElementById(dynamicIdList[i]);
        console.log (target.type);
        target.focus();
        if (target.type === "checkbox") {
          if (dynamicValueList[i] === "true" && target.checked === false)
            target.click();
          else if (dynamicValueList[i] === "true" && target.checked === true)
            continue;
          else if (dynamicValueList[i] === "false" && target.checked === true)
            target.click();
          else
            continue;
        }
        else{
          target.value = dynamicValueList[i];
          target.dispatchEvent(new Event('change'));
        }
      }
      chrome.storage.sync.get("autoSubmit", function(result) {
        chrome.storage.sync.get("subTargetName", function(result1) {
          if (result1.subTargetName != "" && result.autoSubmit)
            document.getElementsByName("submit")[0].click();
            // console.log(document.getElementsByName("submit"));
        })
      })
      // chrome.tabs.remove(tab.id);
    });
  });
}
