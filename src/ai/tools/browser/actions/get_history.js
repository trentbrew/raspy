function getHistory() {
  return new Promise((resolve, reject) => {
    chrome.history.search({ text: "", maxResults: 100 }, (results) => {
      resolve(results);
    });
  });
}
