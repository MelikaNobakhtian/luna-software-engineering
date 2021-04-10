import React from "react";
import { render } from "react-dom";
// import { DatePicker } from "jalali-react-datepicker";
import { RestaurantMenu } from "@material-ui/icons";
import moment from 'moment-jalaali'
import DatePicker from 'react-datepicker2';
import Navbar from "../../Navbar"

import { Toast, Button, Form, FormGroup, Label, input, FormText, Col, InputGroup } from 'react-bootstrap';

function Doctorcalender() {
  return (
    <div>
      <Navbar></Navbar>
      <h1> سلام</h1>
      <p>
        برای انتخاب وقت های حضوری و یا مجازی خود ابتدا روز مورد نظر خود را از روی تقویم انتخاب کرده و سپس بازه ی زمانی ای که در آن میتوانید نوبت حضوری داشته باشید را در کادر بازه های نوبت حضوری و مدت زمانی را که میتونید در آن وقت مجازی داشته باشید در کادر بازه های نوبت مجازی وارد کنید
        </p>


      <div class="row g-3 align-items-center col-4 h-25">
        <div class="col-auto">
          <label for="hozori" class="col-form-label small ">مدت زمان هر وقت حضوری شما؟</label>
        </div>
        <div class="col-2">
        <input type="password" id="hozori" class="form-control" aria-describedby="passwordHelpInline"></input>
        </div>
        </div>

        <div class="row">
          <div class="cal-3">j</div>
          <label for="hozori" class="col-form-label">مدت زمان هر وقت حضوری؟</label>
          <input type="text ratio" class="form-control" id="hozori" style={{ borderRadius: 100 }}></input>
        </div>

        <div>مدت زمان وقت مجازی شما؟
      <input></input>
        </div>
        <DatePicker></DatePicker>
        
        {/* <div class="row">
      
        {/* "calc(1em + 0.1vw)" */}
        {/* <h3 class="col-2" */}
        {/* //  style={{fontSize:"calc(0.8em + 0.1vw)"}}
//          >مدت زمان وقت مجازی شما چه قدر می باشد ؟؟؟</h3> */}
        {/* //          <h3> HI </h3>
//         <div class="col-6 me-n5" style={{backgroundColor:"blue"}}> jj</div>
//         </div> */}
        {/* // <div>dfkdflkdf;lkj</div> */}

      </div>


    )
}
export default Doctorcalender;