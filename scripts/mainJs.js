
let windowFeatures, popupWindow;
let recordBtn = document.querySelector(".start-recording");
let recordArea = document.querySelector(".recordArea");
const mainWindow = window;
let mainHtml;

try {
    if (window.trustedTypes) {
        window.trustedTypes.createPolicy('default', {createHTML: (string, sink) => string})
    }
} catch (error) {}

function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

if (isMobile()) 
    recordArea.style.display = "none";

function createNewWindow() {
    let recordBtnInMain = mainWindow.document.querySelector(".start-recording");
    recordBtnInMain.setAttribute("disabled", "");

    let videoPlayerFullscreen = mainWindow.document.getElementById("videoPlayer");
    videoPlayerFullscreen.classList.add("showInFullscreen");

    mainHtml = mainWindow.document.querySelector("html");
    mainHtml.style.overflow = "hidden";

    let w = 500;
    let h = 600;
    const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY;

    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft
    const top = (height - h) / 2 / systemZoom + dualScreenTop
    popupWindow = window.open("", "", 
    `
    scrollbars=no,
    width=${w / systemZoom}, 
    height=${h / systemZoom}, 
    top=${top}, 
    left=${left}
    `
    )

    if (window.focus) popupWindow.focus();

    popupWindow.document.body.innerHTML = `
        <html>
        <head>
            <title>Nahraj si záznam z tvojej obľúbenej stanice!</title>
        </head>
        <body>
            <video src="" autoplay muted constrols class="video-feedback"></video>
            <div class="recordingWindowText">
                <div class="recordingActive hidden">
                    <div class="recordingDot"></div> 
                    <h3>Prebieha nahrávanie...</h3>
                </div>
                <p style="font-size: 12px;">Video je momentálne prehrávané vo fejkovom fullscreene. Pre jeho zrušenie je potrebné vypnúť okno pre nahrávanie záznamu. 🦦</p>
                <p style="font-size: 10px;">Rozdiel na nahrávke nevidno, nakoľko ide aj tak o zachytávanie okna.</p>
            </div>
            <div class="popupBtns" style="display: flex; justify-content: center; gap: 10px;">
                <button class="start-recording btn popup">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>
                    Spustiť nahrávanie
                </button>
                <button class="stop-recording btn popup" disabled>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"/></svg>
                    Zastaviť nahrávanie
                </button>
            </div>
            <a class="download-video btn download popup" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg>
                Stiahnuť nahrávku
            </a>
        </body>
        </html>`;

    const customCss = popupWindow.document.createElement('link');
    customCss.rel = "stylesheet";
    customCss.href = "./styles/mainStyle.css";
    popupWindow.document.head.appendChild(customCss);

    const recordScript = popupWindow.document.createElement('script');
    recordScript.src = "./scripts/recorder.js";
    popupWindow.document.body.appendChild(recordScript);

    popupWindow.onbeforeunload = function () {
        if (recordBtnInMain.hasAttribute("disabled")) recordBtnInMain.removeAttribute("disabled");
        if (videoPlayerFullscreen.classList.contains("showInFullscreen")) videoPlayerFullscreen.classList.remove("showInFullscreen");
        mainHtml.style.overflow = "auto";
    };

}

recordBtn.addEventListener('click', createNewWindow);

mainWindow.onbeforeunload = function () {
    popupWindow.close();
};

function loadCustomPlaylist() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.m3u,.txt';
    input.style.display = 'none';
    input.onchange = function() {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            parsePlaylist(event.target.result);
            document.querySelector('.filterSelect').classList.remove('hidden');
        };
        reader.readAsText(file);
    };
    input.click();
}

