import React, { useState, useEffect } from "react";
import {
  //Toast,
  //Button,
  Form,
  // FormGroup,
  // Label,
  // Input,
  // FormText,
  Col,
  InputGroup,
} from "react-bootstrap";
import {
  //Link,
  //Redirect,
  withRouter,
  //useHistory
} from "react-router-dom";
import { Avatar } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../apiConstant/apiConstant";
import Snackbar from "@material-ui/core/Snackbar";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

function Editprofile(props) {
  const [user, setUser] = useState({
    token: "",
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    picture: "",
    oldPass: "",
    newPass: "",
    newPass2: "",
    specialty: "",
    sub_specialty: "",
  });
  console.log("lll" + user.lastName);
  const [address, setAddress] = useState({
    state: "",
    city: "",
    detail: "",
  });
  const [variable, setvar] = useState("false");

  //const [type, setType] = useState("");
  useEffect(() => {
    if (Cookies.get("doctorId")) {
      axios
        .get(API_BASE_URL + "/doctor/" + Cookies.get("doctorId"))
        .then(function (response) {
          console.log(response);
          setUser((prevState) => ({
            ...prevState,
            userName: response.data.user.username,
            firstName: response.data.user.first_name,
            lastName: response.data.user.last_name,
            email: response.data.user.email,
            picture: API_BASE_URL + response.data.user.profile_photo,
            specialty: response.data.specialty,
            sub_specialty: response.data.sub_specialty,
          }));
          if (response.data.addresses.length !== 0) {
            setAddress((prevState) => ({
              ...prevState,
              city: response.data.addresses[0].city,
              state: response.data.addresses[0].state,
              detail: response.data.addresses[0].detail,
            }));
          }

          if (response.data.addresses.length > 0) setvar("true");
          //console.log(response.data.addresses[0].city)
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, []);

  const handleChangeInfosClick = (e) => {
    e.preventDefault();

    e.preventDefault();
    var formdata = new FormData();
    formdata.append("username", user.userName);
    formdata.append("first_name", user.firstName);
    formdata.append("last_name", user.lastName);
    if (state.file != null) formdata.append("profile_photo", state.file);
    console.log(formdata);
    // const payload={
    //       "username":user.userName,
    //       "first_name":user.firstName,
    //       "last_name":user.lastName,
    // }
    // const back= JSON.stringify(payload)
    axios
      .put(
        API_BASE_URL + "/user/" + Cookies.get("userId") + "/update-profile/",
        formdata,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + Cookies.get("userTokenA"),
          },
        }
      )
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          console.log(response.status);
          Cookies.set("userName", user.userName);
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    const special = {
      specialty: user.specialty,
      sub_specialty: user.sub_specialty,
    };
    const backend = JSON.stringify(special);
    axios
      .put(
        API_BASE_URL +
          "/doctor/" +
          Cookies.get("doctorId") +
          "/update-profile/",
        backend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + Cookies.get("userTokenA"),
          },
        }
      )
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          console.log(response.status);
          setMassage("اطلاعات جدید با موفقیت جایگزین شد");
          setOpenSnack(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    if (variable === false) {
      var info = [];
      if (address.state != null) info.push({ state: address.state });
      if (address.city != null) info.push({ city: address.city });
      if (address.detail != null) info.push({ detail: address.detail });

      if (info.length !== 0) {
        const backinfo = JSON.stringify(info);
        axios
          .put(
            API_BASE_URL +
              "/doctor/" +
              Cookies.get("doctorId") +
              "/update-address/" +
              "48/",
            backinfo,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + Cookies.get("userTokenA"),
              },
            }
          )
          .then(function (response) {
            console.log(response);
            if (response.status === 200) {
              console.log(response.status);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
    if (variable === true) {
      const payloadcity = {
        state: address.state,
        city: address.city,
        detail: address.detail,
      };

      const backcity = JSON.stringify(payloadcity);
      axios
        .post(
          API_BASE_URL + "/doctor/" + Cookies.get("doctorId") + "/set-address/",
          backcity,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + Cookies.get("userTokenA"),
            },
          }
        )
        .then(function (response) {
          console.log(response);
          if (response.status === 200) {
            console.log(response.status);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };
  const handleChangeaddress = (e) => {
    const { id, value } = e.target;
    setAddress((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const [state, setState] = useState({
    navigate: false,
    file: null,
  });

  const handleChangePassClick = (e) => {
    e.preventDefault();
    if (
      user.oldPass.length === 0 ||
      user.newPass.length === 0 ||
      user.newPass2.length === 0
    ) {
      setMassage("لطفا همه را وارد کنید");
      setOpenSnack(true);
    } else if (user.newPass !== user.newPass2) {
      setMassage("تکرار رمز اشتباه است");
      setOpenSnack(true);
    } else {
      const payload = {
        old_password: user.oldPass,
        new_password: user.newPass,
      };
      const back = JSON.stringify(payload);
      console.log(back);

      axios
        .put(
          API_BASE_URL + "/user/" + Cookies.get("userId") + "/change-password/",
          back,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + Cookies.get("userTokenA"),
            },
          }
        )
        .then(function (response) {
          console.log(response);
          if (response.status === 200) {
            console.log(response.status);
            setMassage("پسورد با موفقیت عوض شد");
            setOpenSnack(true);
          } else if (response.status === 401) {
            console.log(response.status);
            setMassage("پسورد قبلی غلط است");
            setOpenSnack(true);
          }
        })
        .catch(function (error) {
          console.log(error);
          setMassage("پسورد قبلی غلط است");
          setOpenSnack(true);
        });
    }

    setUser((prevState) => ({
      ...prevState,
      oldPass: "",
      newPass: "",
      newPass2: "",
    }));
  };
  const uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);
  const handleImageUpload = (e) => {
    setState({ file: e.target.files[0] });
    const [file] = e.target.files;
    if (file) {
      const reader = new FileReader();
      const { current } = uploadedImage;
      current.file = file;
      reader.onload = (e) => {
        setUser((prevState) => ({
          ...prevState,
          picture: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const [massage, setMassage] = useState(<br></br>);
  const [openSnack, setOpenSnack] = useState(false);
  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };

  return (
    <div className="main-content">
      <div className="container-fluid p-2">
        <div className="d-flex flex-wrap">
          <div className="col-12 col-md-4 ">
            <div className="card border-dark border-2 text-white p-2 m-1 App-color4 shadow-lg">
              <div class="card-header d-flex justify-content-center">
                <div className="text-center">
                  <Avatar
                    src={user.picture}
                    ref={uploadedImage}
                    alt="عکس"
                    className=""
                    style={{ width: 120, height: 120 }}
                  />
                  <h5 className="username mt-2">{user.userName}</h5>
                  <h6 className="email">{user.email}</h6>
                </div>
              </div>
              <div class="card-body">
                <div className="btn btn-light btn-sm">
                  <EditIcon></EditIcon>
                  ویرایش اطلاعات
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-8 ">
            <div className="card border-dark border-2 text-white p-2 m-1 App-color4 shadow-lg">
              <div class="card-header d-flex">
                <h4>اطلاعات شخصی</h4>
              </div>
              <div class="card-body">
                <div>
                  <Form>
                    <form class="row g-3">
                      <div class="col-sm-4 ">
                        <Form.Group controlId="formGridFirstName">
                          <Form.Label className="mt-3">نام </Form.Label>
                          <InputGroup hasValidation>
                            <Form.Control
                              type="text"
                              name="firstName"
                              id="firstName"
                              value={user.firstName}
                              onChange={handleChange}
                              onBlur={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">
                              {"formGridFirstname"}{" "}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>
                      </div>
                      <div class="col-sm-4 ">
                        <Form.Group controlId="formGridLastname">
                          <Form.Label className="mt-3">نام خانوادگی</Form.Label>
                          <InputGroup hasValidation>
                            <Form.Control
                              type="text"
                              name="lastname"
                              id="lastName"
                              value={user.lastName}
                              onChange={handleChange}
                              onBlur={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">
                              {"formGridLastname"}{" "}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>
                      </div>

                      <div class="col-sm-4">
                        <Form.Group controlId="grid">
                          <Form.Label className="mt-3"> نام کاربری</Form.Label>
                          <InputGroup hasValidation>
                            <Form.Control
                              type="text"
                              name="userName"
                              id="userName"
                              value={user.userName}
                              onChange={handleChange}
                              onBlur={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">
                              {""}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>
                      </div>
                      <div class="col-sm-4">
                        <Form.Group>
                          <Form.Label>استان</Form.Label>
                          <Form.Control
                            controlId="formGridState"
                            as="select"
                            defaultValue=" choose...."
                            id="state"
                            value={address.state}
                            onChange={(e) => {
                              console.log("e.target.value", e.target.value);
                              setAddress({ ...address, state: e.target.value });
                            }}
                          >
                            <option value="آذربایجان شرقی">
                              آذربایجان شرقی
                            </option>
                            <option value="	آذربایجان غربی">
                              آذربایجان غربی
                            </option>
                            <option value="اردبیل">اردبیل</option>
                            <option value="اصفهان">اصفهان</option>
                            <option value="البرز">البرز</option>
                            <option value="ایلام">ایلام</option>
                            <option value="بوشهر">بوشهر</option>
                            <option value="تهران">تهران</option>
                            <option value="چهارمحال و بختیاری">
                              چهارمحال و بختیاری
                            </option>
                            <option value="خراسان جنوبی">خراسان جنوبی</option>
                            <option value="خراسان رضوی">خراسان رضوی</option>
                            <option value="خراسان شمالی	">خراسان شمالی</option>
                            <option value="خوزستان">خوزستان</option>
                            <option value="	زنجان">زنجان</option>
                            <option value="سمنان">سمنان</option>
                            <option value="سیستان و بلوچستان	">
                              سیستان و بلوچستان
                            </option>
                            <option value="فارس">فارس</option>
                            <option value="قزوین">قزوین</option>
                            <option value="	قم">قم</option>
                            <option value="	کردستان">کردستان</option>
                            <option value="کرمان">کرمان</option>
                            <option value="کرمانشاه">کرمانشاه</option>
                            <option value="کهگیلویه و بویراحمد">
                              کهگیلویه و بویراحمد
                            </option>
                            <option value="	گلستان">گلستان</option>
                            <option value="گیلان">گیلان</option>
                            <option value="لرستان">لرستان</option>
                            <option value="	مازندران">مازندران</option>
                            <option value="مرکزی">مرکزی</option>
                            <option value="	هرمزگان">هرمزگان</option>
                            <option value="	همدان">همدان</option>
                            <option value="یزد">یزد</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                      <div class="col-sm-4">
                        <Form.Group>
                          <Form.Label>شهر</Form.Label>
                          <InputGroup hasValidation>
                            <Form.Control
                              type="text"
                              //  placeholder="شهر"
                              id="city"
                              value={address.city}
                              onChange={handleChangeaddress}
                            />
                          </InputGroup>
                        </Form.Group>
                      </div>
                      <div class="col-sm-4">
                        <Form.Group>
                          <Form.Label>آدرس</Form.Label>
                          <InputGroup hasValidation>
                            <Form.Control
                              type="text"
                              // placeholder="آدرس"
                              id="detail"
                              value={address.detail}
                              onChange={handleChangeaddress}
                            />
                          </InputGroup>
                        </Form.Group>
                      </div>
                      <div class="col-sm-4">
                        <Form.Group controlId="formBasicSelect">
                          <Form.Label> تخصص خود را انتخاب کنید :</Form.Label>
                          <Form.Control
                            as={Col}
                            controlId="formGridState"
                            as="select"
                            defaultValue=" choose...."
                            id="specialty"
                            value={user.specialty}
                            onChange={(e) => {
                              console.log("e.target.value", e.target.value);
                              setUser({ ...user, specialty: e.target.value });
                            }}
                          >
                            <option value="ﭼﺸﻢ ﭘﺰﺷﮑﯽ">ﭼﺸﻢ ﭘﺰﺷﮑﯽ</option>
                            <option value="ﻗﻠﺐ ﻭ ﻋﺮﻭﻕ">ﻗﻠﺐ ﻭ ﻋﺮﻭﻕ</option>
                            <option value="ﻣﻐﺰ ﻭ ﺍﻋﺼﺎﺏ">ﻣﻐﺰ ﻭ ﺍﻋﺼﺎﺏ</option>
                            <option value="ﺩﺍﺧﻠﯽ ‏">ﺩﺍﺧﻠﯽ</option>
                            <option value="ﮐﻮﺩﮐﺎﻥ">ﮐﻮﺩﮐﺎﻥ ‏</option>
                            <option value="ﺍﻋﺼﺎﺏ ﻭ ﺭﻭﺍﻥ">ﺍﻋﺼﺎﺏ ﻭ ﺭﻭﺍﻥ</option>
                            <option value="ﻋﻤﻮﻣﯽ">ﻋﻤﻮﻣﯽ</option>
                          </Form.Control>
                        </Form.Group>
                      </div>

                      <div class="col-sm-4">
                        <Form.Group>
                          <Form.Label>فوق تخصص</Form.Label>
                          <InputGroup hasValidation>
                            <Form.Control
                              type="text"
                              name="sub_specialty"
                              id="sub_specialty"
                              //  placeholder="تخصص"
                              value={user.sub_specialty}
                              onChange={handleChange}
                            />
                          </InputGroup>
                        </Form.Group>
                      </div>
                      {console.log("lll" + user.sub_specialty)}

                      <div class="col-12 ">
                        <Form.Group>
                          <InputGroup hasValidation>
                            <Form.Control
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              ref={imageUploader}
                              style={{ display: "none", color: "white" }}
                            />
                            <div
                              className="btn btn-outline-light rounded"
                              onClick={() => imageUploader.current.click()}
                            >
                              <AddPhotoAlternateIcon></AddPhotoAlternateIcon>
                              انتخاب عکس جدید
                            </div>
                          </InputGroup>
                        </Form.Group>
                      </div>
                      <div class="col-12 ">
                        <button
                          type="submit"
                          class="btn btn-outline-light"
                          onClick={handleChangeInfosClick}
                        >
                          <CheckCircleIcon></CheckCircleIcon>
                          ذخیره تغییرات
                        </button>
                      </div>
                      <hr></hr>
                      <div class="col-sm-4">
                        <Form.Group>
                          <Form.Label className=""> رمز فعلی</Form.Label>
                          <InputGroup hasValidation>
                            <Form.Control
                              type="password"
                              id="oldPass"
                              value={user.oldPass}
                              onChange={handleChange}
                            />
                          </InputGroup>
                        </Form.Group>
                      </div>
                      <div class="col-sm-4">
                        <Form.Group>
                          <Form.Label className="">رمز جدید</Form.Label>
                          <InputGroup hasValidation>
                            <Form.Control
                              type="password"
                              id="newPass"
                              value={user.newPass}
                              onChange={handleChange}
                            />
                          </InputGroup>
                        </Form.Group>
                      </div>
                      <div class="col-sm-4">
                        <Form.Group>
                          <Form.Label className="">تکرار رمز جدید</Form.Label>
                          <InputGroup hasValidation>
                            <Form.Control
                              type="password"
                              id="newPass2"
                              value={user.newPass2}
                              onChange={handleChange}
                            />
                          </InputGroup>
                        </Form.Group>
                      </div>
                      <div class="col-12">
                        <button
                          type="submit"
                          class="btn btn-outline-light"
                          onClick={handleChangePassClick}
                        >
                          <CheckCircleIcon></CheckCircleIcon>
                          تغییر رمز
                        </button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={openSnack}
            autoHideDuration={2500}
            onClose={handleCloseSnack}
            message={<div style={{ fontSize: 17 }}>{massage}</div>}
          />
        </div>
      </div>
    </div>
  );
}
export default withRouter(Editprofile);
