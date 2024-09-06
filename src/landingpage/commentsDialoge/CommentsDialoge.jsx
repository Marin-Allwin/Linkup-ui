import React, { useState } from "react";
import "./CommentsDialoge.scss";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useUserContext } from "../../contextFolder/UserProvider ";
import moment from "moment";
import logo from "../../assets/profile2.jpg";
import { InputText } from "primereact/inputtext";
import DOMPurify from "dompurify";
import { InputTextarea } from "primereact/inputtextarea";

export default function CommentsDialoge({ post }) {
  console.log(post);
  const [visible, setVisible] = useState(false);
  const currentPost = post;
  const { userData, setUserData, setShowComments, showComments } =
    useUserContext();

  function showDate(dateStr) {
    return moment(dateStr).format("DD-MMM-YYYY");
  }

  return (
    <>
      <Dialog
        header={"Comments on" + " " + post?.firstName + "'s post "}
        visible={showComments}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!showComments) return;
          setShowComments(false);
        }}
        headerStyle={{ textAlign: "center", borderBottomColor: "lightgray" }}
        className="comments-dialoge"
        draggable={false}
      >
        {/* <div className="content">{post?.content}</div> */}
        <div className="comment-sec-header">
          <div className="content-sec-header-profile">
            <img
              src={
                post?.profile ? `data:image/jpeg;base64,${post.profile}` : logo
              }
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
          {post?.content && (
            <div
              className="comments-post-content"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post?.content),
              }}
            ></div>
          )}

          {post?.image && (
            <div className="comments-post-image">
              <img src={`${`data:image/jpeg;base64,${post?.image}`}`} />
            </div>
          )}
        </div>
        <div className="content-sec-footer">
          <div className="footer-section">
            <InputTextarea
              placeholder="Enter your comment...."
              className="comments-input-field"
            />
            <div className="post-button">
              <i className="pi pi-send"></i>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
