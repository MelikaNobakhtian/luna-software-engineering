import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { RangeDatePicker } from "jalali-react-datepicker";
import { RestaurantMenu, TimeToLeave } from "@material-ui/icons";
import moment from 'moment-jalaali'
// import DatePicker from 'react-datepicker2';
import Navbar from "../../Navbar"
import "./Doctortimes.css";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import DatePicker, { Calendar, utils } from "react-modern-calendar-datepicker";
import { Toast, Button, Form, FormGroup, Label, input, FormText, Col, InputGroup } from 'react-bootstrap';
import TextField from '@material-ui/core/TextField';
import { BsPlusCircleFill } from "react-icons/bs";
import { AiFillMinusCircle } from "react-icons/ai";
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import randomColor from "randomcolor";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../apiConstant/apiConstant";
import axios from "axios";
import { duration } from "@material-ui/core";

//یا همه ی موارد ولی ربای حذف یا یه چیز جدا
//  بعدا بین md , sm هم فرق و تقویم نشون
function Doctorcalender() {
  const [hozoris, sethozoris] = useState([]);
  const [magazis, setmagazis] = useState([]);
  const [tmagazi, settmagazi] = useState("");
  const [hfields, sethfields] = useState([{ start: "", startt: "", end: "", endd: "" }])
  const [mfields, setmfields] = useState([{ start: "", startt: "", end: "", endd: "" }])
  const [hduration, sethduration] = useState("");
  const [mduration, setmduration] = useState("");
  const [hmhconflictmessage, sethmhconflictmessage] = useState(undefined);
  const [hmmconflictmessage, sethmmconflictmessage] = useState(undefined);
  const [emptyhduration, setemptyhduration] = useState(undefined);
  const [emptymduration, setemptymduration] = useState(undefined);
  const [selecteddate, setselecteddate] = useState("");
  const [col, setcol] = useState(randomColor())
  //az get
  const [addressid, setaddressid] = useState(1);

  const [openSnack, setOpenSnack] = useState(false);
  const [add, setadd] = useState({ address: "... برای آدرس", addressnumber: "" });
  const [haddresses, sethaddresses] = useState([{ add1: "همه ی آدرس ها ( برای حذف )" }, { add1: "آدرس 1" }
    , { add1: "آدرس 2" }]);
  const [durationmode, setdurationmode] = useState([{ name: "همه ی بازه های زمانی ( برای حذف )", duration: "all" }, { name: "وقت عادی", duration: hduration, color: "#008F81" }])
  const [dm, setdm] = useState("_");
  const [dmdur, setdmdur] = useState("");
  const [selectedduration, setselectedduration] = useState({ name: "وقت عادی", duration: hduration, color: "#008F81" })
  const [dmhdur, setdmhdur] = useState("");
  const [snackbarerror, setsnackbarerror] = useState("");



  useEffect(() => {
    var doctorid = Cookies.get("doctorid");
    axios.get(API_BASE_URL + "/appoinment/" + doctorid + "/")
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);



  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };
  const handlehstartchange = (index, event) => {
    const values = [...hfields];
    values[index][event.target.name] = event.target.value;
    sethfields(values);
    // console.log(index + " index")
    // console.log(event.target.name + "fs;kdhf")
    // console.log(event + " event")
  }


  const checkforhmconflict = (horm) => {

  }
  const sendmagazis = () => {

    if (selecteddate === "") {
      // setemptymduration(undefined)
      setsnackbarerror("لطفاابتدا تاریخ مورد نظر خود را مشخص نمایید")
      setOpenSnack(true);
    }
    var values = [];
    var doctorid = Cookies.get("doctorId");
    console.log(doctorid + " doctorid");

    for (var i = 0; i < magazis.length; i++) {
      var start = selecteddate + " " + magazis[i].time
      values.push({ duration: mduration, start_datetime: start, doc_id: doctorid });
    }
    console.log(values)
    console.log(" all the magazis values :)")

    axios.post(API_BASE_URL + "/appoinment/" + doctorid + "/online/", JSON.stringify(values), {
      headers: { "content-type": "application/json" },
    })
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error);
      });


  }
  const sendhozori = () => {
    if (selecteddate === "") {
      // setemptymduration(undefined)
      setsnackbarerror(" لطفا ابتدا تاریخ مورد نظر خود را مشخص نمایید")
      setOpenSnack(true);
    }
    var values = [];
    var doctorid = Cookies.get("doctorId");
    console.log(hozoris);
    for (var i = 0; i < hozoris.length; i++) {
      var start = selecteddate + " " + hozoris[i].time
      values.push({
        duration: hozoris[i].duration, start_datetime: start, doc_id: doctorid,
        address_id: addressid, time_type: hozoris[i].durationname, address_number: hozoris[i].addressnumber,
        durationnumber: hozoris[i].durationnumber
      });
    }
    console.log(values)
    console.log(" all the magazis values :)")

    axios.post(API_BASE_URL + "/appoinment/" + doctorid + "/online/", JSON.stringify(values), {
      headers: { "content-type": "application/json" },
    })
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error);
      });

  }
  const handleaddhfield = () => {
    if (hduration === "") {
      if (add.address === "... برای آدرس") {
        setemptymduration(undefined)
        setemptyhduration("لطفا فیلد مربوط به مدت زمان و آدرس هر وقت حضوری را پر کنید")
        setOpenSnack(true);
      }
      else {
        setemptymduration(undefined)
        setemptyhduration("لطفا فیلد مربوط به مدت زمان هر وقت حضوری خود را پر کنید")
        setOpenSnack(true);
      }
    }
    else if (add.address === "... برای آدرس") {
      setemptymduration(undefined)
      setemptyhduration("لطفا آدرس مورد نظر برای هر وقت حضوری را اتخاب کنید")
      setOpenSnack(true);
    }


    if (hfields[0].start !== "" && hfields[0].startt !== "" && hfields[0].end !== "" && hfields[0].endd !== "" && hduration !== "" && add.address !== "... برای آدرس") {

      var time = parseInt(hfields[0].start);
      console.log(time + " start")
      var timee = parseInt(hfields[0].startt);
      const endt = parseInt(hfields[0].end);
      const enddt = parseInt(hfields[0].endd)
      //intori toye vaght adi moshkel
      console.log(selectedduration);
      if (selectedduration.name !== "وقت عادی" && selectedduration.name !== "نوع بازه ی زمانی") {
        var duration = parseInt(selectedduration.duration);
      }
      else {
        var duration = parseInt(hduration);
      }

      var values = [...hozoris];
      var finish = false;
      var mend = parseInt(hfields[0].end) + ":" + parseInt(hfields[0].endd);
      //**uniqe boosdan esm ha */
      // var indexof=durationmode.findIndex((element)=>element.duration===duration && element.name===selectedduration.name)
      for (var i = time; !finish; i += (duration / 60)) {
        // var thisindex=hozoris.findIndex((element)=>element.duration=selectedduration.duration&&element.time===time)
        // console.log(thisindex+" this index")
        // if(durationmode.length<=indexof-1){
        //   finish=true;
        //   break;
        // }
        console.log(duration + " duration");
        var check = parseInt(parseInt(duration) + parseInt(timee))
        console.log(check + " CHECKKKKKKK")
        var timecopy = time
        var time2 = check
        console.log(time2 + "time2")
        if (time2 >= 60) {
          var plus = Math.floor(time2 / 60)
          time2 = time2 % 60
          if (time2.toString().length === 1) {
            time2 = "0" + time2;
          }
          console.log(time2 + " time2 2")
          timecopy += plus
        }
        var noww = timecopy + ":" + time2

        var dur = "00:" + duration
        if (moment(noww, "HH:mm").format("HH:mm") > moment(mend, "HH:mm").format("HH:mm")) {
          finish = true;
          break;
        }
        console.log(i + "i")
        console.log("to for")
        if (timee === 0)
          var thenn = time + ":" + timee + "0"
        else
          var thenn = time + ":" + timee
        if (timee >= 60) {
          var plus = Math.floor(timee / 60)
          timee = timee - 60
          time += plus
        }
        if (timee === 0)
          var thistime = time + ":" + timee + "0"
        else
          var thistime = time + ":" + timee
        console.log(hozoris.some(time => (moment(time.time22, "HH:mm").format("HH:mm") < moment(thistime, "HH:mm").format("HH:mm") || moment(time.time, "HH:mm").format("HH:mm") > moment(noww, "HH:mm").format("HH:mm"))) + "somee")
        if (!hozoris.some(time => {
          console.log("++++++++++")
          console.log(time.time22 + " time.time22")
          console.log(time.time + " time.time")
          console.log(thistime + " thistime")
          console.log(noww + " noww");
          console.log("++++++++++")
          //
          return (((moment(noww, "HH:mm").format("HH:mm") > moment(time.time, "HH:mm").format("HH:mm")) && (moment(thistime, "HH:mm").format("HH:mm")) < (moment(time.time22, "HH:mm").format("HH:mm"))) ||
          ((moment(noww, "HH:mm").format("HH:mm") < moment(time.time, "HH:mm").format("HH:mm")) && (moment(thistime, "HH:mm").format("HH:mm")) > (moment(time.time22, "HH:mm").format("HH:mm")))

          )

        }
        )) {
          var finish2 = false;
          var tconflict = "nabood";
          var t2conflict = "nabood";

          if (magazis.some(time => {
            if ((((moment(noww, "HH:mm").format("HH:mm") > moment(time.time, "HH:mm").format("HH:mm")) && (moment(thistime, "HH:mm").format("HH:mm")) < (moment(time.time22, "HH:mm").format("HH:mm"))) ||
              ((moment(noww, "HH:mm").format("HH:mm") < moment(time.time, "HH:mm").format("HH:mm")) && (moment(thistime, "HH:mm").format("HH:mm")) > (moment(time.time22, "HH:mm").format("HH:mm")))
            )) {
              tconflict = time.time;
              t2conflict = time.time22;
              sethmmconflictmessage(undefined)
              sethmhconflictmessage("بازه ی انتخابی شما در ساعت " + " " + t2conflict + "_" + tconflict + " " + "با بازه های مجازی شما تداخل دارد")
              setOpenSnack(true);
              return true;
            }
            else {
              sethmhconflictmessage(undefined);
              return false;
            }
          })) {
            console.log("ERROR ERROR ERROR")
            finish = true;
          }
          else {


            console.log(values)
            console.log(noww + "noww")
            console.log(selectedduration.duration + " selectedduration DURATION")
            if (selectedduration.duration != "") {
              values.push({
                time: thistime, time22: noww, address: add.address, addressnumber: add.addressnumber
                , duration: selectedduration.duration, durationname: selectedduration.name, durationnumber: selectedduration.color
              })
            }
            else {
              console.log(hduration + " HDURATION ")
              values.push({
                time: thistime, time22: noww, address: add.address, addressnumber: add.addressnumber
                , duration: hduration, durationname: selectedduration.name, durationnumber: selectedduration.color
              })
            }
            console.log(thistime + " thistime")
            console.log(values)
          }

        }
        else {
          console.log("boodesh")

        }
        console.log(parseInt(duration + timee) + " parseInt")
        timee = parseInt(duration + timee)
        var now = time + ":" + timee

      }

      sethozoris(values)
      // sethfields([...hfields,{ start: "", startt: "", end: "", endd: "" }]);
    }
  }
  const handleremovehfield = (index) => {

    if (hfields[0].start !== "" && hfields[0].startt !== "" && hfields[0].end !== "" && hfields[0].endd !== "") {

      var time = parseInt(hfields[0].start);
      console.log(time + " start")
      var timee = parseInt(hfields[0].startt);
      const endt = parseInt(hfields[0].end);
      const enddt = parseInt(hfields[0].endd)
      //الان selected duration در هر حال داریم ولی نباید داشته باشیم به نظرم
      //اگه سلکتد دیوریشن هم انتخاب کرده بود بیاد اونایی که انتخاب کرده رو پاک کنه
      //باید حالت دیفالتش همون وقت عادی باشه ولی برای حذف کردن یه گزینه ی جدید داشته باشیم که میخواد این همرو با هم پاک کنه چون برای اد به یه حالت دیفالت نیاز داریم 
      //الان فرض فقط یه مدل دیوریشن رو حذف میکنه


      var values = [...hozoris];
      var finish = false;

      if (enddt.toString().length === 1)
        var mend = endt + ":" + "0" + enddt
      else
        var mend = endt + ":" + enddt
      console.log(enddt + " " + enddt.toString().length + " lenght")
      // if (selectedduration.duration != "all") {
        

        // if (selectedduration.duration === "") {
        //   var duration = parseInt(hduration);
        // }
        // else {

        //   var duration = parseInt(selectedduration.duration);
        // }
        // console.log(duration + " duration")
        // // var mend=parseInt(hfields[0].end)+":"+parseInt(hfields[0].endd);
        // for (var i = time; !finish; i += (duration / 60)) {

        //   if (timee.toString().length === 1)
        //     var thistime = time + ":" + "0" + timee
        //   else
        //     var thistime = time + ":" + timee

        //   //   var thisbuttonindex= hozoris.findIndex((element) =>    
        //   //    { 
        //   //      console.log(element.time+" time shoro")
        //   //      console.log(thistime+" time shoro")
        //   //      console.log(element.duration+" element.duration")
        //   //      console.log(selectedduration.duration +" selectedduration.duration")
        //   //      return(moment(element.time, "HH:mm").format("HH:mm")>=moment(thistime,"HH:mm").format("HH:mm") &&
        //   //      element.duration===selectedduration.duration && 
        //   //      moment(element.time22, "HH:mm").format("HH:mm")<=moment(mend, "HH:mm").format("HH:mm"))
        //   // }
        //   //)


        //   console.log(duration + " duration")
        //   console.log(parseInt(timee) + " timee15435")
        //   var check = parseInt(parseInt(duration) + parseInt(timee))

        //   var timecopy = time
        //   var time2 = check
        //   console.log(time2 + "time2")
        //   if (time2 >= 60) {
        //     console.log(time2 + " check ya time2")
        //     var plus = Math.floor(time2 / 60)
        //     time2 = time2 % 60
        //     if (time2.toString().length === 1) {
        //       time2 = "0" + time2;
        //     }
        //     console.log(time2 + " time 2 badesh")
        //     console.log(time2 + " time2 2")
        //     timecopy += plus
        //     console.log(timecopy + " timecopy")
        //   }
        //   var noww = timecopy + ":" + time2
        //   console.log(noww + " noww")
        //   console.log(mend + " mend")
        //   // var dur = "00:" + duration
        //   if (moment(noww, "HH:mm").format("HH:mm") > moment(mend, "HH:mm").format("HH:mm")) {
        //     finish = true;
        //     break;
        //   }
        //   // console.log(i+"i")
        //   console.log("to for")
        //   //  if(timee===0)
        //   //    var thenn=time+":"+timee+"0"
        //   //   else
        //   //   var thenn=time+":"+timee
        //   //  if(timee>=60){
        //   //    var plus=Math.floor(timee/60)
        //   //    timee=timee-60
        //   //    time+=plus
        //   //  }  
        //   // console.log(hozoris.some(time=>(moment(time.time22,"HH:mm").format("HH:mm")<moment(thistime,"HH:mm").format("HH:mm") || moment(time.time,"HH:mm").format("HH:mm") >moment(noww,"HH:mm").format("HH:mm")))+"somee")

        //   // console.log(values)
        //   // console.log(noww+" noww")
        //   // console.log(thistime+" this time")
        //   // console.log(values)
        //   // console.log("~~~~~~~~~~~~~~~~~~~~")
        //   // return(moment(element.time22,"HH:mm").format("HH:mm")<moment(noww,"HH:mm").format("HH:mm") &&
        //   // moment(element.time,"HH:mm").format("HH:mm")>=moment(thistime,"HH:mm").format("HH:mm"))})
        //   // const index=values.findIndex((element)=>element.time===thistime && element.time22===noww)
        //   const index = values.findIndex((element) => {
        //     console.log(element.time22 + "element time22")
        //     console.log(element.time + "element time")
        //     console.log(noww + " noww")
        //     console.log(thistime + " thistime")
        //     return (moment(element.time22, "HH:mm").format("HH:mm") === moment(noww, "HH:mm").format("HH:mm") &&
        //       moment(element.time, "HH:mm").format("HH:mm") === moment(thistime, "HH:mm").format("HH:mm"))
        //   })
        //   console.log(index)
        //   if (index !== -1) {
        //     // console.log(hozoris[index].duration+" ino")
        //     // if(hozoris[index].duration!==""){
        //     if (parseInt(hozoris[index].duration) === parseInt(duration)) {
        //       console.log(add.address + " add.address")
        //       if (add.address != "همه ی آدرس ها ( برای حذف )") {
        //         if (hozoris[index].address === add.address) {
        //           console.log(" OMAD INJS ")
        //           values.splice(index, 1);
        //         }
        //       }
        //       else {
        //         values.splice(index, 1);
        //       }
        //     }
        //     // }
        //     // else{
        //     //   if(parseInt(hozoris[index].duration)===parseInt(hduration)){
        //     //     console.log(" OMAD INJS ")
        //     //   values.splice(index, 1);
        //     //   }
        //     // } 
        //   }
        //   console.log(hozoris[index])
        //   // console.log(hozoris[index].duration+" hozoris index duration")
        //   console.log(duration + " duration")
        //   sethozoris(values)
        //   // values.push({time:thistime,time22:noww})
        //   console.log(thistime + " thistime")
        //   // console.log(values)
        //   // }
        //   // else
        //   // console.log("boodesh")
        //   console.log(parseInt(duration + timee) + " parseInt")
        //   time = timecopy;
        //   timee = time2;
        //   console.log(time + " THIS " + "time")
        //   console.log(timee + " THIS " + "timee")
        //   var now = timecopy + ":" + time2
        // }


        // sethfields([...hfields,{ start: "", startt: "", end: "", endd: "" }]);
      // }
      // else{
       var values=[...hozoris];
        if (timee.toString().length === 1)
        var thistime = time + ":0" + timee
      else
        var thistime = time + ":" + timee
        console.log(mend+" mend")
      var index=0;
         console.log(hozoris.length+" hozorislenght")
        // var lengthtt=hozoris.length;
        for(var i=0;index<values.length;i++){
         console.log(add)
         console.log(add.address+" add.address")
         console.log(add.addressnumber+" add addressnumber")
        
          if(moment(values[index].time, "HH:mm").format("HH:mm")>=moment(thistime, "HH:mm").format("HH:mm")&&
          moment(values[index].time22, "HH:mm").format("HH:mm")<=moment(mend, "HH:mm").format("HH:mm"))
          {
            console.log(" in if")
            console.log(add.address+" add address")
            console.log(values[index].addressnumber+" hozori address")
           if (selectedduration.duration === "all") {
            if (add.address !== "همه ی آدرس ها ( برای حذف )") {
              console.log(" toye if hameye address ha nist")
              console.log(index+" index")
              console.log(values[index])
              if (values[index].address === add.address) {
                console.log(" mige addressesh hamone")
                values.splice(index, 1);
                 index--;
                // lengthtt--;
                console.log(values)
         
              }
              
            }
            else {
              console.log(" omad toye elese ")
              values.splice(index, 1);
              index--;
              // lengthtt--;
              console.log(values)
         
            }
          }
          else if(values[index].duration===selectedduration.duration){
            if (add.address !== "همه ی آدرس ها ( برای حذف )") {
              console.log(" toye if hameye address ha nist")
              console.log(index+" index")
              console.log(values[index])
              if (values[index].address === add.address) {
                console.log(" mige addressesh hamone")
                values.splice(index, 1);
                 index--;
                // lengthtt--;
                console.log(values)
         
              }
              
            }
            else {
              console.log(" omad toye elese ")
              values.splice(index, 1);
              index--;
              // lengthtt--;
              console.log(values)
         
            }

          }
          }
          index++;
          console.log(i+" i")
         
        }
        sethozoris(values);
      }
    }

  // }

  const handlemstartchange = (index, event) => {
    const values = [...mfields];
    values[index][event.target.name] = event.target.value;
    setmfields(values);

  }

  const handleaddmfield = () => {
    if (mduration === "") {
      setemptyhduration(undefined)
      setemptymduration("لطفا فیلد مربوط به مدت زمان هر وقت مجازی خود را پر کنید")
      setOpenSnack(true);
    }
    if (mfields[0].start != "" && mfields[0].startt != "" && mfields[0].end != "" && mfields[0].endd != "" && mduration != "") {
      var time = parseInt(mfields[0].start);
      console.log(time + " start")
      var timee = parseInt(mfields[0].startt);
      const endt = parseInt(mfields[0].end);
      const enddt = parseInt(mfields[0].endd)
      const duration = parseInt(mduration)

      var values = [...magazis];
      var finish = false;
      var mend = parseInt(mfields[0].end) + ":" + parseInt(mfields[0].endd);
      for (var i = time; !finish; i += (duration / 60)) {
        var check = parseInt(parseInt(duration) + parseInt(timee))
        var timecopy = time
        var time2 = check
        console.log(time2 + "time2")
        if (time2 >= 60) {
          var plus = Math.floor(time2 / 60)
          time2 = time2 % 60
          if (time2.toString().length === 1) {
            time2 = "0" + time2;
          }
          console.log(time2 + " time2 2")
          timecopy += plus
        }
        var noww = timecopy + ":" + time2
        var dur = "00:" + duration
        if (moment(noww, "HH:mm").format("HH:mm") > moment(mend, "HH:mm").format("HH:mm")) {
          finish = true;
          break;
        }
        console.log(i + "i")
        console.log("to for")
        if (timee.toString().length === 1)
          var thenn = time + ":" + "0" + timee
        else
          var thenn = time + ":" + timee
        if (timee >= 60) {
          var plus = Math.floor(timee / 60)
          timee = timee - 60
          time += plus
        }
        if (timee.toString().length === 1)
          var thistime = time + ":" + "0" + timee
        else
          var thistime = time + ":" + timee
        timee = parseInt(duration + timee)
        if (timee >= 60) {
          var plus = Math.floor(timee / 60)
          timee = timee - 60
          time += plus
        }
        if (timee.toString().length === 1)
          var now = time + ":" + "0" + timee
        else
          var now = time + ":" + timee

        console.log(magazis.includes({ time: thistime }, 0) + " include")
        console.log(thistime + " time    ...")
        console.log(now + " timee    ...")
        // !magazis.some(time=>time.time===thistime&&time.time22===now)||
        //overlap nakone
        // console.log(!magazis.some(time=>(!magazis.some((tim)=>moment(tim.time,"HH:mm").format("HH:mm")<(moment(time.time22,"HH:mm").format("HH:mm")<moment(thistime,"HH:mm").format("HH:mm"))) || !magazis.some((tim)=>moment(tim.time22,"HH:mm").format("HH:mm")>(moment(time.time,"HH:mm").format("HH:mm") >moment(now,"HH:mm").format("HH:mm")))))+"somee")
        // if(!magazis.some(time=>(!magazis.some((tim)=>moment(tim.time,"HH:mm").format("HH:mm")<(moment(time.time22,"HH:mm").format("HH:mm")<moment(thistime,"HH:mm").format("HH:mm"))) || !magazis.some((tim)=>moment(tim.time22,"HH:mm").format("HH:mm")>(moment(time.time,"HH:mm").format("HH:mm") >moment(now,"HH:mm").format("HH:mm")))))


        console.log(magazis.some(time => (moment(time.time22, "HH:mm").format("HH:mm") < moment(thistime, "HH:mm").format("HH:mm") || moment(time.time, "HH:mm").format("HH:mm") > moment(noww, "HH:mm").format("HH:mm"))) + "somee")
        if (!magazis.some(time => {
          console.log("+++++")
          console.log(time.time22 + " time.time22")
          console.log(time.time + " time.time")
          console.log(thistime + " thistime")
          console.log(noww + " noww");
          console.log("+++++")
          //yadn chera ----
          //            --- intori moshkel baraye hamin || koli

          // return((moment(time.time22,"HH:mm").format("HH:mm")>moment(thistime,"HH:mm").format("HH:mm") ||
          // moment(time.time,"HH:mm").format("HH:mm")>=moment(noww,"HH:mm").format("HH:mm"))||
          // (moment(time.time22,"HH:mm").format("HH:mm")<=moment(thistime,"HH:mm").format("HH:mm") ||
          // moment(time.time,"HH:mm").format("HH:mm")<moment(noww,"HH:mm").format("HH:mm")))
          return ((moment(noww, "HH:mm").format("HH:mm") > moment(time.time, "HH:mm").format("HH:mm")) && (moment(thistime, "HH:mm").format("HH:mm")) < (moment(time.time22, "HH:mm").format("HH:mm")))


        }
        )) {
          var finish2 = false;
          var tconflict = "nabood";
          var t2conflict = "nabood";

          if (hozoris.some(time => {
            if ((((moment(noww, "HH:mm").format("HH:mm") > moment(time.time, "HH:mm").format("HH:mm")) && (moment(thistime, "HH:mm").format("HH:mm")) < (moment(time.time22, "HH:mm").format("HH:mm"))) ||
              ((moment(noww, "HH:mm").format("HH:mm") < moment(time.time, "HH:mm").format("HH:mm")) && (moment(thistime, "HH:mm").format("HH:mm")) > (moment(time.time22, "HH:mm").format("HH:mm")))
            )) {
              tconflict = time.time;
              t2conflict = time.time22;
              sethmhconflictmessage(undefined)
              sethmmconflictmessage("بازه ی انتخابی شما در ساعت " + " " + t2conflict + "_" + tconflict + " " + "با بازه های حضوری شما تداخل دارد")
              setOpenSnack(true);
              return true;
            }
            else {
              sethmmconflictmessage(undefined)
              return false;
            }
          })) {
            console.log("ERROR ERROR ERROR")
            finish = true;
          }
          else {


            console.log(values)
            console.log(noww + "noww")
            values.push({ time: thistime, time22: noww})
            console.log(thistime + " thistime")
            console.log(values)
          }
        }
        else
          console.log("boodesh")

        console.log(parseInt(duration + timee) + " parseInt")

      }

      setmagazis(values)
    }

  }
  const handleremovemfield = (index) => {
    if (mfields[0].start != "" && mfields[0].startt != "" && mfields[0].end != "" && mfields[0].endd != "" && mduration != "") {
      var time = parseInt(mfields[0].start);
      console.log(time + " start")
      var timee = parseInt(mfields[0].startt);
      const endt = parseInt(mfields[0].end);
      const enddt = parseInt(mfields[0].endd)
      const duration = parseInt(mduration)

      var values = [...magazis];
      var finish = false;

      if (enddt.toString().length === 1)
        var mend = endt + ":" + "0" + enddt
      else
        var mend = endt + ":" + enddt
      console.log(enddt + " " + enddt.toString().length + " lenght")
      // var mend=parseInt(hfields[0].end)+":"+parseInt(hfields[0].endd);
      // for (var i = time; !finish; i += (duration / 60)) {
      //   if (timee.toString().length === 1)
      //     var thistime = time + ":" + "0" + timee
      //   else
      //     var thistime = time + ":" + timee
      //   console.log(duration + " duration")
      //   console.log(parseInt(timee) + " timee15435")
      //   var check = parseInt(parseInt(duration) + parseInt(timee))

      //   var timecopy = time
      //   var time2 = check
      //   console.log(time2 + "time2")
      //   if (time2 >= 60) {
      //     console.log(time2 + " check ya time2")
      //     var plus = Math.floor(time2 / 60)
      //     time2 = time2 % 60
      //     if (time2.toString().length === 1) {
      //       time2 = "0" + time2;
      //     }
      //     console.log(time2 + " time 2 badesh")
      //     console.log(time2 + " time2 2")
      //     timecopy += plus
      //     console.log(timecopy + " timecopy")
      //   }
      //   var noww = timecopy + ":" + time2
      //   console.log(noww + " noww")
      //   console.log(mend + " mend")
      //   var dur = "00:" + duration
      //   if (moment(noww, "HH:mm").format("HH:mm") > moment(mend, "HH:mm").format("HH:mm")) {
      //     finish = true;
      //     break;
      //   }
      //   // console.log(i+"i")
      //   console.log("to for")
      //   //  if(timee===0)
      //   //    var thenn=time+":"+timee+"0"
      //   //   else
      //   //   var thenn=time+":"+timee
      //   //  if(timee>=60){
      //   //    var plus=Math.floor(timee/60)
      //   //    timee=timee-60
      //   //    time+=plus
      //   //  }  
      //   // console.log(hozoris.some(time=>(moment(time.time22,"HH:mm").format("HH:mm")<moment(thistime,"HH:mm").format("HH:mm") || moment(time.time,"HH:mm").format("HH:mm") >moment(noww,"HH:mm").format("HH:mm")))+"somee")

      //   // console.log(values)
      //   // console.log(noww+" noww")
      //   // console.log(thistime+" this time")
      //   // console.log(values)
      //   // console.log("~~~~~~~~~~~~~~~~~~~~")
      //   // return(moment(element.time22,"HH:mm").format("HH:mm")<moment(noww,"HH:mm").format("HH:mm") &&
      //   // moment(element.time,"HH:mm").format("HH:mm")>=moment(thistime,"HH:mm").format("HH:mm"))})
      //   // const index=values.findIndex((element)=>element.time===thistime && element.time22===noww)
      //   const index = values.findIndex((element) => {
      //     console.log(element.time22 + "element time22")
      //     console.log(element.time + "element time")
      //     console.log(noww + " noww")
      //     console.log(thistime + " thistime")
      //     return (moment(element.time22, "HH:mm").format("HH:mm") === moment(noww, "HH:mm").format("HH:mm") &&
      //       moment(element.time, "HH:mm").format("HH:mm") === moment(thistime, "HH:mm").format("HH:mm"))
      //   })
      //   console.log(index)
      //   if (index != -1)
      //     values.splice(index, 1);
      //   setmagazis(values)
      //   // values.push({time:thistime,time22:noww})
      //   console.log(thistime + " thistime")
      //   // console.log(values)
      //   // }
      //   // else
      //   // console.log("boodesh")
      //   console.log(parseInt(duration + timee) + " parseInt")
      //   time = timecopy;
      //   timee = time2;
      //   console.log(time + " THIS " + "time")
      //   console.log(timee + " THIS " + "timee")
      //   var now = timecopy + ":" + time2
      // }


      // sethfields([...hfields,{ start: "", startt: "", end: "", endd: "" }]);
      if (timee.toString().length === 1)
        var thistime = time + ":0" + timee
      else
        var thistime = time + ":" + timee
        console.log(mend+" mend")
      var index=0;
      console.log(magazis.length+" hozorislenght")
     // var lengthtt=hozoris.length;
     for(var i=0;index<values.length;i++){
      console.log(add)
      console.log(add.address+" add.address")
      console.log(add.addressnumber+" add addressnumber")
     
       if(moment(values[index].time, "HH:mm").format("HH:mm")>=moment(thistime, "HH:mm").format("HH:mm")&&
       moment(values[index].time22, "HH:mm").format("HH:mm")<=moment(mend, "HH:mm").format("HH:mm"))
       {
         console.log(" in if")
         console.log(add.address+" add address")
        //  console.log(values[index].addressnumber+" hozori address")
           console.log(" omad toye elese ")
           values.splice(index, 1);
           index--;
           // lengthtt--;
           console.log(values)
       }
       index++;
       console.log(i+" i")
      
     }
     setmagazis(values);
    }
  }


  const [selectedDayRange, setSelectedDayRange] = useState({
    from: null,
    to: null
  });
  const calenderchange = (value) => {
    console.log("hi")
    console.log(value + "value")
    setselecteddate(value.from.year + "-" + value.from.month + "-" + value.from.day)
    console.log(value.from.year + "year" + value.from.month + "month" + value.from.day + " _ " + value.to)
    setSelectedDayRange(value)
  }
  const [value, setValue] = React.useState('Controlled');

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const sessionchange = (index, horm) => {
    if (horm === "hozori") {
      var values = [...hozoris]
      values.splice(index, 1)
      sethozoris(values)
    }
    if (horm === "magazi") {
      var values = [...magazis]
      values.splice(index, 1)
      setmagazis(values)
    }
    console.log("request back")
  }

  return (
    <div >

      {/* وقت absolute dige flex end o ina taghiri ijad na */}
      {/* <div class="d-flex flex-row col-10 col-sm-2 mt-5" style={{justifyContent:"flex-end"}}> */}

      <div class="d-flex mb-3 p-2 flex-md-row flex-column col-11 my-1 mx-auto bd-highlight  mt-md-3 mt-2" style={{ backgroundColor: "white", alignSelf: "center" }}>
        <div class="order-md-1 order-2 col-lg-7 col-md-7 col-sm-12 col-12" style={{ backgroundColor: "white" }}>
          <div>
            {/* بین col-md , col-sm   نشون که بشه تقویم هم جا داد */}
            {/* flex-lg-row  flex-md-column flex-sm-row flex-column */}
            <div class="d-flex flex-column  align-items-start  col-sm-auto col-11">

              {/* mt - 2 وسط وسط نیست */}
              <div class="row  align-items-start col-auto ms-4">
                <div class="col-auto">
                  <label data-testid="hozoritext" for="hozori" class="col-auto ms-n3 sessionstimee ">مدت زمان هر وقت حضوری شما؟</label>
                </div>
                {/* class="col-2 me-n3 " */}
                <div class=" col-auto row align-items-center"
                // style={{height:"clamp(10px,4vh,60px)" , width:"clamp(20px,4.5vw,40px)",borderRadius:100,backgroundColor:"white"}}
                >
                  {/* //width toye screen bozorg yeho ziadi ziad vali height taghriban hammon */}
                  {/* نوشته ی توش ریسپانسیو کوچیک نمیشه */}
                  <input id="hozori" value={hduration} onChange={(event) => {
                    // var values=[...durationmode];
                    // values[0]={name:"وقت عادی",duration:hduration,}
                    sethduration(event.target.value)
                  }} class="col-auto" class="form-control" style={{ height: "clamp(10px,4.5vh,65px)", width: "clamp(45px,5.5vw,45px)", borderRadius: 100, backgroundColor: "white" }} aria-describedby="passwordHelpInline"></input>
                </div>

              </div>
              {/* d-block mb-3 d-sm-none d-md-block d-lg-none  */}
              <div style={{ backgroundColor: "white", position: "absolute", marginRight: "clamp(50px,60vw,255px)", marginTop: "-0.25rem" }} class="col-md-2 col-lg-3 col-sm-5 col-3  d-flex flex-row-reverse align-items-start round-3  ">
                <Button onClick={() => sendhozori()} type="button round-3" class="btn btn-primary btn-sm mb-3 col-lg-6 col-sm-6 me-4 col-md-8 col-8 " style={{ backgroundColor: "#05668D", borderRadius: 100, borderColor: "#05668D", position: "relative" }}>
                  {/* <div class="align-self-center justify-self-center"> */}
              تایید
              {/* {/* </div> */}
                </Button>
              </div>

              {/* تا sm */}
              {/* <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel" style={{ backgroundColor: "lightblue" }}>
                <div class="carousel-inner"> */}
              <div>
                {hfields.map((hfield, index) => (
                  <div key={index} >
                    {/* mt-lg-0 mt-md-3 mt-sm-0 mt-3      col-lg-11 mx-auto*/}
                    <div class="carousel-item-active  d-block d-flex flex-row mt-3 align-items-center ">
                      <BsPlusCircleFill color="gray" onClick={() => handleaddhfield(true)} class="min-vw-20 min-vh-20 ms-2 " style={{ height: "clamp(20px,10vh,25px)", width: "clamp(20px,10vw,25px)" }}></BsPlusCircleFill>
                      <AiFillMinusCircle color="gray" onClick={() => handleremovehfield(index)} class="min-vw-20 min-vh-20 ms-2 " style={{ height: "clamp(20px,10vh,25px)", width: "clamp(20px,10vw,25px)" }}></AiFillMinusCircle>
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
              <div class="d-flex flex-row mt-3 " style={{ marginBottom: "-0.25rem" }}>
                {haddresses.length > 1 ? <div class="dropdown" dir="ltr" >
                  <a class="btn btn-secondary dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                    {add.address}
                  </a>
                  <ul class="dropdown-menu dropdown-menu-end me-auto" aria-labelledby="dropdownMenuLink">
                    {/* <li><a class="dropdown-item " onClick={() => setadd("... برای آدرس ")} data-ref="one" >... برای آدرس</a></li> */}
                    {haddresses.map((value, index) => {
                      var indexx = index + 1;
                      return (<li class="row" style={{ alignItems: "center" }}><a class="dropdown-item " onClick={() => setadd({ address: value.add1, addressnumber: indexx })} data-ref="one" >{value.add1}       ({indexx}) </a>

                      </li>)
                    })}
                  </ul>
                </div> : null}

                {/* ui az aval shoro nemishe va vasate input nist + va harjaye dropdown mizani baste mishe*/}
                {durationmode.length >= 1 ? <div class="dropdown me-5" dir="ltr" >
                  <a class="btn btn-secondary dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                    {selectedduration.name}
                  </a>
                  <ul class="dropdown-menu dropdown-menu-end me-auto col-auto" dir="rtl" aria-labelledby="dropdownMenuLink">

                    {durationmode.map((value, index) => {
                      var indexx = index + 1;

                      {/* value.hdur != "" ?  */ }
                      {/* <li class="row" style={{ alignItems: "center" }}><a class="dropdown-item " onClick={() => setselectedduration({name:"نوع بازه ی زمانی",duration:"",color:"#008F81"})} data-ref="one" >نوع بازه ی زمانی</a></li> */ }
                      return (<li class="d-flex flex-row" dir="ltr" lang="fa" style={{}}>
                        <div class="mx-2 shadow-1 col-12 align-self-center" style={{ backgroundColor: value.color, borderRadius: 100, height: "clamp(20px,10vh,25px)", width: "clamp(20px,10vw,25px)" }}></div>
                        {value.duration != "all" ? [value.name !== "وقت عادی" ? (<a class="dropdown-item mx-auto  " style={{}} dir="rtl" onClick={() => setselectedduration(value)} data-ref="one" >{value.name}  {value.duration}(دقیقه) </a>) :
                          (<a class="dropdown-item mx-auto  " style={{}} dir="rtl" onClick={() => setselectedduration(value)} data-ref="one" >{value.name}  {hduration}(دقیقه) </a>)] :
                          <a class="dropdown-item mx-auto  " style={{}} dir="rtl" onClick={() => setselectedduration(value)} data-ref="one" >{value.name} </a>
                        }</li>
                      )
                    })}

                    <div class=" d-flex flex-row mt-2 " data-ref="one" >
                      <BsPlusCircleFill color="gray" onClick={() => {
                        // var col=randomColor()
                        setselectedduration({ name: dmdur, duration: dmhdur, color: col })
                        console.log(dmhdur + " dmhdur")

                        console.log(durationmode + " durationmode")

                        //  setselectedduration({name:dmdur,duration:dmhdur,color:col})
                        var values = [...durationmode];
                        values.push({ name: dmdur, duration: dmhdur, color: col })
                        setdmhdur("مدت زمان")
                        setdmdur("نوع بازه ی زمانی")
                        console.log(values + " values")
                        setdurationmode(values)
                        console.log(durationmode)
                      }} class="min-vw-20 min-vh-20 align-self-start " style={{ height: "clamp(20px,10vh,25px)", width: "clamp(20px,10vw,25px)" }}></BsPlusCircleFill>
                      <div class="mx-2 shadow-1" onClick={() => setcol(randomColor())} style={{ backgroundColor: col, borderRadius: 100, height: "clamp(20px,10vh,25px)", width: "clamp(20px,10vw,25px)" }}></div>
                      <input type="number" lang="fa" dir="rtl" class="round-2" value={dmhdur} placeholder={"مدت زمان"} onChange={(event) => setdmhdur(event.target.value)}></input>
                      <input type="text" lang="fa" dir="rtl" class="round-2" placeholder={"نوع بازه ی زمانی"} value={dmdur} onChange={(event) => setdmdur(event.target.value)}>
                      </input>
                    </div>
                  </ul>
                </div> : null}
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

         " style={{ borderRadius: 10, backgroundColor: "#F8F8F0", height: "30vh" }}>

              <div class=" " style={{ height: "26.5vh" }}>
                {hozoris != [] ? hozoris.map((val, index) => {

                  {/* const [buttoncolor,setbuttoncolor]=useState("#53BC48"); */ }
                  return (<Button key={index} type="button" class="bt btn-sm col-2" style={{ backgroundColor: "#00A896" }} data-bs-toggle="button"
                    onClick={(val) => {
                      sessionchange(index, "hozori");
                      // setbuttoncolor("red")
                    }}
                    style={{ margin: 3, backgroundColor: val.durationnumber, borderColor: val.durationnumber }}>{val.time}  ({val.addressnumber})</Button>
                  )
                }) : null}
                {/* {hmhconflictmessage != undefined ? <div>{hmhconflictmessage}</div> : null} */}


              </div>
            </div>
            {/* //  flex-column flex-lg-row  */}
            <div class="d-flex flex-column flex-column col-sm-auto col-11 align-items-start mt-3 ">

              <div class="d-flex flex-row  mt-2 col-auto ms-4 ">
                <div class="row  align-items-start">
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
                    <input id="hozori" value={mduration} onChange={(val) => setmduration(val.target.value)} class="col-auto" class="form-control" style={{ height: "clamp(10px,4.5vh,65px)", width: "clamp(45px,5.5vw,45px)", borderRadius: 100, backgroundColor: "white" }} aria-describedby="passwordHelpInline"></input>
                  </div>
                </div>
                {/* ms-auto me-auto nashod */}
                {/* d-block mb-3 d-sm-none d-md-block d-lg-none */}
                <div style={{ backgroundColor: "white", position: "absolute", marginRight: "clamp(50px,60vw,255px)", marginTop: "-0.25rem" }} class="col-md-2 col-lg-3 col-sm-5 col-3  d-flex flex-row-reverse align-items-start round-3  ">
                  <Button onClick={() => sendmagazis()} type="button round-3" class="btn btn-primary btn-sm mb-3 col-lg-6 col-sm-6 me-4 col-md-8 col-8 " style={{ backgroundColor: "#05668D", borderRadius: 100, borderColor: "#05668D", position: "relative" }}>
                    {/* <div class="align-self-center justify-self-center"> */}
              تایید
              {/* {/* </div> */}
                  </Button>
                </div>
              </div>
              {/* تا sm */}
              <div class="d-flex flex-row">
                {mfields.map((mfield, index) => (
                  <div key={index} >
                    {/* mt-lg-2 mt-md-3 mt-sm-2 mt-3 */}
                    <div class="d-block d-flex flex-row mt-3 align-items-center col-12 ">
                      <BsPlusCircleFill color="gray" onClick={() => handleaddmfield()} class="min-vw-20 min-vh-20 ms-2 " style={{ height: "clamp(20px,10vh,25px)", width: "clamp(20px,10vw,25px)" }}></BsPlusCircleFill>
                      <AiFillMinusCircle color="gray" onClick={() => handleremovemfield(index)} class="min-vw-20 min-vh-20 ms-2 " style={{ height: "clamp(20px,10vh,25px)", width: "clamp(20px,10vw,25px)" }}></AiFillMinusCircle>
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

         " style={{ borderRadius: 10, backgroundColor: "#F8F8F0", height: "30vh" }}>

              <div class=" " style={{ height: "26.5vh" }}>
                {magazis.map((val, index) => {

                  {/* const [buttoncolor,setbuttoncolor]=useState("#53BC48"); */ }
                  return (<Button key={index} type="button" class="btn btn-success btn-success btn-sm col-2" data-bs-toggle="button"
                    onClick={(val) => {
                      sessionchange(index, "magazi");
                      // setbuttoncolor("red")
                    }}
                    style={{ margin: 3, backgroundColor: "#008F81", borderColor: "#008F81" }}>{val.time}</Button>
                  )
                })}

                {/* {hmmconflictmessage!=undefined?
                  <div>  <Snackbar
          anchorOrigin={{ vertical:'bottom', horizontal:'center'}}
          open={openSnack}
          autoHideDuration={2500}
          onClose={handleCloseSnack}
          message={<div style={{fontSize:17}}>{hmmconflictmessage}</div>}
          /></div>
                     :null} */}


              </div>
            </div>








          </div>

        </div>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={openSnack}
          autoHideDuration={2500}
          onClose={handleCloseSnack}
          message={
            <div>
              {hmmconflictmessage != undefined ? <div style={{ fontSize: 14 }}>{hmmconflictmessage}</div> : <div style={{ fontSize: 14 }}>{hmhconflictmessage}</div>}
              {emptyhduration != undefined ? <div>{emptyhduration}</div> : null}
              {emptymduration != undefined ? <div>{emptymduration}</div> : null}
              {snackbarerror != "" ? <div>{snackbarerror}</div> : null}
            </div>

          }
        />
        {/* justifu nemishod baraye hamin ms me */}
        {/* engar chon toye flex */}
        {/* dir="ltr-md rtl" nemishe */}
        {/* cal age andaze width calendar mishe ms auto */}
        <div class="order-md-2 mb-lg-auto mb-4   order-1 col-auto me-md-auto me-4    " style={{
          borderRadius: 20,


          // backgroundColor: "white"
          // ,position:"absolute",justifyContent:"flex-end"
          // justify-content: flex-end !important;
        }}>

          {/* <div class="border rounded-3 shadow-3 col-auto w-auto h-auto "> */}
          {/* <div class="custom-calendar w-auto h-auto" style={{borderRadius:20}}> */}
          <Calendar

            // backgroundColor="green"
            // theme="dark"
            // background-image="blue"

            style={{ borderColor: "green" }}
            // style={{marginLeft:100}}

            shouldHighlightWeekends="true"
            calss="mb-3"
            borderColor="green"
            colorPrimary="#02A27F"
            isPersian={true}
            minimumDate={utils("fa").getToday()}
            calendarTodayClassName="custom-today-day"
            colorPrimaryLight="rgba(2, 195, 154, 0.4)"
            shouldHighlightWeekends
            calendarClassName="responsive-calendar custom-calendar"
            value={selectedDayRange}
            onChange={
              (value) => calenderchange(value)

            }
            // colorPrimary="#02C39A"
            // isPersian={true}
            // minimumDate={utils("fa").getToday()}
            // calendarTodayClassName="custom-today-day"
            // colorPrimaryLight="rgba(240, 243, 189, 0.4)"

            locale="fa" // add this
          />
          {/* </div> */}
          {/* </div> */}

        </div>


      </div>



    </div>



  )
}
export default Doctorcalender;