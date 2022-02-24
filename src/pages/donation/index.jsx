import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom'
import DonateNFTModal from '../../components/components/modals/DonateNFTModal';
import './donation.css';
import Router from 'next/router'
export default function Donation() {
    const [CreatemodalShow, setModalShow] = useState(false);

    const [list, setList] = useState([]);
    const [selectid, setselectid] = useState('');
    const [selectEventeRecID, setslectEventeRecID] = useState('');
    const [selectedtype, setselectedtype] = useState('');
    const [SelectedTitle, setSelectedTitle] = useState('');
    const [SelectedendDate, setSelectedendDate] = useState('');
    const [selectedWallet, setSelectedWallet] = useState("");


    useEffect(() => {
        fetchContractData();
    }, []);

    function calculateTimeLeft() {
        try {
            var allDates = document.getElementsByName("DateCount");
            for (let i = 0; i < allDates.length; i++) {
                var date = (allDates[i]).getAttribute("date");
                allDates[i].innerHTML = LeftDate(date);
            }
        } catch (error) {

        }

    }
    setInterval(function () {
        calculateTimeLeft();
    }, 1000);
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    async function fetchContractData() {

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
            await fetch(nearCurrencyUrl, options).then(res => res.json())
                .then(json => nearPrice = json)
                .catch(err => console.error('error:' + err));
            nearPrice = nearPrice.data.marketPairs[0].price;
        } catch (ex) {
            var nearPrice = 0;
        }
        try {
            var Airtable = require('airtable');
            var base = new Airtable({ apiKey: 'keyR1Rrcl9O2s9bTs' }).base('appgbRCpbkzmdcucO');

            base('events').select({
                // Selecting the first 3 records in Grid view:
                maxRecords: 10,
                sort: [{ field: "endDate", direction: "asc" }],
                view: "Grid view"
            }).eachPage(function page(records, fetchNextPage) {
                // This function (`page`) will get called for each page of records.
                var arr = [];
                records.forEach(function (record) {
                    var goalPrice2usd = 0;
                    goalPrice2usd = Number(Number(record.get("Goal")) * nearPrice);
                    arr.push({
                        id: record.id,
                        eventId: record.get("id"),
                        Title: record.get("title"),
                        Date: record.get("endDate"),
                        Goalusd: formatter.format(goalPrice2usd),
                        Goal: record.get("Goal"),
                        logo: record.get("logolink"),
                        wallettype: record.get("wallettype")
                    });
                });

                setList(arr);
                // To fetch the next page of records, call `fetchNextPage`.
                // If there are more records, `page` will get called again.
                // If there are no more records, `done` will get called.
                // fetchNextPage();

                if (document.getElementById("Loading")) {
                    document.getElementById("Loading").style = "display:none";
                }
            }, function done(err) {
                if (err) { console.error(err); return; }
            });


        } catch (error) {
            console.error(error);
        }
    }
    function activateCreateNFTModal(e) {
        setselectid(e.target.getAttribute("eventid"));
        setslectEventeRecID(e.target.getAttribute("recid"))
        setSelectedTitle(e.target.getAttribute("eventtitle"));
        setSelectedendDate(e.target.getAttribute("date"));
        setSelectedWallet(e.target.getAttribute("wallettype"));
        setselectedtype("NFT");

        setModalShow(true);
    }

    function activateCreateCryptopunkModal(e) {
        setselectid(e.target.getAttribute("eventid"));
        setslectEventeRecID(e.target.getAttribute("recid"))
        setSelectedTitle(e.target.getAttribute("eventtitle"));
        setSelectedendDate(e.target.getAttribute("date"));
        setselectedtype("Cryptopunk");

        setModalShow(true);
    }


    function LeftDate(datetext) {
        var c = new Date(datetext).getTime();
        var n = new Date().getTime();
        var d = c - n;
        var da = Math.floor(d / (1000 * 60 * 60 * 24));
        var h = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var m = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
        var s = Math.floor((d % (1000 * 60)) / 1000);
        var output = da.toString() + " Days " + h.toString() + " hours " + m.toString() + " minutes " + s.toString() + " seconds";
        // if ("-" in output) {
        //     output = "Expired!"
        // }
        return (output);
    }


    function EventButtons() {
        if (window.localStorage.getItem("Type") == "" || window.localStorage.getItem("Type") == null) {
            return (<>

            </>)
        }

        if (window.localStorage.getItem("Type") == "user") {
            return (<>

            </>)
        }

        return (<>


        </>)

    }


    return (
        <>

            <div className='row DonationBar'>
                <NavLink to='?q=All'>
                    <a className='DonationBarLink active'>
                        All
                    </a>
                </NavLink>
                <NavLink to='?q=Today'>
                    <a className='DonationBarLink'>
                        Today
                    </a>
                </NavLink>
                <NavLink to='?q=This Month'>
                    <a className='DonationBarLink'>
                        This Month
                    </a>
                </NavLink>
            </div>
            <div id='Loading' className="LoadingArea">
                <h1>Loading...</h1>
            </div>


            {list.map((listItem) => (
                <div key={listItem.eventId} className='row' style={{
                    height: '397px',
                    margin: '28px',
                    display: 'flex',
                    background: 'white',
                    color: 'black',
                    overflow: 'hidden',
                    padding: '14px 7px',
                    alignItems: 'flex-start',
                    alignContent: 'flex-start'
                }}>
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        padding: '18px'
                    }}><h4 style={{
                        fontSize: '2.0vw',
                        float: 'left'
                    }} name="DateCount" date={listItem.Date}>{LeftDate(listItem.Date)}</h4></div>
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        padding: '38px 18px'
                    }}>
                        <div style={{ width: '33%', height: '238px', marginTop: '-37px' }}>
                            <img src={listItem.logo} style={{

                                maxHeight: '259px'
                            }} />
                        </div>
                        <div style={{
                            marginLeft: '50px',
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            rowGap: '10px',
                            alignContent: 'stretch'
                        }}>
                            <h4 style={{ fontSize: '1.7vw' }}>{listItem.Title}</h4>
                            <div style={{ display: "flex", "whiteSpace": "pre-wrap" }}>
                                <h4 style={{ fontSize: '1.7vw' }}>Goal:  </h4>
                                <h4 style={{ fontSize: '1.7vw' }}>${listItem.Goalusd} ({listItem.Goal} NEAR)</h4>
                            </div>

                            <div style={{
                                display: 'flex',
                                height: '100%',
                                float: 'right',
                                alignItems: 'flex-start',
                                marginLeft: '0px',
                                flexDirection: 'column',
                                width: '100%',
                                justifyContent: 'flex-end'
                            }}>
                                <div style={{ "display": "flex", gap: "14px" }}>
                                    {(window.localStorage.getItem('Type') == "" || window.localStorage.getItem('Type') == null) ? (

                                        <div style={{
                                            color: 'white',
                                            overflow: 'hidden',
                                            background: 'rgb(236, 201, 0)',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            height: '72px',
                                            width: '244px',
                                            float: 'right',
                                            padding: '0px'
                                        }} >
                                            <NavLink to="/login?[/donation]">
                                                <div className="card-body" style={{ height: '100%', paddingTop: '34px' }} >
                                                    Login
                                                </div>
                                            </NavLink>

                                        </div>
                                    ) : (window.localStorage.getItem('Type') == "user" ? (<>
                                        <div style={{
                                            color: 'white',
                                            overflow: 'hidden',
                                            background: 'rgb(236, 201, 0)',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            height: '72px',
                                            width: '244px',
                                            float: 'right',
                                            padding: '0px'
                                        }} recid={listItem.id} eventid={listItem.eventId} date={listItem.Date} eventtitle={listItem.Title} className="card" wallettype={listItem.wallettype} onClick={activateCreateNFTModal}>
                                            <div recid={listItem.id} eventid={listItem.eventId} date={listItem.Date} eventtitle={listItem.Title} className="card-body" style={{
                                                height: '100%',
                                                paddingTop: '34px'
                                            }} wallettype={listItem.wallettype}>
                                                Donate NFT
                                            </div>
                                        </div>
                                        <div style={{
                                            color: 'white',
                                            overflow: 'hidden',
                                            background: 'rgb(236, 201, 0)',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            width: '244px',
                                            float: 'right',
                                            padding: '0',
                                        }} className="card" >
                                            <NavLink to={`/donation/auction?[${listItem.id}]`}>

                                                <div className="card-body" style={{
                                                    height: '100%',
                                                    paddingTop: '34px'
                                                }}>
                                                    Go to auction
                                                </div>
                                            </NavLink>
                                        </div>
                                    </>) : (
                                        <div style={{
                                            color: 'white',
                                            overflow: 'hidden',
                                            background: 'rgb(236, 201, 0)',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            width: '244px',
                                            float: 'right',
                                            padding: '0',
                                        }} className="card" >
                                            <NavLink to={`/donation/auction?[${listItem.id}]`}>

                                                <div className="card-body" style={{
                                                    height: '100%',
                                                    height: '68px',
                                                    paddingTop: '34px'
                                                }}>
                                                    Go to auction
                                                </div>
                                            </NavLink>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            ))}
            <DonateNFTModal
                show={CreatemodalShow}
                onHide={() => {
                    setModalShow(false);

                }}
                EventID={selectid}
                EventeRecID={selectEventeRecID}
                type={selectedtype}
                SelectedTitle={SelectedTitle}
                selectedWallet={selectedWallet}
                enddate={SelectedendDate}
            />
        </>
    );
}
