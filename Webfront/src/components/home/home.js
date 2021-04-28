  import React, { useState, useEffect } from "react";
  import { withRouter } from "react-router-dom";
  import { Card, CardColumns,Img ,Row} from "react-bootstrap";
  import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import "./home.css";
  import axios from "axios";
  import Cookies from "js-cookie";
  import { API_BASE_URL } from "../apiConstant/apiConstant";
  import { Avatar } from "@material-ui/core";
  
  function Home(props) {
    const [doctor, setDoctor] = useState([ {
      "id": 15,
      "user": {
          "id": 28,
          "password": "pbkdf2_sha256$216000$NsKTzsQCFHmy$SHNr8kvIjMpqIozqeu5aYc63qfNMdYY9Lwf2yoK4Qns=",
          "last_login": null,
          "is_superuser": false,
          "username": "FAhm",
          "first_name": "F",
          "last_name": "Omid",
          "email": "fateme.ahmadi1522@gmail.com",
          "profile_photo": 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cGljfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60' ,
          "is_verified": false,
          "is_staff": false,
          "created": "2021-04-22T17:39:21.715630Z",
          "auth_provider": "email",
          "groups": [],
          "user_permissions": []
      },
      "specialty": "ali",
      "sub_specialty": "iiii",
      "addresses": [ {"state": "alo", "city": "alo","detail":"yyy"}]
  }]);
  
    useEffect(() => {
      if (Cookies.get("userTokenA")) {
        axios
          .get(API_BASE_URL + "/home/")
          .then((d) => {
              setDoctor(doctor.concat(Array.from(d.results)));
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }, []);


return (
  <div>

 <div className="home">
<div className="homePage" >
<div class="row row-cols-1 row-cols-md-3" >
{ doctor.length === 0? <div></div> :
              doctor.map((doc) => {
                if (doc) return (  
  <div class="col mb-4">
  <Card style={{ width: '20rem' }}>
  <div class=" card-header d-flex justify-content-center">
                    <Avatar
                      src= {doc.user.profile_photo}
                      alt="عکس"
                      className=""
                      style={{ width: 150, height: 150 , justifyontent:"Center",margin:"5%"}}
                    />
                </div>
    <Card.Body>
      <Card.Title>{doc.user.first_name +" " + doc.user.last_name}</Card.Title>
      <Card.Text>
       {doc.specialty}
      </Card.Text>
      <Card.Text>
       {doc.sub_specialty}
      </Card.Text>
      <Card.Text>
       {doc.addresses[0].city}
      </Card.Text>
      <Button variant="primary">نوبت دهی</Button>
    </Card.Body>
  </Card>
  </div>

                )
})}
  </div>
  </div>
  </div>
  </div>
    )

  }
  

export default withRouter(Home);
