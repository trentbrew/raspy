function getBookmarks() {
  const bookmarksList = document.getElementById("bookmarks");

  function displayBookmarks(bookmarks, parentElement) {
    bookmarks.forEach((bookmark) => {
      const li = document.createElement("li");
      if (bookmark.url) {
        // Bookmark item
        const link = document.createElement("a");
        link.href = bookmark.url;
        link.textContent = bookmark.title;
        link.target = "_blank";
        li.appendChild(link);
      } else if (bookmark.children) {
        // Bookmark folder
        li.textContent = bookmark.title;
        const ul = document.createElement("ul");
        displayBookmarks(bookmark.children, ul);
        li.appendChild(ul);
      }
      parentElement.appendChild(li);
    });
  }

  // Fetch bookmarks and display them
  chrome.bookmarks.getTree(function (bookmarkTree) {
    displayBookmarks(bookmarkTree, bookmarksList);
  });
}

export default getBookmarks;
