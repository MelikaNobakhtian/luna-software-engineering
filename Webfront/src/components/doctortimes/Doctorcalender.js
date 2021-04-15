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
import { AiFillMinusCircle } from "react-icons/ai";


//  بعدا بین md , sm هم فرق و تقویم نشون
function Doctorcalender() {
  const [hozoris, sethozoris] = useState([{ id: 0, time: "8:00" }, { id: 1, time: "8:20" }, { id: 2, time: "8:30" }, { id: 3, time: "9:00" }, { id: 4, time: "10:00" }, { id: 5, time: "11:00" }, { id: 6, time: "12:00" }, { id: 7, time: "13:00" }, { id: 8, time: "14:00" }]);
  const [magazis, setmagazis] = useState([{ id: 0, time: "8:00" }, { id: 1, time: "8:20" }]);
  const [tmagazi, settmagazi] = useState("");
  const [hfields, sethfields] = useState([{ start: "", startt: "", end: "", endd: "" }])
  const [mfields, setmfields] = useState([{ start: "", startt: "", end: "", endd: "" }])
  const handlehstartchange = (index, event) => {
    const values=[...hfields];
    values[index][event.target.name]=event.target.value;
    sethfields(values);
    // console.log(index + " index")
    // console.log(event.target.name + "fs;kdhf")
    // console.log(event + " event")
  }
  const handleaddhfield=()=>{
    sethfields([...hfields,{ start: "", startt: "", end: "", endd: "" }]);
  }
  const handleremovehfield=(index)=>{
    
   if(hfields.length>1){   
    const values=[...hfields];
    values.splice(index,1);
    sethfields(values);
   }
    

  }

  const handlemstartchange = (index, event) => {
    const values=[...mfields];
    values[index][event.target.name]=event.target.value;
    setmfields(values);
   
  }

  const handleaddmfield=()=>{
    setmfields([...mfields,{ start: "", startt: "", end: "", endd: "" }]);
  }
  const handleremovemfield=(index)=>{
     if(mfields.length>1){
    const values=[...mfields];
    values.splice(index,1);
    setmfields(values);
     }

  }

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

      <div class="d-flex p-2 flex-md-row flex-column col-11 my-1 mx-auto bd-highlight  mt-md-3 mt-2" style={{ backgroundColor: "white", alignSelf: "center" }}>
        <div class="order-md-1 order-2 col-lg-7 col-md-7 col-sm-12 col-12" style={{ backgroundColor: "white" }}>
          <div>
            {/* بین col-md , col-sm   نشون که بشه تقویم هم جا داد */}
            <div class="d-flex flex-column flex-lg-row  flex-md-column flex-sm-row flex-column align-items-start  col-sm-auto col-9">


              <div class="row  align-items-center col-auto ms-4">
                <div class="col-auto">
                  <label for="hozori" class="col-auto ms-n3 sessionstimee ">مدت زمان هر وقت حضوری شما؟</label>
                </div>
                {/* class="col-2 me-n3 " */}
                <div class=" col-auto row align-items-center"
                // style={{height:"clamp(10px,4vh,60px)" , width:"clamp(20px,4.5vw,40px)",borderRadius:100,backgroundColor:"white"}} 
                >
                  {/* //width toye screen bozorg yeho ziadi ziad vali height taghriban hammon */}
                  {/* نوشته ی توش ریسپانسیو کوچیک نمیشه */}
                  <input id="hozori" class="col-auto" class="form-control" style={{ height: "clamp(10px,4.5vh,65px)", width: "clamp(45px,5.5vw,45px)", borderRadius: 100, backgroundColor: "white" }} aria-describedby="passwordHelpInline"></input>
                </div>
              </div>

              {/* تا sm */}
              {/* <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel" style={{ backgroundColor: "lightblue" }}>
                <div class="carousel-inner"> */}
              <div>
                {hfields.map((hfield, index) => (
                  <div key={index} >
                    <div class="carousel-item-active d-block d-flex flex-row mt-lg-0 mt-md-3 mt-sm-0 mt-3 align-items-center ">
                      <BsPlusCircleFill onClick={()=>handleaddhfield()} class="min-vw-20 min-vh-20 ms-2 " style={{ height: "clamp(30px,10vh,30px)", width: "clamp(30px,10vw,30px)" }}></BsPlusCircleFill>
                    <AiFillMinusCircle onClick={()=>handleremovehfield(index)}></AiFillMinusCircle>
                      <div class="input-group   input-group-sm " dir="ltr">
                        <input type="number" name="start" value={hfield.start} onChange={(event) => handlehstartchange(index, event)}
                          class="form-control " placeholder="8" aria-label="Username"></input>
                        <span class="input-group-text">:</span>
                        <input type="number" name="startt" value={hfield.startt} onChange={(event) => handlehstartchange(index, event)}
                          class="form-control" placeholder="00" aria-label="Server"></input>
                        <span class="input-group-text">-</span>
                        <input type="numebr" name="end" value={hfield.end} onChange={(event) => handlehstartchange(index, event)}
                          class="form-control" placeholder="8" aria-label="Username"></input>
                        <span class="input-group-text">:</span>
                        <input type="number" name="endd" value={hfield.endd} onChange={(event) => handlehstartchange(index, event)}
                          class="form-control" placeholder="30" aria-label="Server"></input>
                      </div>
                    </div>
                  </div>
                ))}

              </div>

              {/* </div> */}
              {/* <button class="carousel-control-prev " type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                  </button>
                  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                  </button> */}
              {/* </div> */}


            </div>
            <div class="p-3 border d-flex col-sm-auto col-12 flex-column border
             mt-4 overflow-auto 
         
         " style={{ borderRadius: 10, backgroundColor: "white", height: "30vh" }}>

              <div class=" " style={{ height: "26.5vh" }}>
                {magazis.map((val) => {

                  {/* const [buttoncolor,setbuttoncolor]=useState("#53BC48"); */ }
                  return (<Button type="button" class="btn btn-success btn-sm col-2" data-bs-toggle="button"
                    onClick={(val) => {
                      sessionchange(val.id);
                      // setbuttoncolor("red")
                    }}
                    style={{ margin: 3, backgroundColor: "green" }}>{val.time}</Button>
                  )
                })}


              </div>
            </div>

            <div class="d-flex flex-column flex-lg-row  flex-md-column flex-sm-row flex-column col-sm-auto col-9 align-items-start mt-3 ">


              <div class="row  align-items-start col-auto ms-4">
                <div class="col-auto">
                  <label for="hozori" class="col-auto ms-n3 sessionstimee ">مدت زمان هر وقت مجازی شما؟</label>
                </div>
                {/* class="col-2 me-n3 " */}
                {/* algin item mishe bardashte baraye balayi ham */}
                <div class=" col-auto row algin-items-center"
                // style={{height:"clamp(10px,4vh,60px)" , width:"clamp(20px,4.5vw,40px)",borderRadius:100,backgroundColor:"white"}} 
                >
                  {/* //width toye screen bozorg yeho ziadi ziad vali height taghriban hammon */}
                  {/* نوشته ی توش ریسپانسیو کوچیک نمیشه */}
                  <input id="hozori" class="col-auto" class="form-control" style={{ height: "clamp(10px,4.5vh,65px)", width: "clamp(45px,5.5vw,45px)", borderRadius: 100, backgroundColor: "white" }} aria-describedby="passwordHelpInline"></input>
                </div>
              </div>

              {/* تا sm */}
              <div>  
              {mfields.map((mfield, index) => (
                  <div key={index} >
              <div class="d-block d-flex flex-row mt-lg-0 mt-md-3 mt-sm-0 mt-3 align-items-center ">
                <BsPlusCircleFill onClick={()=>handleaddmfield()} class="min-vw-20 min-vh-20 ms-2 " style={{ height: "clamp(30px,10vh,30px)", width: "clamp(30px,10vw,30px)" }}></BsPlusCircleFill>
                <AiFillMinusCircle onClick={()=>handleremovemfield(index)}></AiFillMinusCircle>
                <div class="input-group   input-group-sm " dir="ltr">
                  <input type="number" name="start" value={mfield.start} onChange={(event) => handlemstartchange(index, event)}
                    class="form-control " placeholder="8" aria-label="Username"></input>
                  <span class="input-group-text">:</span>
                  <input type="number" name="startt" value={mfield.startt} onChange={(event) => handlemstartchange(index, event)}
                    class="form-control" placeholder="00" aria-label="Server"></input>
                  <span class="input-group-text">-</span>
                  <input type="numebr" name="end" value={mfield.end} onChange={(event) => handlemstartchange(index, event)}
                    class="form-control" placeholder="8" aria-label="Username"></input>
                  <span class="input-group-text">:</span>
                  <input type="number" name="endd" value={mfield.endd} onChange={(event) => handlemstartchange(index, event)}
                    class="form-control" placeholder="30" aria-label="Server"></input>
                </div>
              </div>
              </div>))}
              </div>
              


            </div>

            <div class="p-3 border d-flex  col-sm-auto col-12 flex-column border
            mt-4 overflow-auto 
         
         " style={{ borderRadius: 10, backgroundColor: "white", height: "30vh" }}>

              <div class=" " style={{ height: "26.5vh" }}>
                {magazis.map((val) => {

                  {/* const [buttoncolor,setbuttoncolor]=useState("#53BC48"); */ }
                  return (<Button type="button" class="btn btn-success btn-sm col-2" data-bs-toggle="button"
                    onClick={(val) => {
                      sessionchange(val.id);
                      // setbuttoncolor("red")
                    }}
                    style={{ margin: 3, backgroundColor: "green" }}>{val.time}</Button>
                  )
                })}


              </div>
            </div>








          </div>

        </div>
        {/* justifu nemishod baraye hamin ms me */}
        {/* engar chon toye flex */}
        {/* dir="ltr-md rtl" nemishe */}
        {/* cal age andaze width calendar mishe ms auto */}
        <div class="order-md-2 mb-lg-auto mb-3 order-1 col-auto me-md-auto   " style={{
          backgroundColor: "white"
          // ,position:"absolute",justifyContent:"flex-end"
          // justify-content: flex-end !important;
        }}>

          {/* <div class="border rounded-3 shadow-3 col-auto w-auto h-auto "> */}
          <Calendar

            // backgroundColor="green"
            // theme="dark"
            // background-image="blue"

            style={{ borderColor: "green" }}
            // style={{marginLeft:100}}

            shouldHighlightWeekends="true"
            calss="mb-3"
            borderColor="green"
            colorPrimary="#0fbcf9"
            calendarTodayClassName="custom-today-day"
            colorPrimaryLight="rgba(75, 207, 250, 0.4)"
            calendarClassName="responsive-calendar custom-calendar"
            value={selectedDayRange}
            onChange={
              (value) => calenderchange(value)

            }
            // shouldHighlightWeekends
            locale="fa" // add this
          />
          {/* </div> */}
        </div>



      </div>



    </div>



  )
}
export default Doctorcalender;