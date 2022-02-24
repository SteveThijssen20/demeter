import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom'
import LOGINModal from '@/modals/login';

export default function Home() {

	const [modalShow, setModalShow] = useState(false);
	function DonateButton() {

	}

	return (<>
		<div className="mb-5">
			<div className="row">
				<img style={{ 'width': '340px' }} src='https://i.postimg.cc/1z7RpZsX/favicon.png'></img>

			</div>
			<div className="row">
				<div className="col">
					<div className="text-center">
						<h1 style={{ fontSize: '39px' }}>A gift with a story</h1>
					</div>
				</div>
			</div>
			<div className="row">
				<div style={{ 'width': '690px' }} className="col">
					<div className="text-center">
						<h4 style={{ fontSize: '20px' }}>Demeter creates the most easy, transparent and fun NFT charity auction on Web3, by helping charities raise additional support!</h4>
					</div>
				</div>
			</div>
			<div className="row">
				<div style={{ width: '250px' }} className="col">
					<NavLink to="/login?[/donation]">

						<div style={{
							background: '#ecc900',
							textAlign: 'center',
							cursor: 'pointer',
							height: '73px',
							padding: '36px 0',
							width: '100%',
							margin: '0'
						}} className="card card-body">
							<div className="card-body">Let’s donate!</div>
						</div>
					</NavLink>
				</div>

			</div>
			<div className="Event row">
				<img style={{ 'padding': '0', width: '-webkit-fill-available' }} src="https://www.metisgift.com/Event/Panel.svg" />
				<img style={{ "position": "absolute", "bottom": "0" }} src="https://www.metisgift.com/Event/Group.svg" />
				<img style={{ "padding": "0px", "position": "absolute", "width": "56%", "marginTop": "10%" }} src="https://www.metisgift.com/Event/CharityText.svg" />
				<div className="card-body EventBTN">
					<NavLink to="/login?[/CreateEvents]">
						<div>
							Start event
						</div>
					</NavLink>
				</div>
			</div>
		</div>
	</>

	);
}