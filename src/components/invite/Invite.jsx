import './invite.css';

import React, { useEffect, useState } from 'react';

import useTempAlert from '../../hooks/useTempAlert/useTempAlert';
import envelope from '../../images/envelope.svg';

function Invite({ vibeId }) {
	const [showModal, setShowModal] = useState(false);
	const [inviteLink, setInviteLink] = useState(
		`${window.location.origin}/compare?invite=true&compare_with=${vibeId}`
	);
	const [tempAlert, tempAlertActive, setActive] = useTempAlert('Copied!');

	useEffect(() => {
		setInviteLink(
			`${window.location.origin}/compare?invite=true&compare_with=${vibeId}`
		);
	}, [vibeId]);

	function handleInvite() {
		setShowModal(true);
	}

	function handleCloseModal(e) {
		if (e.target.id === 'allow-close') {
			setShowModal(false);
		}
	}

	function handleCopy() {
		if (!tempAlertActive) {
			navigator.clipboard.writeText(inviteLink);
			setActive('Copied!');
		}
	}

	return (
		<div className='invite-wrapper'>
			<button
				className='button invite-button focus-outline'
				tabIndex='0'
				onClick={() => handleInvite()}>
				Invite
			</button>
			{showModal && (
				<div
					className='invite-modal-wrapper'
					id='allow-close'
					onMouseDown={(e) => handleCloseModal(e)}>
					<div className='invite-modal'>
						<div className='invite-heading-wrapper'>
							<div className='envelope-icon-wrapper'>
								<img src={envelope} alt='envelope icon' />
							</div>
							<h3 className='invite-username-title'>Invite a friend</h3>
						</div>
						<div className='invite-input-wrapper'>
							<input
								className='invite-input'
								defaultValue={inviteLink}
								type='text'
								readOnly='readonly'
							/>
						</div>
						<div className='invite-modal-subtext-wrapper'>
							{tempAlertActive && tempAlert}
							<div className='invite-modal-buttons-wrapper'>
								<button
									className='cancel-button focus-outline'
									id='allow-close'
									tabIndex='0'
									onClick={(e) => handleCloseModal(e)}>
									Cancel
								</button>
								<button
									className='button focus-outline'
									tabIndex='0'
									onClick={() => handleCopy()}>
									Copy
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Invite;
