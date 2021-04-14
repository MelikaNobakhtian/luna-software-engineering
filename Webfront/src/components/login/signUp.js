import React, { useState } from "react";
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
  // Link,
  // Redirect,
  withRouter,
  //useHistory
} from "react-router-dom";
import EmailIcon from "@material-ui/icons/Email";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import LockIcon from "@material-ui/icons/Lock";
import PersonIcon from "@material-ui/icons/Person";
import "./signUp.css";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../apiConstant/apiConstant";

function SignUp(props) {
  const [errors, setErrors] = useState({});
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const [nameErr, setNameErr] = useState("");
  const [lastnameErr, setLastnameErr] = useState("");
  const [usernameErr, setUsernameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");
  const [confirmPassErr, setConfirmPassErr] = useState("");
  const [number, setNumber] = useState("");
  const [fileErr, setFileErr] = useState(null);
  const [isDoctor, setIsDoctor] = useState(0);

  function handleSubmit(event) {
    event.preventDefault();
    setEmailErr("");
    setPassErr("");

    if (isDoctor % 2 === 1) {
      const payload = {
        username: username,
        email: email,
        password : passwords.password,
        password2 : passwords.confirmPassword,
        first_name : name,
        last_name : lastname,
        file : selectedFile
      };
      const back = JSON.stringify(payload);
      axios
        .post(API_BASE_URL + "/register-doctor/", back, {
          headers: { "content-type": "application/json" },
        })
        .then(function (response) {
          if (response.status === 200) {
            Cookies.set("userTokenR", response.data.token.refresh);
            Cookies.set("userTokenA", response.data.token.access);
            Cookies.set("userId", response.data.user_id);
            Cookies.set("doctorId", response.data.doctor_id);
            //redirectToHome();
          } else {
            console.log(response);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else { const payload = {
      username: username,
      email: email,
      password : passwords.password,
      password2 : passwords.confirmPassword,
      first_name : name,
      last_name : lastname
    };
    const back = JSON.stringify(payload);
    axios
      .post(API_BASE_URL + "/register/", back, {
        headers: { "content-type": "application/json" },
      })
      .then(function (response) {
        if (response.status === 200) {
          Cookies.set("userTokenR", response.data.token.refresh);
          Cookies.set("userTokenA", response.data.token.access);
          Cookies.set("userId", response.data.user_id);
          Cookies.set("doctorId", response.data.doctor_id);
          //redirectToHome();
        } else {
          console.log(response);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  function validatorname(value) {
    setName(value);
    let errors = "";
    if (value.length === 0) errors = "پر کرن نام ضروری است !";
    // else if(!value.match(/^[a-zA-Z]+$/)){
    // errors="فقط از حروف استفاده نمایید   !";
    // }
    setNameErr(errors);
  }

  function validatorlastname(value) {
    setLastName(value);
    let errors = "";
    if (value.length === 0) errors = "پر کرن نام خانوادگی ضروری است !";
    // else if(!value.match(/^[a-zA-Z]+$/)){
    // errors="فقط از حروف استفاده نمایید   !";
    //  }
    setLastnameErr(errors);
  }

  function validatorusername(value) {
    setUserName(value);
    let errors = "";
    if (value.length === 0) errors = "پر کردن نام کاربری ضروری است  !";
    setUsernameErr(errors);
  }
  const regex_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  function validatoremail(value) {
    setEmail(value);
    let errors = "";
    if (!regex_email.test(String(value).toLowerCase())) {
      errors = " ایمیل صحیح را وارد نمایید !";
    }
    setEmailErr(errors);
  }
  const pattern = /^((?=.*[0-9]{1,})|(?=.*[!.@#$&*-_]{1,}))(?=.*[a-z]{1,}).{8,}$/;
  function validatorpass(values) {
    setPasswords({ ...passwords, password: values });
    let errors = "";
    if (!pattern.test(String(values).toLowerCase())) {
      errors = "پسورد صحیح را وارد کنید !";
    }
    setPassErr(errors);
  }

  function validatorconfirmpass(values) {
    setPasswords({ ...passwords, confirmPassword: values });
    let errors = "";
    if (passwords.password !== values) {
      errors = "پسورد وارد شده تطابق ندارد !";
    }
    setConfirmPassErr(errors);
  }
  function validatorfile(values) {
    setSelectedFile(values);
    let errors = "";
    if (values === "") {
      errors = " بارگذاری مدرک ضروری است !";
    }
    setFileErr(errors);
  }

  return (
    <div className="background d-flex justify-content-center ">
      <div className="outer">
        <div className="row justify-content-center">
          <div className="col-xs-10 col-sm-9 col-md-6 col-lg-5 col-xl-4">
            <div className="inner">
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label className="mt-3">نام</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroupPrepend">
                        <PersonIcon></PersonIcon>
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="text"
                      name="name"
                      value={name}
                      onChange={(e) => validatorname(e.target.value)}
                      isInvalid={Boolean(nameErr)}
                      onBlur={(e) => validatorname(e.target.value)}
                      placeholder="نام خود را وارد  نمایید "
                    />
                    <Form.Control.Feedback type="invalid">
                      {nameErr}{" "}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group>
                  <Form.Label className="mt-3">نام خانوادگی</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroupPrepend">
                        <PersonIcon></PersonIcon>
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="text"
                      name="last name"
                      value={lastname}
                      onChange={(e) => validatorlastname(e.target.value)}
                      isInvalid={Boolean(lastnameErr)}
                      onBlur={(e) => validatorlastname(e.target.value)}
                      placeholder="نام خانوادگی خود را وارد  نمایید "
                    />
                    <Form.Control.Feedback type="invalid">
                      {lastnameErr}{" "}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group>
                  <Form.Label> نام کاربری</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroupPrepend">
                        <AccountCircleIcon></AccountCircleIcon>
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="text"
                      name="username"
                      value={username}
                      onChange={(e) => validatorusername(e.target.value)}
                      placeholder=" نام کاربری خود را وارد نمایید"
                      onBlur={(e) => validatorusername(e.target.value)}
                      isInvalid={Boolean(usernameErr)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {usernameErr}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group>
                  <Form.Label className="mt-3">ایمیل</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroupPrepend">
                        <EmailIcon></EmailIcon>
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="text"
                      name="email"
                      value={email}
                      onChange={(e) => validatoremail(e.target.value)}
                      isInvalid={Boolean(emailErr)}
                      placeholder="ایمیل خود را وارد  نمایید "
                      onBlur={(e) => validatoremail(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {emailErr}{" "}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group>
                  <Form.Label className="mt-3"> کلمه عبور</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroupPrepend">
                        <LockIcon></LockIcon>
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="کلمه عبور را وارد نمایید"
                      value={passwords.password}
                      onChange={(e) => validatorpass(e.target.value)}
                      isInvalid={Boolean(passErr)}
                      onBlur={(e) => validatorpass(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {passErr}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group>
                  <Form.Label className="mt-3"> تایید کلمه عبور </Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroupPrepend">
                        <LockIcon></LockIcon>
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="password"
                      name="confrim password"
                      value={passwords.confirmPassword}
                      onChange={(e) => validatorconfirmpass(e.target.value)}
                      isInvalid={Boolean(confirmPassErr)}
                      placeholder="کلمه عبور خود را تایید نمایید"
                      onBlur={(e) => validatorconfirmpass(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {confirmPassErr}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <hr></hr>

                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isDoctor"
                    onClick={() => setIsDoctor(isDoctor + 1)}
                  />
                  <label className="form-check-label" for="isDoctor">
                    من پزشک هستم
                  </label>
                </div>
                <Form.Group>
                  <Form.File
                    className="position-relative"
                    type="file"
                    required
                    isInvalid={Boolean(fileErr)}
                    name="file"
                    label="مدرک پزشک "
                    value={selectedFile}
                    onChange={(e) => validatorfile(e.target.value)}
                    onBlur={(e) => validatorfile(e.target.value)}
                    feedback={fileErr}
                  />

                  <Form.Control.Feedback type="invalid">
                    {fileErr}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button className="mt-3" block type="submit" variant="success">
                  ثبت نام
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default withRouter(SignUp);
