import './username-input.css';

import React, { useEffect, useRef, useState } from 'react';

import useFetch from '../../hooks/useFetch/useFetch';
import useSubmit from '../../hooks/useSubmit/useSubmit';
import arrow from '../../images/arrow-right-solid.svg';
import SearchResults from '../search-results/SearchResults';

export default function UsernameInput({
	setResponseData,
	vibeId,
	setExistsDisplayModal,
}) {
	// State
	const currentInputValue = useRef();
	const [userInput, setInput] = useState('');
	const [searchLoading, setSearchLoading] = useState(false);
	const [searchResults, setSearchResults] = useState([]);

	// Custom Hooks
	const sumbitCompare = useSubmit(
		vibeId,
		setResponseData,
		setExistsDisplayModal
	);
	const getSearchResultsFor = useFetch(setSearchLoading, setSearchResults);

	// Handler Functions
	function handleSend(chosenUser) {
		if (chosenUser) {
			sumbitCompare(chosenUser);
			setInput('');
		}
	}

	useEffect(() => {
		setSearchResults([]);
		if (userInput) {
			setSearchLoading(true);
		}

		const delayDebounceFn = setTimeout(() => {
			getSearchResultsFor(userInput);
		}, 500);

		return () => {
			setSearchLoading(false);
			clearTimeout(delayDebounceFn);
		};
	}, [userInput]);

	function handleInputChange(newUserInput) {
		currentInputValue.current = newUserInput;
		setInput(newUserInput);
	}

	function handleKeyDown({ code, target }) {
		if (code === 'Enter' || code === 'NumpadEnter') {
			const chosenUser = target.value;
			handleSend(chosenUser);
		}
	}

	return (
		<div className='username-form'>
			<div
				className={`input-wrapper ${
					searchResults.length !== 0 ? 'bottom-line' : ''
				}`}>
				<p className='at-symbol'>ID</p>
				<input
					type='text'
					tabIndex='0'
					className='username-input'
					value={userInput}
					onChange={(e) => handleInputChange(e.target.value)}
					onKeyDown={(e) => handleKeyDown(e)}
				/>

				<button
					className='compare-button focus-outline'
					tabIndex='0'
					type='submit'
					onClick={() => handleSend(userInput)}>
					<img src={arrow} className='compare-arrow' alt='' />
				</button>
			</div>
			<div className='search-results-aligner'>
				<SearchResults
					results={searchResults}
					vibeId={vibeId}
					userInput={userInput}
					handleSend={handleSend}
					searchLoading={searchLoading}
				/>
			</div>
		</div>
	);
}
