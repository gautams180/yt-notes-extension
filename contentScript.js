(() => {
    let youtubeLeftControls, youtubePlayer;
    let currentVideo = "";
    let currentVideoBookmarks = [];
    let wasPlaying = false;

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoId } = obj;

        if(type === "NEW") {
            currentVideo = videoId;
            newVideoLoaded();
        } else if(type === "PLAY") {
            youtubePlayer.currentTime = value; 
        } else if( type === "DELETE" ) {
            currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time != value);
            chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentVideoBookmarks) });

            response(currentVideoBookmarks);
        }
    });

    const fetchBookmarks = () => {
        return new Promise((resolve) => {
            chrome.storage.sync.get([currentVideo], (obj) => {
                resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
            });
        });
    };

    const newVideoLoaded = async () => {
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];

        currentVideoBookmarks = await fetchBookmarks();

        if(!bookmarkBtnExists) {
            console.log("BTN does not exist");

            // Create wrapper container
            const bookmarkInputContainer = document.createElement("div");
            bookmarkInputContainer.className = "bookmarkInputContainer";

            const bookmarkNoteInput = document.createElement("input");
            bookmarkNoteInput.className = "bookmarkInput";
            bookmarkNoteInput.type = "text";
            bookmarkNoteInput.placeholder = "Enter note here";

            // Create icons row
            const iconsRow = document.createElement("div");
            iconsRow.className = "bookmarkIconsRow";

            // Cross icon (cancel)
            const crossIcon = document.createElement("span");
            crossIcon.className = "bookmarkIcon crossIcon";
            crossIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
            crossIcon.title = "Cancel";

            // Check icon (save)
            const checkIcon = document.createElement("span");
            checkIcon.className = "bookmarkIcon checkIcon";
            checkIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            checkIcon.title = "Save bookmark";

            iconsRow.appendChild(crossIcon);
            iconsRow.appendChild(checkIcon);

            bookmarkInputContainer.appendChild(bookmarkNoteInput);
            bookmarkInputContainer.appendChild(iconsRow);

            const moviePlayer = document.getElementById("movie_player");
            moviePlayer.appendChild(bookmarkInputContainer);

            const bookmarkBtn = document.createElement("img");

            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.className = "ytp-button bookmark-btn";
            bookmarkBtn.title = "Click to bookmark current timestamp";

            youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
            youtubePlayer = document.getElementsByClassName("video-stream")[0];

            // Helper functions for showing/hiding popup
            const showPopup = () => {
                wasPlaying = !youtubePlayer.paused;
                youtubePlayer.pause();
                bookmarkInputContainer.classList.add("visible");
                bookmarkNoteInput.focus();
            };

            const hidePopup = () => {
                bookmarkInputContainer.classList.remove("visible");
                bookmarkNoteInput.value = "";
                if (wasPlaying) {
                    youtubePlayer.play();
                }
            };

            const saveAndClose = () => {
                addNewBookmarkEventHandler(bookmarkNoteInput);
                hidePopup();
            };

            youtubeLeftControls.appendChild(bookmarkBtn);
            bookmarkBtn.addEventListener("click", () => {
                if (bookmarkInputContainer.classList.contains("visible")) {
                    hidePopup();
                } else {
                    showPopup();
                }
            });

            // Cross icon closes without saving
            crossIcon.addEventListener("click", hidePopup);

            // Check icon saves and closes
            checkIcon.addEventListener("click", saveAndClose);

            // Stop keyboard events from propagating to YouTube player
            const stopPropagation = (e) => e.stopPropagation();
            bookmarkNoteInput.addEventListener("keydown", (e) => {
                e.stopPropagation();
                if (e.key === "Enter") {
                    saveAndClose();
                } else if (e.key === "Escape") {
                    hidePopup();
                }
            });
            bookmarkNoteInput.addEventListener("keyup", stopPropagation);
            bookmarkNoteInput.addEventListener("keypress", stopPropagation);
        }
    };

    const addNewBookmarkEventHandler = async (inputElement) => {
        const noteText = inputElement ? inputElement.value.trim() : "";
        const currentTime = youtubePlayer.currentTime;
        const newBookmark = {
            time: currentTime,
            desc: "Bookmark at " + getTime(currentTime),
            note: noteText
        };

        currentVideoBookmarks = await fetchBookmarks();

        //sync to chrome storage
        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
        })
    }
})();

const getTime = t => {
    var date = new Date(0);
    date.setSeconds(t);

    return date.toISOString().substr(11, 8);
}