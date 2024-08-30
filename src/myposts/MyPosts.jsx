import React, { useEffect, useState } from "react";
import "./MyPosts.scss";
import axios from "axios";
import Cookies from "js-cookie";
import { Divider } from "primereact/divider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faThumbsUp,
  faBookmark,
} from "@fortawesome/free-regular-svg-icons";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { useUserContext } from "../contextFolder/UserProvider ";
import ReactQuill from "react-quill";
import DOMPurify from "dompurify";
import api from "../axiosInceptor/api";

export default function MyPosts() {
  const Bearer = Cookies.get("access_Token");
  const email = localStorage.getItem("userEmail");
  const { userData, setUserData } = useUserContext();

  const [postList, setostList] = useState([]);

  useEffect(() => {
    api
      .get(
        `/post/get-my-post?email=${email}`,

        {
          headers: {
            Authorization: `Bearer ${Bearer}`,
          },
        }
      )
      .then((response) => {
        setostList(response.data);
        console.log(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="my-post-main">
      {postList.map((post) => (
        <div className="post-container">
          <div className="post-header">
            <div className="header-image-container">
              <img
                src={`${`data:image/jpeg;base64,${userData?.profileImg}`}`}
              />
            </div>
            <div className="header-about">
              <span>{userData?.firstName + " " + userData?.lastName} </span>
              <span></span>
            </div>
          </div>
          <Divider />
          <div className="post-body">
            {post?.content && (
              <div
                className="post-content"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(post?.content),
                }}
              >
                {/* {DOMPurify.sanitize(post?.content)} */}
              </div>
            )}
            {post?.image && (
              <div className="post-image">
                <img src={`${`data:image/jpeg;base64,${post?.image}`}`} />
              </div>
            )}
          </div>
          <Divider />
          <div className="post-footer">
            <div className="footer-part-one">
              <FontAwesomeIcon icon={faThumbsUp} size="xl" style={{color:"gray"}} />
            </div>
            <div className="footer-part-two">
              <FontAwesomeIcon icon={faComment} size="xl" style={{color:"gray"}} />
            </div>
            <div className="footer-part-three">
              <FontAwesomeIcon icon={faShare} size="xl" style={{color:"gray"}} />
            </div>
            <div className="footer-part-four">
              <FontAwesomeIcon icon={faBookmark} size="xl" style={{color:"gray"}} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
