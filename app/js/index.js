// iTunes API Methods

// Add creating playlist feature - with drag/drop reordering

const baseURL = 'https://itunes.apple.com/';

const fetchSearchResults = async (searchTerm) => {
	searchTerm.replace(/\s/g, '+');
	const response = await axios.get(baseURL + 'search', {
		params : {
			term    : searchTerm,
			country : 'us',
			limit   : '10'
		}
	});
	return response.data.results;
};

const fetchSongData = async (songID) => {
	const response = await axios.get(baseURL + 'lookup', {
		params : {
			term : songID
		}
	});
	return response.data;
};

// Create Autocomplete Widgets

const searchWidgets = document.querySelectorAll('.autocomplete');

for (widget of searchWidgets) {
	//hide associated summary div
	widget.parentElement.querySelector('.songSummary').classList.add('hidden');

	createAutoComplete({
		// === Config Options ===//

		// root element
		root           : widget,

		// data query
		fetchData      : fetchSearchResults,

		// how to render each dropdown result
		renderOption   : (song) => {
			return `
                <div class="autocomplete__dropdown-item--image">
                    <img src=${song.artworkUrl100}>
                </div>
                <div class="autocomplete__dropdown-item--content">
                    <span class="title">${song.trackName}</span>
                    <span class="subtitle">
                        <a href="${song.artistViewUrl}" class="artist">${song.artistName}</a> - 
                        <a href="${song.collectionViewUrl}" class="album">${song.collectionName}</a>
                    </span>
                    </div>
            `;
		},

		// what to do when an option is clicked on
		onOptionSelect : (song, event) => {
			// <<< GUARD >>> //
			// If user clicked on artist or album link, don't run the normal option selection method
			if (event.target.classList.contains('artist') || event.target.classList.contains('album')) {
				event.preventDefault();
				const inputForm = widget.querySelector('input');
				inputForm.value = event.target.innerText;

				let inputEvent = new Event('submit');
				inputForm.dispatchEvent(inputEvent);
				return;
			}

			//Song Selection Method
			onSongSelect(song, widget);
		},

		// what to set input value to when option is clicked on
		setInputValue  : (song) => {
			return song.trackName;
		}
	});
}

//================================//
//======== Song Selection ========//
//================================//

const onSongSelect = (song, root) => {
	// Define Summary Container
	const songSummary = root.parentElement.querySelector('.songSummary');

	// show summary container
	songSummary.classList.remove('hidden');

	// Fill Summary Container
	songSummary.innerHTML = songTemplate(song);
};

const songTemplate = (song) => {
	//artistName
	//artistViewUrl
	//artworkUrl30 (or 60, 100)
	//country
	//kind: "song"
	//previewUrl
	//primaryGenreName
	//relseaseDate
	//trackCensoredName
	//trackExplicitness
	//trackId
	//trackName
	//trackNumber
	//collectionName
	//collectionId
	//collectionViewUrl

	const albumArt = song.artworkUrl100;
	const title = song.trackName;
	const artist = song.artistName;
	const artistSrc = song.artistViewUrl;
	const album = song.collectionName;
	const albumSrc = song.collectionViewUrl;
	const preview = song.previewUrl;

	return `
		<img class="songSummary__image" src="${albumArt}">
		<div class="songSummary__contentBlock">
			<h3 class="songSummary__title" data-title="${title}">${title}</h3>
			<a class="songSummary__artist" href="${artistSrc}"  data-artist="${artist}">${artist}</a> : 
			<a class="songSummary__album" href="${albumSrc}"  data-album="${album}">${album}</a>
			<div class="songSummary__preview">
				<audio class="songSummary__audio" src="${preview}" controls>
					Your browser does not support the audio element.
				</audio>
			</div>
		</div>
		<div class="songSummary__addToPlaylist--container">
			<button class="songSummary__addToPlaylist--button"><i class="fas fa-plus"></i>
			</button>
		</div>
    `;
};

// Connect song summary to playlist
const songSummary = document.querySelector('.songSummary');
const playlist = document.querySelector('.playlist-container');

createPlaylist({
	root        : playlist,
	songsummary : songSummary,
	renderItem  : ({ title, artist, album, preview }) => {
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
});
