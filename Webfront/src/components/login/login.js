import React, { useState } from "react";
import axios from 'axios';
import { Toast, Button, Form, FormGroup, Label, Input, FormText,Col,InputGroup } from 'react-bootstrap';
import { Link, Redirect, withRouter, useHistory } from 'react-router-dom';
//import GroupIcon from '@material-ui/icons/Group';
//import { Email } from "@material-ui/icons";
//import EmailIcon from '@material-ui/icons/Email';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';
import './signUp.css'
import Cookies from 'js-cookie';
import {API_BASE_URL} from '../apiConstant/apiConstant';
import docImage from '../../assets/Lovepik_com-401686853-online-medical-consultation.png'


function Login(props) {

    const [username, setUserName] = useState("");
    const [passwords, setPasswords] = useState("")
    const [usernameErr, setUsernameErr] = useState("")
    const [passErr, setPassErr] = useState("")
    
    function handleSubmit(event) {
      event.preventDefault();
      setUsernameErr("");
      setPassErr("");
      const payload={
          "username":username,
          "password":passwords,
      }
      const back= JSON.stringify(payload)
      axios.post(API_BASE_URL+'/login',back,{"headers":{"content-type":"application/json" }})
          .then(function (response) {
              if(response.status === 200){
                  Cookies.set('userToken',response.data.token);
                  Cookies.set('userId',response.data.userid);
                  Cookies.set('userName',response.data.username);
                  //redirectToHome();
              }
          })
          .catch(function (error) {
                  console.log(error)
          });
      }

      const redirectToRegister = () => {
        props.history.push('/signup'); 
        props.updateTitle('signup');
    }

    return (
        <div className="d-flex justify-content-center background">
        <div className="card-group shadow-lg border border-5 border-success rounded" style={{backgroundColor:'white'}} >
          
            <div className="card border-0 " >
                <div class="card-body ">
                    <h1 className="card-title" style={{textAlign:'center'}}>نوبت آنلاین</h1>
                    <img className="img-fluid " src={docImage} alt=""></img>
                </div>
            </div>
            <div className="card d-flex justify-content-center border-0 ">
            <Form className="m-md-5 m-3" noValidate onSubmit= {handleSubmit}>
            <Form.Group  >
              <Form.Label > نام کاربری</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroupPrepend"><AccountCircleIcon></AccountCircleIcon></InputGroup.Text>
                </InputGroup.Prepend>
              <Form.Control
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                 isValid={usernameErr}
                 placeholder="نام کاربری خود را واد نمایید  "
                // isInvalid={Boolean(usernameErr)}
                // errors={usernameErr}
              />
        <Form.Control.Feedback type="invalid" >{usernameErr}</Form.Control.Feedback>

              </InputGroup>
              </Form.Group>
              <Form.Group >
              <Form.Label className="mt-3">کلمه عبور</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroupPrepend"><LockIcon></LockIcon></InputGroup.Text>
                </InputGroup.Prepend>
              <Form.Control
                type="text"
                name="password"
                value={passwords}
                onChange={(e) => setPasswords(e.target.value)}
                isValid={passErr}
                placeholder="کلمه عبور را وارد کنید "
              />
              <Form.Control.Feedback type="invalid">{passErr} </Form.Control.Feedback>

              </InputGroup>
              </Form.Group>

         <Button className="mt-3" block  type="submit" variant="success">
          ورود
        </Button>
        <div className="">
            <span className="btn" onClick={() => redirectToRegister()}>قبلاً ثبت‌نام نکرده‌اید؟</span> 
        </div>
        <div className="">
            <span className="btn" >رمز خود را فراموش کرده‌اید؟</span> 
        </div>
        </Form>
            </div>
        </div>
       
     </div>
    );
}


export default withRouter(Login);
