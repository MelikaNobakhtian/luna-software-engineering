  import React, { useState, useEffect } from "react";
  import { withRouter } from "react-router-dom";
  import { Card, CardColumns,CardImg ,Row} from "react-bootstrap";
  import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap'
 
  
  function Home(props) {
    return (
  <div>
    
  <Card style={{ width: '18rem' }}>
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

  <Card style={{ width: '18rem' }}>
  <Card.Img  class="rounded-circle z-depth-0" alt="20x20"    variant="top" src='https://react.semantic-ui.com/images/avatar/large/matthew.png'  data-holder-rounded="true"/>
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
  
    )

  }
  

export default withRouter(Home);
