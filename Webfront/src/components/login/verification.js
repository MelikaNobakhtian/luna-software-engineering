import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  //BrowserRouter as Router,
  //useRouteMatch,
 //useParams,
  withRouter,
} from "react-router-dom";
//import Cookies from "js-cookie";
import { API_BASE_URL } from "../apiConstant/apiConstant";

function Verification(props) {
  const [alart ,setAlart]=useState("")
  console.log(props.match.params.tokenId + "*****************");
  useEffect(() => {
    axios
      .get(API_BASE_URL + "/email-verify/?token=" + props.match.params.tokenId)
      .then(function (response) {
        if(response.message === 'Successfully activated'){
          setAlart("ایمیل شما تایید شد. از صفحه لاگین وارد شوید.")
        }
        if(response.message === 'Activation Expired'){
          setAlart("لینک منقصی شده است. دوباره تلاش کنید.")
        }
        if(response.message === 'Invalid token'){
          setAlart("لینک اشتباه است. دوباره تلاش کنید.")
        }
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [props.match.params.tokenId]);
  return (
    <div>
      <div className="d-flex justify-content-center background">
        <div
          className="shadow-lg border border-5 border-success rounded p-4"
          style={{ backgroundColor: "white" }}
        >
          {alart}
        </div>
      </div>
    </div>
  );
}
export default withRouter(Verification);
