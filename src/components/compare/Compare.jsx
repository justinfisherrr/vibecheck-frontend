import './compare.css';

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

import useSubmit from '../../hooks/useSubmit/useSubmit';
import editIcon from '../../images/edit-icon.svg';
import Background from '../background/Background';
import CompareImages from '../compare-images/CompareImages';
import DeleteAccountModal from '../delete-account-modal/DeleteAccountModal';
import Invite from '../invite/Invite';
import ProfileDropdown from '../profile-dropdown/ProfileDropdown';
import UserExistsModal from '../user-exists-modal/UserExistsModal';
import UsernameInput from '../username-input/UsernameInput';
import UsernameModal from '../username-modal/UsernameModal';

function Compare() {
	const [openModal, setOpenModal] = useState(false);
	const [responseData, setResponseData] = useState(null);

	const [userData, setUserData] = useState(
		JSON.parse(localStorage.getItem('userData'))
	);
	const queryParameters = new URLSearchParams(window.location.search);
	const urlUserImg = queryParameters.get('profile_img');
	const urlVibeId = queryParameters.get('vibe_id');

	const [vibeId, setVibeId] = useState(userData ? userData.vibeId : urlVibeId);
	const [userImg] = useState(userData ? userData.userImg : urlUserImg);
	const [displayExistsModal, setExistsDisplayModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);

	const sumbitCompare = useSubmit(
		vibeId,
		setResponseData,
		setExistsDisplayModal
	);

	useEffect(() => {
		const invite = JSON.parse(localStorage.getItem('invite'));
		if (invite) {
			localStorage.removeItem('invite');
			sumbitCompare(invite.otherVibeId);
		}
		window.history.replaceState(null, 'Vibe Check', window.location.pathname);
	}, []);

	function handleChangeUsername() {
		setOpenModal(true);
	}

	function handleCompareClick({ target }) {
		if (showDropdown && target.id !== 'avatar') {
			setShowDropdown(false);
		}
	}

	return responseData == null ? (
		<div className='compare-page' onClick={(e) => handleCompareClick(e)}>
			<Helmet>
				<title>Vibe Check</title>
				<meta
					name='description'
					content='Check your music compatibility. Connect your Spotify account and see how well your music taste matches up.'
				/>
				<link rel='canonical' href='https://thevibecheck.io/compare' />
				<meta name='robots' content='noindex' />
			</Helmet>
			<Background setShowDeleteModal={setShowDeleteModal}>
				<UsernameModal
					openModal={openModal}
					setOpenModal={setOpenModal}
					vibeId={vibeId}
					setUserData={setUserData}
					setVibeId={setVibeId}
				/>

				<DeleteAccountModal
					vibeId={vibeId}
					showDeleteModal={showDeleteModal}
					setShowDeleteModal={setShowDeleteModal}
				/>
				<UserExistsModal
					displayExistsModal={displayExistsModal}
					setExistsDisplayModal={setExistsDisplayModal}
				/>
				<div className='content compare-content'>
					<ProfileDropdown
						profileImg={userImg}
						setShowDeleteModal={setShowDeleteModal}
						showDropdown={showDropdown}
						setShowDropdown={setShowDropdown}
					/>

					<h1 className='compare-heading'>COMPARE WITH?</h1>
					<div
						className='id-container focus-outline'
						tabIndex='0'
						onClick={() => handleChangeUsername()}>
						<p className='compare-your-id'>Your ID: {vibeId}</p>
						<div className='edit-button'>
							<img src={editIcon} alt='' />
						</div>
					</div>

					<CompareImages profileImg={userImg} />
					<p className='compare-subheading'>
						Enter the other users Vibe Check ID
					</p>
					<UsernameInput
						setResponseData={setResponseData}
						vibeId={vibeId}
						setExistsDisplayModal={setExistsDisplayModal}
					/>
					<Invite vibeId={vibeId} />
				</div>
			</Background>
		</div>
	) : (
		<Navigate to={'/animation'} responseData={responseData} />
	);
}

export default Compare;
