import React, { Component } from "react";
import { useState,useEffect} from "react";
import { Toast, Button, Form, FormGroup, Label, Input, FormText,Col,InputGroup } from 'react-bootstrap';
import { Link, Redirect, withRouter, useHistory } from 'react-router-dom';
import {API_BASE_URL} from '../apiConstant/apiConstant';

function Editprofile(props) {

    const [user, setUser] = useState({name:"saba",lastname:"rr ",username:"sabary",
    file:" ",degree:" ",adderess:" ",fieldCity:" ",specialty:" "});
  

    useEffect(async () => {
        fetch(API_BASE_URL, {
          method: 'GET',
          headers: {
            "Authorization": "Token " + localStorage.getItem('loginToken')
          }
        })
          .then((res) => {
            if (res.status === 200) {
              return res.json()
            }
          }
          )
          .then((data) => { if(data) 
            {
            setUser({name:data.name,lastname:data.lastname,username:data.username,file:data.file, 
                degree:data.degree, adderess:data.adderess,fieldCity:data.fieldCity})}});
            console.log("")
      
      }, []);


      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Token " + localStorage.getItem('loginToken'));
      let fd = new FormData();
      fd.append('name',user.name )
      fd.append('lastname', user.lastname);
      fd.append('username', user.username);
      fd.append('img', user.img);
      fd.append('degree', user.degree);
      fd.append('adress', user.adderess);
      fd.append('fieldCity', user.fieldCity);
      

      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: fd,
      };
  
      fetch(API_BASE_URL, requestOptions)
        .then(async (response) => {
          console.log('status', response.status)
  
          if (response.status === 200) 
  
          return response.json()
        })
        .catch(error => {
          console.log('error', error)
        });

          
      const handleChange =(e) => {
        e.preventDefault();
        const {id , value} = e.target   
        setUser(prevState => ({
            ...prevState,
            [id] : value
        }))
    }
          
    function handleSubmit(event) {
        event.preventDefault();
        
      }

  return (
    <div className="background d-flex justify-content-center ">
    <div className="outer">
    <div className="row justify-content-center">
      <div className="col-xs-10 col-sm-9 col-md-6 col-lg-5 col-xl-4">
        <div className="inner">

    <Form noValidate onSubmit= {handleSubmit}>

    <Form.Group >
          <Form.Label className="mt-3">نام</Form.Label>
          <InputGroup hasValidation>
          <Form.Control
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            onBlur={handleChange}
          />
          <Form.Control.Feedback type="invalid">{""} </Form.Control.Feedback>
          </InputGroup>
          </Form.Group>


          <Form.Group >
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

       <Form.Group>
          <Form.Label> نام کاربری</Form.Label>
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


          <Form.Group>
          <Form.Label  className="mt-3"> کلمه عبور</Form.Label>
          <InputGroup hasValidation>
          <Form.Control 
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            onBlur={handleChange}
          />
    <Form.Control.Feedback type="invalid">{""}</Form.Control.Feedback>
          </InputGroup>
          </Form.Group>

          <Form.Group >
          <Form.Label  className="mt-3"> تایید کلمه عبور </Form.Label>
          
          <Form.Control
            type="password"
            name="confrim password"
            value={user.confirmPass}
            onChange={handleChange}
            onBlur={handleChange}
          />
          <Form.Control.Feedback type="invalid">{""}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
               <div >
                  <img src={user.file} alt="" id="img" className="img" />
                   <Form.File id="uploadImg" accept="image/*" className="butChoose" onChange={handleChange} />
               </div>

           </Form.Group>
        <Form.Group controlId="formBasicSelect">
        <Form.Label> تخصص خود را انتخاب کنید :</Form.Label>
        <Form.Control as={Col} controlId="formGridState"
          as="select"
          defaultValue=" choose...."
          value={user.specialty}
          onChange={handleChange}
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
     
  
      <Button  className="mt-3" block  type="submit" variant="success">ذخیره تغییرات</Button>

    </Form>

    </div>
    </div>
    </div>
</div>
</div>
);
}
export default withRouter(Editprofile);