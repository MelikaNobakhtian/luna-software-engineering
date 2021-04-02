// import logo from './logo.svg';
// import './navbar.css';

import "bootstrap/dist/css/bootstrap.min.css"

  import {Container ,Row,Col,Button,nav} from  "react-bootstrap";
  // import {navbar,nav,Button} from "bootstrap"
 // import {Navbar,Nav} from 'bootstrap';
// import * as ReactBootstrap from 'react-bootstrap';
//ino hey goft nemishnase bad az npm install popper va bootstrap toye package.json ham hastan
// import Button from  "react-bootstrap/Button";
function Navbar() {
  return (
    //yarn chiye farghesh ba npm 
     //fargh nav o navbar
    <div  >
   
    <nav class="navbar navbar-expand-lg navbar-light" dir="rtl" style={{backgroundColor:"#E2FBF9"}}  >
    <div class="container-fluid" 
    // style={{backgroundColor:"#E2FBF9"}}
    >
    <a class="navbar-brand" style={{alignSelf:"flex-end"}} href="#">کاشف</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">گرفتن نوبت</a>
        </li>
        
        {/* <li class="nav-item">
          <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
        </li> */}
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown link
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li>
      </ul>
      <form class="d-flex">
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"></input>
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
     
    </div>
    <div  class="collapse navbar-collapse flex-row-reverse" id="navbarNav"
    // style={{backgroundColor:"green"}}
    >
      <ul class="navbar-nav  "  style={{backgroundColor:"lightblue",alignSelf:"baseline"}} >
      <li class="nav-item ">
          <a class="nav-link" style={{fontSize:"calc(1em + 1vw)", fontWeight:"bold"}} href="#">مهندس هستید؟</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">ورود یا ثبت نام</a>
        </li>
        <li class="nav-item pull-left">
          <a class="nav-link"  color="#1f7a8c"  href="#">مشاهده ی اتاق ها</a>
        </li>
        </ul>
        </div>
    </div>
    </nav>
   
      {/* <ReactBootstrap.Button>HI this is bootstrap bottom</ReactBootstrap.Button> */}
    </div>
  );
}

export default Navbar;
