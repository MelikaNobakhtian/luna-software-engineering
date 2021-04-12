import React, { useState, useEffect } from "react";
import {Redirect,withRouter} from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import {API_BASE_URL} from '../apiConstant/apiConstant';
import { Avatar } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';

function UserProfile(props) { 
  const [user , setUser] = useState({
      token : "",
      userName : "fato",
      firstName : "fateme",
      lastName : "omidi",
      email : "qqqqq@aaaa",
      picture : "",
      oldPass :"",
      newPass:"",
      newPass2 : ""
   })

   useEffect(() => {
    if (user.token) {       
        axios.get(API_BASE_URL + '/user/' + Cookies.get('userId'))
            .then(function (response){
              console.log(response);
              setUser(prevState => ({ 
                ...prevState,
                userName: response.data.username,
                email: response.data.email,
                picture : API_BASE_URL +response.data.profile_photo
                }));
                console.log(user);
            })
            .catch(function (error) {
                console.log(error);
                
            });

    }
},[] );
    
   const [state , setState]=useState(
    {
        navigate:false,
        file:null
    }
  )
  const uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);
  const handleImageUpload = e => {
    setState({file:e.target.files[0]});
    const [file] = e.target.files;
    if (file) {
      const reader = new FileReader();
      const { current } = uploadedImage;
      current.file = file;
      reader.onload = e => {
        //current.src = e.target.result;
        setUser(prevState => ({
          ...prevState,
          picture : e.target.result
      }));
  
      };
      reader.readAsDataURL(file);
    }
  };
  
    
  return(
    <div className="main-content bg-dark">
      <div className="container-fluid p-2">
        <div className="d-flex flex-wrap">
         <div className="col-12 col-md-4 ">
          <div className="card border-light border-2 text-white p-2 m-1" style={{backgroundColor:'rgba(70, 70, 60, 0.8)'}}>
            <div class="card-header d-flex justify-content-center">
              <div className="text-center">
                <Avatar src={user.picture} ref={uploadedImage} alt="عکس" className="" style={{width:120, height:120}}/>
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
                  
                  <div class="col-sm-4 ">
                    <label for="inputFirstName" class="form-label">نام</label>
                    <input type="text" class="form-control" id="inputFirstName" />
                  </div>
                  <div class="col-sm-4">
                    <label for="inputLastName" class="form-label">نام خانوادگی</label>
                    <input type="text" class="form-control" id="inputLastName"/>
                  </div>
                  <div class="col-sm-4 ">
                    <label for="inputFirstName" class="form-label">نام کاربری</label>
                    <input type="text" class="form-control" id="inputFirstName" />
                  </div>
                  <div class="col-12 ">
                    <input class="form-control" 
                    type="file" accept="image/*" 
                    onChange={handleImageUpload} 
                    ref={imageUploader} 
                    style={{ display: "none",color:"white" }} />
                    <div className="btn btn-outline-light " onClick={() => imageUploader.current.click()}>
                     <AddPhotoAlternateIcon></AddPhotoAlternateIcon>
                     انتخاب عکس جدید
                   </div>
                  </div>
                  <div class="col-12">
                    <button type="submit" class="btn btn-outline-light">تغییر اطلاعات</button>
                  </div>
                  
                  <hr></hr>

                  <div class="col-sm-4">
                    <label for="inputPassword4" class="form-label">رمز فعلی</label>
                    <input type="password" class="form-control" id="inputPassword4"/>
                  </div>
                  <div class="col-sm-4">
                    <label for="inputPassword4" class="form-label">رمز جدید</label>
                    <input type="password" class="form-control" id="inputPassword4"/>
                  </div>
                  <div class="col-sm-4">
                    <label for="inputPassword4" class="form-label">تکرار رمز جدید</label>
                    <input type="password" class="form-control" id="inputPassword4"/>
                  </div>

                  <div class="col-12">
                    <button type="submit" class="btn btn-outline-light">تغییر رمز</button>
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