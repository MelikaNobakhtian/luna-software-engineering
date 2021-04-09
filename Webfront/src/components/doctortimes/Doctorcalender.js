import React from "react";
import { render } from "react-dom";
// import { DatePicker } from "jalali-react-datepicker";
import { RestaurantMenu } from "@material-ui/icons";
import moment from 'moment-jalaali'
import DatePicker from 'react-datepicker2';
import Navbar from "../../Navbar"

function Doctorcalender(){
    return(
        <div>
        <Navbar></Navbar>
      <div style={{}}>مدت زمان وقت حضوری شما؟</div>
      <div>مدت زمان وقت مجازی شما؟</div>
        <DatePicker></DatePicker>
        </div>

    )
}
export default Doctorcalender;