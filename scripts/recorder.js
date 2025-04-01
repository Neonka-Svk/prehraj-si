let stream = null,
    mixedStream = null,
    chunks = [], 
    recorder = null,
    startButton = null,
    stopButton = null,
    downloadButton = null,
    recordedVideo = null;

let recordingText = document.querySelector(".recordingActive");

async function setupStream() {
    try {
        stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false,
                googAutoGainControl: false
            }
        });

        setupVideoFeedback();
    } catch (err) {
        console.error(err);
    }
}

function setupVideoFeedback() {
    if (stream) {
        const video = document.querySelector('.video-feedback');
        video.srcObject = stream;
        video.play();
        video.classList.add("active");
    } else {
        console.warn('No stream available');
        if (video.classList.contains("active")) video.classList.remove("active");
    }
}

async function startRecording() {
    await setupStream();

    if (stream) {
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = handleDataAvailable;
        recorder.onstop = handleStop;
        recorder.start(1000);
    
        startButton.disabled = true;
        stopButton.disabled = false;

        if (downloadButton.classList.contains('downloadAvailable')) {
            downloadButton.classList.remove("downloadAvailable");
            downloadButton.setAttribute("disabled", "");
        }

        if (recordingText.classList.contains("hidden")) recordingText.classList.remove("hidden");
    
        console.log('Recording started');
    } else {
        console.warn('No stream available.');
        startButton.disabled = false;
        stopButton.disabled = true;
    }
}

function stopRecording() {
    recorder.stop();

    startButton.disabled = false;
    stopButton.disabled = true;

    recordingText.classList.add("hidden");

    const video = document.querySelector('.video-feedback');
    if (video.classList.contains("active")) video.classList.remove("active");
}

function handleDataAvailable(e) {
    chunks.push(e.data);
}

function handleStop(e) {
    const blob = new Blob(chunks, { 'type': 'video/mp4' });
    chunks = [];

    downloadButton.href = URL.createObjectURL(blob);
    downloadButton.download = 'video.mp4';

    stopRecording();

    if (downloadButton.hasAttribute("disabled")) downloadButton.removeAttribute("disabled");
    if (downloadButton.classList.contains('downloadAvailable')) {
        downloadButton.classList.remove("downloadAvailable");
        downloadButton.classList.add("downloadAvailable");
    }
    else {
        downloadButton.classList.add("downloadAvailable");
    }

    stream.getTracks().forEach((track) => track.stop());
    console.log('Recording stopped');
}

    startButton = document.querySelector('.start-recording');
    recordedVideo = document.querySelector('.recorded-video');
    stopButton = document.querySelector('.stop-recording');
    downloadButton = document.querySelector('.download-video');

    startButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);