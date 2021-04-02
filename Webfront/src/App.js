import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import login from './components/login/login';
import signUp from './components/login/signUp';



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
            <Route exact path='/signup' component={signUp} />
            <Route exact path='/login' component={login} />
       
          </Switch>
          </div>
    </Router>
    
  );
}

export default App;
