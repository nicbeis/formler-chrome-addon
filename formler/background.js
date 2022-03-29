chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ urlValue: "" });
  chrome.storage.sync.set({ executeOnStartup: false });
  chrome.storage.sync.set({ onceADay: false });
  chrome.storage.sync.set({ autoSubmit: false });
  chrome.storage.sync.set({ subTargetName: "" });
  chrome.storage.sync.set({ dynamicIdList: [] });
  chrome.storage.sync.set({ dynamicValueList: [] });
  chrome.storage.sync.set({ triggerButton: false});
  chrome.storage.sync.set({currentIndex: 0});
  chrome.storage.sync.set({ currentIndexNumbers: [] });
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.sync.get("urlValue", function(result) {
    if (result.urlValue != "") {
      chrome.storage.sync.get("executeOnStartup", function(result1) {
        if (result1.executeOnStartup) {
          chrome.tabs.create({
            url: result.urlValue
          });
        };
      });
    };
  });
});