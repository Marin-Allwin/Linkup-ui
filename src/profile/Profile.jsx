import React, { useRef, useState } from "react";
import "./Profile.scss";
import { Image } from "primereact/image";
import Cookies from "js-cookie";
import axios from "axios";
import { useUserContext } from "../contextFolder/UserProvider ";
import profileIconImage from "../assets/profileImg.jpg";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Divider } from "primereact/divider";
import { TabMenu } from "primereact/tabmenu";
import { Dialog } from "primereact/dialog";
// import { Editor } from "primereact/editor";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import MyReactProfile from "../myReactProfile/MyReactProfile";
import Editor from "../confugurations/Editor";
import { Tooltip } from "primereact/tooltip";
import QuillEditor from "../quill/QuillEditor";
import { Toast } from "primereact/toast";
import ReactQuill from "react-quill";
import api from "../axiosInceptor/api";
// import AddNewPost from "./AddNewPost";
import AddPostDialog from "./AddPostDialog";

export default function Profile() {
  const Bearer = Cookies.get("access_Token");
  const email = localStorage.getItem("userEmail");
  const [profileImage, setProfileImage] = useState();
  const [coverPic, setCoverPic] = useState();
  const { userData, setUserData, SetShowAddPost } = useUserContext();
  const { refresh, setRefresh } = useUserContext();
  const navigate = useNavigate();


  const [showAbout, setShowAbout] = useState("status");

  const [tabName, SetTabName] = useState("about");
  const items = [
    { label: "About", command: () => SetTabName("about") },
    {
      label: "Posts",
      command: () => {
        SetTabName("post");
        navigate("my-posts");
      },
    },
  ];

  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const profileData = new FormData();
  const CoverData = new FormData();

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handlecoverClick = () => {
    coverInputRef.current.click();
  };



  const handleProfileChange = async (e) => {
    const profile = e.target.files[0];
    setProfileImage(profile);

    if (profile !== null) {
      profileData.append("image", profile);
      profileData.append("email", email);

      try {
        const profileUploadResponse = await axios.post(
          `http://localhost:8080/user/update-profile`,
          profileData,
          {
            headers: {
              Authorization: `Bearer ${Bearer}`,
            },
          }
        );

        if (profileUploadResponse.status === 200) {
          setRefresh((x) => !x);
          //   setProfileImage("");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleCoverChange = async (e) => {
    const cover = e.target.files[0];
    setCoverPic(cover);

    if (cover !== null) {
      CoverData.append("image", cover);
      CoverData.append("email", email);

      try {
        const profileUploadResponse = await api.post(
          `/user/upload-coverPic`,
          CoverData,
          {
            headers: {
              Authorization: `Bearer ${Bearer}`,
            },
          }
        );

        if (profileUploadResponse.status === 200) {
          setRefresh((x) => !x);
          //   setProfileImage("");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  function convertToYYYY(dateString) {
    const dateObject = new Date(dateString);
    return dateObject.getFullYear();
  }

  function formatDateToDDMMYYYY(isoDateString) {
    const date = new Date(isoDateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  return (
    <>
      {/* <Toast ref={toast} /> */}
      <div className="profile-main">
        <div className="profile-container">
          <div className="cover-pic-container">
            {userData?.coverImg ? (
              <Image
                src={`${`data:image/jpeg;base64,${userData?.coverImg}`}`}
                alt="Image"
                preview
                className="cover-pic"
              />
            ) : (
              ""
            )}
            <div className="upload-cover-pic" onClick={handlecoverClick}>
              <i className="pi pi-camera"></i>Upload cover pic
              <input
                type="file"
                style={{ display: "none" }}
                ref={coverInputRef}
                accept="image/gif,image/jpeg,image/jpg,image/png"
                onChange={handleCoverChange}
              />
            </div>
          </div>
          <div className="profile-pic-sec">
            <div className="profile-pic-container">
              {userData?.profileImg ? (
                <Image
                  src={`${`data:image/jpeg;base64,${userData?.profileImg}`}`}
                  alt="Image"
                  preview
                  className="profile-pic"
                />
              ) : (
                <img src={profileIconImage} className="profile-pic-icon" />
              )}
              <i
                className="pi pi-camera profile-camera"
                onClick={handleIconClick}
              >
                <input
                  type="file"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  accept="image/gif,image/jpeg,image/jpg,image/png"
                  onChange={handleProfileChange}
                />
              </i>
            </div>
            <div className="profile-name-container">
              <div className="profile-name">
                {userData?.firstName + " " + userData?.lastName}
              </div>
              <div className="profile-bio">{userData?.bio}</div>
            </div>
            <div className="profile-edit-setion">
              <div className="add-post" onClick={() => SetShowAddPost(true)}>
                Add Post<i className="pi pi-plus"></i>
              </div>
              <div
                className="edit-profile"
                onClick={() => navigate("/edit-profile")}
              >
                Edit profile<i className="pi pi-pencil"></i>
              </div>
            </div>
          </div>
          <Divider />
          <div className="myProfile-about-actions">
            <TabMenu model={items} />
            {tabName === "about" && (
              <div className="myProfile-about-main">
                <div className="myProfile-about-sec-one">
                  <div
                    className="myProfile-about-sec-one-items"
                    onClick={() => setShowAbout("status")}
                  >
                    RelationShip
                  </div>
                  <div
                    className="myProfile-about-sec-one-items"
                    onClick={() => setShowAbout("birthday")}
                  >
                    Birthday
                  </div>
                  <div
                    className="myProfile-about-sec-one-items"
                    onClick={() => setShowAbout("school")}
                  >
                    Schooling
                  </div>
                  <div
                    className="myProfile-about-sec-one-items"
                    onClick={() => setShowAbout("college")}
                  >
                    College
                  </div>
                  <div
                    className="myProfile-about-sec-one-items"
                    onClick={() => setShowAbout("work")}
                  >
                    Work
                  </div>
                  <div
                    className="myProfile-about-sec-one-items"
                    onClick={() => setShowAbout("contact")}
                  >
                    Contact
                  </div>
                </div>
                <Divider layout="vertical" />
                <div className="myProfile-about-sec-two">
                  {showAbout === "status" && (
                    <div className="myProfile-relationship-section">
                      <span>
                        <i className="pi pi-heart-fill"></i>
                        {userData?.relationShipStatus
                          ? userData?.relationShipStatus
                          : " _ _ _"}
                      </span>
                    </div>
                  )}
                  {showAbout === "birthday" && (
                    <div className="myProfile-birthday-section">
                      <span>
                        <i className="pi pi-gift"></i>
                        {userData?.dob
                          ? formatDateToDDMMYYYY(userData?.dob)
                          : "_ _ _"}
                        {console.log(userData?.birtday)}
                      </span>
                    </div>
                  )}
                  {showAbout === "school" && (
                    <div className="myProfile-school-section">
                      {userData?.schools ? (
                        userData?.schools.map((scl) => (
                          <>
                            <div className="myProfile-schooling-container">
                              <div className="myProfile-school-education-container">
                                <div className="myProfile-school-education">
                                  <i className="pi  pi-graduation-cap"></i>
                                  {scl.education}
                                </div>
                                <div className="myProfile-school-duration">
                                  <span className="myProfile-school-from">
                                    {convertToYYYY(scl.from)}
                                  </span>
                                  -
                                  <span className="myProfile-school-to">
                                    {convertToYYYY(scl.to)}
                                  </span>
                                </div>
                              </div>

                              <div className="myProfile-school-name">
                                {scl.schoolName}
                              </div>
                            </div>
                            <Divider />
                          </>
                        ))
                      ) : (
                        <span className="myProfile-school-none">- - -</span>
                      )}
                    </div>
                  )}
                  {showAbout === "college" && (
                    <div className="myProfile-college-section">
                      {userData?.colleges ? (
                        userData?.colleges.map((clg) => (
                          <>
                            <div className="myProfile-college-container">
                              <div className="myProfile-college-education-container">
                                <div className="myProfile-college-education">
                                  <i className="pi  pi-graduation-cap"></i>

                                  {clg.degree}
                                </div>
                                <div className="myProfile-college-duration">
                                  <span className="myProfile-college-from">
                                    {convertToYYYY(clg.from)}
                                  </span>
                                  -
                                  <span className="myProfile-college-to">
                                    {convertToYYYY(clg.to)}
                                  </span>
                                </div>
                              </div>

                              <div className="myProfile-college-name">
                                {clg.collegeName}
                              </div>
                            </div>
                            <Divider />
                          </>
                        ))
                      ) : (
                        <span className="myProfile-college-none">- - -</span>
                      )}
                    </div>
                  )}
                  {showAbout === "work" && (
                    <div className="myProfile-company-section">
                      {userData?.works ? (
                        userData?.works.map((cmpy) => (
                          <>
                            <div className="myProfile-company-container">
                              <div className="myProfile-company-education-container">
                                <div className="myProfile-company-education">
                                  <i className="pi pi-briefcase"></i>
                                  {cmpy.designation}
                                </div>
                                <div className="myProfile-company-duration">
                                  <span className="myProfile-company-from">
                                    {convertToYYYY(cmpy.from)}
                                  </span>
                                  -
                                  <span className="myProfile-company-to">
                                    {convertToYYYY(cmpy.to)}
                                  </span>
                                </div>
                              </div>

                              <div className="myProfile-company-name">
                                {cmpy.companyName}
                              </div>
                            </div>
                            <Divider />
                          </>
                        ))
                      ) : (
                        <span className="myProfile-work-none">- - -</span>
                      )}
                    </div>
                  )}
                  {showAbout === "contact" && (
                    <div className="myProfile-phone-email">
                      <span>
                        <i className="pi pi-phone"></i>
                        {userData?.phoneNumber
                          ? userData?.phoneNumber
                          : "_ _ _"}
                      </span>
                      <span>
                        <i className="pi pi-envelope"></i>
                        {userData?.email ? userData?.email : "_ _ _"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
            {tabName === "post" && (
              <div>
                <Outlet />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <Dialog
        header="Add Post"
        visible={showAddPost}
        style={{ width: "50vw" }}
        draggable={false}
        onHide={() => {
          if (!showAddPost) return;
          SetShowAddPost(false);
          setSelectedFile(null);
          setImagePreview(null);
          setTextValue("");
        }}
        className="add-post-dialoge"
      >
        <Tooltip
          target=".add-image"
          content="Upload an image"
          position="right"
        />
        <div className="editor-container">
          <ReactQuill
            theme="bubble"
            value={textValue}
            onChange={setTextValue}
            className="add-post-editor"
            placeholder="Share something....."
          />
        </div>
        <div className="add-post-image">
          <span>
            <i className="pi pi-image add-image" onClick={handlePostImgClick}>
              <input
                type="file"
                ref={postPicRef}
                style={{ display: "none" }}
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
              />
            </i>
          </span>

          <div className="show-image-container">
            {selectedFile && (
              <img
                src={imagePreview}
                alt="Selected"
                style={{ width: "180px", height: "200px" }}
                className="post-image"
              />
            )}
          </div>
        </div>
        <div className="add-post-button">
          <Button
            label="Post"
            onClick={handleAddPost}
            disabled={!selectedFile && !textValue}
          />
        </div>
      </Dialog> */}
      <AddPostDialog />
    </>
  );
}