function loadPlaylist() {
    const fileInput = document.getElementById('playlistFile');
    
    if (fileInput.files.length === 0) {
        alert('Prosím, vyber súbor s príponou .m3u! 🦦');
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(event) {
        parsePlaylist(event.target.result);
    };
    
    reader.readAsText(file);
}

function parsePlaylist(content) {
    const playlistElement = document.getElementById('playlist');
    const filterElement = document.getElementById('groupFilter'); // Dropdown filter
    const lines = content.split('\n');
    playlistElement.innerHTML = '';
    filterElement.innerHTML = ''; // Reset filter

    let currentTitle = '';
    let currentLogo = '';
    let currentGroups = [];
    let working = '';
    let vlc = '';
    let google = '';
    let channelsByGroup = {};
    let uniqueGroups = new Set();

playlistElement.classList.remove("empty");

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('#EXTINF')) {
            // Extract channel name
            const matchTitle = line.match(/tvg-name="(.*?)"/);
            currentTitle = matchTitle && matchTitle[1] ? matchTitle[1] : "Bez názvu";
            // if (currentTitle.length > 22) currentTitle = currentTitle.substring(0, 19) + "...";

            // Extract logo URL
            const matchLogo = line.match(/tvg-logo="(.*?)"/);
            currentLogo = matchLogo && matchLogo[1] ? matchLogo[1] : "./logos/noLogo.jpg";

            // Extract groups (supports multiple groups)
            const matchGroup = line.match(/group-title="(.*?)"/);
            currentGroups = matchGroup && matchGroup[1] ? matchGroup[1].split(';').map(g => g.trim()) : ["Nezaradené"];

            // Extract working status
            const matchWorking = line.match(/working="(.*?)"/);
            working = matchWorking && matchWorking[1] ? matchWorking[1] : "true";

            // Extract VLC compatibility
            const matchVLC = line.match(/vlc="(.*?)"/);
            if (matchVLC && matchVLC[1] === "true") {
                vlc = "true";
                // currentTitle += " (VLC)";
                // if (currentTitle.length > 22) currentTitle = currentTitle.substring(0, 19) + "...";
            } else {
                vlc = "false";
            }

            // Extract Google
            const matchGoogle = line.match(/google="(.*?)"/);
            if (matchGoogle && matchGoogle[1] === "true") {
                google = "true";
            } else {
                google = "false";
            }

        } else if (line && !line.startsWith('#')) { // Stream URL
            const notWorkingLinkGroup = "Nefunkčné";
            if (working === "false")
                currentGroups.push(notWorkingLinkGroup);

            currentGroups.forEach(group => {
                if (working === "false" && group !== notWorkingLinkGroup) return;

                if (!channelsByGroup[group]) {
                    channelsByGroup[group] = [];
                }
                channelsByGroup[group].push({ title: currentTitle, logo: currentLogo, url: line, workingStatus: working, inVLC: vlc, inGoogle: google });
            });

            // Store unique groups for dropdown (excluding duplicates)
            currentGroups.forEach(group => uniqueGroups.add(group));

            // Reset variables for next entry
            currentTitle = '';
            currentLogo = '';
            currentGroups = [];
            working = '';
            vlc = '';
            google = '';
        }
    });

    // Populate filter dropdown
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'Všetko';
    filterElement.appendChild(allOption);

    uniqueGroups.forEach(group => {
        const option = document.createElement('option');
        option.value = group;
        option.textContent = group;
        filterElement.appendChild(option);
    });

    filterElement.addEventListener('change', () => updatePlaylistDisplay(filterElement.value, channelsByGroup));

    updatePlaylistDisplay('all', channelsByGroup);
}

let tooltip = document.querySelector(".copyPopup");

