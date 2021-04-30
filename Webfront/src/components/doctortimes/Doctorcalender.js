import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { RangeDatePicker } from "jalali-react-datepicker";
import { CallMadeSharp, RestaurantMenu, TimeToLeave } from "@material-ui/icons";
import moment from 'moment-jalaali'
// import DatePicker from 'react-datepicker2';
import Navbar from "../../Navbar"
import "./Doctortimes.css";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import DatePicker, { Calendar, utils } from "react-modern-calendar-datepicker";
import { Toast, Button, Form, FormGroup, Label, input, FormText, Col, InputGroup, Modal } from 'react-bootstrap';
import TextField from '@material-ui/core/TextField';
import { BsPlusCircleFill, BsTrash } from "react-icons/bs";
import { AiFillMinusCircle, AiOutlineEdit } from "react-icons/ai";
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import randomColor from "randomcolor";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../apiConstant/apiConstant";
import axios from "axios";
import { duration } from "@material-ui/core";
import { BiChevronDown } from "react-icons/bi";

//یا همه ی موارد ولی ربای حذف یا یه چیز جدا
//  بعدا بین md , sm هم فرق و تقویم نشون




//وقت های قبل از امروزش رو هم بتونه روشون بزنه ولی بعد برای همه ی پست و اینا ایف بزارم که نتونه پست کنه و ارور نشون بده
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
  const [startselectedday, setstartseletedday] = useState("");
  const [endselectedday, setendseletedday] = useState("");
  const [col, setcol] = useState(randomColor())
  //az get
  const [littleadd, setlittleadd] = useState("همه ی آدرس ها ( برای حذف )");
  const [addressid, setaddressid] = useState(1);

  const [openSnack, setOpenSnack] = useState(false);
  const [add, setadd] = useState({ address: "... برای آدرس", addressnumber: "", id: "" });
  const [haddresses, sethaddresses] = useState([{ add1: "همه ی آدرس ها ( برای حذف )", id: "" }]);
  const [showdetail, setshowdetail] = useState(false);
  const [durationmode, setdurationmode] = useState([{ name: "همه ی بازه های زمانی ( برای حذف )", duration: "all" }, { name: "وقت عادی", duration: hduration, color: "#008F81" }])
  const [dm, setdm] = useState("_");
  const [dmdur, setdmdur] = useState("");
  const [selectedduration, setselectedduration] = useState({ name: "وقت عادی", duration: hduration, color: "#008F81" })
  const [dmhdur, setdmhdur] = useState("");
  const [snackbarerror, setsnackbarerror] = useState("");
  const [changingdate, setchangingdate] = useState("");
  const [selectedmdeletemodal, setselectedmdeletemodal] = useState({ value: "", time: "", time22: "", index: "" });
  const [selectedhdeletemodal, setselectedhdeletemodal] = useState({ value: "", time: "", time22: "", index: "" });
  const [hidedeletemodal, sethidedeletemodal] = useState(false);
  const [editdurationmodename, seteditdurationmodename] = useState("");
  const [editdurationmodeduration, seteditdurationmodeduration] = useState("");
  const [editdurationmodecolor, seteditdurationmodecolor] = useState("");
  const [editdurationindex, seteditdurationindex] = useState("");
  const [deleteallatftertoday,setdeleteallaftertoday]=useState(false);
  // const [deleteyear,setdeleteyear]=useState("")
  // const [deletemonth,setdeletemonth]=useState("")
  // const [deleteday,setdeleteday]=useState("")
  const [deletedate,setdeletedate]=useState("");


  //validation ***
  //age to calendar avaz ham dobare dare get mikone
  useEffect(() => {
    if (startselectedday !== "") {
      var doctorid = Cookies.get("doctorid");
      // values.push({
      //   id:add.id,
      //   time: thistime, time22: noww, address: add.address, addressnumber: add.addressnumber
      //   , duration: hduration, durationname: selectedduration.name, durationnumber: selectedduration.color
      // })
      console.log("TOYE GET")
      // console.log(startselectedday)
      // console.log(startselectedday)
      var datee = { date: "1400-02-10" }
      var stringifydate = JSON.stringify(datee);
      // console.log(stringigydate)
      console.log(stringifydate)
      // ,JSON.stringify({date:"1400-02-10"}
      axios.get(API_BASE_URL + "/appointment/" + 1 + "/in-person?date=" + startselectedday)
        .then(function (response) {
          console.log(response);
          var resdata = response.data;
          // console.log(resdata.user.id+" id");
          var values = [];
          var durations = [...durationmode];
          for (var i = 0; i < resdata.length; i++) {
            var starttime = resdata[i].start_time.toString().substring(0, 5);
            var endtime = resdata[i].end_time.toString().substring(0, 5);
            var address = resdata[i].address.state + "_" + resdata[i].address.city + "_" + resdata[i].address.detail;
            values.push({
              id: resdata[i].address.id, time: starttime, time22: endtime,
              address: address, addressnumber: resdata[i].address_number, duration: resdata[i].duration, durationnumber: resdata[i].duration_number, durationname: resdata[i].time_type
            })
            if (i > 0) {
              durations.push({ name: resdata[i].time_type, duration: resdata[i].duration, color: resdata[i].duration_number })
            }
            if(i===1){
              sethduration(resdata[i].duration)
            }
          }
          console.log(durations);
          console.log(values);
          console.log("values");
          sethozoris(values)
          setdurationmode(durations);


        })
        .catch(function (error) {
          console.log(error);
        });


      axios.get(API_BASE_URL + "/appointment/" + 1 + "/online?date=" + startselectedday)
        .then(function (response) {
          console.log(response);
          var resdata = response.data;
          // console.log(resdata.user.id+" id");
          var values = [];
          for (var i = 0; i < resdata.length; i++) {
            var starttime = resdata[i].start_time.toString().substring(0, 5);
            var endtime = resdata[i].end_time.toString().substring(0, 5);

            values.push({ time: starttime, time22: endtime })
          }
          console.log(values);
          console.log("values");
          setmagazis(values)

        })
        .catch(function (error) {
          console.log(error);
        });
    }

  }, [changingdate]);

  //age shod yekari ke in ba rerender shodan balayi dobare get nakone
  useEffect(() => {
    var doctorid = Cookies.get("doctorId");

    axios.get(API_BASE_URL + "/doctor/" + 1 + "/")
      .then(function (response) {
        // console.log(response)
        console.log(response.data.addresses);
        var Alltheaddresses = response.data.addresses;
        var values = [...haddresses];
        for (var i = 0; i < Alltheaddresses.length; i++) {
          values.push({ add1: Alltheaddresses[i].state + "_" + Alltheaddresses[i].city + "_" + Alltheaddresses[i].detail, id: Alltheaddresses[i].id })
        }

        console.log(values)
        sethaddresses(values);
        console.log(haddresses);
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

    if (startselectedday === "") {
      // setemptymduration(undefined)
      setsnackbarerror("لطفاابتدا تاریخ مورد نظر خود را مشخص نمایید")
      setOpenSnack(true);
    }
    else {

      var values = [];
      //***** */
      var doctorid = Cookies.get("doctorId");
      console.log(doctorid + " doctorid");

      for (var i = 0; i < magazis.length; i++) {
        // var start = startselectedday + " " + magazis[i].time
        values.push({ duration: mduration, doc_id: 1, start_time: magazis[i].time, end_time: magazis[i].time22 });
      }
      console.log(" all the magazis values :)")
      var informations = { start_day: startselectedday, end_day: endselectedday, appointments: values }
      console.log(informations)
      axios.post(API_BASE_URL + "/appointment/" + 1 + "/online/", JSON.stringify(informations), {
        headers: { "content-type": "application/json" },
      })
        .then(function (response) {
          console.log(response)
        })
        .catch(function (error) {
          console.log(error);
        });

    }
  }
  const sendhozori = () => {
    if (startselectedday === "") {
      // setemptymduration(undefined)
      setsnackbarerror(" لطفا ابتدا تاریخ مورد نظر خود را مشخص نمایید")
      setOpenSnack(true);
    }
    else if (hozoris.length !== 0) {

      var values = [];
      var doctorid = Cookies.get("doctorId");
      console.log(hozoris);
      //doctor id va address id ***

      for (var i = 0; i < hozoris.length; i++) {
        console.log(hozoris[i].id)
        // var start = startselectedday + " " + hozoris[i].time
        console.log((hozoris))
        console.log(hozoris[i].durationnumber + " HOZORIS I DURATION NUMBER");
        values.push({
          duration: hozoris[i].duration, start_time: hozoris[i].time, end_time: hozoris[i].time22, doc_id: 1,
          address_id: hozoris[i].id, time_type: hozoris[i].durationname, address_number: hozoris[i].addressnumber,
          duration_number: hozoris[i].durationnumber
        });
      }
      var informations = { start_day: startselectedday, end_day: endselectedday, appointments: values }
      console.log(informations)
      console.log(" all the magazis values :)")

      axios.post(API_BASE_URL + "/appointment/" + 1 + "/in-person/", JSON.stringify(informations), {
        headers: { "content-type": "application/json" },
      })
        .then(function (response) {
          console.log(response)
        })
        .catch(function (error) {
          console.log(error);
        });
    }

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
                id: add.id,
                time: thistime, time22: noww, address: add.address, addressnumber: add.addressnumber
                , duration: selectedduration.duration, durationname: selectedduration.name, durationnumber: selectedduration.color
              })
            }
            else {
              console.log(hduration + " HDURATION ")
              values.push({
                id: add.id,
                time: thistime, time22: noww, address: add.address, addressnumber: add.addressnumber
                , duration: hduration, durationname: selectedduration.name, durationnumber: selectedduration.color
              })
            }
            console.log(thistime + " thistime")
            console.log(values)
            console.log("values");
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
      var values = [...hozoris];
      if (timee.toString().length === 1)
        var thistime = time + ":0" + timee
      else
        var thistime = time + ":" + timee
      console.log(mend + " mend")
      var index = 0;
      console.log(hozoris.length + " hozorislenght")
      // var lengthtt=hozoris.length;
      for (var i = 0; index < values.length; i++) {
        console.log(add)
        console.log(add.address + " add.address")
        console.log(add.addressnumber + " add addressnumber")

        if (moment(values[index].time, "HH:mm").format("HH:mm") >= moment(thistime, "HH:mm").format("HH:mm") &&
          moment(values[index].time22, "HH:mm").format("HH:mm") <= moment(mend, "HH:mm").format("HH:mm")) {
          console.log(" in if")
          console.log(add.address + " add address")
          console.log(values[index].addressnumber + " hozori address")
          console.log(add.address !== "همه ی آدرس ها ( برای حذف )")
          console.log(values[index].duration === selectedduration.duration)
          console.log(values[index].duration)
          console.log(selectedduration.duration)
          console.log("bool")
          if (selectedduration.duration === "all") {
            if (add.address !== "همه ی آدرس ها ( برای حذف )") {
              console.log(" toye if hameye address ha nist")
              console.log(index + " index")
              console.log(values[index])
              console.log(values[index].address)
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
          //ino shak daram toye validation bayad handle ke yeho hduration ro khali ya pak nakone
          else if (values[index].duration === selectedduration.duration || selectedduration.duration === "") {
            if (add.address !== "همه ی آدرس ها ( برای حذف )") {
              console.log(" toye if hameye address ha nist")
              console.log(index + " index")
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
        console.log(i + " i")

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
            values.push({ time: thistime, time22: noww })
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
      console.log(mend + " mend")
      var index = 0;
      console.log(magazis.length + " hozorislenght")
      // var lengthtt=hozoris.length;
      for (var i = 0; index < values.length; i++) {
        console.log(add)
        console.log(add.address + " add.address")
        console.log(add.addressnumber + " add addressnumber")

        if (moment(values[index].time, "HH:mm").format("HH:mm") >= moment(thistime, "HH:mm").format("HH:mm") &&
          moment(values[index].time22, "HH:mm").format("HH:mm") <= moment(mend, "HH:mm").format("HH:mm")) {
          console.log(" in if")
          console.log(add.address + " add address")
          //  console.log(values[index].addressnumber+" hozori address")
          console.log(" omad toye elese ")
          values.splice(index, 1);
          index--;
          // lengthtt--;
          console.log(values)
        }
        index++;
        console.log(i + " i")

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
    var startmonth = "";
    var startday = "";
    if (value.from.month.toString().length === 1) {
      startmonth = "0" + value.from.month
    }
    else {
      startmonth = value.from.month
    }
    if (value.from.day.toString().length === 1) {
      startday = "0" + value.from.day
    }
    else {
      startday = value.from.day
    }
    var newselectedday = value.from.year + "-" + startmonth + "-" + startday
    if (startselectedday !== newselectedday) {
      setdurationmode([{ name: "همه ی بازه های زمانی ( برای حذف )", duration: "all" },
       { name: "وقت عادی", duration: hduration, color: "#008F81" }])
      console.log(newselectedday)
      console.log(startselectedday)
      // sethaddresses([{ add1: "همه ی آدرس ها ( برای حذف )", id: "" }])
      console.log("MOTEFAVET")
      sethozoris([])
      setmagazis([])
      setchangingdate(value.from)
    }
    setstartseletedday(newselectedday)
    console.log(value.to)
    if (value.to != null) {
      var endmonth = "";
      var endday = "";
      if (value.to.month.toString().length === 1) {
        endmonth = "0" + value.to.month
      }
      else {
        endmonth = value.to.month
      }
      if (value.to.day.toString().length === 1) {
        endday = "0" + value.to.day
      }
      else {
        endday = value.to.day
      }
      setendseletedday(value.to.year + "-" + endmonth + "-" + endday)

    }
    else {
      setendseletedday(value.from.year + "-" + startmonth + "-" + startday)
    }
    // console.log(value.to.year+" to year")
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
                {haddresses.length > 1 ? <div class="dropdown" dir="rtl" >
                  <a class="btn btn-secondary dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                    {add.address}
                  </a>
                  <ul class="dropdown-menu dropdown-menu-end me-auto" aria-labelledby="dropdownMenuLink">
                    {/* <li><a class="dropdown-item " onClick={() => setadd("... برای آدرس ")} data-ref="one" >... برای آدرس</a></li> */}
                    {haddresses.map((value, index) => {
                      var indexx = index + 1;
                      if (value.add1.toString().length > 10) {
                        var thisadd = value.add1.toString().substring(0, 10) + " ..."
                        console.log(thisadd)

                      }
                      else {
                        var thisadd = value.add1;
                      }

                      //faseleye har address ta felesh ro be payin ziad ***
                      return (<div><li class="d-flex flex-row" style={{}}>
                        {/* <div data-bs-toggle="collapse" data-bs-target="#collapsedetail" aria-expanded="false" aria-controls="collapsedetail"
                       class="ms-1" onClick={()=>console.log("clicked")}
                       style={{backgroundColor:"#F7F7F7",alignItems: "center",justifyContent:"center",borderWidth:1,borderColor:"gray",borderRadius:100}}>
                      <BiChevronDown size={20} class="m-1" color="#028090"></BiChevronDown>
                      </div> */}

                        {value.add1.toString().length > 10 && index > 0 ? <div dir="ltr" style={{ fontSize: "clamp(12px,2vw,15px)" }} class="dropdown-item d-flex flex-row-reverse mx-auto"
                          data-bs-toggle="tooltip" data-bs-placement="left"
                          onClick={() => {
                            setlittleadd(thisadd)
                            setadd({ address: thisadd, addressnumber: indexx, id: value.id })
                          }}
                          title={value.add1} >{thisadd}     ({indexx})
                      </div> :
                          <div style={{ fontSize: "clamp(12px,2vw,15px)" }} dir="ltr" class="dropdown-item d-flex flex-row-reverse mx-auto"
                            onClick={() => {
                              setlittleadd(thisadd)
                              setadd({ address: value.add1, addressnumber: indexx, id: value.id })
                            }} data-ref="one" >{value.add1}     ({indexx})
                      </div>}



                      </li>
                        {/* <div  class="dropdown-menu  collapse" id="collapsedetail">
                        <div  class="dropdown-divider"></div>
                        {add.detail} hihihihihi
                        <div  class="dropdown-divider"></div>
                      </div> */}
                      </div>

                      )
                    })}
                  </ul>
                </div> : null}

                {/* ui az aval shoro nemishe va vasate input nist + va harjaye dropdown mizani baste mishe*/}
                {durationmode.length >= 1 ? <div class="dropdown shadow-sm me-5" dir="rtl" >
                  <div class="btn btn-secondary dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                    {selectedduration.name}
                  </div>
                  <ul class="dropdown-menu dropdown-menu-end shadow-3 me-auto col-auto" dir="rtl" aria-labelledby="dropdownMenuLink">

                    {durationmode.map((value, index) => {
                      var indexx = index + 1;

                      {/* value.hdur != "" ?  */ }
                      {/* <li class="row" style={{ alignItems: "center" }}><a class="dropdown-item " onClick={() => setselectedduration({name:"نوع بازه ی زمانی",duration:"",color:"#008F81"})} data-ref="one" >نوع بازه ی زمانی</a></li> */ }
                      return (

                        <li class="d-flex flex-row" dir="rtl" lang="fa" style={{}}>

                          {value.duration !== "all" ? [value.name !== "وقت عادی" ?
                            (<div class="dropdown-item  d-flex flex-row-reverse  " style={{ fontSize: "clamp(12px,2vw,15px)" }} dir="ltr"
                              onClick={() => setselectedduration(value)} data-ref="one" >{value.name}  {value.duration}(دقیقه)

                            </div>) :
                            (<div class="dropdown-item  d-flex flex-row-reverse  " style={{ fontSize: "clamp(12px,2vw,15px)" }} dir="ltr" onClick={() => setselectedduration(value)}
                              data-ref="one" >{value.name}  {hduration}(دقیقه)

                            </div>)] :
                            <div class="dropdown-item  d-flex flex-row-reverse " style={{}} dir="ltr" onClick={() => setselectedduration(value)}
                              data-ref="one" >
                              <div style={{ fontSize: "clamp(12px,2vw,15px)" }} >
                                {value.name}
                              </div>
                            </div>
                          }
                          {index !== 0 ? <AiOutlineEdit size={20} data-bs-toggle="modal"
                            onClick={() => {
                              seteditdurationindex(index)
                              seteditdurationmodename(value.name)
                              seteditdurationmodeduration(value.duration)
                              //shabih term pish state araye i hamoon moghe update na inja objecti na engar
                              seteditdurationmodecolor(value.color)
                            }}
                            data-bs-target="#editduration" color={value.color} class="align-self-center"></AiOutlineEdit> : null}

                          {index !== 0 ? <BsTrash size={20} color={value.color} class="align-self-center me-2"></BsTrash> : null}
                          {index !== 0 ? <div class="mx-2 ms-2 shadow-1 align-self-center col-12 ms-0 align-items-end" style={{
                            backgroundColor: value.color,
                            borderRadius: 100, height: "clamp(20px,10vh,25px)", width: "clamp(20px,10vw,25px)"
                          }}></div> : null}


                        </li>


                      )
                    })}
                    {/* edit & delete modals */}
                    {/* <AiOutlineEdit size={20} data-bs-toggle="modal" data-bs-target="#editduration"
                    onClick={()=>seteditdurationindex(index)} color={value.color} class="align-self-center"></AiOutlineEdit> */}

                    {/* edit & delete modals */}

                    <div class=" d-flex flex-row mt-2 mx-1 " data-ref="one" >
                      <BsPlusCircleFill color="gray" onClick={() => {
                        // var col=randomColor()
                        setselectedduration({ name: dmdur, duration: dmhdur, color: col })
                        console.log(dmhdur + " dmhdur")

                        console.log(durationmode + " durationmode")

                        //  setselectedduration({name:dmdur,duration:dmhdur,color:col})
                        var values = [...durationmode];
                        values.push({ name: dmdur, duration: dmhdur, color: col })
                        // setdmhdur("مدت زمان")
                        // setdmdur("نوع بازه ی زمانی")
                        setcol(randomColor());
                        console.log(values + " values")
                        setdurationmode(values)
                        console.log(durationmode)
                      }} class="min-vw-20 min-vh-20 mt-1 align-self-start " style={{ height: "clamp(20px,10vh,25px)", width: "clamp(20px,10vw,25px)" }}></BsPlusCircleFill>
                      <div class="mx-1 mt-1 shadow-1" onClick={() => setcol(randomColor())} style={{ backgroundColor: col, borderRadius: 100, height: "clamp(20px,10vh,25px)", width: "clamp(20px,10vw,25px)" }}></div>
                      {/* width:"clamp(100px,15vw,100px) in ba 100px khali fargh dasht */}
                      <input type="number" style={{ fontSize: "clamp(11px,2vw,15px)", width: "clamp(86px,15vw,106px)", borderRadius: 50, borderWidth: 1, borderColor: "lightgray" }} class="form-control form-control-sm" lang="fa" dir="rtl" value={dmhdur} placeholder={"مدت زمان"} onChange={(event) => setdmhdur(event.target.value)}></input>
                      <input style={{ fontSize: "clamp(11px,2vw,15px)", width: "clamp(100px,20vw,150px)", borderRadius: 50 }} lang="fa" dir="rtl" class="form-control form-control-sm" placeholder={"نوع بازه ی زمانی"} value={dmdur} onChange={(event) => setdmdur(event.target.value)}>
                      </input>
                    </div>
                  </ul>

                </div> : null}
                {/* //width kamtar kon badan */}
                <div dir="rtl" class="modal fade " id="editduration" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editduration" aria-hidden="true">
                  <div class="modal-dialog  modal-dialog-centered editdurationmodal" >
                    <div class="modal-content">
                      <div class="modal-header d-flex flex-row-reverse" dir="rtl">
                        <button type="button" class="btn-close align-self-center mx-auto ms-2 justify-self-start " data-bs-dismiss="modal" aria-label="Close"></button>
                        <div style={{ fontSize: "clamp(12px,3vw,17px)", fontWeight: "bold", color: "#005249" }} class="modal-title" id="exampleModalLabel" >ویرایش بازه ی زمانی</div>


                      </div>
                      <div class="modal-body d-flex flex-row" dir="rtl">
                        {/* defualt background color shabih place holderer */}
                        <div class="mx-1 mt-1 shadow-1" onClick={() => seteditdurationmodecolor(randomColor())} style={{ backgroundColor: editdurationmodecolor, borderRadius: 100, height: "clamp(20px,10vh,25px)", width: "clamp(20px,10vw,25px)" }}></div>
                        {/* width:"clamp(100px,15vw,100px) in ba 100px khali fargh dasht */}
                        {editdurationindex > 1 ? <input type="number" style={{ fontSize: "clamp(11px,2vw,15px)", width: "clamp(86px,15vw,106px)", borderRadius: 50, borderWidth: 1, borderColor: "lightgray" }} class="form-control form-control-sm" lang="fa" dir="rtl"
                          value={editdurationmodeduration} placeholder={durationmode[editdurationindex].duration}
                          onChange={(event) => seteditdurationmodeduration(event.target.value)}></input> :
                          <input type="number" style={{ fontSize: "clamp(11px,2vw,15px)", width: "clamp(86px,15vw,106px)", borderRadius: 50, borderWidth: 1, borderColor: "lightgray" }}
                            class="form-control form-control-sm" lang="fa" dir="rtl" value={editdurationmodeduration}
                            placeholder={hduration} onChange={(event) => seteditdurationmodeduration(event.target.value)}></input>}
                        {/* //baraye payini chera niyaz */}
                        {editdurationindex !== "" ? <input style={{ fontSize: "clamp(11px,2vw,15px)", width: "clamp(100px,20vw,150px)", borderRadius: 50 }} lang="fa" dir="rtl" class="form-control form-control-sm"
                          placeholder={durationmode[editdurationindex].name} value={editdurationmodename} onChange={(event) => seteditdurationmodename(event.target.value)}>
                        </input> : null}

                      </div>

                      <div class="modal-footer">

                        <button type="button" data-bs-target="#editduration2" data-bs-toggle="modal" class="btn btn-success" style={{ backgroundColor: "#008F81", color: "white" }}
                          data-bs-dismiss="modal" onClick={async () => {

                            axios.get(API_BASE_URL + "/update-appointment/" + 1 + "/in-person?type=" + editdurationmodename)
                              .then(function (response) {
                                console.log(response);
                                if (response.data.message === "No time reserved!") {
                                  setdeleteallaftertoday(true);
                                  var today = utils("fa").getToday()
                                  // console.log(today)
                                  // //baraye in kar ye tabe tarif kolan tamiz to jahaye dige
                                  var year = today.year;
                                  var month = "";
                                  var day = "";
                                
                                  if (today.month.toString().lenght === 1) {
                                    month= "0" + today.month
                                  }
                                  else
                                    month=today.month

                                  if (today.day.toString().lenght === 1) {
                                    day="0" + today.day
                                  }
                                  else
                                    day=today.day

                                  setdeletedate(year + "-" + month + "-" + day);
                                  
                                  // var Today = year + "-" + month + "-" + day;
                                  // console.log("today")

                                  // console.log(editdurationmodename+"  edit duration name")
                                  // var info={"type": editdurationmodename,"date":Today}
                                  // var infojson=JSON.stringify(info)
                                  
                                  // // axios.delete(API_BASE_URL + "/update-appointment/" + 1 + "/in-person/",{params:{type: "وقت عادی",date:Today}})
                                  // axios.delete(API_BASE_URL + "/update-appointment/" + 1 + "/in-person/",infojson)
                                  //   .then(function (response) {
                                  //     console.log(response);


                                  //   })
                                  //   .catch(function (error) {
                                  //     console.log(error);
                                  //   });

                                }
                                else{
                                  setdeletedate(response.data.datetime);
                                  setdeleteallaftertoday(false)
                                }

                              })
                              .catch(function (error) {
                                console.log(error);
                              });
                          }}>تایید</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">بستن</button>
                      </div>
                    </div>
                  </div>
                </div>






                <div dir="rtl" class="modal fade " id="editduration2" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editduration2" aria-hidden="true">
                  <div class="modal-dialog  modal-dialog-centered editdurationmodal" >
                    <div class="modal-content">
                      <div class="modal-header d-flex flex-row-reverse" dir="rtl">
                        <button type="button" class="btn-close align-self-center mx-auto ms-2 justify-self-start " data-bs-dismiss="modal" aria-label="Close"></button>
                        <div style={{ fontSize: "clamp(12px,3vw,17px)", fontWeight: "bold", color: "#005249" }} class="modal-title" id="exampleModalLabel" >ویرایش بازه ی زمانی</div>


                      </div>
                      <div class="modal-body d-flex flex-row" dir="rtl">
                        <div>در صورت تایید همه ی ویزیت هایی که از نوع بازه ی زمانی {editdurationmodename} و بعد از تاریخ {deletedate} هستند حذف خواهند شد</div>
                      </div>

                      <div class="modal-footer">

                        <button type="button" class="btn btn-success" style={{ backgroundColor: "#008F81", color: "white" }} data-bs-dismiss="modal" onClick={async () => {
                           axios.delete(API_BASE_URL + "/update-appointment/" + 1 + "/in-person/",JSON.stringify({type:editdurationmodename,date:deletedate}))
                                    .then(function (response) {
                                      console.log(response);


                                    })
                                    .catch(function (error) {
                                      console.log(error);
                                    });
                        }}>تایید</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">بستن</button>
                      </div>
                    </div>
                  </div>
                </div>




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
                  return (<Button data-bs-toggle="modal" data-bs-target="#deletebuttonmodalh" key={index} type="button" class="bt btn-sm col-2"
                    onClick={async (val) => {
                      await setselectedhdeletemodal((prevState) => ({ ...prevState, value: val, index: index, time: val.time, time22: val.time22 }))
                      // sessionchange(index, "hozori");
                      // setbuttoncolor("red")
                    }}
                    color={val.durationnumber} style={{ margin: 3, backgroundColor: val.durationnumber, borderColor: val.durationnumber }}>{val.time}  ({val.addressnumber})</Button>
                  )
                }) : null}
                {/* {hmhconflictmessage != undefined ? <div>{hmhconflictmessage}</div> : null} */}
                <div dir="rtl" class="modal fade" id="deletebuttonmodalh" tabindex="-1" aria-labelledby="deletebuttonmodahl" aria-hidden="true">
                  <div class="modal-dialog  modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-body d-flex flex-row" dir="rtl">
                        {/* nashodd un aval ba inke modal baz nist miad error undefined mide vaghti ham ke baraye boodan ya naboodan modal on hededelete... ro gozashtam chon tool mikeshe ta set beshe bayad chand bar ghahi ro dokhme ha bezane */}
                        {/* <h5 class="modal-title" id="deletebuttonmodal">آیا از حذف وقت ویزیت خود در ساعت {magazis[selectedmdeletemodal.index].time}-{magazis[selectedmdeletemodal.index].time22} اطمینان دارید؟</h5> */}
                        <div class="modal-title ms-auto" id="deletebuttonmodalh">آیا از حذف این وقت ویزیت خود اطمینان دارید؟</div>
                        <button type="button" class="btn-close me-auto align-self-center" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>

                      <div class="modal-footer">

                        <button type="button" class="btn btn-success" style={{ backgroundColor: "#008F81", color: "white" }} data-bs-dismiss="modal" onClick={async () => {
                          sessionchange(selectedhdeletemodal.index, "hozori")
                          //ba in baes takhir bad bayad do bar bezane ghahi ta modal baz beshe
                          //  await sethidedeletemodal(false)
                        }}>تایید</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">بستن</button>
                      </div>
                    </div>
                  </div>
                </div>

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
                  return (

                    <Button key={index} data-bs-toggle="modal" data-bs-target="#deletebuttonmodal" type="button" class="btn btn-success btn-success btn-sm col-2"
                      onClick={async (val) => {
                        console.log(index + "index")
                        console.log("Alan omad")
                        console.log(val)
                        console.log(val.time);
                        console.log("time")
                        console.log(val.time22)
                        console.log("time22")
                        var a = { value: val, index: index, time: val.time, time22: val.time22 }
                        console.log(a);
                        console.log("a")
                        await setselectedmdeletemodal((prevState) => ({ ...prevState, value: val, index: index, time: val.time, time22: val.time22 }))
                        // sessionchange(index, "magazi");
                        console.log(selectedmdeletemodal)
                        console.log("set selected m ...")


                        //  if(selectedmdeletemodal!=""){  sethidedeletemodal(true);}


                        // setbuttoncolor("red") {`#deletebuttonmodal${index}`}
                      }}
                      style={{ margin: 3, backgroundColor: "#008F81", borderColor: "#008F81" }}>{val.time}</Button>
                    /* <div class="modal fade" id="deletebuttonmodal" tabindex="-1" aria-labelledby="deletebuttonmodal" aria-hidden="true">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="deletebuttonmodal">آیا از حذف وقت ویزیت خود در ساعت {val.time}-{val.time22} اطمینان دارید؟</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        ...
                     </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Save changes</button>
                      </div>
                    </div>
                  </div>
                </div>
                </div> */

                  )
                }

                )

                }
                {/* <Modal show={selectedmdeletemodal!==""} onHide={hidedeletemodal}>
  <Modal.Header closeButton>
    <Modal.Title>Modal heading</Modal.Title>
  </Modal.Header>
  <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={console.log("hi")}>
      Close
    </Button>
  </Modal.Footer>
</Modal> */}
                {/* {magazis[selectedmdeletemodal.index].time!=undefined? */}
                <div dir="rtl" class="modal fade" id="deletebuttonmodal" tabindex="-1" aria-labelledby="deletebuttonmodal" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-body d-flex flex-row" dir="rtl">
                        {/* nashodd un aval ba inke modal baz nist miad error undefined mide vaghti ham ke baraye boodan ya naboodan modal on hededelete... ro gozashtam chon tool mikeshe ta set beshe bayad chand bar ghahi ro dokhme ha bezane */}
                        {/* <h5 class="modal-title" id="deletebuttonmodal">آیا از حذف وقت ویزیت خود در ساعت {magazis[selectedmdeletemodal.index].time}-{magazis[selectedmdeletemodal.index].time22} اطمینان دارید؟</h5> */}
                        <div class="modal-title" id="deletebuttonmodal">آیا از حذف این وقت ویزیت خود اطمینان دارید؟</div>
                        <button type="button" class="btn-close me-auto align-self-center" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>

                      <div class="modal-footer">

                        <button type="button" class="btn btn-success" style={{ backgroundColor: "#008F81", color: "white" }} data-bs-dismiss="modal" onClick={async () => {
                          sessionchange(selectedmdeletemodal.index, "magazi")
                          //ba in baes takhir bad bayad do bar bezane ghahi ta modal baz beshe
                          await sethidedeletemodal(false)
                        }}>تایید</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">بستن</button>
                      </div>
                    </div>
                  </div>
                </div>


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