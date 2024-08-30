import React, { useEffect, useState } from "react";
import "./LandingPage.scss";
import { Divider } from "primereact/divider";
import api from "../axiosInceptor/api";
import Cookies from "js-cookie";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faComment,
  faThumbsUp,
} from "@fortawesome/free-regular-svg-icons";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import DOMPurify from "dompurify";
import moment from 'moment';
import { useUserContext } from "../contextFolder/UserProvider ";
import WebSocketComponent from "../websocket/WebSocketComponent";


export default function LandingPage() {
  const [allPost, setAllPost] = useState();
  const Bearer = Cookies.get("access_Token");
  const ref_token = Cookies.get("refresh_Token");
  const { userData, setUserData } = useUserContext();

  // console.log(ref_token);

  useEffect(() => {
    api
      .get("/post/get-all-post", {
        headers: {
          Authorization: `Bearer ${Bearer}`,
        },
      })
      .then((response) => setAllPost(response.data))
      .catch((error) => console.log(error));
  }, []);

  function showDate(dateStr) {
    return moment(dateStr).format('DD-MMM-YYYY');
  }

  return (
    <div className="landingpage-main">
      <WebSocketComponent />
      {/* <Divider layout="vertical" /> */}
      {/* <div className="landing-header" onClick={() => {}}>
        <span>Hiii { userData?.lastName} share Something.....</span>
      </div> */}
      <div className="landingpage-sec-two">
        {allPost?.map((post) => (
          <div className="landing-post-container">
            <div className="landing-post-header">
              <div className="landing-header-image-container">
                <img src={`${`data:image/jpeg;base64,${post?.profile}`}`} />
              </div>
              <div className="landing-header-about">
                <span className="person-about">{post?.firstName + " " + post?.lastName} </span>
                <span className="post-date">{post?.postTime ? showDate(post?.postTime ) : ""}</span>
              </div>
            </div>
            <Divider />
            <div className="landing-post-body">
              {post?.content && (
                <div
                  className="landing-post-content"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post?.content),
                  }}
                ></div>
              )}
              {post?.image && (
                <div className="landing-post-image">
                  <img src={`${`data:image/jpeg;base64,${post?.image}`}`} />
                </div>
              )}
            </div>
            <Divider />
            <div className="landing-post-footer">
              <div className="landing-footer-part-one">
                <FontAwesomeIcon icon={faThumbsUp} size="xl" style={{color:"gray"}}/>
              </div>
              <div className="landing-footer-part-two">
                <FontAwesomeIcon icon={faComment} size="xl" style={{color:"gray"}}/>
              </div>
              <div className="landing-footer-part-three">
                <FontAwesomeIcon icon={faShare} size="xl" style={{color:"gray"}}/>
              </div>
              <div className="landing-footer-part-four">
                <FontAwesomeIcon icon={faBookmark} size="xl" style={{color:"gray"}}/>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* <Divider layout="vertical" /> */}
    </div>
  );
}
