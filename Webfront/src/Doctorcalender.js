import React from "react";
import { render } from "react-dom";
// import { DatePicker } from "jalali-react-datepicker";
import { RestaurantMenu } from "@material-ui/icons";
import moment from 'moment-jalaali'
import DatePicker from 'react-datepicker2';


function Doctorcalender(){
    return(
        <div><DatePicker></DatePicker></div>

    )
}
export default Doctorcalender;