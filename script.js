// --- Music Player Data (Using the full, complex filenames provided) ---

const playlistData = [{ 
    title: "Man Dhavtaya", 
    artist: "Radhika Bhide", 
    duration: "2:32", 
    // Updated File 2
    src: "audio/WhatsApp Audio 2025-11-09 at 01.18.37_2a15f412.mp3", 
    albumArt: "radhika.jpg" 
},

{ 
    title: "Manwa Laage", 
    artist: "Arjit Singh & Shreya Ghoshal", 
    duration: "5:08", 
    // Updated File 1
    src: "audio/WhatsApp Audio 2025-11-09 at 01.18.09_d089e538.mp3", 
    albumArt: "manwa.jpeg" 
},

{ 
    title: "Zingat ", 
    artist: "Ajay-Atul", 
    duration: "3:51", 
    // Updated File 3
    src: "audio/WhatsApp Audio 2025-11-09 at 01.18.55_683d98e5.mp3", 
    albumArt: "zingat.jpg" 
},
{ 
    title: "Tere sang yaara", 
    artist: "arko pravo mukherjee", 
    duration: "5:40", 
    // Updated File 4
    src: "audio/WhatsApp Audio 2025-11-09 at 01.19.36_63b94e7c.mp3", 
    albumArt: "tere.jpg" 
},
{ 
    title: "Mere Sapno Ki Rani", 
    artist: "kishore Kumar", 
    duration: "1:49", 
    // Updated File 5
    src: "audio/WhatsApp Audio 2025-11-09 at 01.20.18_391c9090.mp3", 
    albumArt: "mere sapno ki rani.jpg" 
},

];

// --- DOM Element Selection ---

const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const playPauseIcon = document.getElementById('play-pause-icon');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const volumeSlider = document.getElementById('volume-slider');

const progressBar = document.querySelector('.progress-bar');
const progress = document.querySelector('.progress');
const currentTimeDisplay = document.getElementById('current-time');
const totalDurationDisplay = document.getElementById('total-duration');

const currentTitle = document.getElementById('current-title');
const currentArtist = document.getElementById('current-artist');
const albumArt = document.getElementById('album-art');
const playerCard = document.querySelector('.player-card');
const playlistEl = document.getElementById('playlist');

// --- State Variables ---

let currentSongIndex = 0;
let isPlaying = false;


// --- Core Functions ---

/**
 * Loads a song into the audio player and updates the UI.
 * @param {number} index - The index of the song in the playlistData array.
 */
function loadSong(index) {
    const song = playlistData[index];
    
    // Update audio player source
    audioPlayer.src = song.src;
    
    // Update UI elements
    currentTitle.textContent = song.title;
    currentArtist.textContent = song.artist;
    albumArt.src = song.albumArt;
    totalDurationDisplay.textContent = song.duration; // Display static duration initially
    
    // Update active class in playlist
    updatePlaylistActiveClass();

    // Reset progress and time display
    currentTimeDisplay.textContent = '0:00';
    progress.style.width = '0%';

    // Remove playing animation class if not playing
    if (!isPlaying) {
        playerCard.classList.remove('playing');
    }
}

/**
 * Plays the current song.
 */
function playSong() {
    isPlaying = true;
    playPauseIcon.textContent = 'pause';
    playerCard.classList.add('playing');
    audioPlayer.play();
}

/**
 * Pauses the current song.
 */
function pauseSong() {
    isPlaying = false;
    playPauseIcon.textContent = 'play_arrow';
    playerCard.classList.remove('playing');
    audioPlayer.pause();
}

/**
 * Toggles between play and pause.
 */
function togglePlayPause() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

/**
 * Skips to the next song in the playlist.
 */
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlistData.length;
    loadSong(currentSongIndex);
    playSong();
}

/**
 * Skips to the previous song in the playlist.
 */
function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + playlistData.length) % playlistData.length;
    loadSong(currentSongIndex);
    playSong();
}

/**
 * Formats time in seconds to mm:ss format.
 * @param {number} seconds - Time in seconds.
 * @returns {string} Formatted time string.
 */
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

/**
 * Renders the playlist data into the HTML structure.
 */
function renderPlaylist() {
    // Update the song count display
    document.getElementById('song-count').textContent = `(${playlistData.length} songs)`;

    playlistData.forEach((song, index) => {
        const li = document.createElement('li');
        li.classList.add('song-item');
        li.dataset.index = index;
        li.innerHTML = `
            <div class="song-details">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <div class="song-duration">${song.duration}</div>
        `;
        
        // Add click listener to play a song from the playlist
        li.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
        });

        playlistEl.appendChild(li);
    });
}

/**
 * Updates the 'active' class on playlist items.
 */
function updatePlaylistActiveClass() {
    document.querySelectorAll('.song-item').forEach((item, index) => {
        item.classList.remove('active');
        if (index === currentSongIndex) {
            item.classList.add('active');
        }
    });
}


// --- Event Listeners ---

// 1. Play/Pause Button
playPauseBtn.addEventListener('click', togglePlayPause);

// 2. Next/Previous Buttons
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

// 3. Volume Control
volumeSlider.addEventListener('input', () => {
    audioPlayer.volume = volumeSlider.value;
});

// 4. Time and Progress Update
audioPlayer.addEventListener('timeupdate', () => {
    const { currentTime, duration } = audioPlayer;
    if (duration && isFinite(duration)) {
        // Update progress bar
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;

        // Update current time display
        currentTimeDisplay.textContent = formatTime(currentTime);

        // Update total duration display once metadata is loaded (if not static)
        totalDurationDisplay.textContent = formatTime(duration);
    }
});

// 5. Song Ends (Go to Next)
audioPlayer.addEventListener('ended', nextSong);

// 6. Seek functionality on progress bar
progressBar.addEventListener('click', (e) => {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    
    if (duration && isFinite(duration)) {
        // Calculate new playback time
        audioPlayer.currentTime = (clickX / width) * duration;
    }
});


// --- Initialization ---

// Set initial volume (0.7 = 70%)
audioPlayer.volume = volumeSlider.value;

// Render the playlist and load the first song
renderPlaylist();
loadSong(currentSongIndex);