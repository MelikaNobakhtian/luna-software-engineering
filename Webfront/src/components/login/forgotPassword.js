import React, { useState ,useEffect} from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link, Redirect, withRouter, useHistory } from 'react-router-dom';
import {API_BASE_URL} from '../apiConstant/apiConstant';

function ForgotPassword(props) {

  return(
      <div>
          ForgotPassword
      </div>


  );
}


export default withRouter(ForgotPassword);
