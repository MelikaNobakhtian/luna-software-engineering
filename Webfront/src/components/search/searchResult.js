import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../apiConstant/apiConstant";
import { Avatar } from "@material-ui/core";

function SearchResult(props) {
  const [doctors, setDoctors] = useState([]);
  const [page, setPage] = useState(1);
  const [pagesNumber, setPagesNumber] = useState();

  useEffect(() => {
    axios
      .get(
        `${API_BASE_URL}/groups?search=${props.match.params.search}&search-fields=title&page=${page}`,
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

  return (
    <div className="main-content">
      <div className="container-fluid p-2">
        <div className="d-flex flex-wrap">
            
        </div>
      </div>
    </div>
  );
}

export default withRouter(SearchResult);
