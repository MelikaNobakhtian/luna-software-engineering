import React, { Component } from "react";
import { useState} from "react";
import { Toast, Button, Form, FormGroup, Label, Input, FormText,Col,InputGroup } from 'react-bootstrap';
import { Link, Redirect, withRouter, useHistory } from 'react-router-dom';
import { Email } from "@material-ui/icons";
import EmailIcon from '@material-ui/icons/Email';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';
import './signUp.css'

function SignUp(e) {

    const [errors, setErrors] = useState({});
    const [email, setEmail] = useState("");
    const [username, setUserName] = useState("");
    const [passwords, setPasswords] = useState({ password: "", confirmPassword: "" })
    const [usernameErr, setUsernameErr] = useState("")
    const [emailErr, setEmailErr] = useState("")
    const [passErr, setPassErr] = useState("")
    const [confirmPassErr, setConfirmPassErr] = useState("")
    
    function handleSubmit(event) {
        event.preventDefault();
      }


    return (
        <div className="background">
        <div className="outer">
        <div className="row justify-content-center">
          <div className="col-xs-10 col-sm-9 col-md-6 col-lg-5 col-xl-4">
            <div className="inner">

        <Form noValidate onSubmit= {handleSubmit}>
           <Form.Group >
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
              <Form.Label>ایمیل</Form.Label>
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
              <Form.Label> کلمه عبور</Form.Label>
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
              <Form.Label> تایید کلمه عبور </Form.Label>
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
          <Button block  type="submit" variant="success">ثبت نام</Button>
        </Form>
   
        </div>
        </div>
        </div>
    </div>
    </div>
  );
}
export default withRouter(SignUp);
