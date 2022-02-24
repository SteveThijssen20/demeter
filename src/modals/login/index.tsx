
import Head from 'next/head';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import React from 'react';
import './app.css';
import Button from 'react-bootstrap/Button';
import Router from 'next/router'


import { ContentLoader } from '@/components/common/ContentLoader'
import { useState, useEffect, useMemo } from "react";
import '@/near-contracts/contract';

export default function Login({
    show,
    onHide,
    redirecting

}) {
    const [ConnectStatus, setConnectStatus] = useState(true);
    //NEAR
    function NearWallet(): JSX.Element {
        var booltrue = true;
        while (booltrue) {
            try {
                console.log(window.walletAccount.isSignedIn())
                break;
            } catch (ex) { continue };
        }
        if (window.walletAccount.isSignedIn() == false) {
            return (<>
                <div onClick={onClickConnectNear} style={{ display: "flex", padding: "10px", borderRadius: "5px", width: "350px", cursor: "pointer", margin: "20px 0" }} className="btn-primary whitebtn">
                    <img style={{ height: '51px', width: '51px' }} src='https://i.postimg.cc/nzQMgnnJ/Near.png' />
                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '11px', height: '51px' }}>
                        <span style={{ fontWeight: 'bolder', padding: '0', fontFamily: 'sans-serif', height: '100%', margin: '-12px 0' }}>
                            NEAR
                        </span>
                        <span style={{ fontSize: '15px', padding: '0', margin: '0', fontFamily: 'sans-serif' }}>
                            Connect With NEAR wallet
                        </span>
                    </div>
                </div>
            </>)
        }
        if (window.walletAccount.isSignedIn() == true) {
            return (<>
                <div style={{ display: "flex", padding: "10px", borderRadius: "5px", cursor: "pointer", width: "350px", margin: "20px 0" }} className="btn-primary whitebtn active">
                    <div onClick={onClickConnectedNEAR} style={{ display: 'flex', background: 'transparent', width: '100%', padding: '0' }} className="btn-primary">
                        <img style={{ height: '51px', width: '51px' }} src='https://i.postimg.cc/nzQMgnnJ/Near.png' />
                        <div style={{ display: 'flex', background: 'transparent', flexDirection: 'column', marginLeft: '11px', height: '51px' }}>
                            <span style={{ fontWeight: 'bolder', padding: '0', fontFamily: 'sans-serif', height: '100%', margin: '-12px 0' }}>
                                NEAR
                            </span>
                            <span style={{ fontSize: '15px', padding: '0', margin: '0', fontFamily: 'sans-serif' }}>
                                Connected NEAR wallet
                            </span>
                        </div>
                    </div>
                    <button onClick={onClickDisConnectNEAR} type="button" className="btn btn-logout" style={{ width: 'initial' }}>
                        <span className="icon closebtn" style={{
                            background: '#9d9999',
                            float: 'right',
                            borderRadius: '7px'
                        }}>
                            <svg style={{ fill: 'red' }} fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height="32" width="32"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.4753 18.2903H19.295H20.1146V21.5162V23.9355H15.1966L15.1967 27L13.0492 26.2799L8.11633 24.662C7.4459 24.433 7 24.2782 7 24.2782V7H8.63938C8.66196 7 8.68378 7.00459 8.70558 7.00919C8.72248 7.01275 8.73936 7.0163 8.75659 7.01772C8.76929 7.01605 8.78125 7.01267 8.79315 7.00931C8.80968 7.00464 8.8261 7 8.84424 7H17.6556H20.1146V11.8387H19.295H18.4753L18.4754 8.61267L17.6556 8.61281H13.8376H11.918L15.1966 9.41936V22.3226H18.4753V21.5162V18.2903ZM23.153 11.2686L27 15.0644C27 15.0644 26.7522 15.3194 26.4318 15.6346L23.153 18.8605L21.7541 20.2257L21.7539 15.8709H17.6556V15.0645V14.2581H21.7539L21.7541 9.90301L23.153 11.2686Z"></path></svg>
                        </span>
                    </button>
                </div>
            </>)
        }

    }
    async function onClickConnectNear() {
        window.walletAccount.requestSignIn(
            window.nearConfig.contractName,
            'Demeter');
    }
    async function onClickConnectedNEAR() {
     //   window.location.href = (redirecting);
    }
    async function onClickDisConnectNEAR() {
        await window.walletAccount.signOut()
        window.location.href = window.location.href;
    }


    //Aurora
    function AuroraWallet(): JSX.Element {
        var booltrue = true;
        while (booltrue) {
            try {
                console.log(window.walletAccount.isSignedIn())
                break;
            } catch (ex) { continue };
        }
        return (
            <>
                {window.ethereum.selectedAddress == null ? (
                    <div onClick={onClickConnectAurora} style={{ display: "flex", padding: "10px", width: "350px", borderRadius: "5px", cursor: "pointer", margin: "20px 0" }} className="btn-primary whitebtn">
                        <img style={{ height: '51px', width: '51px' }} src='https://i.postimg.cc/3wCZzRCV/Aurora.jpg' />
                        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '11px', height: '51px' }}>
                            <span style={{ fontWeight: 'bolder', padding: '0', fontFamily: 'sans-serif', height: '100%', margin: '-12px 0' }}>
                                Aurora
                            </span>
                            <span style={{ fontSize: '15px', padding: '0', margin: '0', fontFamily: 'sans-serif' }}>
                                Connect With Metamask wallet
                            </span>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: "flex", padding: "10px", borderRadius: "5px", cursor: "pointer", width: "350px", margin: "20px 0" }} className="btn-primary whitebtn active">
                        <div onClick={onClickConnectedAurora} style={{ display: 'flex',  background: 'transparent', width: '100%', padding: '0' }} className="btn-primary">
                            <img style={{ height: '51px', width: '51px' }} src='https://doc.aurora.dev/img/favicon.svg' />
                            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '11px', height: '51px' }}>
                                <span style={{ fontWeight: 'bolder', padding: '0', fontFamily: 'sans-serif', height: '100%', margin: '-12px 0' }}>
                                    Aurora
                                </span>
                                <span style={{ fontSize: '15px', padding: '0', margin: '0', fontFamily: 'sans-serif' }}>
                                    Connected Metamask wallet
                                </span>
                            </div>
                        </div>

                    </div>
                )}
            </>
        )
    }
    async function onClickConnectAurora() {
        let result = await window.ethereum.request({ method: 'eth_requestAccounts' });
        result;
        try {
            const getacc = await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '1313161555', }],
            });
            getacc;
        } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: '1313161555',
                                chainName: 'Aurora Testnet',
                                nativeCurrency: {
                                    name: 'ETH',
                                    symbol: 'ETH',
                                    decimals: 18,
                                },
                                rpcUrls: ['https://testnet.aurora.dev'],
                            },
                        ],
                    });
                } catch (addError) {
                    // handle "add" error
                    console.log(addError);
                }
            }
            // handle other "switch" errors
        }

    }
    async function onClickConnectedAurora() {

    }
    async function onClickContinue() {
        window.location.href = (redirecting);
    }
    setTimeout(() => {
        if (window.walletAccount.isSignedIn() == true && window.ethereum.selectedAddress != null) {
            setConnectStatus(true);
        } else {
            setConnectStatus(false);
        }
    }, 1000)
    return (

        <><>
            <Head>
                <title>Login</title>
                <meta name="description" content="Login" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Modal show={show}
                onHide={onHide}
                size='lg'
                centered >

                <Modal.Header className='modal-header-login' closeButton>
                    Connect wallet
                </Modal.Header>
                <div className='modal-body-login'>
                    <Row style={{ marginBottom: '0' }}>
                        <div style={{ margin: '0px 0px 12px', width: '100%', color: 'grey' }}>
                            <h4>Please connect both your wallets</h4>
                        </div>

                        <Col style={{ paddingTop: '0px', width: '100%' }}>
                            <div style={{ display: 'flex', columnGap: '1vw', flexWrap: 'wrap' }}>
                                <NearWallet />
                                <AuroraWallet />
                            </div>
                        </Col>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                            {ConnectStatus ? (<>
                                <Button onClick={onClickContinue} style={{ width: '150px' }}>
                                    Continue
                                </Button></>) : (<>
                                    <Button disabled style={{ width: '150px' }}>
                                        Continue
                                    </Button>
                                </>)}

                        </div>

                    </Row>
                </div>

            </Modal>

        </></>

    );

}


