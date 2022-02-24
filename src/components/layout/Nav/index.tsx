import React, { useState, useEffect } from 'react';
// import {ContentLoader} from '@/components/common/ContentLoader'
import { useIntl } from 'react-intl'
import { NavLink } from 'react-router-dom'
import { Button, Grid, makeStyles } from "@material-ui/core";
import './index.scss'
import '@/near-contracts/contract';
import Router from 'next/router'

import * as nearAPI from "near-api-js"
import getConfig from "@/config"

export function Nav(): JSX.Element {
    const [acc, setAcc] = useState('');
    const [NearBalance, setNearBalance] = useState('');
    const [isSigned, setSigned] = useState(false);
    async function fetch() {
        var booltrue = true;
        while (booltrue) {
            try {
                console.log(window.walletAccount.isSignedIn())
                break;
            } catch (ex) {
                // Initializing connection to the NEAR node.
                window.near = await nearAPI.connect(Object.assign({ deps: { keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore() } }, nearConfig));

                // Initializing Wallet based Account. It can work with NEAR TestNet wallet that
                // is hosted at https://wallet.testnet.near.org
                window.walletAccount = new nearAPI.WalletAccount(window.near);


                continue;
            };
        }
        if (window.walletAccount.isSignedIn() == true) {
            let accoun = await near.account(window.walletAccount.getAccountId());
            await setAcc(window.walletAccount.getAccountId());
            var Balance = await accoun.getAccountBalance();
            let price = await Number(Balance.total / 1000000000000000000000000);

            setNearBalance(price.toString());
            setSigned(true);
            window.document.getElementById("withoutSign").style.display = "none";
            window.document.getElementById("withSign").style.display = "";
        }
    }
    useEffect(() => {
        fetch();
    }, [2000]);
    function NavButtons(): JSX.Element {
        if (window.localStorage.getItem("Type") == null || window.localStorage.getItem("Type") == "") {
            return (<>
                <li>
                    <NavLink to="/donation" id="donationbtnNav">
                        Donation
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/CreateEvents">
                        Create Events
                    </NavLink>
                </li>
            </>);
        }
        if (window.localStorage.getItem("Type") == "user") {
            return (<>
                <li>
                    <NavLink to="/donation" id="donationbtnNav">
                        Donation
                    </NavLink>
                </li></>);
        }
        return (<>
            <li>
                <NavLink to="/donation" id="donationbtnNav">
                    Donation
                </NavLink>
            </li>
            <li>
                <NavLink to="/CreateEvents">
                    Create Events
                </NavLink>
            </li>
        </>)
    }
    const [modalShow, setModalShow] = useState(false);
    return (
        <nav className="main-nav">
            <ul>
                <NavButtons />

                <li>
                    <div id='withoutSign' className="wallets">
                        <div className="wallet">
                            <NavLink to="/login?[/donation]">

                                <button type="button" className="btn btn-secondary" aria-disabled="false">
                                    Login
                                </button>
                            </NavLink>
                        </div>
                    </div>


                    <div id="withSign" className="wallets" style={{ display: "none" }}>
                        <div className="wallet" style={{ height: 48, display: "flex", alignItems: "center" }}>
                            <div className="wallet__wrapper" style={{ display: "flex", alignItems: "center", height: "100%" }}>
                                <div className="wallet__user-avatar" style={{ position: "sticky", width: 34 }}>
                                    <svg width={32} height={32} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx={16} cy={16} r={16} style={{ fill: "rgb(18, 31, 41)" }} />
                                        <g clipPath="url(#clip0000000003)">
                                            <path
                                                d="M20.8422 8.84471L17.4978 13.776C17.4501 13.847 17.43 13.9328 17.4411 14.0174C17.4522 14.102 17.4938 14.1798 17.5582 14.2363C17.6225 14.2928 17.7053 14.3243 17.7913 14.3249C17.8772 14.3254 17.9604 14.2951 18.0256 14.2395L21.3178 11.4036C21.3371 11.3865 21.361 11.3753 21.3866 11.3714C21.4122 11.3675 21.4383 11.3711 21.4619 11.3818C21.4855 11.3924 21.5054 11.4096 21.5193 11.4314C21.5331 11.4531 21.5403 11.4783 21.54 11.504V20.3824C21.54 20.4095 21.5316 20.4361 21.5158 20.4583C21.5001 20.4806 21.4779 20.4975 21.4522 20.5068C21.4265 20.516 21.3985 20.5172 21.3721 20.5102C21.3456 20.5031 21.322 20.4882 21.3044 20.4673L11.3533 8.63726C11.1933 8.44956 10.994 8.29873 10.7693 8.19525C10.5446 8.09178 10.2999 8.03815 10.0522 8.03809H9.70444C9.2524 8.03809 8.81887 8.21642 8.49922 8.53386C8.17957 8.8513 8 9.28185 8 9.73078V22.2351C8 22.684 8.17957 23.1145 8.49922 23.432C8.81887 23.7494 9.2524 23.9277 9.70444 23.9277V23.9277C9.99591 23.9278 10.2825 23.8537 10.537 23.7125C10.7914 23.5713 11.0051 23.3677 11.1578 23.1211L14.5022 18.1898C14.5499 18.1188 14.57 18.033 14.5589 17.9484C14.5478 17.8638 14.5062 17.7861 14.4418 17.7295C14.3775 17.673 14.2947 17.6415 14.2087 17.641C14.1228 17.6404 14.0396 17.6707 13.9744 17.7264L10.6822 20.5622C10.6629 20.5794 10.639 20.5906 10.6134 20.5944C10.5878 20.5983 10.5617 20.5947 10.5381 20.5841C10.5145 20.5734 10.4946 20.5562 10.4807 20.5345C10.4669 20.5128 10.4597 20.4875 10.46 20.4618V11.5813C10.46 11.5541 10.4684 11.5276 10.4842 11.5053C10.4999 11.483 10.5221 11.4661 10.5478 11.4568C10.5735 11.4476 10.6015 11.4464 10.6279 11.4534C10.6544 11.4605 10.678 11.4755 10.6956 11.4963L20.6456 23.3286C20.8056 23.5163 21.0049 23.6671 21.2296 23.7706C21.4543 23.874 21.699 23.9277 21.9467 23.9277H22.2944C22.5184 23.9279 22.7401 23.8842 22.947 23.7992C23.154 23.7142 23.342 23.5895 23.5004 23.4324C23.6588 23.2752 23.7844 23.0885 23.8702 22.8831C23.9559 22.6776 24 22.4574 24 22.2351V9.73078C24 9.28185 23.8204 8.8513 23.5008 8.53386C23.1811 8.21642 22.7476 8.03809 22.2956 8.03809C22.0041 8.03801 21.7175 8.11211 21.4631 8.25332C21.2086 8.39453 20.9949 8.59814 20.8422 8.84471V8.84471Z"
                                                fill="white"
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip00033">
                                                <rect
                                                    width={16}
                                                    height={16}
                                                    fill="white"
                                                    transform="translate(8 7.9834)"
                                                />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <div className="wallet__info" >
                                    <div className="wallet__address" style={{ fontSize: 14, letterSpacing: "0.5px" }}>
                                        {acc}
                                    </div>
                                    <div className="wallet__balance" style={{ color: "rgb(236 190 33 / 50%)", fontSize: 12, letterSpacing: "0.6px" }}>
                                        {NearBalance} NEAR
                                    </div>
                                </div>
                                <button type="button" onClick={() => { window.localStorage.setItem("Type", ""); window.walletAccount.signOut(); window.location.reload() }} className="btn btn-logout" style={{ padding: 0 }}>
                                    <span className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height={32} width={32} style={{ fill: "rgb(197, 228, 243)" }}>
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M18.4753 18.2903H19.295H20.1146V21.5162V23.9355H15.1966L15.1967 27L13.0492 26.2799L8.11633 24.662C7.4459 24.433 7 24.2782 7 24.2782V7H8.63938C8.66196 7 8.68378 7.00459 8.70558 7.00919C8.72248 7.01275 8.73936 7.0163 8.75659 7.01772C8.76929 7.01605 8.78125 7.01267 8.79315 7.00931C8.80968 7.00464 8.8261 7 8.84424 7H17.6556H20.1146V11.8387H19.295H18.4753L18.4754 8.61267L17.6556 8.61281H13.8376H11.918L15.1966 9.41936V22.3226H18.4753V21.5162V18.2903ZM23.153 11.2686L27 15.0644C27 15.0644 26.7522 15.3194 26.4318 15.6346L23.153 18.8605L21.7541 20.2257L21.7539 15.8709H17.6556V15.0645V14.2581H21.7539L21.7541 9.90301L23.153 11.2686Z"
                                            />
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>


                </li>
            </ul>


        </nav>
    )
}
