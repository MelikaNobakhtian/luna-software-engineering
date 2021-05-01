import React, { useState, useEffect } from "react";
import axios from "axios";
//import Cookies from "js-cookie";
import {
  BrowserRouter as Router,
  useRouteMatch,
  useParams,
  withRouter,
} from "react-router-dom";
import { API_BASE_URL } from "../apiConstant/apiConstant";

function ForgotPassword(props) {
  const [isCurrect, setIsCurrect] = useState(false);
  const [uidb64, setUidb64] = useState({});
  const [token, setToken] = useState({});
  const [state, setState] = useState({
    password: "",
    confirmPassword: "",
    error: "",
  });

  useEffect(() => {
    axios
      .get(
        API_BASE_URL +
          "/password-reset/" +
          props.match.params.tokenId +
          "/" +
          props.match.params.token
      )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          setUidb64(response.data.uidb64);
          setToken(response.data.token);
          setIsCurrect(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [props.tokenId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const changePassword = () => {
    setState((prevState) => ({
      ...prevState,
      backError: "",
    }));
    if (state.password !== state.confirmPassword) {
      setState((prevState) => ({
        ...prevState,
        backError: "پسورد وارد شده تطابق ندارد !",
      }));
    } else if (state.password.length <= 8) {
      setState((prevState) => ({
        ...prevState,
        backError: "رمز باید بیشتر از هشت کاراکتر باشد",
      }));
    } else {
      const payload = {
        password: state.password,
        token: token,
        uidb64: uidb64,
      };
      const back = JSON.stringify(payload);
      axios
        .post(API_BASE_URL + "/password-reset-complete/", back, {
          headers: { "content-type": "application/json" },
        })
        .then(function (response) {
          if (response.status === 401) {
            setState((prevState) => ({
              ...prevState,
              backError: "لینک منقضی شده است",
            }));
          } else if (response.message === "Password reset success") {
            setState((prevState) => ({
              ...prevState,
              backError: "رمز شما با موفقیت عوض شد",
            }));
            redirectToLogin();
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };
  const redirectToLogin = () => {
    props.history.push("/login");
  };

  return (
    <div>
      {isCurrect ? (
        <div className="d-flex justify-content-center background">
          <div className="  ">
            <div className="card border border-5 border-success shadow-lg">
              <div class="card-body ">
                <form className="row g-3">
                  <div>
                    <label class="form-label">رمز جدید</label>
                    <input
                      type="password"
                      id="password"
                      value={state.password}
                      onChange={handleChange}
                      class="form-control"
                      placeholder="رمز جدید خود را وارد کنید"
                    />
                  </div>
                  <div>
                    <label class="form-label">تکرار رمز جدید</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={state.confirmPassword}
                      onChange={handleChange}
                      class="form-control"
                      placeholder="رمز جدید خود را دوباره وارد کنید"
                    />
                  </div>
                  <p className="loginText"> {state.backError} </p>
                </form>
                <button
                  type="submit"
                  class="btn btn-success mt-3"
                  onClick={changePassword}
                >
                  تایید
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>لینک منقضی شده است</div>
      )}
    </div>
  );
}

export default withRouter(ForgotPassword);
