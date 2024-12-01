function getTabs() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({}, (tabs) => {
      resolve(tabs);
    });
  });
}
