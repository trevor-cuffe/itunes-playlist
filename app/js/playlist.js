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
	//===create div container for song===//
	const newSong = document.createElement('div');
	newSong.classList.add('playlist__song');

	//===create title element===//
	const songTitle = document.createElement('span');
	songTitle.classList.add('playlist__song--title');
	songTitle.innerText = `${title}`;
	//append to newSong
	newSong.appendChild(songTitle);

	//===create info element===//
	const songInfo = document.createElement('span');
	songInfo.classList.add('playlist__song--info');
	songInfo.innerHTML = `<strong>${artist}</strong>: ${album}`;
	//append to newSong
	newSong.appendChild(songInfo);

	//===create audio controls element===//
	const songAudio = document.createElement('audio');
	songAudio.classList.add('playlist__song--audio');
	songAudio.src = `${preview}`;
	//append to newSong
	newSong.appendChild(songAudio);

	//===append to root===//
	playlist.appendChild(newSong);
}
