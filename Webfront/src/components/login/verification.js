import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  //Toast,
  Button,
  Form,
  // FormGroup,
  // Label,
  // Input,
  // FormText,
  // Col,
  InputGroup,
} from "react-bootstrap";
import {
    BrowserRouter as Router,
    useRouteMatch,
    useParams,
    withRouter
} from "react-router-dom";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import LockIcon from "@material-ui/icons/Lock";
import "./signUp.css";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../apiConstant/apiConstant";
import docImage from "../../assets/Lovepik_com-401686853-online-medical-consultation.png";

function Verification(props){
    console.log(props.match.params.tokenId+"*****************")
    useEffect(() => {
    axios.get(API_BASE_URL+"/email-verify/?token="+props.match.params.tokenId).then(
        function(response){
            console.log(response)
        }
    ).catch(
        function(error){
            console.log(error)
        }
    )
    },[props.tokenId]) 
    return (
        <div>
            "Successfully verified"
        </div>
    )
}
export default withRouter(Verification)