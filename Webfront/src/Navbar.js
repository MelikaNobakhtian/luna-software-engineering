// import logo from './logo.svg';
// import './navbar.css';
// import "bootstrap/dist/css/bootstrap.min.css"
// import 'bootstrap/dist/js/bootstrap.bundle';
// import {Container ,Row,Col,Button,nav} from  "react-bootstrap";
// import {navbar,nav,Button} from "bootstrap"
// import {Navbar,Nav} from 'bootstrap';
// import * as ReactBootstrap from 'react-bootstrap';
import React, { useEffect, useState } from "react";
//import { FcSearch } from "react-icons/fc";
//import Button from "react-bootstrap/Button";
import { BsSearch, BsFillPersonFill } from "react-icons/bs";
//import { BiSearchAlt2 } from "react-icons/bi";
import Cookies from "js-cookie";
import {
  //   BrowserRouter as Router,
  //   Switch,
  //   Route,
  //   Link,
  //   Redirect,
  withRouter,
} from "react-router-dom";

function Navbar(props) {
  const [searchedDoctor, setSearchedDoctor] = useState({
    name: "",
    lastname: "",
    specialty: "",
    state: "",
    city: "",
  });

  const redirecttoprofile = () => {
    console.log(Cookies.get("doctorId"));
    if (Cookies.get("doctorId") === "0") {
      props.history.push("/userProfile");
    } else if (Cookies.get("doctorId") === "1") {
      props.history.push("/doctorProfile");
    } else {
      props.history.push("/login");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSearchedDoctor((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const GoToSearch = (e) => {
    //props.history.push("/searchResult/" + JSON.stringify(searchedDoctor));
    let url = "/searchResult/";
    if (searchedDoctor.name.length) {
      url = url + "search=" + searchedDoctor.name + "&";
    }
    if (searchedDoctor.lastname.length) {
      url = url + "search=" + searchedDoctor.lastname + "&";
    }
    if (searchedDoctor.specialty.length) {
      url = url + "search=" + searchedDoctor.specialty + "&";
    }
    if (searchedDoctor.city.length) {
      url = url + "search=" + searchedDoctor.city + "&";
    }
    if (searchedDoctor.state.length) {
      url = url + "search=" + searchedDoctor.state + "&";
    }
    if (url === "/searchResult/") {
      url = url + " ";
    }

    // props.history.push(
    //   `/searchResult/${searchedDoctor.name}&${searchedDoctor.lastname}&${searchedDoctor.specialty}&${searchedDoctor.city}&${searchedDoctor.state}`
    // );
    props.history.push(url);
    setSearchedDoctor({
      name: "",
      lastname: "",
      specialty: "",
      state: "",
      city: "",
    });
  };

  return (
    <div className="" style={{ backgroundColor: "#EBFCFF" }}>
      <nav
        data-testid="navbar"
        className="navbar navbar-expand-lg navbar-light"
        dir="rtl"
      >
        <div className="container-fluid">
          <div
            className="navbar-brand"
            style={{ color: "#028090", fontWeight: "bolder" }}
          >
            پزشک
            <button
              className="btn mx-4 round-3 shadow-0"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasRight"
              aria-controls="offcanvasRight"
              style={{
                backgroundColor: "white",
                borderRadius: 100,
                borderColor: "lightgray",
              }}
            >
              <BsSearch
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasRight"
                aria-controls="offcanvasRight"
                color="gray"
                size="20"
                className="round-3 mb-1 align-self-center justify-self-center"
                dir="rtl"
                style={{}}
              ></BsSearch>
            </button>
          </div>

          <button
            className=" navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span
              className="navbar-toggler-icon"
              data-bs-target=".navbar-collapse.show"
            ></span>
          </button>
          <div className="collapse navbar-collapse mb-5 mb-lg-0" id="navbarNav">
            <ul className="navbar-nav">
              <li className="btn nav-item nav-link ms-auto">گرفتن نوبت</li>

              {/* <li className="nav-item">
          <a className="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
        </li> ///*/}
            </ul>
            <form className="d-flex col-lg-8  col-md-6 mt-lg-auto mb-lg-auto mb-n2 mt-3 col-11 round-3 me-lg-5 me-2">
              {/* <input
                className="form-control me-2 round-3 w-75 col-lg-11  shadow-0"
                type="search"
                style={{ borderRadius: 100 }}
                placeholder="نام پزشک ..."
                aria-label="Search"
              ></input> */}

              {/* <button className="btn btn-outline-success round-3 shadow" style={{borderRadius:100}} type="submit">جستجو</button> */}
            </form>
          </div>
          <div
            className="collapse navbar-collapse flex-row-reverse"
            id="navbarNav"
            // style={{backgroundColor:"green"}}
          >
            <ul className="navbar-nav  ">
              {/* <li className="nav-item dropdown" data-bs-toggle="collapse" dir ="ltr"  >
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
           پزشک هستید؟
          </a>
          <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
            <li><a className="dropdown-item" href="#">ثبت نام پزشک</a></li>
            <li><a className="dropdown-item" href="#">ورود پزشک</a></li>
        
          </ul>
        </li> */}
              <div className="nav-item mt-lg-auto mb-lg-auto mb-2 mt-n5  ms-5">
                {Cookies.get("doctorId") !== undefined ? (
                  <div
                    className="btn p-1 "
                    style={{ fontSize: "clamp(15px,1.2vw,20px)" }}
                    onClick={() => redirecttoprofile()}
                    data-testid="redirecttoprofile"
                  >
                    <BsFillPersonFill className="ms-2"></BsFillPersonFill>
                    حساب کاربری
                  </div>
                ) : (
                  <div
                    className="btn p-1 "
                    style={{ fontSize: "clamp(15px,1.2vw,20px)" }}
                    onClick={() => redirecttoprofile()}
                    data-testid="redirecttoprofile"
                  >
                    <BsFillPersonFill className="ms-2"></BsFillPersonFill>
                    ورود یا ثبت نام
                  </div>
                )}
              </div>
              <li
                className="btn nav-item nav-link pull-left ms-auto"
                style={{ color: "#00A896", fontWeight: "bold" }}
              >
                <small>مشاهده ی اتاق ها</small>
              </li>
            </ul>
          </div>
        </div>
        {/* <div className="collapse"  id="navbarNav">
  <div className="bg-dark p-4">
    <h5 className="text-white h4">Collapsed content</h5>
    <span className="text-muted">Toggleable via the navbar brand.</span>
  </div>
</div> */}
      </nav>

      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
        style={{ backgroundColor: "#e3eeee" }}
      >
        <div className="offcanvas-header">
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
          <h5 id="offcanvasRightLabel">جستجو</h5>
        </div>
        <div className="offcanvas-body m-1 ">
          <p className="">قسمت های مورد نظر خود را پر کنید</p>
          <form className="row g-3">
            <div className="col-6">
              <input
                type="text"
                className="form-control "
                placeholder="نام دکتر..."
                id="name"
                value={searchedDoctor.name}
                onChange={handleChange}
              />
            </div>
            <div className="col-6">
              <input
                type="text"
                className="form-control "
                placeholder="فامیلی دکتر..."
                id="lastname"
                value={searchedDoctor.lastname}
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <input
                type="text"
                className="form-control  "
                placeholder="تخصص..."
                aria-label=""
                id="specialty"
                value={searchedDoctor.specialty}
                onChange={handleChange}
              />
            </div>
            <div className="col-6">
              <input
                type="text"
                className="form-control"
                placeholder="استان..."
                aria-label=""
                value={searchedDoctor.state}
                id="state"
                onChange={handleChange}
              />
            </div>
            <div className="col-6">
              <input
                type="text"
                className="form-control"
                placeholder="شهر..."
                aria-label=""
                value={searchedDoctor.city}
                id="city"
                onChange={handleChange}
              />
            </div>
            <div
              data-bs-dismiss="offcanvas"
              className="btn btn-primary col-4 mx-2"
              onClick={GoToSearch}
              data-testid="goToSearch"
            >
              بگرد
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Navbar);
