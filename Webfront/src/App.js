import React from "react";
import "./App.css";
//import "bootstrap/dist/css/bootstrap.min.css"
import Navbar from "./Navbar.js";
//import {Container ,Row,Col,Button,nav} from  "react-bootstrap";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  //Link,
  Redirect,
} from "react-router-dom";
//import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import login from "./components/login/login";
import signUp from "./components/login/signUp";
import editProfileDoctor from "./components/editProfile-doctor/editProfile-doctor";
import UserProfile from "./components/userProfile/userProfile";
import ForgotPassword from "./components/login/forgotPassword";
import Verification from "./components/login/verification";
import Doctorcalender from "./components/doctortimes/Doctorcalender";
//import Cookies from "js-cookie";
import Home from "./components/home/home";
import SearchResult from "./components/search/searchResult"

function App() {
  function PrivateRoute({ component: Component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
          // !!Cookies.get("userTokenA")
          true ? (
            <div>
              <Navbar></Navbar>
              <Component {...props} />
            </div>
          ) : (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          )
        } //or from: props.location
      />
    );
  }
  return (
    <Router>
      <div data-testid="router" className="text-right" style={{ direction: "rtl" }}>
        <Switch>
          <Route path="/" exact={true}>
            <Navbar />
            <Home />
          </Route>

          <Route path="/signup" component={signUp} />
          <Route path="/login" component={login} />

          <PrivateRoute path="/doctorProfile" component={editProfileDoctor} />
          <PrivateRoute path="/userProfile" component={UserProfile} />

          <Route path="/forgotPassword/:tokenId/:token"component={ForgotPassword}/>
          <Route path="/verification/:tokenId" component={Verification} />

          <Route path="/doctorcal">
            <Navbar />
            <Doctorcalender />
          </Route>

          <Route path="/searchResult/:search">
            <Navbar />
            <SearchResult />
          </Route>



          <Route path="*">
              <div class="alert alert-warning" role="alert">
                صفحه وجود ندارد
              </div>
            </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
