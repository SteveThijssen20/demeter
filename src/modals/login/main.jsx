import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import { toast } from 'react-toastify';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import UseFormInput from '@/components/components/UseFormInput';
import * as nearAPI from "near-api-js"
import getConfig from "@/config"
import LOGINModal from '@/modals/login';

import Form from 'react-bootstrap/Form';
import useContract from '../../../services/useContract';
import './main.css'

window.nearConfig = getConfig("development");
export default function CreateEvents() {
    const [modalShow, setModalShow] = useState(false);
    const regex = /\[(.*)\]/g;
    const str = decodeURIComponent(window.location.search);
    let m;
    let redirecting = "";
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        redirecting = m[1];
    }



    function TypeSet(e) {
        window.localStorage.setItem("Type", e.target.getAttribute("type"));
        setModalShow(true);
    }

    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    function EventManger() {
        if (window.localStorage.getItem("Type") == "manager") {
            return (<>
                <div type="manager" onClick={TypeSet} className='eventManagerButton active'>
                    <span type="manager" style={{ fontSize: 35, color: "yellow" }}>Event Manager</span>
                </div>
            </>)
        }
        return (<>
            <div type="manager" onClick={TypeSet} className='eventManagerButton'>
                <span type="manager" style={{ fontSize: 35, color: "yellow" }}>Event Manager</span>
            </div>
        </>)
    }
    function UserType() {
        if (window.localStorage.getItem("Type") == "user") {
            return (<>
                <div type="user" onClick={TypeSet} className='userButton active'>
                    <span type="user" style={{ fontSize: 35, color: "black" }}>User</span>
                </div>
            </>)
        }
        return(<>
        <div type="user" onClick={TypeSet} className='userButton'>
            <span type="user" style={{ fontSize: 35, color: "black" }}>User</span>
        </div>
        </>)
        
    }
    return (
        <><>
            <Row>
                <Col >
                    <div style={{ width: "45vw", background: "transparent", padding: "19px", borderRadius: "4px", height: "100%", border: "white solid" }}>
                        <div style={{ margin: "0px 0px 30px 0px" }}>
                            <h1 style={{ marginBottom: "10px" }}>Login</h1>
                        </div>

                        <div style={{
                            margin: "18px 0px",
                            display: "flex",
                            justifyContent: "space-between"
                        }} >
                            <EventManger />
                            <UserType />
                        </div>
                    </div>
                </Col>
            </Row>
            <LOGINModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                redirecting={redirecting}
            />
        </></>
    );
}