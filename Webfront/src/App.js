import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import Navbar from "./Navbar.js";
  import {Container ,Row,Col,Button,nav} from  "react-bootstrap";
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import login from './components/login/login';
import signUp from './components/login/signUp';
import editProfileDoctor from './components/editProfile-doctor/editProfile-doctor';
import UserProfile from './components/userProfile/userProfile'




function App() {

  
  function PrivateRoute ({component: Component, ...rest}) {

    return (
      <Route
        {...rest}
        render={(props) => !!localStorage.getItem('loginToken')
          ? <Component {...props} />
          : <Redirect to={{pathname: '/sign-in', state: {from: props.location}}} />} //or from: props.location
      />
    )
  }
  return (
    <Router>
       <div className="text-right" style={{direction:"rtl"}}>
          <Switch>
            <Route exact path='/' component={Navbar} />
            <Route path='/signup' component={signUp} />
            <Route path='/login' component={login} />
            <Route path='/doctorProfile' component={editProfileDoctor} />
            <Route path='/userProfile' component={UserProfile} />
            
       
          </Switch>
          </div>
    </Router>
    
  );
}

export default App;
