import React, { useEffect, useState } from "react";
import "./ViewPeople.scss";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Image } from "primereact/image";
import profileIconImage from "../assets/profileImg.jpg";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { TabMenu } from "primereact/tabmenu";

export default function ViewPeople() {
  const location = useLocation();
  const { firstNameLastName } = useParams();
  const email = location.state?.email;
  const personId = location.state?.personId;
  const Bearer = Cookies.get("access_Token");
  const [personData, setPersonData] = useState();
  const [tabName, SetTabName] = useState("about");
  const [showAbout, setShowAbout] = useState("school");

  function convertToYYYY(dateString) {
    const dateObject = new Date(dateString);
    return dateObject.getFullYear();
  }

  const items = [
    { label: "About", command: () => SetTabName("about") },
    { label: "Posts", command: () => SetTabName("post") },
  ];

  useEffect(() => {
    axios
      .get(`http://localhost:8080/user/get-person?personId=${personId}`, {
        headers: {
          Authorization: `Bearer ${Bearer}`,
        },
      })
      .then((response) => {
        setPersonData(response.data);
      })
      .catch(() => {});
  }, []);

  //   <h1>{`Profile of ${firstNameLastName.replace("-", " ")}`}</h1>
  //       <p>{`Email: ${email}`}</p>{" "}


  function formatDateToDDMMYYYY(isoDateString) {
    const date = new Date(isoDateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  return (
    <div className="ViewPeople-main">
      <div className="viewPeople-container">
        <div className="viewPeople-cover-pic-container">
          {personData?.coverImg ? (
            <Image
              src={`${`data:image/jpeg;base64,${personData?.coverImg}`}`}
              alt="Image"
              preview
              className="viewPeople-cover-pic"
            />
          ) : (
            ""
          )}
        </div>
        <div className="viewPeople-profile-pic-sec">
          <div className="viewPeople-profile-pic-container">
            {personData?.profileImg ? (
              <Image
                src={`${`data:image/jpeg;base64,${personData?.profileImg}`}`}
                alt="Image"
                preview
                className="viewPeople-profile-pic"
              />
            ) : (
              <img
                src={profileIconImage}
                className="viewPeople-profile-pic-icon"
              />
            )}
          </div>
          <div className="viewPeople-profile-name-container">
            <div className="viewPeople-profile-name">
              {personData?.firstName + " " + personData?.lastName}
            </div>
            <div className="viewPeople-profile-bio">{personData?.bio}</div>
          </div>
          <div className="viewPeople-profile-action-setion">
            <div className="viewPeople-send-request">
              {/* Add post<i className="pi pi-plus"></i> */}
              <Button label="Send Request" severity="info" />
            </div>
            <div className="viewPeople-send-message">
              <Button label="Send Message" severity="info" />
            </div>
          </div>
        </div>
        <Divider />
        <div className="viewPeople-about-actions">
          <TabMenu model={items} />
          {tabName === "about" && (
            <div className="viewPeople-about-main">
              <div className="viewPeople-about-sec-one">
                <div
                  className="viewPeople-about-sec-one-items"
                  onClick={() => setShowAbout("status")}
                >
                  RelationShip
                </div>
                <div
                  className="viewPeople-about-sec-one-items"
                  onClick={() => setShowAbout("birthday")}
                >
                  Birthday
                </div>
                <div
                  className="viewPeople-about-sec-one-items"
                  onClick={() => setShowAbout("school")}
                >
                  Schooling
                </div>
                <div
                  className="viewPeople-about-sec-one-items"
                  onClick={() => setShowAbout("college")}
                >
                  College
                </div>
                <div
                  className="viewPeople-about-sec-one-items"
                  onClick={() => setShowAbout("work")}
                >
                  Work
                </div>
                <div
                  className="viewPeople-about-sec-one-items"
                  onClick={() => setShowAbout("contact")}
                >
                  Contact
                </div>
              </div>
              <Divider layout="vertical" />
              <div className="viewPeople-about-sec-two">
                {showAbout === "status" && (
                  <div className="relationship-section">
                    <span>
                      <i className="pi pi-heart-fill"></i>
                      {personData?.relationShipStatus
                        ? personData?.relationShipStatus
                        : " _ _ _"}
                    </span>
                  </div>
                )}
                {showAbout === "birthday" && (
                  <div className="birthday-section">
                    <span>
                      <i className="pi pi-gift"></i>
                      {personData?.dob ? formatDateToDDMMYYYY(personData?.dob) : "_ _ _"}
                    </span>
                  </div>
                )}
                {showAbout === "school" && (
                  <div className="school-section">
                    {personData?.schools ? (
                      personData?.schools.map((scl) => (
                        <>
                          <div className="schooling-container">
                            <div className="school-education-container">
                              <div className="school-education">
                                <i className="pi  pi-graduation-cap"></i>
                                {scl.education}
                              </div>
                              <div className="school-duration">
                                <span className="school-from">
                                  {convertToYYYY(scl.from)}
                                </span>
                                -
                                <span className="school-to">
                                  {convertToYYYY(scl.to)}
                                </span>
                              </div>
                            </div>

                            <div className="school-name">{scl.schoolName}</div>
                          </div>
                          <Divider />
                        </>
                      ))
                    ) : (
                      <span className="school-none">- - -</span>
                    )}
                  </div>
                )}
                {showAbout === "college" && (
                  <div className="college-section">
                    {personData?.colleges
                      ? personData?.colleges.map((clg) => (
                          <>
                            <div className="college-container">
                              <div className="college-education-container">
                                <div className="college-education">
                                  <i className="pi  pi-graduation-cap"></i>

                                  {clg.degree}
                                </div>
                                <div className="college-duration">
                                  <span className="college-from">
                                    {convertToYYYY(clg.from)}
                                  </span>
                                  -
                                  <span className="college-to">
                                    {convertToYYYY(clg.to)}
                                  </span>
                                </div>
                              </div>

                              <div className="college-name">
                                {clg.collegeName}
                              </div>
                            </div>
                            <Divider />
                          </>
                        ))
                      : <span className="college-none">- - -</span>}
                  </div>
                )}
                {showAbout === "work" && (
                  <div className="company-section">
                    {personData?.works
                      ? personData?.works.map((cmpy) => (
                          <>
                            <div className="company-container">
                              <div className="company-education-container">
                                <div className="company-education">
                                  <i className="pi pi-briefcase"></i>
                                  {cmpy.designation}
                                </div>
                                <div className="company-duration">
                                  <span className="company-from">
                                    {convertToYYYY(cmpy.from)}
                                  </span>
                                  -
                                  <span className="company-to">
                                    {convertToYYYY(cmpy.to)}
                                  </span>
                                </div>
                              </div>

                              <div className="company-name">
                                {cmpy.companyName}
                              </div>
                            </div>
                            <Divider />
                          </>
                        ))
                      : <span className="work-none">- - -</span>}
                  </div>
                )}
                {showAbout === "contact" && (
                  <div className="phone-email">
                    <span>
                      <i className="pi pi-phone"></i>
                      {personData?.phoneNumber
                        ? personData?.phoneNumber
                        : "_ _ _"}
                    </span>
                    <span>
                      <i className="pi pi-envelope"></i>
                      {personData?.email ? personData?.email : "_ _ _"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          {tabName === "post" && <div>Post</div>}
        </div>
      </div>
    </div>
  );
}
