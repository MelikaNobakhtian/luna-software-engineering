import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Card, CardColumns, Img, Row } from "react-bootstrap";
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./home.css";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../apiConstant/apiConstant";
import { Avatar } from "@material-ui/core";
import ReactiveButton from 'reactive-button';

function Home(props) {
  const [state, setState] = useState('idle');
  const [doctor, setDoctor] = useState([]);

  useEffect(() => {
    //if (Cookies.get("userTokenA")) {
      axios
        .get(API_BASE_URL + "/home/?filter=recent")
        .then((d) => {
          console.log(d)
          setDoctor(d.data.doctors);
        })
        .catch(function (error) {
          console.log(error);
        });
    //}
  }, []);




  const onClickHandler = () => {
    setState('loading');
    setTimeout(() => {
      setState('success');
    }, 2000);
  }

  return (
    <div>

      <div className="home">
        <div className="homePage" >
          <div class="row row-cols-1 row-cols-md-3 row-cols-sm-2"  >
            {doctor.length === 0 ? <div></div> :
              doctor.map((doc) => {
                if (doc) return (
                  <div class="col mb-4">
                    <Card  >
                      <div class=" card-header d-flex justify-content-center" style={{ borderRadius: '5%' }} >
                        <Avatar
                          src={doc.user.profile_photo}
                          alt="عکس"
                          className=""
                          style={{ width: 150, height: 150, justifyontent: "Center", margin: "5%" }}
                        />
                      </div>
                      <Card.Body>
                        <Card.Title>{"دکتر " + doc.user.first_name + " " + doc.user.last_name}</Card.Title>

                        <Card.Text>
                          {"تخصص " + doc.specialty}
                        </Card.Text>
                        <Card.Text>
                          {doc.sub_specialty}
                        </Card.Text>

                        {doc.addresses.length === 0 ? <div></div> :
                          doc.addresses.map((address) => {
                            if (address) return (
                              <Card.Text style={{ color: "#6F6D6D" }}>
                                {"● " + address.state + "،" + address.city + "،" + address.detail}
                              </Card.Text>

                            )
                          })}

                        <ReactiveButton
                          buttonState={state}
                          onClick={onClickHandler}
                          color={'green'}
                          idleText={'نوبت دهی'}
                          loadingText={'Loading'}
                          successText={'Success'}
                          type={'button'}
                          className={'class1 class2'}
                          style={{ borderRadius: '5px' }}
                          shadow={true}
                          size={'normal'}
                          messageDuration={2000}
                          buttonRef={null}
                          animation={true}
                        />
                      </Card.Body>
                    </Card>
                  </div>
                )
              })}

          </div>
        </div>
      </div>
    </div>
  )

}


export default withRouter(Home);