// Function to update the playlist based on filter selection
function updatePlaylistDisplay(selectedGroup, channelsByGroup) {
    const playlistElement = document.getElementById('playlist');
    playlistElement.innerHTML = '';

    for (const group in channelsByGroup) {
        if (selectedGroup !== 'all' && group !== selectedGroup) continue;

        const groupDiv = document.createElement('div');
        groupDiv.classList.add('playlist-group');

        // Group Header
        const groupHeader = document.createElement('h3');
        const groupHeaderCount = document.createElement('p');
        groupHeaderCount.classList.add("headerCount");

        let channelsText = "kanálov";
        if (channelsByGroup[group].length === 1) channelsText = "kanál";
        if (channelsByGroup[group].length >= 2 && channelsByGroup[group].length <= 4) channelsText = "kanály";

        groupHeader.textContent = `Skupina: ${group}`;
        groupHeaderCount.innerHTML = `<span>(Skupina obsahuje ${channelsByGroup[group].length} ${channelsText})</span>`;
        groupDiv.appendChild(groupHeader);
        groupDiv.appendChild(groupHeaderCount);

        // Channel List
        const list = document.createElement('ul');

        channelsByGroup[group].forEach((channel, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('playlist-item');

            if (channel.workingStatus === "false") {
                listItem.classList.add("notWorking");
                const notWorkingMsg = document.createElement('p');
                notWorkingMsg.classList.add("notWorkingMsg");
                notWorkingMsg.innerHTML = `Daný odkaz aktuálne nefunguje!`;
                listItem.appendChild(notWorkingMsg);
            }

            const link = document.createElement('a');
            link.href = '#';
            link.textContent = `${index + 1}. ${channel.title.trim()}`;
            link.onclick = channel.inVLC === "true" ? 
                () => downloadM3U(channel.url, channel.title.split('(')[0]) :
                () => playStream(channel.url, channel.title.trim())
            if (channel.inGoogle === "true") link.onclick = "";

            if (channel.logo) {
                const img = document.createElement('img');
                img.src = channel.logo;
                link.appendChild(img);
            }

            if (channel.inVLC === "true") {
                const vlcIcon = document.createElement('img');
                vlcIcon.classList.add("vlc");
                vlcIcon.src = "./logos/VLC.svg";
                listItem.appendChild(vlcIcon);
            }

            if (channel.inGoogle === "true") {
                const googleIcon = document.createElement('img');
                googleIcon.classList.add("google");
                googleIcon.src = "./logos/Google.svg";
                listItem.classList.add("googleLink");
                listItem.appendChild(googleIcon);
                link.href = channel.url;
                link.target = "_blank";
                listItem.title = "Možné vyhľadať online zadarmo (1 a viac prenosov).";
            }

            const copyURL = document.createElement("div");
            copyURL.classList.add("copyURL");
            copyURL.innerHTML = `<i class="fa-solid fa-copy"></i>`;
            copyURL.addEventListener('click', function(){
                navigator.clipboard.writeText(channel.url).then(() => {
                    let copyBtns = document.querySelectorAll(".copyURL");
                    copyBtns.forEach(button => {
                        button.style.opacity = 0.5;
                        button.style.pointerEvents = "none";
                    });
                    tooltip.classList.add("showTooltip");
                    setTimeout(() => {
                        if (tooltip.classList.contains("showTooltip")) tooltip.classList.remove("showTooltip");
                        copyBtns.forEach(button => {
                            button.style.opacity = 1;
                            button.style.pointerEvents = "all";
                        });
                    }, 2000);

                }).catch((err) => {
                    tooltip.innerHTML = `<p>❌ Nepodarilo sa skopírovať URL adresu. <strong>Skús to znova!</strong> 🦦</p>`;
                    tooltip.style.boxShadow = "0 0 3px 1px #f12e5d9c";
                    setTimeout(() => {
                        if (tooltip.classList.contains("showTooltip")) tooltip.classList.remove("showTooltip");
                        setTimeout(() => {
                            tooltip.style.boxShadow = "0 0 3px 1px #33ff409c";
                        }, 300);
                    }, 2000);
                });
            });
            listItem.appendChild(copyURL);


            listItem.appendChild(link);
            list.appendChild(listItem);
        });

        groupDiv.appendChild(list);
        playlistElement.appendChild(groupDiv);
    }
}

function playlistItems() {
    const playlistItems = document.querySelectorAll(".playlist-item");

    playlistItems.forEach(item => {
        item.addEventListener("click", function () {
            let selectedItem = document.querySelector(".playlist-item.selected");
            if (selectedItem) selectedItem.classList.remove("selected");
            this.classList.add("selected");
        });
    });
}

function playStream(url, title) {
    var player = videojs('videoPlayer');
    playlistItems();
    
    if (url.endsWith('.mpd')) {
        player.src({
            src: url,
            type: 'application/dash+xml'
        });
    } else if (url.endsWith('.m3u8')) {
        player.src({
            src: url,
            type: 'application/x-mpegURL'
        });
    } else if (url.endsWith('.ts')) {
        player.src({
            src: url,
            type: 'video/mp2t'
        });
    }

    player.ready(function () {
        try {
            player.play();
            document.querySelector(".channelName").innerHTML = title;
            const currentlyPlaying = document.querySelector(".currentlyPlaying");
            if (!currentlyPlaying.classList.contains("visible")) currentlyPlaying.classList.add("visible");
            if (recordBtn.hasAttribute("disabled")) recordBtn.removeAttribute("disabled");
            recordBtn.title = "";
        } catch {}
    });
    
}

function downloadM3U(url, title) {
    const blob = new Blob([`#EXTM3U\n${url}`], { type: 'application/x-mpegURL' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = title.trim()+'.m3u8';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}