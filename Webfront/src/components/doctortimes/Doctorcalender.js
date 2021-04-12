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

function Doctorcalender() {
  const [hozoris, sethozoris] = useState(["8:00","10:00","8:00","10:00","8:00","10:00","8:00","10:00","8:00","10:00"]);
  const [magazis, setmagazis] = useState(["12:00,14:00,16:00,16:20"]);
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
  return (
    <div >
      <Navbar></Navbar>
      {/* وقت absolute dige flex end o ina taghiri ijad na */}
      {/* <div class="d-flex flex-row col-10 col-sm-2 mt-5" style={{justifyContent:"flex-end"}}> */}

      <div class="d-flex p-2 flex-row-reverse bd-highlight" style={{ backgroundColor: "white" }}>
        {/* hi */}
        {/* //bein md , sm خیلی فاصله */}
        {/* // // col-xl-6 cl-xxl-6 col-lg-6 col-md-6 col-sm-auto */}
        <div class="order-5-lg d-flex flex-row mt-sm-5 mt-lg-5 mt-xl-5 mt-xxl-5 mt-md-5 col-xl-6 col-xxl-6 col-lg-6 col-md-7 col-sm-auto responsive-calendar"
          style={{ borderWidth: 20, padding: 1, borderRadius: 10, justifyContent: "flex-end", borderColor: "lightskyblue", backgroundColor: "lightskyblue" }}>
          {/* <div style={{justifyItems:"center",backgroundColor:"green"}}> */}
          {/* <div style={{alignSelf:"flex-start",alignItems:"flex-start",justifySelf:"flex-start",justifyItems:"flex-start",justifySelf:"flex-start"}}>
          hiii
        </div> */}
          {/* marginRight:"21.9vw" */}

          <div class="d-flex flex-column ms-lg-4 ms-md-5 align-items-center justify-content-center">
            <div class="row  align-items-center col-auto">
              <div class="col-auto">
                <label for="hozori" class="col-auto ms-n3 sessionstimee ">مدت زمان هر وقت حضوری شما؟</label>
              </div>
              {/* class="col-2 me-n3 " */}
              <div class=" col-auto row"
              // style={{height:"clamp(10px,4vh,60px)" , width:"clamp(20px,4.5vw,40px)",borderRadius:100,backgroundColor:"white"}} 
              >
                {/* //width toye screen bozorg yeho ziadi ziad vali height taghriban hammon */}
                {/* نوشته ی توش ریسپانسیو کوچیک نمیشه */}
                <input id="hozori" class="col-auto" class="form-control" style={{ height: "clamp(10px,4.5vh,65px)", width: "clamp(20px,5.5vw,45px)", borderRadius: 100, backgroundColor: "white" }} aria-describedby="passwordHelpInline"></input>
              </div>
            </div>
            <div class="shadow-3 mt-4" style={{}}>
              <TextField
                id="outlined-textarea"
                label="بازه های نوبت های حضوری شما"
                placeholder="8-10 10/30-11/30"
                multiline
                variant="outlined"
              />

            </div>
            <Button class="btn btn-primary btn-sm mb-n1" style={{ position: "relative", backgroundColor: "primary", borderColor: "lightgreen", justifySelft: "flex-start" }}>تایید</Button>
            <div class="row   align-items-center col-auto mt-4 ">
              <div class="col-auto">
                <label for="hozori" class="col-auto ms-n3 sessionstimee ">مدت زمان هر وقت مجازی شما؟</label>
              </div>
              {/* class="col-2 me-n3 " */}
              <div class=" col-auto row"
              // style={{height:"clamp(10px,4vh,60px)" , width:"clamp(20px,4.5vw,40px)",borderRadius:100,backgroundColor:"white"}} 
              >
                {/* //width toye screen bozorg yeho ziadi ziad vali height taghriban hammon */}
                {/* نوشته ی توش ریسپانسیو کوچیک نمیشه */}
                <input id="hozori" class="col-auto" class="form-control" style={{ height: "clamp(10px,4.5vh,65px)", width: "clamp(20px,5.5vw,45px)", borderRadius: 100, backgroundColor: "white" }} aria-describedby="passwordHelpInline"></input>
              </div>
            </div>
            <div class="shadow-3 mt-4" style={{}}>
              <TextField
                id="outlined-textarea"
                // lang="fa"
                label="بازه های نوبت های مجازی شما"
                placeholder="8-10 10/30-11/30"
                multiline
                variant="outlined"
              />

            </div>
            <Button class="btn btn-primary btn-sm mb-0" style={{ position: "relative", backgroundColor: "primary", borderColor: "lightgreen", justifySelft: "flex-start" }}>تایید</Button>

          </div>





          <div class="" style={{}}>
            <Calendar

              // backgroundColor="green"
              // theme="dark"
              // background-image="blue"
              // style={{ backgroundColor: "green" }}

              shouldHighlightWeekends="true"
              calss="shadow-0 justify-content-center"
              colorPrimary="#0fbcf9"
              colorPrimaryLight="rgba(75, 207, 250, 0.4)"
              calendarClassName="responsive-calendar"
              value={selectedDayRange}
              onChange={
                (value) => calenderchange(value)

              }
              // shouldHighlightWeekends
              locale="fa" // add this
            />
          </div>

          {/* </div> */}
        </div>

       <div class="" style={{marginLeft:"2vw"}} ></div>
        <div class="p-3 d-flex col-lg-4 col-xl-4 col-sm-4 col-xxl-4 col-md-4 flex-column border
         mt-sm-5 mt-lg-5 mt-xl-5 mt-xxl-5 mt-md-5   ms-sm-5 ms-lg-5 ms-xl-5 ms-xxl-5 ms-md-5
         ms-sm-n2 ms-lg-n2 ms-xl-n2 ms-xxln25 ms-md-n2
         " style={{ borderRadius:10 }}>
          <div class="border mb-3 p-2" style={{height:"26.5vh"}}>
          {hozoris.map((val)=>(
            <Button type="button" class="btn btn-primary btn-sm col-2" style={{margin:3}}>{val}</Button>
          ))}
         
          </div>
          
          <div class="border p-2"  style={{height:"26.5vh"}}>
          {magazis.map((val)=>(
            <Button type="button" class="btn btn-primary btn-sm col-2" >{val}</Button>
          ))}
          </div>



        </div>


      </div>
      {/* <h1> سلام</h1>
      
      <p className="sessionstime">
        برای انتخاب وقت های حضوری و یا مجازی خود ابتدا روز مورد نظر خود را از روی تقویم انتخاب کرده و سپس بازه ی زمانی ای که در آن میتوانید نوبت حضوری داشته باشید را در کادر بازه های نوبت حضوری و مدت زمانی را که میتونید در آن وقت مجازی داشته باشید در کادر بازه های نوبت مجازی وارد کنید
        </p> */}

      {/* <div class="col-6 row-6" style={{ backgroundColor: "white", height: 300 }}>h </div> */}
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
          <input id="hozori" class="col-auto" class="form-control" style={{ height: "clamp(10px,4.5vh,65px)", width: "clamp(20px,5.5vw,45px)", borderRadius: 100, backgroundColor: "white" }} aria-describedby="passwordHelpInline"></input>
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
          <input id="hozori" class="col-auto" class="form-control" style={{ height: "clamp(10px,4.5vh,65px)", width: "clamp(20px,5.5vw,45px)", borderRadius: 100, backgroundColor: "white" }} aria-describedby="passwordHelpInline"></input>
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