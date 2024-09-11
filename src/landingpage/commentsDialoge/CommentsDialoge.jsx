import React, { useEffect, useRef, useState } from "react";
import "./CommentsDialoge.scss";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useUserContext } from "../../contextFolder/UserProvider ";
import moment from "moment";
import logo from "../../assets/profile2.jpg";
import { InputText } from "primereact/inputtext";
import DOMPurify from "dompurify";
import { InputTextarea } from "primereact/inputtextarea";
import EmojiPicker from "emoji-picker-react";
import api from "../../axiosInceptor/api";
import Cookies from "js-cookie";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";

export default function CommentsDialoge({ post, setPost }) {
  const [comment, setComment] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const Bearer = Cookies.get("access_Token");
  const currentPost = post;
  const toast = useRef(null);
  const navigate = useNavigate()
  // console.log("old", post?.comments);

  const {
    userData,
    setUserData,
    setShowComments,
    showComments,
    stompClient,
    isConnected,
    setAllPost,
  } = useUserContext();

  // console.log("wdefef", post?.comments);

  useEffect(() => {
    if (showComments === true) {
      api
        .get(`/post/get-all-comments?postId=${post?.postId}`, {
          headers: {
            Authorization: `Bearer ${Bearer}`,
          },
        })
        .then((response) =>
          setPost((prev) => ({
            ...prev,
            comments: response.data,
          }))
        )
        .catch((error) => console.log(error));
    }
  }, [showComments]);

  useEffect(() => {
    if (stompClient && isConnected) {
      stompClient.subscribe("/public/post-comments", (message) => {
        const commentsNew = JSON.parse(message.body);
        console.log("new", commentsNew);
        // setPost((prevPost) => ({
        //   ...prevPost,
        //   comments: prevPost.comments ? [...prevPost.comments, commentsNew] : [commentsNew],
        // }));
        setPost((prev) => ({
          ...prev,
          comments: commentsNew,
        }));
      });
    }
  }, [stompClient, isConnected]);

  function showDate(dateStr) {
    return moment(dateStr).format("DD-MMM-YYYY");
  }

  const handleEmojiClick = (emojiObject) => {
    // console.log("Selected Emoji Object:", emojiObject);

    if (emojiObject) {
      setComment((prevValue) => prevValue + emojiObject.emoji);
    } else {
      console.error("Emoji is undefined or incorrect property.");
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

  const handleNewComment = () => {
    api
      .post(
        `post/post-comment`,
        {
          postId: post?.postId,
          personId: userData?.personId,
          comment: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${Bearer}`,
          },
        }
      )
      .then((response) => {
        setComment("");
        console.log(response.data);
        toast.current.show({
          severity: "success",
          summary: "Comment added",
          detail: "Comment added successfully",
        });
        // setAllPost((prevPosts) =>
        //   prevPosts?.map((oldPost) =>
        //     oldPost.postId === post?.postId
        //       ? { ...oldPost, comments: post.comments }
        //       : oldPost.comments
        //   )
        // );
      })
      .catch((error) => console.log(error));
  };

  const handleDialogHide = () => {
    if (!showComments) return;

    setShowComments(false);

    setAllPost((prevPosts) =>
      prevPosts?.map((oldPost) =>
        oldPost.postId === post?.postId
          ? { ...oldPost, comments: post.comments }
          : oldPost
      )
    );
  };

  const handleVisitUser = (comment) => {
    navigate(`/people/${comment?.firstName}-${comment?.lastName}`, {
      state: { personId: comment?.personId },
    });
    setShowComments(false)
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header={"Comments on" + " " + post?.firstName + "'s post "}
        visible={showComments}
        style={{ width: "40vw" }}
        onHide={() => {
          handleDialogHide();
        }}
        headerStyle={{ textAlign: "center", borderBottomColor: "lightgray" }}
        className="comments-dialoge"
        draggable={false}
      >
        <div className="comments-overall">
          <div className="comment-sec-header">
            <div className="content-sec-header-profile">
              <img
                src={
                  post?.profile
                    ? `data:image/jpeg;base64,${post.profile}`
                    : logo
                }
                alt=""
              />
            </div>
            <div className="comment-sec-header-about">
              <div className="person-name">
                {post?.firstName + " " + post?.lastName}{" "}
              </div>
              <div className="post-date">
                {" "}
                {post?.postTime ? showDate(post?.postTime) : ""}
              </div>
            </div>
          </div>
          <div className="comments-dialoge-body">
            {cleanContent(post?.content) ? (
              <div
                className="comments-post-content"
                dangerouslySetInnerHTML={{
                  __html: cleanContent(post?.content),
                }}
              ></div>
            ) : null}

            {post?.image && (
              <div className="comments-post-image">
                <img
                  src={`${`data:image/jpeg;base64,${post?.image}`}`}
                  alt=""
                />
              </div>
            )}
          </div>

          <Divider />

          {post?.comments && post.comments.length > 0 ? (
            <div className="comments-section-main">
              {post?.comments?.map((comment, index) => (
                <div className="each-comment">
                  <div className="comment-person-image">
                    <img
                      src={
                        post?.profile
                          ? `data:image/jpeg;base64,${comment?.personImage}`
                          : logo
                      }
                      alt=""
                      onClick={() => handleVisitUser(comment)}
                    />
                  </div>
                  <div className="comment-about">
                    <div
                      className="comment-person-name"
                      onClick={() => handleVisitUser(comment)}
                    >
                      {comment?.firstName + " " + comment?.lastName}
                    </div>
                    <div
                      className="comment-content"
                      dangerouslySetInnerHTML={{
                        __html: cleanContent(comment?.comment),
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-comments">No comments yet</div>
          )}
        </div>

        <div className="content-sec-footer">
          <div className="footer-section">
            <InputTextarea
              placeholder="Enter your comment...."
              className="comments-input-field"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="post-button">
              <span>
                <i
                  className="pi pi-face-smile"
                  onClick={() => setShowEmoji((x) => !x)}
                  style={{ cursor: "pointer" }}
                ></i>
              </span>
              <i
                className={`pi pi-send send-icon ${!comment ? "disabled" : ""}`}
                onClick={() => handleNewComment()}
              ></i>
            </div>
          </div>
          {showEmoji && (
            <div className="comment-section-emoji-container">
              <EmojiPicker
                className="emoji-picker-comment-section"
                onEmojiClick={handleEmojiClick}
              />
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
}
