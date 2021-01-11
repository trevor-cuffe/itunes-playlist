//=========================================//
//========  Set up Playlist Module ========//
//=========================================//

// Dependency: draggable.js

//=========================================//
//=========================================//

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

	// Methods

	//Use this to find the add to playlist button within the clicked song summary
	function getSongFromSummary(songSummaryContainer) {
		const title = songSummaryContainer.querySelector('.songSummary__title').dataset.title;
		const artist = songSummaryContainer.querySelector('.songSummary__artist').dataset.artist;
		const album = songSummaryContainer.querySelector('.songSummary__album').dataset.album;
		const preview = songSummaryContainer.querySelector('.songSummary__audio').src;

		return { title: title, artist: artist, album: album, preview: preview };
	}

	function addItemToPlaylist(playlist, song) {
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

		//*** Include Drag and Drop Methods ***//
		setDraggable(newSong);
		setDroppable(newSong);

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

	function playlist_song_template(song) {
		return renderItem(song);
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
		//play the audio
		fadeAudio(song.querySelector('audio'), 0, 1, 2);
		song.querySelector('audio').play();

		//update button icon
		song.querySelector('.playlist__song--play-pause-button').innerHTML = '<i class="fas fa-pause"></i>';

		//update song class to reflect that it is no longer playing
		song.classList.add('playing');
	}

	function fadeAudio(element, startVolume = null, newVolume, time) {
		//time should be defined in seconds
		//volume goes from 0 to 1, startVolume is optional

		if (startVolume !== null) {
			element.volume = startVolume;
		}

		const increment = (newVolume - element.volume) / (20 * time);
		const fade = setInterval(() => {
			element.volume = (element.volume + increment).toFixed(8);
			if (element.volume <= 0) {
				element.volume = 0;
				clearInterval(fade);
			} else if (element.volume >= 1) {
				element.volume = 1;
				clearInterval(fade);
			}
		}, 50);

		setTimeout(() => {
			clearInterval(fade);
		}, time * 1000);
	}
}
