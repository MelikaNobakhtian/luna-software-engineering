import React, { useState, useEffect } from "react";
import {Redirect,withRouter} from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import {API_BASE_URL} from '../apiConstant/apiConstant';
import { Avatar } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Snackbar from '@material-ui/core/Snackbar';

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
                firstName:response.data.firstName,
                lastName:response.data.lastName,
                email: response.data.email,
                picture : API_BASE_URL +response.data.profile_photo
                }));
            })
            .catch(function (error) {
                console.log(error);
            });
      }
    },[] );

    const handleChangeInfosClick = (e) => {
      e.preventDefault();
      // var formdata = new FormData()
      // formdata.append('username',user.userName)
      // formdata.append('firstName',user.firstName)
      // formdata.append('photo',state.file)
      // console.log(formdata);
      const payload={
            "username":user.userName,
            "firstName":user.firstName,
            "lastName":user.lastName
      }
      const back= JSON.stringify(payload)
      axios.put(API_BASE_URL+ '/user/'+Cookies.get('userId')+'/update-profile',
      back,{
          headers:{
         "Content-Type":"application/json",
         "Authorization":"Token "+Cookies.get("userToken")}
          })
              .then(function (response) {
              console.log(response);
              if(response.status === 200){
                  console.log(response.status);
                  setMassage('اطلاعات جدید با موفقیت جایگزین شد')
                  setOpenSnack(true);
                  Cookies.set('userName',user.userName);
              }
          })
          .catch(function (error) {
              console.log(error);
              setMassage("نام کاربری از قبل وجود دارد")
              setOpenSnack(true);
          });
  }

    const handleChange = (e) => {
      const {id , value} = e.target   
      setUser(prevState => ({
          ...prevState,
          [id] : value
      }))
  }
    
   const [state , setState]=useState(
    {
        navigate:false,
        file:null
    }
  )
  const handleChangePassClick = (e) => {
    e.preventDefault();
    if(user.oldPass.length&&user.newPass.length){
        const payload={
            "old_password": user.oldPass,
            "new_password":user.newPass,
        }
        const back= JSON.stringify(payload);
        console.log(back);

        axios.put( API_BASE_URL+ '/user/'+Cookies.get('userId')+'/change-password',
         back
         ,{
          headers:{
         "Content-Type":"application/json",
        "Authorization":"Token "+Cookies.get("userToken")}
         }

        ).then(function(response){
            console.log(response);
            setMassage('پسورد با موفقیت عوض شد')
            setOpenSnack(true);

        })
        .catch(function(error){
            console.log(error);
            setMassage("پسورد قبلی غلط است")
            setOpenSnack(true);
         })
        
    }
    else { 
     }

     setUser(prevState => ({
      ...prevState,
      oldPass : "",
      newPass:""
  })); 

}

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
  
  const [massage, setMassage]= useState(<br></br>);
  const[openSnack,setOpenSnack]=useState(false);
  const handleCloseSnack = (event, reason) => {
  if (reason === 'clickaway') {
  return;
  }
  setOpenSnack(false);
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
                    <label for="firstName" class="form-label">نام</label>
                    <input type="text" class="form-control" id="firstName" 
                    value={user.firstName} onChange={handleChange}/>
                  </div>
                  <div class="col-sm-4">
                    <label for="lastName" class="form-label">نام خانوادگی</label>
                    <input type="text" class="form-control" id="lastName"
                    value={user.lastName} onChange={handleChange}/>
                  </div>
                  <div class="col-sm-4 ">
                    <label for="userName" class="form-label">نام کاربری</label>
                    <input type="text" class="form-control" id="userName" 
                    value={user.userName} onChange={handleChange}/>
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
                    <button type="submit" class="btn btn-outline-light"  onClick={handleChangeInfosClick}>
                      <CheckCircleIcon></CheckCircleIcon>
                      ذخیره تغییرات</button>
                  </div>
                  
                  <hr></hr>

                  <div class="col-sm-4">
                    <label for="oldPass" class="form-label">رمز فعلی</label>
                    <input type="password" class="form-control" id="oldPass"
                    value={user.oldPass} onChange={handleChange}/>
                  </div>
                  <div class="col-sm-4">
                    <label for="newPass" class="form-label">رمز جدید</label>
                    <input type="password" class="form-control" id="newPass"
                    value={user.newPass} onChange={handleChange}/>
                  </div>
                  <div class="col-sm-4">
                    <label for="newPass2" class="form-label">تکرار رمز جدید</label>
                    <input type="password" class="form-control" id="newPass2"
                    value={user.newPass2} onChange={handleChange}/>
                  </div>

                  <div class="col-12">
                    <button type="submit" class="btn btn-outline-light" onClick={handleChangePassClick}>
                    <CheckCircleIcon></CheckCircleIcon>
                    تغییر رمز</button>
                  </div>
                </form>
              </div>
              
            </div>
          </div>
         </div>
         <Snackbar
          anchorOrigin={{ vertical:'bottom', horizontal:'center'}}
          open={openSnack}
          autoHideDuration={2500}
          onClose={handleCloseSnack}
          message={<div style={{fontSize:17}}>{massage}</div>}
          />
        </div>
      </div>
    </div>

  )
}
export default withRouter(UserProfile);