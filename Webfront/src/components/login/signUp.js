import React, { Component } from "react";
import { useState} from "react";
import { Toast, Button, Form, FormGroup, Label, Input, FormText,Col,InputGroup } from 'react-bootstrap';
import { Link, Redirect, withRouter, useHistory } from 'react-router-dom';
import { Email } from "@material-ui/icons";
import EmailIcon from '@material-ui/icons/Email';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';
import PersonIcon from '@material-ui/icons/Person';
import './signUp.css'
import axios from 'axios';
import Cookies from 'js-cookie';
import {API_BASE_URL} from '../apiConstant/apiConstant';

function SignUp(props) {

    // const [errors, setErrors] = useState({});
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [lastname, setLastName] = useState("");
    const [username, setUserName] = useState("");
    const [passwords, setPasswords] = useState({ password: "", confirmPassword: "" })
    const [nameErr, setNameErr] = useState("")
    const [lastnameErr, setLastnameErr] = useState("")
    const [usernameErr, setUsernameErr] = useState("")
    const [emailErr, setEmailErr] = useState("")
    const [passErr, setPassErr] = useState("")
    const [confirmPassErr, setConfirmPassErr] = useState("")
    const [number, setNumber] = useState("")

    function handleSubmit(event) {
        event.preventDefault();
        
      }


    return (
        <div className="background d-flex justify-content-center ">
        <div className="outer">
        <div className="row justify-content-center">
          <div className="col-xs-10 col-sm-9 col-md-6 col-lg-5 col-xl-4">
            <div className="inner">

        <Form noValidate onSubmit= {handleSubmit}>
        <Form.Group >
              <Form.Label className="mt-3">نام</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroupPrepend"><PersonIcon></PersonIcon></InputGroup.Text>
                </InputGroup.Prepend>
              <Form.Control
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isInvalid={Boolean(nameErr)}
                placeholder="نام خود را وارد  نمایید "
              />
              <Form.Control.Feedback type="invalid">{nameErr} </Form.Control.Feedback>
              </InputGroup>
              </Form.Group>


              <Form.Group >
              <Form.Label className="mt-3">نام خانوادگی</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroupPrepend"><PersonIcon></PersonIcon></InputGroup.Text>
                </InputGroup.Prepend>
              <Form.Control
                type="text"
                name="last name"
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
                isInvalid={Boolean(lastnameErr)}
                placeholder="نام خانوادگی خود را وارد  نمایید "
              />
              <Form.Control.Feedback type="invalid">{lastnameErr} </Form.Control.Feedback>
              </InputGroup>
              </Form.Group>
           <Form.Group>
              <Form.Label> نام کاربری</Form.Label>
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
                 placeholder=" نام کاربری خود را وارد نمایید"
                isInvalid={Boolean(usernameErr)}
                 errors={usernameErr}
              />
        <Form.Control.Feedback type="invalid" >{usernameErr}</Form.Control.Feedback>
              </InputGroup>
              </Form.Group>

              <Form.Group >
              <Form.Label className="mt-3">ایمیل</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroupPrepend"><EmailIcon></EmailIcon></InputGroup.Text>
                </InputGroup.Prepend>
              <Form.Control
                type="text"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isValid={emailErr}
                placeholder="ایمیل خود را وارد  نمایید "
              />
              <Form.Control.Feedback type="invalid">{emailErr} </Form.Control.Feedback>
              </InputGroup>
              </Form.Group>

              <Form.Group>
              <Form.Label  className="mt-3"> کلمه عبور</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroupPrepend"><LockIcon></LockIcon></InputGroup.Text>
                </InputGroup.Prepend>
              <Form.Control
                type="text"
                name="password"
                //  value={passwords}
                //  onChange={(e) => setPasswords(e.target.value)}
                isValid={passErr}
                placeholder="کلمه عبور را وارد نمایید"
              />
        <Form.Control.Feedback type="invalid">{passErr}</Form.Control.Feedback>
              </InputGroup>
              </Form.Group>

              <Form.Group >
              <Form.Label  className="mt-3"> تایید کلمه عبور </Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroupPrepend"><LockIcon></LockIcon></InputGroup.Text>
                </InputGroup.Prepend>
              <Form.Control
                type="text"
                name="confrim password"
                // value={passwords}
                // onChange={(e) => setPasswords(e.target.value)}
                isValid={confirmPassErr}
                placeholder="کلمه عبور خود را تایید نمایید"
              />
              <Form.Control.Feedback type="invalid">{confirmPassErr}</Form.Control.Feedback>

              </InputGroup>
              </Form.Group>

              <hr></hr>

              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="isDoctor"/>
                <label className="form-check-label" for="isDoctor">من پزشک هستم</label>
              </div>

              <Form.Group >
              <Form.Label  className=""> شماره نظام پزشکی</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroupPrepend"><LockIcon></LockIcon></InputGroup.Text>
                </InputGroup.Prepend>
              <Form.Control
                type="text"
                name="number"
                // value={passwords}
                // onChange={(e) => setPasswords(e.target.value)}
                isValid={number}
                placeholder="کلمه عبور خود را تایید نمایید"
              />
              <Form.Control.Feedback type="invalid">{number}</Form.Control.Feedback>

              </InputGroup>
              </Form.Group>

          <Button  className="mt-3" block  type="submit" variant="success">ثبت نام</Button>
          

         
        </Form>
   
        </div>
        </div>
        </div>
    </div>
    </div>
  );
}
export default withRouter(SignUp);
