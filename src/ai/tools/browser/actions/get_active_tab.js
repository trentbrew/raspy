function getActiveTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        reject(new Error("No active tab found"));
      } else {
        resolve(tabs[0]);
      }
    });
  });
}
