import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../apiConstant/apiConstant";
import { Avatar } from "@material-ui/core";
//import GradeRoundedIcon from "@material-ui/icons/GradeRounded";
//import { RiUserStarFill } from "react-icons/all";
//import { FcApproval } from "react-icons/fc";
function SearchResult(props) {
  const [doctors, setDoctors] = useState([]);
  const [page, setPage] = useState(1);
  const [pagesNumber, setPagesNumber] = useState();

  useEffect(() => {
    axios
      .get(
        `${API_BASE_URL}/doctors?search=${props.match.params.search}&search-fields=name&page=${page}`,
        {
          headers: {
            Authorization: "Token " + Cookies.get("userToken"),
          },
        }
      )
      .then((response) => {
        console.log(response);
        setDoctors(response.data.groups);
        setPagesNumber(response.data.count);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.match.params.search, page]);

  const routeToDoctorHandler = () => {
    props.history.push("/visitDoctor");
  };

  return (
    <div className="main-content">
      <div className="container-fluid p-2">
        <div className="d-flex flex-wrap">
          <div className="mx-md-5">
            {doctors.length === 0 ? (
              <p id="noResultPage">نتیجه‌ای برای نمایش وجود ندارد</p>
            ) : (
              <div
                class="row row-cols-1 row-cols-md-4 row-cols-sm-2"
                style={{ textAlign: "right" }}
              >
                {doctors.map((current) => (
                  <div class="col mb-4">
                    <div class="card h-100 shadow">
                      <Avatar
                        src={current.doctor_photo}
                        alt={current.name}
                        className="card-img-top mx-auto my-2 shadow-sm "
                        onClick={() => routeToDoctorHandler(current.id)}
                        style={{ width: 150, height: 150 }}
                      />
                      <div class="card-body">
                        <h5
                          class="card-title btn m-n2 text-break"
                          onClick={() => routeToDoctorHandler(current.id)}
                          style={{ fontSize: 25 }}
                        >
                          {current.firstname}
                          {current.lastname}
                        </h5>
                        <p class="card-text text-break">{current.specialty}</p>
                      </div>
                      <div className="align-items-center m-3">
                        <h6 class="card-subtitle mt-1 text-muted">
                          {/* <RiUserStarFill></RiUserStarFill> */}
                          {current.score}
                        </h6>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-5">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(SearchResult);
