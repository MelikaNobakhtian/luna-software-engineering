import React, { useState, useEffect } from "react";
import {
  //Toast,
  //Button,
  Form,
  // FormGroup,
  // Label,
  // Input,
  // FormText,
  //Col,
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
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

function Editprofile(props) {
  const [user, setUser] = useState({
    //token: "",
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
 
  const [states, setStates] = useState({ 0: "444", 1: "ttt" });

  useEffect(() => {
    if (Cookies.get("userTokenA")) {
      axios
        .get(API_BASE_URL + "/doctor/" + Cookies.get("doctorId"))
        .then(function (response) {
          console.log(response);
          setUser((prevState) => ({
            ...prevState,
            userName: response.data.data.user.username,
            firstName: response.data.data.user.first_name,
            lastName: response.data.data.user.last_name,
            email: response.data.data.user.email,
            picture: API_BASE_URL + response.data.data.user.profile_photo,
            specialty: response.data.data.specialty,
            sub_specialty: response.data.data.sub_specialty,
          }));
          setStates(response.data.states);
          setDoctorAddresses(response.data.data.addresses);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, []);

  const handleChange = (e) => {
    //console.log(user);
    //console.log(states);
    const { id, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleChangeInfosClick = (e) => {
    e.preventDefault();
    if (
      user.firstName.length === 0 ||
      user.lastName.length === 0 ||
      user.userName.length === 0 ||
      user.specialty.length === 0 ||
      user.sub_specialty.length === 0
  
    ) {
      setMassage("لطفا همه را وارد کنید");
      setOpenSnack(true);
    } else {
      e.preventDefault();
      var formdata = new FormData();
      formdata.append("username", user.userName);
      formdata.append("first_name", user.firstName);
      formdata.append("last_name", user.lastName);
      formdata.append("profile_photo", state.file);
      console.log(formdata);
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
            setMassage("اطلاعات جدید با موفقیت جایگزین شد");
            setOpenSnack(true);
          } else if (response.status === 401) {
            console.log(response.status);
            setMassage("نشست شما منقضی شده است. لطفا دوباره وارد شوید");
            setOpenSnack(true);
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

     
    }
  };

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
    } else if (user.newPass.length < 8) {
      setMassage("رمز باید بیشتر از ۸ کاراکتر باشد");
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
          if (response.data.message === "Password updated succesfully!") {
            console.log(response.status);
            setMassage("پسورد با موفقیت عوض شد");
            setOpenSnack(true);
          } else if (response.data.message.toString() === "Wrong Password") {
            //console.log(response.status);
            setMassage("پسورد قبلی غلط است");
            setOpenSnack(true);
          } else console.log(response.data.message);
        })
        .catch(function (error) {
          console.log(error);
          setMassage("پسورد قبلی غلط است");
          setOpenSnack(true);
        });
    }

    // setUser((prevState) => ({
    //   ...prevState,
    //   oldPass: "",
    //   newPass: "",
    //   newPass2: "",
    // }));
  };

  //get image from user
  const [state, setState] = useState({
    navigate: false,
    file: null,
  });
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
        //current.src = e.target.result;
        setUser((prevState) => ({
          ...prevState,
          picture: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  //snackbar
  const [massage, setMassage] = useState(<br></br>);
  const [openSnack, setOpenSnack] = useState(false);
  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };

  const handleLogout = () => {
    Cookies.remove("userId");
    Cookies.remove("doctorId");
    Cookies.remove("userTokenR");
    Cookies.remove("userTokenA");
    props.history.push("/login");
  };

  const [newAddress, setNewAddress] = useState({
    state: "",
    city: "",
    detail: "",
  });
  const [doctorAddresses, setDoctorAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState({
    index: "",
    state: "",
    city: "",
    detail: "",
    id: "",
  });

  const handleAddNewAddressClick = (e) => {
    e.preventDefault();
    if (newAddress.state && newAddress.city && newAddress.detail) {
      const payloadNewAddress = {
        count: 1,
        addresses: [
          {
            state: newAddress.state,
            city: newAddress.city,
            detail: newAddress.detail,
          },
        ],
      };
      const backcity = JSON.stringify(payloadNewAddress);
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
          if (
            response.data.message === "You submit your addresses successfully!"
          ) {
            console.log(response.status);
            setMassage("آدرس شما با موفقیت اضافه شد");
            setOpenSnack(true);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const handleChangeAddressClick = (e) => {
    e.preventDefault();
    const payloadNewAddress = {
      state: editingAddress.state,
      city: editingAddress.city,
      detail: editingAddress.detail,
    };
    const backcity = JSON.stringify(payloadNewAddress);
    console.log(backcity);
    axios
      .put(
        API_BASE_URL +
          "/doctor/" +
          Cookies.get("doctorId") +
          "/update-address/" +
          editingAddress.id +
          "/",
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
  };

  return (
    <div className="main-content">
      <div className="container-fluid p-2">
        {Cookies.get("doctorId") === undefined ? (
          <div className="text-center">لطفا وارد حساب خود شوید</div>
        ) : (
          <div className="d-flex flex-wrap">
            <div className="col-12 col-md-4 ">
              <div
                className="card border-dark border p-2 m-1 shadow"
                style={{ backgroundColor: "#EEEDE8" }}
              >
                <div class="card-header d-flex justify-content-center">
                  <div className="text-center">
                    <Avatar
                      src={user.picture}
                      ref={uploadedImage}
                      alt="عکس"
                      className="mx-auto"
                      style={{ width: 120, height: 120 }}
                    />
                    <h5 className="username mt-2">{user.userName}</h5>
                    <h6 className="email">{user.email}</h6>
                  </div>
                </div>
                <div class="card-body flex row g-2">
                  <div
                    className="btn btn-outline-dark btn-sm"
                    onClick={handleLogout}
                  >
                    <ExitToAppIcon></ExitToAppIcon>
                    خروج از حساب
                  </div>
                  <div className="btn btn-outline-dark btn-sm">
                    <EditIcon></EditIcon>
                    ویرایش اطلاعات
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-8 ">
              <div
                className="card border-dark border p-2 m-1 shadow-"
                style={{ backgroundColor: "#EEEDE8" }}
              >
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
                            <Form.Label className="mt-3">
                              نام خانوادگی
                            </Form.Label>
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
                            <Form.Label className="mt-3">
                              {" "}
                              نام کاربری
                            </Form.Label>
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
                          <Form.Group controlId="formBasicSelect">
                            <Form.Label> تخصص</Form.Label>
                            <Form.Control
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
                              <option className="text-muted" value="">
                                انتخاب کنید...
                              </option>
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
                                className="btn btn-outline-dark rounded"
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
                            class="btn btn-outline-dark"
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
                            class="btn btn-outline-dark"
                            onClick={handleChangePassClick}
                          >
                            <CheckCircleIcon></CheckCircleIcon>
                            تغییر رمز
                          </button>
                        </div>
                      </form>
                    </Form>
                    <hr></hr>
                    <div>
                      {doctorAddresses.length === 0 ? (
                        <p>آدرسی برای خود ثبت کنید</p>
                      ) : (
                        <div>
                          {Array.from(Array(doctorAddresses.length), (e, i) => (
                            <form class="row g-3">
                              <div class="col-sm-3">
                                <Form.Group>
                                  <span class="badge bg-dark">{i + 1}</span>

                                  <Form.Label className="mx-2">
                                    استان
                                  </Form.Label>
                                  <p
                                    className="p-1 rounded border"
                                    style={{ backgroundColor: "white" }}
                                  >
                                    {doctorAddresses[i].state}
                                  </p>
                                </Form.Group>
                              </div>
                              <div class="col-sm-4">
                                <Form.Group>
                                  <Form.Label>شهر</Form.Label>
                                  <p
                                    className="p-1 rounded border"
                                    style={{ backgroundColor: "white" }}
                                  >
                                    {doctorAddresses[i].city}
                                  </p>
                                </Form.Group>
                              </div>
                              <div class="col-sm-4">
                                <Form.Group>
                                  <Form.Label>آدرس</Form.Label>
                                  <p
                                    className="p-1 rounded border"
                                    style={{ backgroundColor: "white" }}
                                  >
                                    {doctorAddresses[i].detail}
                                  </p>
                                </Form.Group>
                              </div>
                              <div class="col-1">
                                <button
                                  type="button"
                                  class="btn btn-outline-dark mt-sm-4 mb-3"
                                  onClick={() => {
                                    setEditingAddress({
                                      index: i,
                                      state: doctorAddresses[i].state,
                                      city: doctorAddresses[i].city,
                                      detail: doctorAddresses[i].detail,
                                      id: doctorAddresses[i].id,
                                    });
                                  }}
                                  data-bs-toggle="modal"
                                  data-bs-target="#staticBackdrop"
                                >
                                  <EditIcon></EditIcon>
                                </button>
                              </div>
                            </form>
                          ))}
                        </div>
                      )}
                      <form class="row g-3">
                        {states === undefined ? (
                          <p></p>
                        ) : (
                          <div class="col-sm-4">
                            <Form.Group>
                              <span class="badge bg-dark">آدرس جدید:</span>
                              <Form.Label className="mx-2">استان</Form.Label>
                              <Form.Control
                                controlId="formGridState"
                                as="select"
                                defaultValue=" choose...."
                                id="newstate"
                                value={newAddress.state}
                                onChange={(e) => {
                                  //console.log("e.target.value", e.target.value);
                                  setNewAddress({
                                    ...newAddress,
                                    state: e.target.value,
                                  });
                                }}
                              >
                                <option className="text-muted" value="">
                                  انتخاب کنید...
                                </option>

                                {Array.from(Array(32), (e, i) => {
                                  return <option value={i}>{states[i]}</option>;
                                })}
                              </Form.Control>
                            </Form.Group>
                          </div>
                        )}
                        <div class="col-sm-4">
                          <Form.Group>
                            <Form.Label>شهر</Form.Label>
                            <InputGroup hasValidation>
                              <Form.Control
                                type="text"
                                //  placeholder="شهر"
                                id="newcity"
                                value={newAddress.city}
                                onChange={(e) => {
                                  console.log(
                                    "e.target.value",
                                    newAddress.city
                                  );
                                  setNewAddress({
                                    ...newAddress,
                                    city: e.target.value,
                                  });
                                }}
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
                                id="newdetail"
                                value={newAddress.detail}
                                onChange={(e) => {
                                  console.log(
                                    "e.target.value",
                                    newAddress.detail
                                  );
                                  setNewAddress({
                                    ...newAddress,
                                    detail: e.target.value,
                                  });
                                }}
                              />
                            </InputGroup>
                          </Form.Group>
                        </div>
                        <div class="col-12">
                          <button
                            type="submit"
                            class="btn btn-outline-dark"
                            onClick={handleAddNewAddressClick}
                          >
                            <CheckCircleIcon></CheckCircleIcon>
                            ذخیره آدرس جدید
                          </button>
                        </div>
                      </form>
                    </div>
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
                    <h3>ویرایش آدرس</h3>
                  </div>
                  {doctorAddresses.length === 0 ? (
                    <p></p>
                  ) : (
                    <div class="modal-body">
                      <form class="row g-3">
                        {states === undefined ? (
                          <p></p>
                        ) : (
                          <div class="col-sm-6">
                            <Form.Group>
                              <Form.Label className="">استان</Form.Label>
                              <Form.Control
                                controlId="formGridState"
                                as="select"
                                defaultValue=" choose...."
                                id="editingstate"
                                value={editingAddress.state}
                                onChange={(e) => {
                                  //console.log("e.target.value", e.target.value);
                                  setEditingAddress({
                                    ...editingAddress,
                                    state: e.target.value,
                                  });
                                }}
                              >
                                <option className="text-muted" value="">
                                  انتخاب کنید...
                                </option>

                                {Array.from(Array(32), (e, i) => {
                                  return (
                                    <option value={states[i]}>
                                      {states[i]}
                                    </option>
                                  );
                                })}
                              </Form.Control>
                            </Form.Group>
                          </div>
                        )}
                        <div class="col-sm-6">
                          <Form.Group>
                            <Form.Label>شهر</Form.Label>
                            <InputGroup hasValidation>
                              <Form.Control
                                type="text"
                                //  placeholder="شهر"
                                id="editingcity"
                                value={editingAddress.city}
                                onChange={(e) => {
                                  console.log(
                                    "e.target.value",
                                    editingAddress.city
                                  );
                                  setEditingAddress({
                                    ...editingAddress,
                                    city: e.target.value,
                                  });
                                }}
                              />
                            </InputGroup>
                          </Form.Group>
                        </div>
                        <div class="col-sm-12">
                          <Form.Group>
                            <Form.Label>آدرس</Form.Label>
                            <InputGroup hasValidation>
                              <Form.Control
                                type="text"
                                // placeholder="آدرس"
                                id="editingdetail"
                                value={editingAddress.detail}
                                onChange={(e) => {
                                  console.log(
                                    "e.target.value",
                                    editingAddress.detail
                                  );
                                  setEditingAddress({
                                    ...editingAddress,
                                    detail: e.target.value,
                                  });
                                }}
                              />
                            </InputGroup>
                          </Form.Group>
                        </div>
                      </form>
                    </div>
                  )}
                  <div class="modal-footer d-flex justify-content-start">
                    <button
                      type="button"
                      class="btn btn-success"
                      data-bs-dismiss="modal"
                      onClick={handleChangeAddressClick}
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
        )}
      </div>
    </div>
  );
}
export default withRouter(Editprofile);
