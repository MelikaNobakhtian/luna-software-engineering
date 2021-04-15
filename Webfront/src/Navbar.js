// import logo from './logo.svg';
// import './navbar.css';

// import "bootstrap/dist/css/bootstrap.min.css"
// import 'bootstrap/dist/js/bootstrap.bundle';
// import {Container ,Row,Col,Button,nav} from  "react-bootstrap";
  // import {navbar,nav,Button} from "bootstrap"
 // import {Navbar,Nav} from 'bootstrap';
// import * as ReactBootstrap from 'react-bootstrap';
import React,{useState} from "react";
// import Button from  "react-bootstrap/Button";
function Navbar() {
  return (
    
    <div  >
      
    <nav className="navbar navbar-expand-lg navbar-light" dir="rtl" style={{backgroundColor:"#E2FBF9"}}  >
    <div className="container-fluid" 
    // style={{backgroundColor:"#E2FBF9"}}
    >
    <a className="navbar-brand" style={{}} href="#">کاشف</a>
    
    <button className=" navbar-toggler"  type="button" data-bs-toggle="collapse" 
    data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon" data-bs-target=".navbar-collapse.show" data-bs-target="#navbarNav" ></span>
    </button>
    <div className="collapse navbar-collapse mb-5 mb-lg-0" id="navbarNav">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="#">گرفتن نوبت</a>
        </li>
        
        {/* <li className="nav-item">
          <a className="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
        </li> ///*/}
     
      </ul>
      <form className="d-flex">
        <input className="form-control me-2" type="search"  placeholder="Search" aria-label="Search"></input>
        <button className="btn btn-outline-success" type="submit">Search</button>
      </form>
     
    </div>
    <div  className="collapse navbar-collapse flex-row-reverse" id="navbarNav" 
    // style={{backgroundColor:"green"}}
    >
      <ul className="navbar-nav  "  style={{backgroundColor:"#E2FBF9"}} >
      <li className="nav-item dropdown" data-bs-toggle="collapse" dir ="ltr"  >
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
           پزشک هستید؟
          </a>
          <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
            <li><a className="dropdown-item" href="#">ثبت نام پزشک</a></li>
            <li><a className="dropdown-item" href="#">ورود پزشک</a></li>
        
          </ul>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">ورود یا ثبت نام</a>
        </li>
        <li className="nav-item pull-left">
          <a className="nav-link"  color="#1f7a8c"  href="#">مشاهده ی اتاق ها</a>
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
   
      {/* <ReactBootstrap.Button>HI this is bootstrap bottom</ReactBootstrap.Button> */}
    </div>
  );
}

export default Navbar;
