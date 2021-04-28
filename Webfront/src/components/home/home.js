  import React, { useState, useEffect } from "react";
  import { withRouter } from "react-router-dom";
  import { Card, CardColumns,Img ,Row} from "react-bootstrap";
  import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import "./home.css";
  
  function Home(props) {
    return (
  <div>

    <div className="home">
  <div className="homePage" >

<div class="row row-cols-1 row-cols-md-3" >
<div class="col mb-4">
  <Card style={{ width: '20rem' }}>
  <Card.Img  class="rounded-circle z-depth-0" alt="100x100"    variant="top" src='C:\Users\es\Pictures\Saved Pictures\images.jpg'  data-holder-rounded="true"/>
    <Card.Body>
      <Card.Title>Card Title</Card.Title>
      <Card.Text>
        Some quick example text to build on the card title and make up the bulk of
        the card's content.
      </Card.Text>
      <Button variant="primary">Go somewhere</Button>
    </Card.Body>
  </Card>
  </div>
  <div class="col mb-4">
  <Card style={{ width: '20rem' }}>
  <Card.Img  class="rounded-circle z-depth-0" alt="100x100"    variant="top" src='https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cGljfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60'  data-holder-rounded="true" style={{width:"50%" ,height:"40%"}}/>
    <Card.Body>
      <Card.Title>Card Title</Card.Title>
      <Card.Text>
        Some quick example text to build on the card title and make up the bulk of
        the card's content.
      </Card.Text>
      <Button variant="primary">Go somewhere</Button>
    </Card.Body>
  </Card>
  </div>
  <div class="col mb-4">
  <Card style={{ width: '20rem' }}>
  <Card.Img  class="rounded-circle z-depth-0" alt="20x20"    variant="top" src='https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGljfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60'  data-holder-rounded="true"/>
    <Card.Body>
      <Card.Title>Card Title</Card.Title>
      <Card.Text>
        Some quick example text to build on the card title and make up the bulk of
        the card's content.
      </Card.Text>
      <Button variant="primary">Go somewhere</Button>
    </Card.Body>
  </Card>
  </div>
  </div>
  </div>
  </div>
  </div>
    )

  }
  

export default withRouter(Home);
