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
  useHistory,
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
import docImage from "../../assets/Lovepik_com-401686853-online-medical-consultation.png";

function SignUp(props) {
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
  //const [number, setNumber] = useState("");
  const [fileErr, setFileErr] = useState(null);
  const [isDoctor, setIsDoctor] = useState(0);
  const [state, setState] = useState({
    navigate: false,
    file: null,
  });
  const [profileImg, setProfileImg] = useState("");

  const uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);
  const handleImageUpload = (e) => {
    setState({ file: e.target.files[0] });
    const [file] = e.target.files;
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
    }

    console.log(state.file);
  };

  // const imageHandler = (e) => {
  //   if (e.target?.files?.length > 0) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       if (reader.readyState === 2) {
  //         setProfileImg(reader.result);
  //       }
  //     };
  //     reader.readAsDataURL(e.target.files[0]);

  //     setProfileImg(e.target.files[0]);
  //   } else {
  //     setProfileImg("");
  //   }
  // };

  // {
  //   console.log(profileImg + "ffilee");
  // }

  function handleSubmit(event) {
    event.preventDefault();
    setEmailErr("");
    setPassErr("");

    if (
      username.length &&
      email.length &&
      passwords.password.length &&
      passwords.confirmPassword.length &&
      name.length &&
      lastname.length
    ) {
      var formd = new FormData();
      if (isDoctor % 2 === 1) {
        //console.log("1")
        if (state.file) {
          //console.log("2")
          formd.append("username", username);
          formd.append("email", email);
          formd.append("password", passwords.password);
          formd.append("password2", passwords.confirmPassword);
          formd.append("first_name", name);
          formd.append("last_name", lastname);
          formd.append("degree", state.file);
          console.log(profileImg.split(":")[1]);
          console.log(formd);
          axios
            .post(API_BASE_URL + "/register-doctor/", formd, {
              headers: { "content-Type": "application/json" },
            })
            .then(function (response) {
              console.log(response);
              if (response.statusText === "OK") {
                if (response.message === "Passwords must match") {
                  setConfirmPassErr("پسورد وارد شده تطابق ندارد !");
                } else if (
                  response.message ===
                  "The username should only contain alphanumeric characters"
                ) {
                  setUsernameErr("نام کاربری فقط می‌تواند شامل حرف و عدد باشد");
                }
                // Cookies.set("userTokenR", response.data.token.refresh);
                // Cookies.set("userTokenA", response.data.token.access);
                // Cookies.set("userId", response.data.user_id);
                // Cookies.set("doctorId", response.data.doctor_id);
                // props.history.push("/login");
                else {
                  window.alert("ایمیل تایید برای شما فرستاده شد");
                }
              } else {
                console.log(response);
                window.alert("ایمیل تایید برای شما فرستاده شد");
              }
            })
            .catch(function (error) {
              console.log("error")
              console.log(error.error)
              console.log(error.response)
              console.log(error);
            });
        } else {
          setFileErr(" بارگذاری مدرک ضروری است !");
          //console.log("3")
        }
      } else {
        const payload = {
          username: username,
          email: email,
          password: passwords.password,
          password2: passwords.confirmPassword,
          first_name: name,
          last_name: lastname,
        };
        const back = JSON.stringify(payload);
        console.log(back);
        axios
          .post(API_BASE_URL + "/register/", back, {
            headers: { "content-type": "application/json" },
          })
          .then(function (response) {
            console.log(response);
            if (response.statusText === "OK") {
              // Cookies.set("userTokenR", response.data.token.refresh);
              // Cookies.set("userTokenA", response.data.token.access);
              // Cookies.set("userId", response.data.user_id);
              // Cookies.set("doctorId", response.data.doctor_id);
              // props.history.push("/login");
              ////ایمیل تایید برای شما فرستاده شد
              if (response.message === "Passwords must match") {
                setConfirmPassErr("پسورد وارد شده تطابق ندارد !");
              } else if (
                response.message ===
                "The username should only contain alphanumeric characters"
              ) {
                setUsernameErr("نام کاربری فقط می‌تواند شامل حرف و عدد باشد");
              } else {
                window.alert("ایمیل تایید برای شما فرستاده شد");
              }
            } else {
              console.log(response);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    } else {
      window.alert("مشخصات را کامل کنید");
      console.log(
        username +
          email +
          passwords.password +
          passwords.confirmPassword +
          name +
          lastname +
          state.file
      );
    }
  }

  function validatorname(value) {
    setName(value);
    let errors = "";
    if (value.length === 0) errors = "پر کرن نام ضروری است !";
    setNameErr(errors);
  }

  function validatorlastname(value) {
    setLastName(value);
    let errors = "";
    if (value.length === 0) errors = "پر کرن نام خانوادگی ضروری است !";
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
    if (value.length === 0) errors = "پر کرن ایمیل ضروری است !";
    else if (!regex_email.test(String(value).toLowerCase())) {
      errors = " ایمیل صحیح را وارد نمایید !";
    }
    setEmailErr(errors);
  }
  const pattern = /^((?=.*[0-9]{1,})|(?=.*[!.@#$&*-_]{1,}))(?=.*[a-z]{1,}).{8,}$/;
  function validatorpass(values) {
    setPasswords({ ...passwords, password: values });
    let errors = "";
    if (!pattern.test(String(values).toLowerCase())) {
      errors = "  پسورد باید حداقل هشت کاراکتر شامل حرف و رقم باشد  !";
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

  const redirectToLogin = () => {
    props.history.push("/login");
  };

  return (
    <div className="d-flex justify-content-center background">
      <div
        className="card-group shadow-lg border border-5 border-success rounded"
        style={{ backgroundColor: "white" }}
      >
        <div className="card border-0 align-self-center">
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
              <Form.Label className="mt-3"> نام کاربری</Form.Label>
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
            <div class="col-12 ">
              <input
                class="form-control"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={imageUploader}
                style={{ display: "none", color: "white" }}
              />
              {/* <Form.Group>
                          <Form.File id="uploadImg" accept="image/*" className="butChoose" onChange={imageHandler} />
                        </Form.Group> */}
              <div
                className="btn btn-dark "
                onClick={() => imageUploader.current.click()}
              >
                انتخاب عکس مدرک
              </div>
            </div>
            <div>
              <Button className="mt-3" block type="submit" variant="success">
                ثبت نام
              </Button>
              <span className="btn mt-3" onClick={() => redirectToLogin()}>
                ثبت ‌نام کرده‌اید؟
              </span>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
export default withRouter(SignUp);
