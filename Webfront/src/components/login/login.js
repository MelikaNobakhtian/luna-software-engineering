import React, { Component } from "react";
import { useState} from "react";
import { Toast, Button, Form, FormGroup, Label, Input, FormText,Col,InputGroup } from 'react-bootstrap';
import { Link, Redirect, withRouter, useHistory } from 'react-router-dom';
import GroupIcon from '@material-ui/icons/Group';
import { Email } from "@material-ui/icons";
import EmailIcon from '@material-ui/icons/Email';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';
import './signUp.css'


function Login() {

    const [username, setUserName] = useState("");
    const [passwords, setPasswords] = useState("")
    const [usernameErr, setUsernameErr] = useState("")
    const [passErr, setPassErr] = useState("")
  
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
                 placeholder="نام کاربری خود را واد نمایید  "
                // isInvalid={Boolean(usernameErr)}
                // errors={usernameErr}
              />
        <Form.Control.Feedback type="invalid" >{usernameErr}</Form.Control.Feedback>

              </InputGroup>
              </Form.Group>
              <Form.Group >
              <Form.Label>کلمه عبور</Form.Label>
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

         <Button block  type="submit" variant="success">
          ورود
        </Button>
        </Form>
     
     </div>
    </div>
     </div>
     </div>
    </div>
    );
}


export default withRouter(Login);
