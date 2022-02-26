import React, { useState, useEffect, useCallback } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { toast } from 'react-toastify';

import UseFormInput from '../UseFormInput';
import { createBid, ReduceCategory } from '@/pages/Events/token'
import { Icon } from '@/components/common/Icon'
import { getCategoriesbyeventid, eventgetbyid } from '../../../pages/Events/event'
import * as nearAPI from "near-api-js"
export default function BidNFTModal({
	show,
	onHide,
	ToAddress,
	tokenId,
	recid,
	RealEventId,
	type,
	Highestbid,
	walletType,
	eventId,
}) {
	var Airtable = require('airtable');
	var base = new Airtable({ apiKey: 'keyR1Rrcl9O2s9bTs' }).base('appgbRCpbkzmdcucO');

	const [Alert, setAlert] = useState('');
	const [Amount, AmountInput] = UseFormInput({
		type: 'text',
		placeholder: 'Amount',
	});
	const [EventGoal, setEventGoal] = useState(0);
	const [categories, setCategories] = useState([]);


	const [allSelected, setAllSelected] = useState(false);
	const [otherSelected, setOtherSelected] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState([]);

	const [otherCategory, setOtherCategory] = useState(-1);

	function activateWarningModal() {
		var alertELM = document.getElementById("alert");
		alertELM.style = 'contents';
		setAlert(`Amount cannot be under ${Highestbid} NEAR`)
	}
	async function fetchCategories() {
		if (categories.length == 0) {
			var nearPrice = 0;
			try {
				var nearCurrencyUrl = "https://api.coinmarketcap.com/data-api/v3/cryptocurrency/market-pairs/latest?slug=near-protocol&start=1&limit=1&category=spot&sort=cmc_rank_advanced";
				let options = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json, text/plain, */*'
					},
				};
				await fetch(nearCurrencyUrl, options).then(res => res.json())
					.then(json => nearPrice = json)
					.catch(err => console.error('error:' + err));
				nearPrice = nearPrice.data.marketPairs[0].price;
			} catch (ex) {
				var nearPrice = 0;
			}

			if (EventGoal == 0) {
				await base('events').find(eventId, function (err, record) {
					setEventGoal(Number(record.get("Goal")));
				});
			}
			if (RealEventId != 0) {
				try {

					base('eventcategories').select({
						filterByFormula: `({eventid} = ${RealEventId})`,
						view: "Grid view"
					}).eachPage(function page(records, fetchNextPage) {
						var sumofmain = 0;
						records.forEach(function (record) {
							categories.push(record.fields);
							sumofmain += Number(Number(record.get("price")) * Number(record.get("amount")));
						});
						setOtherCategory(parseInt(EventGoal * nearPrice) - sumofmain);

						// setCategories(records[0].fields);
					}, function done(err) {
						console.error(err);
					});
				} catch (error) { }
			}

		}

	}

	useEffect(() => {
		fetchCategories();

	}, [categories]);
	async function bidNFT() {
		if (Number(Amount) < Number(Highestbid)) {
			activateWarningModal();
			return;
		}
		await toast.promise(bidNFTbyNEAR, {
			pending: `Bidding...`,
			error: "Please try again later",
			success: `Success!!!`
		});

		await toast.promise(CreatingOnAirTable, {
			pending: `Updating on Airtable...`,
			error: "Please try again later",
			success: `Updated on Airtable`
		});

		window.location.reload();
		window.document.getElementsByClassName("btn-close")[0].click();
	}
	async function CreatingOnAirTable() {
		var Airtable = require('airtable');
		var base = new Airtable({ apiKey: 'keyR1Rrcl9O2s9bTs' }).base('appgbRCpbkzmdcucO');
		let currentDate = new Date();
		await base('tokenbid').create([
			{
				"fields": {
					"Tokenid": tokenId,
					"Date": currentDate,
					"UserName": walletAccount.getAccountId().toString(),
					"Bidprice": Amount
				}
			}]);
		toast.success("Bid created on Airtable");
		await UpdateAirtable();

	}
	async function UpdateAirtable() {
		var Airtable = require('airtable');
		var base = new Airtable({ apiKey: 'keyR1Rrcl9O2s9bTs' }).base('appgbRCpbkzmdcucO');

		await base('nfts').update([
			{
				"id": recid,
				"fields": {
					"price": Amount
				}
			}
		]);

		for (var i = 0; i < selectedCategory.length; i++) {

			await base('eventcategories').select({
				filterByFormula: `({id} = '${selectedCategory[i]}')`,
				sort: [{ field: "price", direction: "desc" }],
				view: "Grid view"
			}).eachPage(async function page(records, fetchNextPage) {
				// This function (`page`) will get called for each page of records.
			
			 await records.forEach(async function (record) {
					var eventcategoryID = record.id;
					const perpeice =  parseInt(Number(record.get('price'))/ Number(record.get('amount')));
					var updatedprice = Number(record.get("price")) - perpeice;
					var Updatedamount = Number(record.get('amount'))-1;
					await base('eventcategories').update([
						{
							"id": eventcategoryID,
							"fields": {
								"price": updatedprice.toString(),
								"amount":  Updatedamount.toString()
							}
						}
					]);
					console.log(record);
				});
			}, function done(err) {
				if (err) { console.error(err); return; }
			});
			//	await ReduceCategory(selectedCategory[i]);
		}

	}

	async function bidNFTbyNEAR() {
	
		var buttonProps = document.getElementsByClassName("btn btn-primary")[0];
		if (window.walletAccount.isSignedIn() == false) {
			buttonProps.innerText = "Connect to NEAR wallet"
			await toast.warn("Not connected with NEAR wallet! Connecting...");
			await window.walletAccount.requestSignIn(
				window.nearConfig.contractName,
				'Demeter');
			return;
		}
		// We call say Hi and then update who said Hi last.
		// window.contract.sayHi().then(updateWhoSaidHi);
		const config = {
			networkId: "testnet",
			keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
			nodeUrl: "https://rpc.testnet.near.org",
			walletUrl: "https://wallet.testnet.near.org",
			helperUrl: "https://helper.testnet.near.org",
			explorerUrl: "https://explorer.testnet.near.org",
		};
		// sends NEAR tokens
		const near = await nearAPI.connect(config);
		const account = await near.account(walletAccount.getAccountId());
		const amountInYocto = (Number(Amount) * 1000000000000000000000000).toLocaleString('fullwide', { useGrouping: false });

		await account.sendMoney(
			ToAddress, // receiver account
			amountInYocto // amount in yoctoNEAR
		).catch((error) => {
				console.error("error:", error);
				console.log(error);
				return;
			})
	}


	const selectCategory = (category_id) => {
		console.log("category_id");
		console.log(category_id);
		var temp_arr = [];
		for (var i = 0; i < selectedCategory.length; i++) {
			temp_arr.push(selectedCategory[i]);
		}
		temp_arr.push(category_id);
		console.log(temp_arr);

		setSelectedCategory(temp_arr);
	}
	const unselectCategory = (category_id) => {
		var temp_arr = [];
		for (var i = 0; i < selectedCategory.length; i++) {
			if (selectedCategory[i] != category_id)
				temp_arr.push(selectedCategory[i]);
		}
		console.log(temp_arr);
		setSelectedCategory(temp_arr);
	}

	const selectAllCategory = () => {
		if (allSelected) {
			setAllSelected(false);
			setSelectedCategory([]);
		} else {

			setAllSelected(true);
			var temp_arr = [];
			for (var i = 0; i < categories.length; i++) {
				temp_arr.push(categories[i].id)
			}
			temp_arr.push(-1);
			setSelectedCategory(temp_arr);
		}

	}
	const otherSelect = () => {
		if (otherSelected) {
			setOtherSelected(false);
			var temp_arr = [];
			for (var i = 0; i < selectedCategory.length; i++) {
				if (selectedCategory[i] != -1)
					temp_arr.push(selectedCategory[i])
			}
			setSelectedCategory(temp_arr);
		} else {
			setOtherSelected(true);
			var temp_arr = [];
			for (var i = 0; i < selectedCategory.length; i++) {
				temp_arr.push(selectedCategory[i])
			}
			temp_arr.push(-1);
			setSelectedCategory(temp_arr);
		}
	}
	return (
		<>
			<Modal
				show={show}
				onHide={onHide}
				onShow={fetchCategories}
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
				<Modal.Header closeButton>
					{(type == "Cryptopunk") ? (
						<Modal.Title id="contained-modal-title-vcenter">
							Bid Cryptopunk
						</Modal.Title>) : (
						<Modal.Title id="contained-modal-title-vcenter">
							Bid NFT
						</Modal.Title>
					)}
				</Modal.Header>
				<Modal.Body className="show-grid">
					<Form>
						<div id='alert' style={{ display: 'none' }} className="alert alert-danger" role="alert">
							{Alert}
						</div>
						<Form.Group className="mb-3" controlId="formGroupName">
							<Form.Label>Bid Amount in NEAR</Form.Label>
							{AmountInput}
						</Form.Group>
						<div className='selectCategoryAll'>
							<h4 style={{ marginBottom: "10px" }}>Choose where you want to give support</h4>
							<div style={{ width: "100%", padding: "5px", display: "flex", justifyContent: "center", alignItems: "center", position: "relative", background: "bisque", height: "40px", borderRadius: "5px", marginBottom: "10px" }} onClick={() => {

								selectAllCategory();
							}}>
								<h4 style={{ alignSelf: "center", color: "black" }}>Support in general </h4>
								{allSelected ?
									<div style={{ position: "absolute", right: "10px", top: "-7px" }} >
										<div style={{
											marginTop: "10px",
											display: "flex",
											width: "32px",
											height: "32px",
											justifyContent: "center",
											flexDirection: "column",
											alignItems: "center",
											borderRadius: "16px",
											background: "#EEF1F4"
										}}><Icon icon="heartSelected" /></div>
									</div> :
									<div style={{ position: "absolute", right: "10px", top: "-7px" }} >
										<div style={{
											marginTop: "10px",
											display: "flex",
											width: "32px",
											height: "32px",
											justifyContent: "center",
											flexDirection: "column",
											alignItems: "center",
											borderRadius: "16px",
											background: "#EEF1F4"
										}}><Icon icon="heartUnselected" /></div>
									</div>}
							</div>
						</div>
						<div className='selectCategory' style={{ marginLeft: "-10px", marginRight: "-10px", display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
							{
								categories.map((category) => (
									(selectedCategory.indexOf(category.id) !== -1) ?
										(<div style={{ width: "33%", padding: "0 10px", marginBottom: "10px" }} key={category.id} onClick={() => unselectCategory(category.id)}>
											<div style={{ background: "white", padding: "8px 15px", border: "1px solid transparent", borderRadius: "5px", alignItems: "center", }}>
												<h4 style={{ marginBottom: "10px", color: "#151F28", textAlign: "center" }}>{category.title}</h4>
												<img src={category.image} style={{ aspectRatio: '1', borderRadius: "5px"}} />
												<h5 style={{ color: "#151F28", textAlign: "center", marginTop: "10px", lineHeight: "14px" }}>{category.amount * category.price} USD</h5>
												<h5 style={{ color: "#151F28", textAlign: "center", lineHeight: "14px" }}>({category.amount} pieces)</h5>



												<div style={{ display: "flex", justifyContent: "flex-end" }}  >
													<div style={{
														marginTop: "10px",
														display: "flex",
														width: "32px",
														height: "32px",
														justifyContent: "center",
														flexDirection: "column",
														alignItems: "center",
														borderRadius: "16px",
														background: "#EEF1F4"

													}}><Icon icon="heartSelected" /></div>
												</div>
											</div>
										</div>)
										:
										(<div style={{ width: "33%", padding: "0 10px", marginBottom: "10px" }} key={category.id} onClick={() => selectCategory(category.id)}>
											<div style={{ background: "white", padding: "8px 15px", border: "1px solid transparent", borderRadius: "5px", alignItems: "center", }}>
												<h4 style={{ marginBottom: "10px", color: "#151F28", textAlign: "center" }}>{category.title}</h4>
												<img src={category.image} style={{aspectRatio: '1', borderRadius: "5px" }} />
												<h5 style={{ color: "#151F28", textAlign: "center", marginTop: "10px", lineHeight: "14px" }}>{category.amount * category.price} USD</h5>
												<h5 style={{ color: "#151F28", textAlign: "center", lineHeight: "14px" }}>({category.amount} pieces)</h5>


												<div style={{ display: "flex", justifyContent: "flex-end" }} >
													<div style={{
														marginTop: "10px",
														display: "flex",
														width: "32px",
														height: "32px",
														justifyContent: "center",
														flexDirection: "column",
														alignItems: "center",
														borderRadius: "16px",
														background: "#EEF1F4"
													}}><Icon icon="heartUnselected" /></div>
												</div>



											</div>
										</div>)

								))
							}
							<div style={{ width: "33%", padding: "0 10px", display: "flex", flexDirection: "column" }} onClick={() => otherSelect()}>
								{
									(categories.length > 0) ?
										(<div style={{ background: "white", padding: "10px", border: "1px solid transparent", borderRadius: "5px", alignItems: "center", marginBottom: "15px" }}>
											<h4 style={{ marginBottom: "10px", color: "#151F28", textAlign: "center" }}>Other support</h4>
											<h5 style={{ color: "#151F28", textAlign: "center", marginTop: "10px", lineHeight: "14px" }}>{
												otherCategory
											} USD</h5>
											{
												(selectedCategory.indexOf(-1) !== -1) ? (
													<div style={{ display: "flex", justifyContent: "flex-end" }} >
														<div style={{
															marginTop: "10px",
															display: "flex",
															width: "32px",
															height: "32px",
															justifyContent: "center",
															flexDirection: "column",
															alignItems: "center",
															borderRadius: "16px",
															background: "#EEF1F4"

														}}><Icon icon="heartSelected" /></div>
													</div>) : (
													<div style={{ display: "flex", justifyContent: "flex-end" }} >
														<div style={{
															marginTop: "10px",
															display: "flex",
															width: "32px",
															height: "32px",
															justifyContent: "center",
															flexDirection: "column",
															alignItems: "center",
															borderRadius: "16px",
															background: "#EEF1F4"

														}}><Icon icon="heartUnselected" /></div>
													</div>
												)
											}
										</div>) : null
								}

							</div>
						</div>
						<div className="d-grid">

							{(type == "Cryptopunk") ? (
								<Button variant="primary" onClick={bidNFT}>
									Bid Cryptopunk
								</Button>)
								: (
									<Button variant="primary" onClick={bidNFT}>
										Bid NFT
									</Button>
								)}
						</div>
					</Form>
				</Modal.Body>

			</Modal>

		</>
	);
}
