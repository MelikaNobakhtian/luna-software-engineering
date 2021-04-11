import React, { useState } from "react";
import {Redirect,withRouter} from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import {API_BASE_URL} from '../apiConstant/apiConstant';
import { Avatar } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

function UserProfile(props) { 
  const [user , setUser] = useState({
      token : "",
      userName : "fato",
      userFirstName : "fateme",
      userLastName : "omidi",
      email : "qqqqq@aaaa",
      picture : "",
      oldPass :"",
      newPass:"",
      newPass2 : ""
   })
    
    
    
  return(
    <div className="main-content bg-dark">
      <div className="container-fluid p-2">
        <div className="d-flex flex-wrap">
         <div className="col-12 col-md-4 ">
          <div className="card border-light border-2 text-white p-2 m-1" style={{backgroundColor:'rgba(70, 70, 60, 0.8)'}}>
            <div class="card-header d-flex justify-content-center">
              <div className="text-center">
                <Avatar src={user.picture} alt="" className="" style={{width:120, height:120}}/>
                <h5 className="username mt-2">{user.userName}</h5>
                <h6 className="email">{user.email}</h6>
              </div>
            </div>
            <div class="card-body">
              <div className='btn btn-light btn-sm'>
                <EditIcon></EditIcon>
                ویرایش اطلاعات
              </div>
            </div>
          </div>
         </div>
         <div className="col-12 col-md-8 ">
          <div className="card border-light border-2 text-white p-2 m-1" style={{backgroundColor:'rgba(70, 70, 60, 0.8)'}}>
            <div class="card-header d-flex">
                <h4>اطلاعات شخصی</h4>
             
            </div>
            <div class="card-body">
              <div>
              <form class="row g-3">
                  <div class="col-sm-6 ">
                    <label for="inputEmail4" class="form-label">نام</label>
                    <input type="email" class="form-control" id="inputEmail4"/>
                  </div>
                  <div class="col-sm-6">
                    <label for="inputPassword4" class="form-label">نام خانوادگی</label>
                    <input type="password" class="form-control" id="inputPassword4"/>
                  </div>
                  <div class="col-sm-6">
                    <label for="inputEmail4" class="form-label">آدرس ایمیل</label>
                    <input type="email" class="form-control" id="inputEmail4"/>
                  </div>
                  <div class="col-sm-6">
                    <label for="inputAddress2" class="form-label">شماره ملی</label>
                    <input type="text" class="form-control" id="inputAddress2" placeholder=""/>
                  </div>
                  <div class="col-sm-6">
                    <label for="inputPassword4" class="form-label">رمز</label>
                    <input type="password" class="form-control" id="inputPassword4"/>
                  </div>
                  <div class="col-12">
                    <label for="inputAddress" class="form-label">آدرس</label>
                    <input type="text" class="form-control" id="inputAddress" placeholder=""/>
                  </div>
                  
                  <div class="col-sm-6">
                    <label for="inputCity" class="form-label">شهر</label>
                    <input type="text" class="form-control" id="inputCity"/>
                  </div>
                  <div class="col-sm-4">
                    <label for="inputState" class="form-label">استان</label>
                    <select id="inputState" class="form-select">
                      <option selected>انتخاب کنید...</option>
                      <option>اصفهان</option>
                    </select>
                  </div>
                  
                  <div class="col-12">
                    <button type="submit" class="btn btn-outline-light">تغییر اطلاعات</button>
                  </div>
                </form>
              </div>
              
            </div>
          </div>
         </div>
        </div>
      </div>
    </div>

  )
}
export default withRouter(UserProfile);