import React, { useState } from "react";
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
  //Link,
  //Redirect,
  withRouter,
  //useHistory
} from "react-router-dom";
//import GroupIcon from '@material-ui/icons/Group';
//import { Email } from "@material-ui/icons";
//import EmailIcon from '@material-ui/icons/Email';
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import LockIcon from "@material-ui/icons/Lock";
import "./signUp.css";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../apiConstant/apiConstant";
import docImage from "../../assets/Lovepik_com-401686853-online-medical-consultation.png";
//import { makeStyles } from "@material-ui/core/styles";
// import Stepper from "@material-ui/core/Stepper";
// import Step from "@material-ui/core/Step";
// import StepLabel from "@material-ui/core/StepLabel";
// import StepContent from "@material-ui/core/StepContent";
// import Paper from "@material-ui/core/Paper";
// import Typography from "@material-ui/core/Typography";
// import { SettingsSystemDaydreamOutlined } from "@material-ui/icons";

function Login(props) {
  const [email, setEmail] = useState("");
  const [passwords, setPasswords] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setEmailErr("");
    setPassErr("");
    const payload = {
      email: email,
      password: passwords,
    };
    const back = JSON.stringify(payload);
    axios
      .post(API_BASE_URL + "/login/", back, {
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
      function validatorusername(value){
        setUserName(value);
        let errors=""
        if(value.length === 0)
        errors ="پر کردن نام کاربری ضروری است  !";
        setUsernameErr(errors)
      }
     
      function validatorpass(value){
        setPasswords(value);
        let errors=""
        if(value.length === 0)
        errors ="پر کردن کلمه عبور ضروری است  !";
        setPassErr(errors)
      }
     
  const redirectToRegister = () => {
    props.history.push("/signup");
  };

  // const [activeStep, setActiveStep] = useState(0);

  // const handleNext = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  // };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  // const handleReset = () => {
  //   setActiveStep(0);
  // };

  const [sended, setSended] = useState("");

  const sendEmail = () => {
    const payload = {
      email: email,
    };
    const back = JSON.stringify(payload);
    axios
      .post(API_BASE_URL + "request-reset-email/", back, {
        headers: { "content-type": "application/json" },
      })
      .then(function (response) {
        if (response.status === 200) {
          setSended("لینک تغییر رمز به ایمیل شما ٝرستاده شد");
        } else if (response.status === 404) {
          setSended("حسابی با این ایمیل وجود ندارد");
        }
      })
      .catch(function (error) {
        setSended("حسابی با این ایمیل وجود ندارد");
      });
  };

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


  return (
    <div className="d-flex justify-content-center background">
      <div
        className="card-group shadow-lg border border-5 border-success rounded"
        style={{ backgroundColor: "white" }}
      >
        <div className="card border-0 ">
          <div class="card-body ">
            <h1 className="card-title" style={{ textAlign: "center" }}>
              نوبت آنلاین
            </h1>
            <img className="img-fluid " src={docImage} alt=""></img>
          </div>
        </div>
        <div className="card d-flex justify-content-center border-0 ">
          <Form className="m-md-5 m-3" noValidate onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label> ایمیل</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroupPrepend">
                    <AccountCircleIcon></AccountCircleIcon>
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => validatoremail(e.target.value)}
                  isInvalid={Boolean(emailErr)}
                  placeholder="ایمیل خود را وارد نمایید  "
                  onBlur={(e) => validatoremail(e.target.value)}
                  // isInvalid={Boolean(emailErr)}
                  // errors={emailErr}
                />
                <Form.Control.Feedback type="invalid">
                  {emailErr}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label className="mt-3">کلمه عبور</Form.Label>
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
              <span
                type="button"
                className="btn"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
                style={{ color: "tomato" }}
              >
                رمز خود را ٝراموش کرده‌اید؟
              </span>
            </Form.Group>

            <div className="mt-3">
              <Button className="" block type="submit" variant="success">
                ورود
              </Button>
              <span className="btn" onClick={() => redirectToRegister()}>
                قبلاً ثبت‌نام نکرده‌اید؟
              </span>
            </div>
          </Form>
        </div>
        <div
          class="modal fade"
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabindex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h3>تغییر رمز عبور</h3>
              </div>
              <div class="modal-body">
                <form>
                  <div class="mb-3">
                    <Form.Group>
                      <Form.Label> ایمیل</Form.Label>
                      <InputGroup hasValidation>
                        <InputGroup.Prepend>
                          <InputGroup.Text id="inputGroupPrepend">
                            <AccountCircleIcon></AccountCircleIcon>
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                          type="email"
                          name="email"
                          value={email}
                          onChange={(e) => validatoremail(e.target.value)}
                          isInvalid={Boolean(emailErr)}
                          placeholder="ایمیل خود را وارد نمایید  "
                          onBlur={(e) => validatoremail(e.target.value)}
                          // isInvalid={Boolean(emailErr)}
                          // errors={emailErr}
                        />
                        <Form.Control.Feedback type="invalid">
                          {emailErr}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </div>
                  <p>{sended}</p>
                </form>
              </div>
              <div class="modal-footer d-flex justify-content-start">
                <button
                  type="button"
                  class="btn btn-success"
                  data-bs-dismiss="modal"
                  onClick={sendEmail}
                >
                  تایید
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Login);
