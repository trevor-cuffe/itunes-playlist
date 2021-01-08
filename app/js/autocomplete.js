//==============================================================//
//==================  AUTO-COMPLETION WIDGET  ==================//
//==============================================================//
//
// Author: Trevor Cuffe
// Created as part of my Modern Javascript Bootcamp course
// Original design by Stephen Grider
//
// Description:
// This widget is designed to work within the Bulma framework
// Also requires
// It can be used to generate multiple autocomplete elements in
// a single page.
//
//--------------------------------------------------------------//

function createAutoComplete({ root, fetchData, renderOption, onOptionSelect, setInputValue }) {
	//=== Create HTML for AutoComplete ===//

	root.innerHTML = `
        <label>
            <span class="autocomplete__label">Search:</span>
            <input type="text" class="autocomplete__input" placeholder="Search...">
        </label>
        <div class="autocomplete__dropdown">
            <div class="autocomplete__dropdown--menu">
                <div class="autocomplete__dropdown--content autocomplete__results"></div>
            </div>
        </div>

    `;

	//====================================//

	// -------------------- //
	// Set up DOM Variables //
	// -------------------- //

	const input = root.querySelector('.autocomplete__input');
	const dropdown = root.querySelector('.autocomplete__dropdown');
	const resultsWrapper = root.querySelector('.autocomplete__results');

	// User Input

	const getSearchResults = async (event) => {
		//get results from input string
		const results = await fetchData(event.target.value);

		//reset results wrapper
		resultsWrapper.innerHTML = '';

		//GUARD: if there are no results
		if (!results.length) {
			dropdown.classList.remove('is-active');
			return;
		}

		dropdown.classList.add('is-active');

		//set up DOM Element for each result
		for (let result of results) {
			let option = document.createElement('a');

			option.classList.add('autocomplete__dropdown-item');
			option.innerHTML = renderOption(result);

			option.addEventListener('click', (event) => {
				dropdown.classList.remove('is-active');
				input.value = setInputValue(result);
				onOptionSelect(result, event);
			});

			resultsWrapper.appendChild(option);
		}
	};

	input.addEventListener('input', debounce(getSearchResults, 500));

	input.addEventListener('submit', getSearchResults);

	//*** Remove dropdown when user clicks outside ***//

	document.addEventListener('click', (event) => {
		if (!root.contains(event.target)) {
			dropdown.classList.remove('is-active');
		}
	});

	//*** If there are results, restore them on input focus ***//

	input.addEventListener('focusin', () => {
		if (resultsWrapper.innerHTML !== '') {
			dropdown.classList.add('is-active');
		}
	});
}
