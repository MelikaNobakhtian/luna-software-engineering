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
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { SettingsSystemDaydreamOutlined } from "@material-ui/icons";


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
    }

  //   const redirectToForgotPass = () => {
  //     props.history.push('/forgotPass'); 
  //     props.updateTitle('forgotPass');
  // }
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const sendEmail = () => {
    axios.post(API_BASE_URL)
          .then(function (response) {
              if(response.status === 200){
                  handleNext();
              }
          })
          .catch(function (error) {
                  console.log(error)
                  handleNext();
          });
  };

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
              <span type="button" className="btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop" style={{color:'tomato'}} >رمز خود را فراموش کرده‌اید؟</span> 
              </Form.Group>

        
        <div className="mt-3">
            
            <Button className="" block  type="submit" variant="success">
             ورود
            </Button>
            <span className="btn" onClick={() => redirectToRegister()}>قبلاً ثبت‌نام نکرده‌اید؟</span> 
        </div>
        </Form>
            </div>
            <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h3>تغییر رمز عبور</h3>
      </div>
      <div class="modal-body">



      <div>
      <Stepper activeStep={activeStep} orientation="vertical">
       
          <Step key="1" >
            <StepLabel>وارد کردن ایمیل</StepLabel>
            <StepContent>

            <div>
          <form>
            <div class="mb-3">
              <label class="form-label">آدرس ایمیل</label>
              <input type="email" class="form-control" placeholder="ایمیل خود را وارد کنید"/>
            </div>
          </form>
        </div>

              <div >
                <div>
                  <Button
                    onClick={sendEmail}
                  >
                    تایید
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>


          <Step key="2"> 
            <StepLabel>کد تایید</StepLabel>
            <StepContent>
            <div>
          <form>
            <div class="mb-3">
              <label class="form-label"  >کد تایید</label>
              <input type="password" class="form-control"  placeholder="کد فرستاده شده به ایمیل خود را وارد کنید"/>
            </div>
          </form>
        </div>

              <div >
                <div>
                  <Button
                    onClick={handleNext}
                  >
                    تایید
                   </Button>
                </div>
              </div>
            </StepContent>
          </Step>



          <Step key="3">
            <StepLabel>وارد کردن ایمیل</StepLabel>
            <StepContent>

            <div>
          <form>
            <div class="mb-3">
              <label class="form-label"  >رمز جدید</label>
              <input type="password" class="form-control"  placeholder="رمز جدید خود را وارد کنید"/>
            </div>
            <div class="mb-3">
              <label class="form-label"  >تکرار رمز جدید</label>
              <input type="password" class="form-control"  placeholder="رمز جدید خود را دوباره وارد کنید"/>
            </div>
          </form>
        </div>

              <div >
                <div>
                <button type="submit" class="btn btn-success" onClick={handleNext}>تایید</button>
                </div>
              </div>
            </StepContent>
          </Step>
       
      </Stepper>
      {activeStep === 3 && (
        <Paper square elevation={0} >
          <Typography>رمز شما با موفقیت عوض شد.</Typography>
        
        </Paper>
      )}
    </div>



       



      </div>
      <div class="modal-footer d-flex justify-content-start">
      
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={handleReset}>انصراف</button>
      </div>
    </div>
  </div>
</div>
        </div>
       
     </div>
    );
}


export default withRouter(Login);
