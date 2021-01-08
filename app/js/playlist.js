function createPlaylist({ root, songsummary, renderItem }) {
	root.innerHTML = `
		<div class="playlist">
			<div class="playlist__intro">
				Search for some songs to add to your playlist!
			</div>
		</div>
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
			playPause(this);
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

	//===add event listener for audio stopping===//
	//*This has to be after appending to the parent, because it depends on other elements in the playlist
	newSong.querySelector('audio').addEventListener('ended', function() {
		const nextSong = newSong.nextSibling;

		playPause(newSong);

		if (nextSong && nextSong.classList.contains('playlist__song')) {
			playPause(nextSong);
		}
	});
}

function playlist_song_template({ title, artist, album, preview }) {
	const longTitle = title.length > 35 ? 'long' : '';
	const longInfo = artist.length + album.length > 50 ? 'long' : '';
	return `
        <audio class="playlist__song--audio" src=${preview}></audio>
        <div class="playlist__song--play-pause-container">
            <button class="playlist__song--play-pause-button"><i class="fas fa-play"></i></button>
		</div>
		<div class="playlist__song--col playlist__song--col-1">
			<span class="playlist__song--title ${longTitle}">${title}</span>
		</div>
		<div class="playlist__song--col playlist__song--col-2">
			<span class="playlist__song--info ${longInfo}"><strong>${artist}</strong>: ${album}</span>
		</div>
    `;
}

//Connects the functionality of the audio element to the custom play/pause button
function playPause(song) {
	if (song.classList.contains('playing')) {
		//PAUSE
		pauseSong(song);
	} else {
		//PLAY

		//pause other songs before playing
		pauseAllPlaying();

		playSong(song);
	}
}

function pauseAllPlaying() {
	const playingSongs = document.querySelectorAll('.playlist__song.playing');
	for (let song of playingSongs) {
		pauseSong(song);
	}
}

function pauseSong(song) {
	//pause the audio
	song.querySelector('audio').pause();

	//update button icon
	song.querySelector('.playlist__song--play-pause-button').innerHTML = '<i class="fas fa-play"></i>';

	//update song class to reflect that it is no longer playing
	song.classList.remove('playing');
}

function playSong(song) {
	//pause the audio
	song.querySelector('audio').play();

	//update button icon
	song.querySelector('.playlist__song--play-pause-button').innerHTML = '<i class="fas fa-pause"></i>';

	//update song class to reflect that it is no longer playing
	song.classList.add('playing');
}
