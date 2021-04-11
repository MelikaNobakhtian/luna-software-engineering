import React , {useState} from "react";
import { render } from "react-dom";
 import {RangeDatePicker  } from "jalali-react-datepicker";
import { RestaurantMenu } from "@material-ui/icons";
import moment from 'moment-jalaali'
// import DatePicker from 'react-datepicker2';
import Navbar from "../../Navbar"
import "./Doctortimes.css";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import DatePicker, { Calendar } from "react-modern-calendar-datepicker";
import { Toast, Button, Form, FormGroup, Label, input, FormText, Col, InputGroup } from 'react-bootstrap';

function Doctorcalender() {
  const [selectedDayRange, setSelectedDayRange] = useState({
    from: null,
    to: null
  });
  return (
    <div >
      <Navbar></Navbar>
      {/* وقت absolute dige flex end o ina taghiri ijad na */}
      {/* <div class="d-flex flex-row col-10 col-sm-2 mt-5" style={{justifyContent:"flex-end"}}> */}

      <div class="d-flex p-2 flex-row-reverse  bd-highlight mt-1" style={{backgroundColor:"blue"}}>
      hi
      <div  class="order-5-lg ms-5-lg">
        <Calendar
        calendarClassName="responsive-calendar" 
       value={selectedDayRange}
      onChange={setSelectedDayRange}
      // shouldHighlightWeekends
      locale="fa" // add this
    />
    </div>
    </div>
      {/* <h1> سلام</h1>
      
      <p className="sessionstime">
        برای انتخاب وقت های حضوری و یا مجازی خود ابتدا روز مورد نظر خود را از روی تقویم انتخاب کرده و سپس بازه ی زمانی ای که در آن میتوانید نوبت حضوری داشته باشید را در کادر بازه های نوبت حضوری و مدت زمانی را که میتونید در آن وقت مجازی داشته باشید در کادر بازه های نوبت مجازی وارد کنید
        </p> */}
 
        <div class="col-6 row-6" style={{backgroundColor:"lightgreen",height:300}}>h </div>
      <div class="row me-0 ms-0 align-items-center col-auto ">
        <div class="col-auto">
          <label for="hozori" class="col-auto ms-n3 sessionstime ">مدت زمان هر وقت حضوری شما؟</label>
        </div>
        {/* class="col-2 me-n3 " */}
        <div class=" col-auto row" 
        // style={{height:"clamp(10px,4vh,60px)" , width:"clamp(20px,4.5vw,40px)",borderRadius:100,backgroundColor:"white"}} 
        >
        {/* //width toye screen bozorg yeho ziadi ziad vali height taghriban hammon */}
        {/* نوشته ی توش ریسپانسیو کوچیک نمیشه */}
        <input  id="hozori" class="col-auto" class="form-control" style={{height:"clamp(10px,4.5vh,65px)" , width:"clamp(20px,5.5vw,45px)",borderRadius:100,backgroundColor:"white"}} aria-describedby="passwordHelpInline"></input>
        </div>
        </div>

        <div class="row me-0 ms-0 align-items-center col-auto mt-4 ">
        <div class="col-auto">
          <label for="hozori" class="col-auto ms-n3 sessionstime ">مدت زمان هر وقت مجازی شما؟</label>
        </div>
        {/* class="col-2 me-n3 " */}
        <div class=" col-auto row" 
        // style={{height:"clamp(10px,4vh,60px)" , width:"clamp(20px,4.5vw,40px)",borderRadius:100,backgroundColor:"white"}} 
        >
        {/* //width toye screen bozorg yeho ziadi ziad vali height taghriban hammon */}
        {/* نوشته ی توش ریسپانسیو کوچیک نمیشه */}
        <input  id="hozori" class="col-auto" class="form-control" style={{height:"clamp(10px,4.5vh,65px)" , width:"clamp(20px,5.5vw,45px)",borderRadius:100,backgroundColor:"white"}} aria-describedby="passwordHelpInline"></input>
        </div>
        </div>

        {/* <div >
          <div class="cal-3">j</div>
          <label for="hozori" class="col-form-label">مدت زمان هر وقت حضوری؟</label>
          <input type="text ratio" class="form-control" id="hozori" style={{ borderRadius: 100 }}></input>
        </div>

        <div>مدت زمان وقت مجازی شما؟
      <input></input>
        </div> */}
        {/* <div class="d-flex p-2 bd-highlight" style={{position:"absolute", alignSelf:"flex-start",justifySelf:"flex-end",backgroundColor:"blue"}}> */}
       
        <RangeDatePicker></RangeDatePicker>
        {/* </div> */}
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