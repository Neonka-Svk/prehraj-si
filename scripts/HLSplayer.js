const videoPlayer = document.querySelector("#video_player");
const VideoScr = videoPlayer.querySelector("#videoPlayerHLS");
const videoControls = videoPlayer.querySelector(".video_controls");
const play_n_pause = videoPlayer.querySelector(".play_pause");
const volume = videoPlayer.querySelector(".volume");
const volumeRange = videoPlayer.querySelector(".volume_range");
const current = videoPlayer.querySelector(".current");
const fullscreenMode = videoPlayer.querySelector(".fullscreen_mode");
const loadingIndicator = videoPlayer.querySelector(".loading_indicator");
// const pictureInpicture = videoPlayer.querySelector(".picture_in_picture_mode");
// const pictureInpictureCapture = videoPlayer.querySelector(".capture-icon");

// Displaying controls on mouse-enter
videoPlayer.addEventListener("mouseenter", () => {
  videoControls.classList.add("active");
});

videoPlayer.addEventListener("mouseleave", () => {
  videoControls.classList.remove("active");
});

//Display loading spinner when video is loading
VideoScr.addEventListener("waiting", () => {
  loadingIndicator.style.display = "block";
  if (playingBars.classList.contains("withoutAnim")) playingBars.classList.remove("withoutAnim");
  playingBars.classList.add("withoutAnim");
  statusText.innerHTML = "Načítava sa -";
  channelName.innerHTML = currentTextShow;
});

VideoScr.addEventListener("canplay", () => {
  if (playingBars.classList.contains("withoutAnim")) playingBars.classList.remove("withoutAnim");
  statusText.innerHTML = "Práve sa prehráva -";
  channelName.innerHTML = currentTextShow;
  loadingIndicator.style.display = "none";
});


// Play Video function
const playVideo = () => {
  play_n_pause.innerHTML = "pause";
  play_n_pause.title = "pause";
  videoPlayer.classList.remove("paused");
  VideoScr.play();
};

// Pause Video function
const pauseVideo = () => {
  play_n_pause.innerHTML = "play_arrow";
  play_n_pause.title = "play";
  videoPlayer.classList.add("paused");
  VideoScr.pause();
};

// Toggle Play/Pause on click
VideoScr.addEventListener("click", () => {
  if (VideoScr.paused)
    playVideo();
  else
    pauseVideo();
});

// Handle external play events
VideoScr.addEventListener("play", () => {
  if (playingBars.classList.contains("withoutAnim")) playingBars.classList.remove("withoutAnim");
  statusText.innerHTML = "Práve sa prehráva -";
  channelName.innerHTML = currentTextShow;
  playVideo();
});

// Handle external pause events
VideoScr.addEventListener("pause", () => {
  if (playingBars.classList.contains("withoutAnim")) playingBars.classList.remove("withoutAnim");
  playingBars.classList.add("withoutAnim");
  statusText.innerHTML = "Prenos pozastavený -";
  pauseVideo();
});

// toggle play/pause
play_n_pause.addEventListener("click", () => {
  const isVideoPaused = videoPlayer.classList.contains("paused");
  if (!isVideoPaused) {
    pauseVideo();
  } else {
    playVideo();
  }
});

const volumeIndicator = document.querySelector(".volume-progress");

const setVolume = () => {
  const volumeLevel = volumeRange.value;
  VideoScr.volume = volumeLevel / 100;

  if (volumeLevel == 0) {
    volume.innerHTML = "volume_off";
  } 
  else if (volumeLevel < 33) {
    volume.innerHTML = "volume_mute";
  } 
  else if (volumeLevel < 68) {
    volume.innerHTML = "volume_down";
  } 
  else {
    volume.innerHTML = "volume_up";
  }
  volumeIndicator.style.width = `calc(${volumeLevel}%)`;
};

let savedVolume = volumeRange.value;
volumeRange.addEventListener("input", () => {
  savedVolume = volumeRange.value;
  setVolume();
});

// mute volume
const muteVideoVolume = () => {
  if (volumeRange.value == 0) {
    volumeRange.value = savedVolume;
    VideoScr.volume = savedVolume/100;
    volumeIndicator.style.width = `calc(${savedVolume}%)`;
    volume.innerHTML = "volume_up";
  } 
  else {
    volumeRange.value = 0;
    VideoScr.volume = 0;
    volume.innerHTML = "volume_off";
    volumeIndicator.style.width = `calc(${volumeRange.value}%)`;
  }
};

volume.addEventListener("click", () => {
  muteVideoVolume();
});


VideoScr.addEventListener("ended", () => {
  if (autoPlay.classList.contains("active")) {
    playVideo();
  } else {
    play_pause.innerHTML = "replay";
    play_pause.title = "Replay";
  }
});

// Full screen function
fullscreenMode.addEventListener("click", () => {
    if (!videoPlayer.classList.contains("openFullScreen")) {
      videoPlayer.classList.add("openFullScreen");
      fullscreenMode.innerHTML = "fullscreen_exit";
      videoPlayer.requestFullscreen();
    } else {
      videoPlayer.classList.remove("openFullScreen");
      fullscreenMode.innerHTML = "fullscreen";
      document.exitFullscreen();
    }
  });
  
//   pictureInpictureCapture.addEventListener("click", () => {
//     if (document.pictureInPictureElement) {
//       pictureInpictureCapture.classList.add("hidden");
//       pictureInpicture.classList.remove("hidden");
//       document.exitPictureInPicture().catch((error) => {
//         console.error("Failed to exit PiP: ", error);
//       });
//     }
//   });
  
//   // Picture-in-Picture function with fullscreen reset
//   pictureInpicture.addEventListener("click", () => {
//     // If video is in fullscreen, exit fullscreen first
//     if (document.fullscreenElement || videoPlayer.classList.contains("openFullScreen")) {
//       // Exit fullscreen mode
//       videoPlayer.classList.remove("openFullScreen");
//       fullscreenMode.innerHTML = "fullscreen";
//       if (document.exitFullscreen) {
//         document.exitFullscreen();
//         pictureInpictureCapture.classList.add("hidden");
//         pictureInpicture.classList.remove("hidden");
//       }
//     }
  
//     // If PiP is not active, request PiP
//     VideoScr.requestPictureInPicture().then((pictureInPictureWindow) => {
//       pictureInPictureWindow.addEventListener("resize", () => onPipWindowResize(), false);
//       pictureInpictureCapture.classList.remove("hidden");
//       pictureInpicture.classList.add("hidden");
//     }).catch((error) => {
//       console.error("Failed to enter PiP: ", error);
//     });
//   });
  