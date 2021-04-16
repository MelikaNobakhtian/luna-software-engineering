// import logo from './logo.svg';
// import './navbar.css';

// import "bootstrap/dist/css/bootstrap.min.css"
// import 'bootstrap/dist/js/bootstrap.bundle';
// import {Container ,Row,Col,Button,nav} from  "react-bootstrap";
  // import {navbar,nav,Button} from "bootstrap"
 // import {Navbar,Nav} from 'bootstrap';
// import * as ReactBootstrap from 'react-bootstrap';
import React,{useState} from "react";
import { FcSearch } from "react-icons/fc";
import Button from  "react-bootstrap/Button";
import { BsSearch ,BsFillPersonFill} from "react-icons/bs";
import { BiSearchAlt2} from "react-icons/bi";
import Cookies from 'js-cookie';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

 
function Navbar(props) {
  const redirecttoprofile =()=>{
    if(Cookies.get("doctorid")===0){
      props.history.push("/userProfile");
    }
    else if(Cookies.get("doctorid")===1)
    {
      props.history.push("/doctorProfile");
    }
    else{
      props.history.push("/login");
    }
  }
  return (
    
    <div  >
      
    <nav className="navbar navbar-expand-lg navbar-light" dir="rtl" style={{backgroundColor:"#EBFCFF"}}  >
    <div className="container-fluid" 
    // style={{backgroundColor:"#E2FBF9"}}
    >
    <a className="navbar-brand" style={{color:"#028090", fontWeight:"bolder"}} href="#">پزشک</a>
    
    <button className=" navbar-toggler"  type="button" data-bs-toggle="collapse" 
    data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon" data-bs-target=".navbar-collapse.show" data-bs-target="#navbarNav" ></span>
    </button>
    <div className="collapse navbar-collapse mb-5 mb-lg-0" id="navbarNav">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link active small me-3" style={{}} aria-current="page" href="#">گرفتن نوبت</a>
        </li>
        
        {/* <li className="nav-item">
          <a className="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
        </li> ///*/}
     
      </ul>
      <form className="d-flex col-lg-8  col-md-6 mt-lg-auto mb-lg-auto mb-n2 mt-3 col-11 round-3 me-lg-5 me-2" style={{}}>
      <Button class="btn round-3 shadow-0" style={{backgroundColor:"white",borderRadius:100,borderColor:"lightgray"}}>
      <BsSearch color="gray" size="20" class="round-3 mb-1 align-self-center justify-self-center" dir="rtl" style={{}}></BsSearch>
      </Button>
        <input className="form-control me-2 round-3 w-75 col-lg-11  shadow-0" type="search" style={{borderRadius:100}}  placeholder="نام پزشک ..." aria-label="Search">
          
        </input>
       
        {/* <button className="btn btn-outline-success round-3 shadow" style={{borderRadius:100}} type="submit">جستجو</button> */}
      </form>
     
    </div>
    <div  className="collapse navbar-collapse flex-row-reverse" id="navbarNav" 
    // style={{backgroundColor:"green"}}
    >
      <ul className="navbar-nav  "  style={{backgroundColor:"#EBFCFF"}} >
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
           {Cookies.get("doctorid")===1||Cookies.get("doctorid")===0?<div style={{fontSize:"clamp(15px,1.2vw,20px)"}}  onClick={()=>redirecttoprofile()} >
           <BsFillPersonFill class="ms-2" ></BsFillPersonFill>
           حساب کاربری</div>:
           <div class=" p-1 " style={{fontSize:"clamp(15px,1.2vw,20px)"}} onClick={()=>redirecttoprofile()} >
           <BsFillPersonFill class="ms-2" ></BsFillPersonFill>
           
           ورود یا ثبت نام
           
           </div>}
        </div>
        <li className="nav-item pull-left">
          <a className="nav-link"  style={{color:"#00A896",fontWeight:"bold"}}  href="#"><small>
            مشاهده ی اتاق ها
          </small></a>
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