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
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import Lottie from "lottie-react";
import Loading2 from "../animations/Loading2.json";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";

export default function LandingPage() {
  const [commetShown, setCommentShown] = useState();
  const Bearer = Cookies.get("access_Token");
  const ref_token = Cookies.get("refresh_Token");
  const [showSpinner, setShowSpinner] = useState(false);
  const [activeIndex, setActiveIndex] = useState();

  const {
    userData,
    setUserData,
    SetShowAddPost,
    landingPageNotification,
    setLandingPageNotification,
    stompClient,
    isConnected,
    setShowComments,
    showComments,
    allPost,
    setAllPost,
  } = useUserContext();

  console.log(userData?.saved);

  useEffect(() => {
    if (isConnected) {
      stompClient.subscribe("/public/posts/likes", (message) => {
        const postUpdated = JSON.parse(message.body);
        setAllPost((prevPosts) =>
          prevPosts?.map((post) =>
            post.postId === postUpdated.postId
              ? { ...post, likes: postUpdated.likes }
              : post
          )
        );
      });
      stompClient.subscribe(
        `/user/${userData?.email}/queue/savedpost`,
        (message) => {
          const response = JSON.parse(message.body);
          setUserData((prev) => ({
            ...prev,
            saved: [...(prev.saved || []), response],
          }));
          console.log("this is response", response);
        }
      );
      stompClient.subscribe(
        `/user/${userData?.email}/queue/unsavedpost`,
        (message) => {
          console.log("received the unsaved list");
          const response = JSON.parse(message.body);
          setUserData((prev) => ({
            ...prev,
            saved: response,
          }));
          console.log("this is unsave response", response);
        }
      );
    }
  }, [isConnected, stompClient]);

  useEffect(() => {
    api
      .get("/post/get-all-post", {
        headers: {
          Authorization: `Bearer ${Bearer}`,
        },
      })
      .then((response) => {
        setAllPost(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  function showDate(dateStr) {
    return moment(dateStr).format("DD-MMM-YYYY");
  }

  const handleUpdateLike = (post) => {
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
    if (post.likes != null && post.likes != undefined) {
      const likesList = post?.likes?.map((p) => {
        return p.personId;
      });
      if (likesList.includes(userData?.personId)) {
        handleDislike(post);
      } else {
        handleUpdateLike(post);
      }
    } else {
      handleUpdateLike(post);
    }
  };

  const thumbsUpColor = (post) => {
    if (post?.likes == null) {
      return "gray";
    } else {
      const likesList = post?.likes?.map((p) => {
        return p.personId;
      });

      if (likesList.includes(userData?.personId)) {
        return "#0866ff";
      } else {
        return "gray";
      }
    }
  };

  function cleanContent(content) {
    const sanitizedContent = DOMPurify.sanitize(content || "");
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = sanitizedContent;

    let firstChild = tempDiv.firstChild;
    while (
      firstChild &&
      firstChild.tagName === "P" &&
      (firstChild.innerHTML.trim() === "" ||
        firstChild.innerHTML === "<br>" ||
        firstChild.innerHTML === "<br />")
    ) {
      tempDiv.removeChild(firstChild);
      firstChild = tempDiv.firstChild;
    }

    return tempDiv.innerHTML;
  }

  const savePost = (id) => {
    api
      .post(
        `/post/save-post/${userData?.personId}?postId=${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Bearer}`,
          },
        }
      )
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error));
  };

  const unSavePost = (id) => {
    api
      .post(
        `/post/unsave-post/${userData?.personId}?postId=${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Bearer}`,
          },
        }
      )
      .then((response) => (saveList = saveList?.filter((s) => s != id)))
      .catch((error) => console.log(error));
  };

  let saveList = userData?.saved?.map((s) => {
    return s?.postId;
  });

  const handleSaveUnsave = (post) => {
    if (saveList == undefined) {
      console.log("yes");
      savePost(post?.postId);
    } else if (saveList.includes(post?.postId)) {
      console.log("yes");
      unSavePost(post?.postId);
    } else {
      console.log("nooo");
      savePost(post?.postId);
    }
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
          {!showSpinner ? (
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
                    {cleanContent(post?.content) ? (
                      <div
                        className="landing-post-content"
                        dangerouslySetInnerHTML={{
                          __html: cleanContent(post?.content),
                        }}
                      ></div>
                    ) : null}

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
                        style={{ fontSize: "12px" }}
                      >
                        {post?.likes && post?.likes.length > 0 ? (
                          <>
                            {post.likes.length}
                            <i
                              className="pi pi-thumbs-up-fill"
                              style={{ color: "#0866ff", fontSize: "12px" }}
                            ></i>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                      <div
                        className="post-comment-count"
                        style={{ fontSize: "12px" }}
                      >
                        {post?.comments && post?.comments.length > 0 ? (
                          <>
                            {post?.comments.length}
                            <span style={{ fontSize: "14px" }}>comments</span>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                  <Divider />
                  <div className="landing-post-footer">
                    <div className="landing-footer-part-one">
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
                        style={{
                          color: "gray",
                          fontSize: "18px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setShowComments(true);
                          setCommentShown(post);
                        }}
                      />
                    </div>
                    <div className="landing-footer-part-three">
                      <FontAwesomeIcon
                        icon={faShare}
                        style={{
                          color: "gray",
                          fontSize: "18px",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                    <div className="landing-footer-part-four">
                      {/* <FontAwesomeIcon
                        icon={faBookmark}
                        style={{
                          color: "gray",
                          fontSize: "18px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSaveUnsave(post)}
                      /> */}
                      {saveList?.includes(post?.postId) || saveList == null ? (
                        <i
                          className="pi pi-bookmark-fill"
                          style={{
                            color: "gray",
                            fontSize: "18px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSaveUnsave(post)}
                        ></i>
                      ) : (
                        <i
                          className="pi pi-bookmark"
                          style={{
                            color: "gray",
                            fontSize: "18px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSaveUnsave(post)}
                        ></i>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {/* {console.log(allPost)} */}
            </div>
          ) : (
            <Lottie animationData={Loading2} className="spinner-landing-page" />
          )}
        </div>
        <div className="landig-page-container-three">
          <div className="landig-page-container-three-main">
            {/* <div className="container-three-content-container">
              <div className="container-three-content-items">My Friends</div>
              <div className="container-three-content-items">Suggssions</div>
              <div className="container-three-content-items">
                Recently saved
              </div>
            </div> */}

            <Accordion multiple activeIndex={[0]} className="accordian">
              <AccordionTab header="My Friends" className="accordian-tab">
                <div className="container-three-content-items">My Friends</div>
              </AccordionTab>
              <AccordionTab header="Suggssions" className="accordian-tab">
                <div className="container-three-content-items">Suggssions</div>
              </AccordionTab>
              <AccordionTab header="Recently saved" className="accordian-tab">
                <div className="container-three-content-items">
                  Recently saved
                </div>
              </AccordionTab>
            </Accordion>
          </div>
        </div>
      </div>
      <AddPostDialog />
      <CommentsDialoge post={commetShown} setPost={setCommentShown} />
    </>
  );
}
