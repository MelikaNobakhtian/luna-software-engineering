import React, { useState ,useEffect} from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link, Redirect, withRouter, useHistory } from 'react-router-dom';
import {API_BASE_URL} from '../apiConstant/apiConstant';

function ForgotPassword(props) {

    useEffect(() => {
        
    },[] );

    const changePassword = () =>{

    }

  return(
      <div>
          <div className="d-flex justify-content-center background">
            <div className="  "  >
              <div className="card border border-5 border-success shadow-lg" >
                <div class="card-body ">
                <form className="row g-3">
                  <div>
                    <label class="form-label"  >رمز جدید</label>
                    <input type="password" class="form-control"  placeholder="رمز جدید خود را وارد کنید"/>
                  </div>
                  <div >
                    <label class="form-label"  >تکرار رمز جدید</label>
                    <input type="password" class="form-control"  placeholder="رمز جدید خود را دوباره وارد کنید"/>
                  </div>
                  
                </form>
                <button type="submit" class="btn btn-success mt-3" onClick={changePassword}>تایید</button>

                </div>
              </div>
            </div>
          </div>
      </div>


  );
}


export default withRouter(ForgotPassword);
