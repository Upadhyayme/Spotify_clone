// Improved JavaScript for Spotify Clone with Duration Fetching
console.log("Welcome to Spotify");

// Array of songs
let songs = [
    { songName: "Slushii & sapientdream - Break My Heart ", filePath: "./song/2.mp3", coverPath: "./cover/1.jpg", duration: "0:00" },
    { songName: "P3PPER - blessing [NCS Release]", filePath: "./song/3.mp3", coverPath: "./cover/2.jpg", duration: "0:00" },
    { songName: "Clarx & SlidV - Severed Rose", filePath: "./song/4.mp3", coverPath: "./cover/3.jpg", duration: "0:00" },
    { songName: "Janji, Robbie Hutton - Call My", filePath: "./song/2.mp3", coverPath: "./cover/4.jpg", duration: "0:00" },
    { songName: "Rameses B - i want u", filePath: "./song/3.mp3", coverPath: "./cover/5.jpg", duration: "0:00" },
    { songName: "Mangoo, B3nte - Perfection (Feat. Derek Cate)", filePath: "./song/4.mp3", coverPath: "./cover/6.jpg", duration: "0:00" },
    { songName: "Don Darkoe - Like That", filePath: "./song/2.mp3", coverPath: "./cover/7.jpg", duration: "0:00" },
    { songName: "Let me Love You", filePath: "./song/3.mp3", coverPath: "./cover/8.jpg", duration: "0:00" },
    { songName: "Divine Love", filePath: "./song/4.mp3", coverPath: "./cover/9.jpg", duration: "0:00" },
    { songName: "Feel It", filePath: "./song/2.mp3", coverPath: "./cover/10.jpg", duration: "0:00" }
];

// Convert seconds to MM:SS format
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Function to fetch duration for a single song
function fetchSongDuration(song) {
    return new Promise((resolve, reject) => {
        const audio = new Audio(song.filePath);
        audio.addEventListener('loadedmetadata', () => {
            song.duration = formatTime(audio.duration);
            resolve(song);
        });
        audio.addEventListener('error', () => {
            console.error(`Error loading metadata for ${song.songName}`);
            resolve(song);  // Resolve with default duration
        });
    });
}

// Function to fetch durations for all songs
async function fetchAllSongDurations() {
    const durationPromises = songs.map(fetchSongDuration);
    return Promise.all(durationPromises);
}

// Initialize variables
let songIndex = 0;
let audioElement = new Audio(songs[songIndex].filePath);
let masterPlay = document.getElementById('masterPlay');
let progressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songItemContainer = document.getElementById('songItemContainer');

// Dynamically generate song list
function populateSongList() {
    songItemContainer.innerHTML = ''; // Clear existing items
    songs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.classList.add('songItem');
        songItem.innerHTML = `
            <img src="${song.coverPath}" alt="${index + 1}">
            <span class="songName">${song.songName}</span>
            <span class="songlistplay">
                <span class="timestamp">${song.duration} <i id="${index}" class="far songItemPlay fa-play-circle"></i></span>
            </span>
        `;
        songItemContainer.appendChild(songItem);
    });

    // Reattach event listeners to new song items
    let songItems = Array.from(document.getElementsByClassName('songItemPlay'));
    songItems.forEach((element, i) => {
        element.addEventListener('click', () => {
            playSong(i);
        });
    });
}

// Function to update play/pause icons and gif
function updatePlayPauseUI(isPlaying) {
    if (isPlaying) {
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        gif.style.opacity = 1;
    } else {
        masterPlay.classList.remove('fa-pause-circle');
        masterPlay.classList.add('fa-play-circle');
        gif.style.opacity = 0;
    }
}

// Function to play a specific song
function playSong(index) {
    songIndex = index;
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    updatePlayPauseUI(true);
}

// Populate song list when page loads with durations
document.addEventListener('DOMContentLoaded', async () => {
    // Fetch song durations before populating the list
    await fetchAllSongDurations();
    populateSongList();
});

// Add event listeners to play/pause master button
masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        updatePlayPauseUI(true);
    } else {
        audioElement.pause();
        updatePlayPauseUI(false);
    }
});

// Update progress bar
audioElement.addEventListener('timeupdate', () => {
    // Calculate progress
    let progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
    progressBar.value = progress;
});

// Allow seeking through progress bar
progressBar.addEventListener('change', () => {
    audioElement.currentTime = progressBar.value * audioElement.duration / 100;
});

// Previous song functionality
document.getElementById('previous').addEventListener('click', () => {
    if (songIndex <= 0) {
        songIndex = songs.length - 1;
    } else {
        songIndex -= 1;
    }
    playSong(songIndex);
});

// Next song functionality
document.getElementById('next').addEventListener('click', () => {
    if (songIndex >= songs.length - 1) {
        songIndex = 0;
    } else {
        songIndex += 1;
    }
    playSong(songIndex);
});

// Automatically play next song when current song ends
audioElement.addEventListener('ended', () => {
    if (songIndex >= songs.length - 1) {
        songIndex = 0;
    } else {
        songIndex += 1;
    }
    playSong(songIndex);
});