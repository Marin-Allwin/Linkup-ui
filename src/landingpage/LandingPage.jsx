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
import moment from "moment";
import { useUserContext } from "../contextFolder/UserProvider ";
import WebSocketComponent from "../websocket/WebSocketComponent";
import AddPostDialog from "../profile/AddPostDialog";
import { Badge } from "primereact/badge";
import logo from "../assets/profile2.jpg";
import CommentsDialoge from "./commentsDialoge/CommentsDialoge";

export default function LandingPage() {
  // const [allPost, setAllPost] = useState();
  const [commetShown, setCommentShown] = useState();
  const Bearer = Cookies.get("access_Token");
  const ref_token = Cookies.get("refresh_Token");
  const {
    userData,
    setUserData,
    SetShowAddPost,
    landingPageNotification,
    setLandingPageNotification,
    stompClient,
    isConnected,
    setShowComments,
    allPost,
    setAllPost,
  } = useUserContext();

  useEffect(() => {
    if (isConnected) {
      stompClient.subscribe("/public/posts/likes", (message) => {
        const postUpdated = JSON.parse(message.body);
        setAllPost((prevPosts) =>
          prevPosts.map((post) =>
            post.postId === postUpdated.postId
              ? { ...post, likes: postUpdated.likes }
              : post
          )
        );

        console.log(postUpdated);
      });
    }
  }, [isConnected, stompClient]);

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
    return moment(dateStr).format("DD-MMM-YYYY");
  }

  const handleUpdateLike = (post) => {
    console.log("inside like");
    api
      .post(
        `post/update-like/${userData.personId}?postId=${post.postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Bearer}`,
          },
        }
      )
      .then((response) => {
        console.log("Like updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating like:", error);
      });
  };

  const handleDislike = (post) => {
    console.log("inside dislike");
    api
      .post(
        `post/undo-like/${userData.personId}?postId=${post.postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Bearer}`,
          },
        }
      )
      .then((response) => {
        console.log("Disliked successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating like:", error);
      });
  };

  const handleLikeUnlike = (post) => {
    console.log(post?.postId);
    if (post.likes != null && post.likes != undefined) {
      const likesList = post?.likes.map((p) => {
        return p.personId;
      });
      if (likesList.includes(userData?.personId)) {
        console.log("dislike");
        handleDislike(post);
      } else {
        console.log("like");
        handleUpdateLike(post);
      }
    } else {
      handleUpdateLike(post);
    }
  };

  const thumbsUpColor = (post) => {
    if (post.likes == null) {
      return "gray";
    } else {
      const likesList = post?.likes.map((p) => {
        return p.personId;
      });

      if (likesList.includes(userData?.personId)) {
        return "#0866ff";
      } else {
        return "gray";
      }
    }
  };

  const deliverContent = (post) => {
    return;
    <>
      <div
        className="landing-post-content"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(post?.content),
        }}
      ></div>
    </>;
  };

  return (
    <>
      <div className="landingpage-main" id="new-post-section">
        <div className="landig-page-container-one">
          <div className="landig-page-container-one-main">
            <div className="container-one-sec-one">
              <img
                src={
                  userData?.coverImg
                    ? `data:image/jpeg;base64,${userData?.coverImg}`
                    : ""
                }
                alt=""
              />
              <div className="container-one-sec-one-profile">
                <img
                  src={
                    userData?.profileImg
                      ? `data:image/jpeg;base64,${userData?.profileImg}`
                      : logo
                  }
                  alt="profile img"
                />
              </div>
            </div>

            <div className="container-one-sec-two">
              <div className="user-name">
                {userData?.firstName + " " + userData?.lastName}
              </div>
              <div>{userData?.bio}</div>
            </div>

            <Divider />

            <div className="container-one-sec-three">
              <div className="container-one-sec-three-items">New post</div>
              {/* <div className="container-one-sec-three-items">My Friends</div> */}
              {/* <div className="container-one-sec-three-items">Suggessions</div> */}
              <div className="container-one-sec-three-items">My groups</div>
              <div className="container-one-sec-three-items">My Learnings</div>
              <div className="container-one-sec-three-items">My chat</div>
              <div className="container-one-sec-three-items">Events</div>
              <div className="container-one-sec-three-items">Edit profile</div>
            </div>
          </div>
        </div>
        <div className="landig-page-container-two">
          <div className="landing-header" onClick={() => SetShowAddPost(true)}>
            <div className="landing-header-profile">
              <img
                src={
                  userData?.profileImg
                    ? `data:image/jpeg;base64,${userData?.profileImg}`
                    : logo
                }
                alt="profile img"
              />
            </div>
            <span>Hiii {userData?.lastName} share Something.....</span>
          </div>
          <div className="landingpage-sec-two">
            {allPost?.map((post) => (
              <div className="landing-post-container">
                <div className="landing-post-header">
                  <div className="landing-header-image-container">
                    <img
                      src={
                        post?.profile
                          ? `data:image/jpeg;base64,${post?.profile}`
                          : logo
                      }
                      alt="profile img"
                    />
                  </div>
                  <div className="landing-header-about">
                    <span className="person-about">
                      {post?.firstName + " " + post?.lastName}{" "}
                    </span>
                    <span className="post-date">
                      {post?.postTime ? showDate(post?.postTime) : ""}
                    </span>
                  </div>
                </div>
                <Divider />
                <div className="landing-post-body">
                  {console.log(post?.content.length)}
                  {post?.content.length >= 1 && (
                    <div
                      className="landing-post-content"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(post?.content),
                      }}
                    ></div>
                  )}
                  {post?.image && (
                    <div className="landing-post-image">
                      <img
                        src={`${`data:image/jpeg;base64,${post?.image}`}`}
                        alt="post img"
                      />
                    </div>
                  )}
                  <div className="post-reach">
                    <div
                      className="post-like-count"
                      style={{ fontSize: "14px" }}
                    >
                      {post?.likes && post?.likes.length > 0 ? (
                        <>
                          {post.likes.length}
                          {/* <FontAwesomeIcon
                          icon={faThumbsUp}
                          size="l"
                          style={{
                            color: "blue",
                          }}
                        /> */}
                          <i
                            className="pi pi-thumbs-up-fill"
                            style={{ color: "#0866ff", fontSize: "14px" }}
                          ></i>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="post-comment-count">{post?.comment}</div>
                  </div>
                </div>
                <Divider />
                <div className="landing-post-footer">
                  <div className="landing-footer-part-one">
                    {/* <FontAwesomeIcon
                    icon={faThumbsUp}
                    size="xl"
                    style={{
                      color: thumbsUpColor(post),
                      cursor: "pointer",
                    }}
                    onClick={() => handleLikeUnlike(post)}
                  /> */}
                    <i
                      className="pi pi-thumbs-up-fill"
                      onClick={() => handleLikeUnlike(post)}
                      style={{
                        color: thumbsUpColor(post),
                        fontSize: "18px",
                        cursor: "pointer",
                      }}
                    ></i>
                  </div>
                  <div className="landing-footer-part-two">
                    <FontAwesomeIcon
                      icon={faComment}
                      style={{ color: "gray", fontSize: "18px" }}
                      onClick={() => {
                        setShowComments(true);
                        setCommentShown(post);
                      }}
                    />
                  </div>
                  <div className="landing-footer-part-three">
                    <FontAwesomeIcon
                      icon={faShare}
                      style={{ color: "gray", fontSize: "18px" }}
                    />
                  </div>
                  <div className="landing-footer-part-four">
                    <FontAwesomeIcon
                      icon={faBookmark}
                      style={{ color: "gray", fontSize: "18px" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="landig-page-container-three">
          <div className="landig-page-container-three-main">
            <div>
              <div>My Friends</div>
              <div>Suggssions</div>
              <div>Recently saved</div>
              <div>Suggssions</div>
            </div>
          </div>
        </div>
      </div>
      <AddPostDialog />
      <CommentsDialoge post={commetShown} />
    </>
  );
}
