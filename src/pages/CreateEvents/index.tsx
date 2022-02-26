import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import { toast } from 'react-toastify';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import UseFormInput from '@/components/components/UseFormInput';
import { createEventAPI, createEventCategoryAPI } from '@/pages/Events/event';
import { CreatePlugin } from '@/pages/Events/event';
import { Icon } from '@/components/common/Icon'
import { NavLink } from 'react-router-dom'
import Router from 'next/router'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {
    BuilderField,
    BuilderSubmitButton,
    BuilderTransaction,
} from '@/modules/Builder/components'
import { Select } from '@material-ui/core';
import "regenerator-runtime/runtime";

import * as nearAPI from "near-api-js"
import getConfig from "@/config"


import useContract from '../../../services/useContract';

window.nearConfig = getConfig("development");
export default function CreateEvents() {
    const { contract } = useContract('ERC721');
    // Application initialization

    const [EventTitle, EventTitleInput] = UseFormInput({
        defaultValue: "",
        type: 'text',
        placeholder: 'Event Title',
        id: ''
    });

    const [EventDate, EventDateInput] = UseFormInput({
        defaultValue: "",
        type: 'datetime-local',
        placeholder: 'Event End Date ',
        id: 'enddate',
    });
    const [EventWalletType, EventWalletTypeInput] = UseFormInput({
        defaultValue: "NEAR",
        type: 'select',
        id: 'walletType',
        select_options: [{ value: "NEAR", text: "NEAR" }]
    });
    const [EventWalletAddress, EventWalletAddressInput] = UseFormInput({
        defaultValue: "",
        type: 'text',
        placeholder: 'Wallet',
        id: 'wallet',
    });
    const [EventGoal, setEventGoal] = useState(0);

    const [EventLogo, EventLogoInput] = UseFormInput({
        defaultValue: "",
        type: 'text',
        placeholder: 'Event Logo Link',
        id: 'logo'
    });
    const [eventCategories, setEventCategories] = useState([]);
    const [createCategoryModal, setCreateCategoryModal] = useState(false);
    const [newCategoryTitle, setNewCategoryTitle] = useState("");
    const [newCategoryImgLink, setNewCategoryImgLink] = useState("");
    const [newCategoryPrice, setNewCategoryPrice] = useState(0);
    const [newCategoryAmount, setNewCategoryAmount] = useState(0);
    const [otherCategory, setOtherCategory] = useState("");
    const [NearPriceUSD, setNearPriceUSD] = useState(0);



    async function CreateEvent() {
        if (window.walletAccount.isSignedIn() == false) {
            toast.warning("Please connect Near Account!");
            return;
        }

        await toast.promise(CreatingEventAirtable, {
            pending: "Event is creating on Airtable...",
            error: "Please try again later",
            success: "Event has created on Airtable!"
        })

        await toast.promise(CreatingEvent, {
            pending: "Event is creating on Aurora...",
            error: "Please try again later",
            success: "Event has created on Aurora!"
        })
        window.location.href = "/donation";

    }

    async function CreateCateCategories(eventID) {
        var Airtable = require('airtable');
        Airtable.configure({
            endpointUrl: 'https://api.airtable.com',
            apiKey: 'keyR1Rrcl9O2s9bTs'
        });
        const base = require('airtable').base('appgbRCpbkzmdcucO');

        for (var i = 0; i < eventCategories.length; i++) {
            await base('eventcategories').create([
                {
                    "fields": {
                        "eventid": eventID,
                        "title": eventCategories[i].title,
                        "price": eventCategories[i].price,
                        "amount": eventCategories[i].amount,
                        "image": eventCategories[i].image
                    }
                }
            ], function (err, records) { console.error(err) });
        }
    }
    async function CreatingEventAirtable() {

        var Airtable = require('airtable');
        Airtable.configure({
            endpointUrl: 'https://api.airtable.com',
            apiKey: 'keyR1Rrcl9O2s9bTs'
        });
        const base = require('airtable').base('appgbRCpbkzmdcucO');

        await base('events').create([
            {
                "fields": {
                    "title": EventTitle,
                    "description": "",
                    "endDate": EventDate,
                    "Goal": EventGoal,
                    "logolink": EventLogo,
                    "wallet": EventWalletAddress,
                    "wallettype": "NEAR"
                }
            }
        ], async function (err, records) {
            if (err) {
                console.error(err);
                return;
            }
            if (document.getElementById("plugin").checked) {
               await CreatePlugin(`https://${window.location.host}/donation/auction?[${records[0].getId()}]`);
            }
            if (document.getElementById("plugin").checked)
            await toast.promise(CreateCateCategories(records[0].fields.id), {
                pending: "Event Categories are creating on Airtable...",
                error: "Please try again later",
                success: "Event Categories has created on Airtable!"
            })


        });

    }

    const CreatingEvent = async () => {
        //  Contract
        console.log(contract);
        const createdObject = {
            Title: EventTitle,
            Date: EventDate,
            Address: EventWalletAddress,
            Goal: EventGoal,
        };

        const result = await contract.createEvent(
            JSON.stringify(createdObject)
        );

        console.log(result);

    };

    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const CreateCategory = () => {
        var new_category = {
            title: newCategoryTitle,
            price: newCategoryPrice,
            amount: newCategoryAmount,
            image: newCategoryImgLink
        }
        var temp_arr = eventCategories;
        temp_arr.push(new_category);
        var sum = 0;
        for (var i = 0; i < temp_arr.length; i++) {
            sum += temp_arr[i].price * temp_arr[i].amount;
        }
        var usdEventGoal = Number(NearPriceUSD) * Number(EventGoal);
        var TwoDecimal = formatter.format(usdEventGoal - sum);
        setOtherCategory(TwoDecimal.toString());
        setEventCategories(temp_arr);
        setCreateCategoryModal(false);
        setNewCategoryTitle("");
        setNewCategoryImgLink("");
        setNewCategoryPrice(0);
        setNewCategoryAmount(0);
    }
    const removeCategory = (e) => {
        var category_id = e.target.getAttribute("categoryid");
        var temp_arr = [];
        for (var i = 0; i < eventCategories.length; i++) {
            if (i != category_id) {
                temp_arr.push(eventCategories[i]);
            }
        }
        setEventCategories(temp_arr);
    }
    const eventGoalChanged = (value) => {
        setEventGoal(value);
        var sum = 0;
        for (var i = 0; i < eventCategories.length; i++) {
            sum += eventCategories[i].price * eventCategories[i].amount;
        }
        setOtherCategory(EventGoal - sum);
    }
    async function fetchData() {

        //Near currency
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
            var allnearData;
            await fetch(nearCurrencyUrl, options).then(res => res.json())
                .then(json => allnearData = json)
                .catch(err => console.error('error:' + err));
            nearPrice = allnearData.data.marketPairs[0].price;
        } catch (ex) {
            var nearPrice = 0;
        }
        setNearPriceUSD(nearPrice);

    }

    useEffect(() => {
        fetchData();
    }, []);

    function CreateCategoryButton(): JSX.Element {
        if (window.localStorage.getItem("Type") != "manager") {
            return (<>
                  <NavLink to="/login?[/CreateEvents]">
                         <Button style={{ margin: "17px 0 0px 0px", width: "100%" }}>
                    Login as Event Manager
                </Button>
                  </NavLink>
             
            </>);
        }
        return (<>
            <Button style={{ margin: "17px 0 0px 0px", width: "100%" }} onClick={CreateCategory}>
                Create Category
            </Button>
        </>)
    }

    function CreateEventButton(): JSX.Element {
        if (window.localStorage.getItem("Type") != "manager") {
            return (<>
                <NavLink to="/login?[/CreateEvents]">
                    <Button style={{ margin: "17px 0 0px 0px", width: "100%" }}>
                        Login as Event Manager
                    </Button>

                </NavLink>

            </>);
        }
        return (<>
            <Button style={{ margin: "17px 0 0px 0px", width: "100%" }} onClick={CreateEvent}>
                Create Event
            </Button>
        </>)
    }

    return (
        <><>
            <Row>

                <Col >
                    <div style={{ width: "45vw", background: "transparent", padding: "19px", borderRadius: "4px", height: "100%", border: "white solid" }}>
                        <div style={{ margin: "0px 0px 30px 0px" }}>
                            <h1 style={{ marginBottom: "10px" }}>Create Event</h1>
                        </div>

                        <div style={{ margin: "18px 0" }}>
                            <h4 style={{ marginBottom: "10px" }}>Event Title</h4>
                            {EventTitleInput}
                        </div>

                        <div style={{ margin: "18px 0" }}>
                            <h4 style={{ marginBottom: "10px" }}>Event End Date</h4>
                            {EventDateInput}
                        </div>
                        <div style={{ margin: "18px 0" }}>
                            <h4 style={{ marginBottom: "10px" }}>Wallet Type</h4>
                            {EventWalletTypeInput}
                        </div>
                        <div style={{ margin: "18px 0" }}>
                            {EventWalletType == "NEAR" ? (<><h4 style={{ marginBottom: "10px" }}>Account ID of {EventWalletType} wallet</h4></>) : (
                                <> <h4 style={{ marginBottom: "10px" }}>Wallet Address in {EventWalletType}</h4></>
                            )}

                            {EventWalletAddressInput}
                        </div>
                        <div style={{ margin: "18px 0" }}>
                            <h4 style={{ marginBottom: "10px" }}>Event Goal in {EventWalletType}</h4>
                            <Form.Control
                                value={EventGoal}
                                placeholder={`Event Goal in ${EventWalletType}`}
                                onChange={(e) => eventGoalChanged(e.target.value)}
                                type={"number"}
                                id={"goal"}
                            />
                        </div>
                        <div style={{ margin: "18px 0" }}>
                            <h4 style={{ marginBottom: "10px" }}>Categories for Support</h4>
                            <div style={{ marginLeft: "-10px", marginRight: "-10px", display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                                {
                                    eventCategories.map((eventCategory, index) => (
                                        <div style={{ width: "33%", padding: "0 10px", marginBottom: "10px" }} key={index} >
                                            <div style={{ background: "white", padding: "8px 15px", border: "1px solid transparent", borderRadius: "5px", alignItems: "center", }}>
                                                <div
                                                    className="btn btn-icon popup-close"
                                                    onClick={removeCategory}
                                                    categoryid={index}
                                                    style={{ display: "flex", justifyContent: "flex-end", fontSize: 20, color: "black" }}
                                                >
                                                    X
                                                </div>
                                                <h4 style={{ marginBottom: "10px", color: "#151F28", textAlign: "center" }}>{eventCategory.title}</h4>
                                                <img src={eventCategory.image} style={{ aspectRatio: '1',borderRadius: "5px" }} />
                                                <h5 style={{ color: "#151F28", textAlign: "center", marginTop: "10px", lineHeight: "14px" }}>{eventCategory.price * eventCategory.amount} USD</h5>
                                                <h5 style={{ color: "#151F28", textAlign: "center", lineHeight: "14px" }}>({eventCategory.amount} pieces)</h5>

                                            </div>
                                        </div>
                                    ))
                                }

                                <div style={{ width: "33%", padding: "0 10px", display: "flex", flexDirection: "column" }}>
                                    {
                                        (eventCategories.length > 0) ?
                                            (<div style={{ background: "white", padding: "10px", border: "1px solid transparent", borderRadius: "5px", alignItems: "center", height: "80px", marginBottom: "15px" }}>
                                                <h4 style={{ marginBottom: "10px", color: "#151F28", textAlign: "center" }}>Other support</h4>
                                                <h5 style={{ color: "#151F28", textAlign: "center", marginTop: "10px", lineHeight: "14px" }}>{
                                                    otherCategory
                                                } USD</h5>
                                            </div>) : null
                                    }

                                    <div style={{ background: "white", padding: "10px", border: "1px solid transparent", borderRadius: "5px", alignItems: "center", height: "80px", display: "flex", justifyContent: "center" }} onClick={() => setCreateCategoryModal(true)}>
                                        <h1 style={{ color: "#757575", textAlign: "center", lineHeight: "14px", fontSize: "50px" }}>+</h1>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div style={{ margin: "18px 0" }}>
                            <h4 style={{ marginBottom: "10px" }}>Event Logo Link</h4>
                            {EventLogoInput}
                        </div>

                        <div style={{
                            margin: '18px 0px',
                            display: 'flex',
                            alignContent: 'center',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '5px'
                        }} >
                            <input type="checkbox" id="plugin" />
                            <h4>Generate Plugin?</h4>
                        </div>


                        <CreateEventButton />
                    </div>
                </Col>

            </Row>
            <Modal show={createCategoryModal}
                onHide={() => setCreateCategoryModal(false)}
                size='lg'
                centered style={{ padding: "20px" }}>
                <Modal.Header closeButton>
                    Create a new category
                </Modal.Header>
                <div style={{ margin: "20px" }}>
                    <div style={{ margin: "18px 0" }}>
                        <h4 style={{ marginBottom: "10px", color: "black" }}>Category Title</h4>
                        <Form.Control
                            value={newCategoryTitle}
                            placeholder={"Category Title"}
                            onChange={(e) => setNewCategoryTitle(e.target.value)}
                            type={"text"}
                            id={"cat_title"}
                        />
                    </div>
                    <div style={{ margin: "18px 0" }}>
                        <h4 style={{ marginBottom: "10px", color: "black" }}>Amount</h4>
                        <Form.Control
                            value={newCategoryAmount}
                            placeholder={"Amount"}
                            onChange={(e) => setNewCategoryAmount(e.target.value)}
                            type={"number"}
                            id={"cat_piece"}
                        />
                    </div>
                    <div style={{ margin: "18px 0" }}>
                        <h4 style={{ marginBottom: "10px", color: "black" }}>Price of A Piece</h4>
                        <Form.Control
                            value={newCategoryPrice}
                            placeholder={"Category Price"}
                            onChange={(e) => setNewCategoryPrice(e.target.value)}
                            type={"number"}
                            id={"cat_price"}
                        />
                    </div>
                    <div style={{ margin: "18px 0" }}>
                        <h4 style={{ marginBottom: "10px", color: "black" }}>Category Image Link</h4>
                        <Form.Control
                            value={newCategoryImgLink}
                            placeholder={"Category Image Link"}
                            onChange={(e) => setNewCategoryImgLink(e.target.value)}
                            type={"text"}
                            id={"cat_image"}
                        />
                    </div>
                    <CreateCategoryButton />
                </div>
            </Modal>
        </></>
    );
}