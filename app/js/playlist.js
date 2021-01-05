function createPlaylist({ root, songsummary, renderItem }) {
	root.innerHTML = `
        <div class="playlist"></div>
    `;

	songsummary.addEventListener('click', function(event) {
		if (event.target.closest('.songSummary__addToPlaylist--button')) {
			song = getSongFromSummary(this);
			let playlist = root.querySelector('.playlist');
			addItemToPlaylist(playlist, song);
		}
	});

	//Prevent button from receiving focus on click
	songsummary.addEventListener('mousedown', function(event) {
		if (event.target.closest('.songSummary__addToPlaylist--button')) {
			event.preventDefault();
		}
	});
}

// Methods

//Use this to find the add to playlist button within the clicked song summary
function getSongFromSummary(songSummaryContainer) {
	const title = songSummaryContainer.querySelector('.songSummary__title').dataset.title;
	const artist = songSummaryContainer.querySelector('.songSummary__artist').dataset.artist;
	const album = songSummaryContainer.querySelector('.songSummary__album').dataset.album;
	const preview = songSummaryContainer.querySelector('.songSummary__audio').src;

	return { title: title, artist: artist, album: album, preview: preview };
}

function addItemToPlaylist(playlist, { title, artist, album, preview }) {
	//===create new song element from template
	const newSong = document.createElement('div');
	newSong.classList.add('playlist__song');
	newSong.innerHTML = playlist_song_template(song);

	//===add event listener for play/pause button===//
	newSong.addEventListener('click', function(event) {
		//check if the user clicked on the audio button or it's containing elements
		if (event.target.closest('.playlist__song--play-pause-button')) {
			let audioElement = this.querySelector('.playlist__song--audio');
			let audioButton = this.querySelector('.playlist__song--play-pause-button');

			//decide whether to play or pause the audio
			const pause = audioButton.classList.contains('playing');

			//run method in audio controls
			if (pause) {
				audioElement.pause();
			} else {
				audioElement.play();
			}

			//change button
			const buttonClass = pause ? 'play' : 'pause';
			audioButton.innerHTML = `<i class="fas fa-${buttonClass}"></i>`;
			audioButton.classList.toggle('playing');
		}
	});

	//Prevent button from receiving focus on click
	newSong.addEventListener('mousedown', function(event) {
		if (event.target.closest('.playlist__song--play-pause-button')) {
			event.preventDefault();
		}
	});

	//===append to root===//
	playlist.appendChild(newSong);
}

function playlist_song_template({ title, artist, album, preview }) {
	return `
        <audio class="playlist__song--audio" src=${preview}></audio>
        <div class="playlist__song--play-pause-container">
            <button class="playlist__song--play-pause-button"><i class="fas fa-play"></i></button>
        </div>
        <span class="playlist__song--title">${title}</span>
        <span class="playlist__song--info"><strong>${artist}</strong>: ${album}</span>
    `;
}
