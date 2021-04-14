import React, { useState } from "react";
import { render } from "react-dom";
import { RangeDatePicker } from "jalali-react-datepicker";
import { RestaurantMenu } from "@material-ui/icons";
import moment from 'moment-jalaali'
// import DatePicker from 'react-datepicker2';
import Navbar from "../../Navbar"
import "./Doctortimes.css";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import DatePicker, { Calendar } from "react-modern-calendar-datepicker";
import { Toast, Button, Form, FormGroup, Label, input, FormText, Col, InputGroup } from 'react-bootstrap';
import TextField from '@material-ui/core/TextField';
import { BsPlusCircleFill } from "react-icons/bs";

function Doctorcalender() {
  const [hozoris, sethozoris] = useState([{ id: 0, time: "8:00" }, { id: 1, time: "8:20" }, { id: 2, time: "8:30" }, { id: 3, time: "9:00" }, { id: 4, time: "10:00" }, { id: 5, time: "11:00" }, { id: 6, time: "12:00" }, { id: 7, time: "13:00" }, { id: 8, time: "14:00" }]);
  const [magazis, setmagazis] = useState([{ id: 0, time: "8:00" }, { id: 1, time: "8:20" }]);
  const [tmagazi, settmagazi] = useState("");
  const [selectedDayRange, setSelectedDayRange] = useState({
    from: null,
    to: null
  });
  const calenderchange = (value) => {
    console.log("hi")
    console.log(value + "value")
    console.log(value.from.year + "year" + value.from.month + "month" + value.from.day + " _ " + value.to)
    setSelectedDayRange(value)
  }
  const [value, setValue] = React.useState('Controlled');

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const sessionchange = (index) => {
    console.log("request back")
  }
  return (
    <div >
      <Navbar></Navbar>
      {/* وقت absolute dige flex end o ina taghiri ijad na */}
      {/* <div class="d-flex flex-row col-10 col-sm-2 mt-5" style={{justifyContent:"flex-end"}}> */}

      <div class="d-flex p-2 flex-row col-11 my-1 mx-auto bd-highlight justify-self-center mt-5 mt-md-5" style={{ backgroundColor: "lightblue", alignSelf: "center" }}>
       <div>
        <div class="d-flex flex-column flex-sm-row col-lg-7  col-md-9 col-sm-11 col-9">


          <div class="row  align-items-center col-auto ms-4">
            <div class="col-auto">
              <label for="hozori" class="col-auto ms-n3 sessionstimee ">مدت زمان هر وقت حضوری شما؟</label>
            </div>
            {/* class="col-2 me-n3 " */}
            <div class=" col-auto row"
            // style={{height:"clamp(10px,4vh,60px)" , width:"clamp(20px,4.5vw,40px)",borderRadius:100,backgroundColor:"white"}} 
            >
              {/* //width toye screen bozorg yeho ziadi ziad vali height taghriban hammon */}
              {/* نوشته ی توش ریسپانسیو کوچیک نمیشه */}
              <input id="hozori" class="col-auto" class="form-control" style={{ height: "clamp(10px,4.5vh,65px)", width: "clamp(45px,5.5vw,45px)", borderRadius: 100, backgroundColor: "white" }} aria-describedby="passwordHelpInline"></input>
            </div>
          </div>

             {/* تا sm */}
         <div class="d-flex flex-row mt-sm-0 mt-3">
          <BsPlusCircleFill class="min-vw-20 min-vh-20 ms-2 " style={{height:"clamp(30px,10vh,30px)",width:"clamp(30px,10vw,30px)"}}></BsPlusCircleFill>

          <div class="input-group   input-group-sm " dir="ltr">
            <input type="number" class="form-control " placeholder="8" aria-label="Username"></input>
            <span class="input-group-text">:</span>
            <input type="number" class="form-control" placeholder="00" aria-label="Server"></input>
            <span class="input-group-text">-</span>
            <input type="numebr" class="form-control" placeholder="8" aria-label="Username"></input>
            <span class="input-group-text">:</span>
            <input type="number" class="form-control" placeholder="30" aria-label="Server"></input>
          </div>
          </div>
         

        </div>
        <div class="p-3 d-flex col-5 flex-column border
        mt-4
         
         " style={{ borderRadius: 10 ,backgroundColor:"cyan"}}></div>

       



      </div>
      </div>



    </div>


  )
}
export default Doctorcalender;