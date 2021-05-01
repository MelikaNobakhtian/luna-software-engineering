import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../apiConstant/apiConstant";
import { Avatar } from "@material-ui/core";
//import GradeRoundedIcon from "@material-ui/icons/GradeRounded";
//import { RiUserStarFill } from "react-icons/all";
//import { FcApproval } from "react-icons/fc";
import ReactiveButton from "reactive-button";

function SearchResult(props) {
  console.log(props.match.params.search);
  const [doctors, setDoctors] = useState([]);
  //const [page, setPage] = useState(1);
  //const [pagesNumber, setPagesNumber] = useState();
  //console.log(s)

  useEffect(() => {
    axios
      .get(
        `${API_BASE_URL}/doctors?${props.match.params.search}search-fields=first_name&search-fields=last_name&search-fields=specialty&search-fields=city&search-fields=state`,
        {
          headers: {
            Authorization: "Token " + Cookies.get("userToken"),
          },
        }
      )
      .then((response) => {
        console.log(response);
        setDoctors(response.data);
        //setPagesNumber(response.data.count);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.match.params.search]);

  const routeToDoctorHandler = () => {
    props.history.push("/visitDoctor");
  };

  const [state, setState] = useState("idle");

  const onClickHandler = () => {
    setState("loading");
    setTimeout(() => {
      setState("success");
    }, 2000);
  };
  return (
    <div data-testid="searchResult" className="main-content m-5">
      <div className="home">
        <div className="homePage">
          {doctors === undefined || doctors.length === 0 ? (
            <p id="noResultPage">نتیجه‌ای برای نمایش وجود ندارد</p>
          ) : (
            <div
              class="row row-cols-1 row-cols-md-3 row-cols-sm-2"
              style={{ textAlign: "right" }}
            >
              {doctors.map((current) => (
                <div class="col mb-4">
                  <div class="card h-100">
                    <div
                      class=" card-header d-flex justify-content-center"
                      style={{ borderRadius: "5%" }}
                    >
                      <Avatar
                        src={current.user.profile_photo}
                        alt={current.first_name}
                        className=""
                        onClick={() => routeToDoctorHandler(current.id)}
                        style={{
                          width: 150,
                          height: 150,
                          justifyontent: "Center",
                          margin: "5%",
                        }}
                      />
                    </div>
                    <div class="card-body">
                      <h5
                        class="card-title btn m-n2 text-break"
                        onClick={() => routeToDoctorHandler(current.id)}
                      >
                        {"دکتر " +
                          current.user.first_name +
                          " " +
                          current.user.last_name}
                      </h5>
                      <div class="card-text text-break">
                        {" "}
                        {"تخصص " + current.specialty}
                      </div>
                      <div class="card-text text-break">
                        {" "}
                        {current.sub_specialty}
                      </div>
                      {/* {current.addresses.length === 0 ? (
                        <div></div>
                      ) : (
                        current.addresses.map((address) => {
                          if (address)
                            return (
                              <div
                                class="card-text text-break"
                                style={{ color: "#6F6D6D" }}
                              >
                                {"● " +
                                  address.state +
                                  "،" +
                                  address.city +
                                  "،" +
                                  address.detail}
                              </div>
                            );
                        })
                      )} */}
                    </div>
                    <div className="align-items-center m-3">
                      <div class="card-subtitle mt-1 ">
                        <ReactiveButton
                          buttonState={state}
                          onClick={onClickHandler}
                          color={"green"}
                          idleText={"نوبت دهی"}
                          loadingText={"Loading"}
                          successText={"Success"}
                          type={"button"}
                          className={"class1 class2"}
                          style={{ borderRadius: "5px" }}
                          shadow={true}
                          size={"normal"}
                          messageDuration={2000}
                          buttonRef={null}
                          animation={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* <div className="mb-5">
          {pagesNumber === 1 || pagesNumber === undefined ? (
            <p></p>
          ) : (
            <div>
              {Array.from(Array(pagesNumber), (e, i) => {
                return (
                  <div
                    className="btn btn-light"
                    onClick={() => {
                      setPage(i + 1);
                    }}
                  >
                    {" "}
                    {i + 1}{" "}
                  </div>
                );
              })}
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}

export default withRouter(SearchResult);
