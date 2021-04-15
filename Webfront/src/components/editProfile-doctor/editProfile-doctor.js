import React, { Component } from "react";
import { useState,useEffect} from "react";
import { Toast, Button, Form, FormGroup, Label, Input, FormText,Col,InputGroup } from 'react-bootstrap';
import { Link, Redirect, withRouter, useHistory } from 'react-router-dom';
import { Avatar } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import axios from 'axios';
import Cookies from 'js-cookie';
import {API_BASE_URL} from '../apiConstant/apiConstant';
import Snackbar from '@material-ui/core/Snackbar';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';


function Editprofile(props) {

    const [user , setUser] = useState({  token : "", userName : "", firstName : "",
        lastName : "",email : "", picture : "", oldPass :"",  newPass:"", newPass2 : "",
        addresses:[], specialty:"", sub_specialty:""
     })
     
     const [type, setType] = useState('');
     useEffect(() => {
      if (user.token) {       
          axios.get(API_BASE_URL + '/doctor/' + Cookies.get('doctorId'))
              .then(function (response){
                console.log(response);
                setUser(prevState => ({ 
                  ...prevState,
                  userName: response.data.username,
                  firstName:response.data.first_name,
                  lastName:response.data.last_name,
                  email: response.data.email,
                  picture : API_BASE_URL +response.data.profile_photo,
                  specialty:response.data.specialty,
                  sub_specialty:response.data.sub_specialty,
                  city:response.data.addresses.city,
                  state:response.data.addresses.state,
                  detail:response.data.addresses.detail
                  }));
              })
              .catch(function (error) {
                  console.log(error);
              });
        }
      },[] );
      const handleChangeInfosClick = (e) => {
        e.preventDefault();
  
        const payload={
              "username":user.userName,
              "first_name":user.firstName,
              "last_name":user.lastName,
              "specialty":user.specialty,
              "sub_specialty":user.sub_specialty
        }
        const back= JSON.stringify(payload)
        axios.put(API_BASE_URL+ '/doctor/'+Cookies.get('doctorId')+'/update-profile',
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
  
          axios.put( API_BASE_URL+ '/doctor/'+Cookies.get('doctorId')+'/change-password',
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
    
  return (
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
   <Form>
  <form class="row g-3">  
<div class="col-sm-4">
    <Form.Group   controlId="formGridName"  >
          <Form.Label className="mt-3">نام</Form.Label>
          <InputGroup hasValidation>
          <Form.Control
            type="text"
            name="name"
            value={user.firstName}
            onChange={handleChange}
            onBlur={handleChange}
          />
          <Form.Control.Feedback type="invalid">{""} </Form.Control.Feedback>
          </InputGroup>
          </Form.Group>
          </div>
          <div class="col-sm-4 ">
          <Form.Group  controlId="formGridLastname">
          <Form.Label className="mt-3">نام خانوادگی</Form.Label>
          <InputGroup hasValidation>
          <Form.Control
            type="text"
            name="last name"
            value={user.lastname}
            onChange={handleChange}
            onBlur={handleChange}
          />
          <Form.Control.Feedback type="invalid">{""} </Form.Control.Feedback>
          </InputGroup>
          </Form.Group>
          </div>

          <div class="col-sm-4">
       <Form.Group  controlId="">
          <Form.Label className="mt-3"> نام کاربری</Form.Label>
          <InputGroup hasValidation>
          <Form.Control
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            onBlur={handleChange}
          />
    <Form.Control.Feedback type="invalid" >{""}</Form.Control.Feedback>
          </InputGroup>
          </Form.Group>
         </div>
       <div class="col-sm-4">
         <Form.Group >
        <Form.Label>استان</Form.Label>
        <Form.Control controlId="formGridState"
          as="select"
          defaultValue=" choose...."
          value={user.state}
          onChange={e => {
            console.log("e.target.value", e.target.value);
            setUser({...user,state:e.target.value});
          }}
        >
          <option value="آذربایجان شرقی"> 
          آذربایجان شرقی </option>
            <option value="	آذربایجان غربی">
            آذربایجان غربی
            </option>
            <option value="اردبیل">
            اردبیل
            </option>
            <option value="اصفهان">
            اصفهان
            </option>
            <option value="البرز">
            البرز
            </option>
            <option value="ایلام">
            ایلام
            </option>
            <option value="بوشهر">
            بوشهر
            </option>
            <option value="تهران">
            تهران
            </option>
            <option value="چهارمحال و بختیاری">
            چهارمحال و بختیاری
            </option>
            <option value="خراسان جنوبی">
            خراسان جنوبی
            </option>
            <option value="خراسان رضوی">
            خراسان رضوی
            </option>
            <option value="خراسان شمالی	">
            خراسان شمالی	
            </option>
            <option value="خوزستان">
            خوزستان
            </option>
            <option value="	زنجان">
            زنجان
            </option>
            <option value="سمنان">
            سمنان
            </option>
            <option value="سیستان و بلوچستان	">
            سیستان و بلوچستان	
            </option>
            <option value="فارس">
            فارس
            </option>
            <option value="قزوین">
            قزوین
            </option>
            <option value="	قم">
            قم
              </option>
              <option value="	کردستان">
              کردستان
              </option>
              <option value="کرمان">
              کرمان
              </option>
              <option value="کرمانشاه">
              کرمانشاه
              </option>
              <option value="کهگیلویه و بویراحمد">
              کهگیلویه و بویراحمد
              </option>
              <option value="	گلستان">
              گلستان
              </option>
              <option value="گیلان">
              گیلان
              </option>
              <option value="لرستان">
              لرستان
              </option>
              <option value="	مازندران">
              مازندران
              </option>
              <option value="مرکزی">
              مرکزی
              </option>
              <option value="	هرمزگان">
              هرمزگان
              </option>
              <option value="	همدان">
              همدان
              </option>
              <option value="یزد">
              یزد
              </option>
        </Form.Control>
      </Form.Group>
     </div>
      <div class="col-sm-4">
      <Form.Group>
          <Form.Label>شهر</Form.Label>
          <InputGroup hasValidation>
          <Form.Control
                    type="text"
                    //  placeholder="شهر"
                    value={user.addresses.city}
                     onChange={handleChange}/>
                     </InputGroup>
                     </Form.Group>
                  </div>
      <div class="col-sm-4">
      <Form.Group>
          <Form.Label>آدرس</Form.Label>
          <InputGroup hasValidation>
          <Form.Control
                    type="text"
                    // placeholder="آدرس"
                    value={user.addresses.detail}
                    onChange={handleChange}
                     />
                     </InputGroup>
                     </Form.Group>
                  </div>
                  <div class="col-sm-4">
        <Form.Group controlId="formBasicSelect">
        <Form.Label> تخصص خود را انتخاب کنید :</Form.Label>
        <Form.Control as={Col} controlId="formGridState"
          as="select"
        //   defaultValue=" choose...."
          value={user.specialty}
          onChange={e => {
            console.log("e.target.value", e.target.value);
            setUser({...user,specialty:e.target.value});
          }}
        >
            <option value='ﭼﺸﻢ ﭘﺰﺷﮑﯽ'>
            ﭼﺸﻢ ﭘﺰﺷﮑﯽ</option> 
            <option value="ﻗﻠﺐ ﻭ ﻋﺮﻭﻕ">
            ﻗﻠﺐ ﻭ ﻋﺮﻭﻕ
            </option>
            <option value="ﻣﻐﺰ ﻭ ﺍﻋﺼﺎﺏ">
            ﻣﻐﺰ ﻭ ﺍﻋﺼﺎﺏ
            </option>
            <option value="ﺩﺍﺧﻠﯽ ‏">
            ﺩﺍﺧﻠﯽ
            </option>
            <option value="ﮐﻮﺩﮐﺎﻥ">
            ﮐﻮﺩﮐﺎﻥ ‏
            </option>
            <option value="ﺍﻋﺼﺎﺏ ﻭ ﺭﻭﺍﻥ">
            ﺍﻋﺼﺎﺏ ﻭ ﺭﻭﺍﻥ
            </option>
            <option value="ﻋﻤﻮﻣﯽ">
            ﻋﻤﻮﻣﯽ</option> 
        </Form.Control>
      </Form.Group>
      </div>

      <div class="col-sm-4">
      <Form.Group>
          <Form.Label>تخصص</Form.Label>
          <InputGroup hasValidation>
          <Form.Control
            type="text"
            name="username"
            // placeholder="تخصص"
            value={user.sub_specialty}
            onChange={handleChange}
         
          />
          </InputGroup>
          </Form.Group>
          </div>

          <div class="col-12 ">
          <Form.Group>
          <InputGroup hasValidation>
          <Form.Control
            type="file" accept="image/*" 
            onChange={handleImageUpload} 
            ref={imageUploader} 
            style={{ display: "none",color:"white" }} />
            <div className="btn btn-outline-light " onClick={() => imageUploader.current.click()}>

            <AddPhotoAlternateIcon></AddPhotoAlternateIcon>
                     انتخاب عکس جدید
                   </div>
                </InputGroup>
                </Form.Group>
                </div>
                <div class="col-12 ">
                    <button type="submit" class="btn btn-outline-light">ذخیره تغییرات</button>
                    </div>
                  <hr></hr>
        <div class="col-sm-4">
         <Form.Group>
          <Form.Label  className=""> رمز فعلی</Form.Label>
          <InputGroup hasValidation>
          <Form.Control 
             type="password"
             id="oldPass"
            value={user.oldPass}
            onChange={handleChange}
            />
            </InputGroup>
            </Form.Group>
            </div>
            <div class="col-sm-4">
            <Form.Group>
          <Form.Label  className="">رمز جدید</Form.Label>
          <InputGroup hasValidation>
          <Form.Control 
             type="password"
             id="newPass"
             value={user.newPass} 
            onChange={handleChange}
            />
            </InputGroup>
            </Form.Group>
            </div>
            <div class="col-sm-4">
            <Form.Group>
          <Form.Label  className="">تکرار رمز جدید</Form.Label>
          <InputGroup hasValidation>
          <Form.Control 
             type="password"
             id="newPass2"
             value={user.newPass2} 
            onChange={handleChange}
            />
            </InputGroup>
            </Form.Group>
                  </div>
                  <div class="col-12">
                  <button type="submit" class="btn btn-outline-light" onClick={handleChangePassClick}>
                    <CheckCircleIcon></CheckCircleIcon>
                    تغییر رمز</button>
                    </div>
                   </form>
                </Form>
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
);
}
export default withRouter(Editprofile);