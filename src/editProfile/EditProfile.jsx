import React, { useEffect, useState } from "react";
import "./EditProfile.scss";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import axios from "axios";
import Cookies from "js-cookie";
import { useUserContext } from "../contextFolder/UserProvider ";
import Lottie from "lottie-react";
import Loading from "../animations/Loading.json";
import { format, parseISO } from "date-fns";

export default function EditProfile() {
  const [showName, setShowName] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const Bearer = Cookies.get("access_Token");
  const { userData, setUserData } = useUserContext();
  const [sampleUserData, setSampleUserData] = useState();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      setTimeout(() => {
        setSampleUserData(userData);
        setIsLoading(false);
      }, 2000);
    }
  }, [userData]);

  const [schoolDetails, setSchoolDetails] = useState({
    schoolName: "",
    from: null,
    to: null,
    education: "",
  });

  const [collegeDetails, setCollegeDetails] = useState({
    collegeName: "",
    from: null,
    to: null,
    degree: "",
  });

  const [workDetails, setWorkDetails] = useState({
    companyName: "",
    from: null,
    to: null,
    designation: "",
  });

  const statusOption = [
    { name: "Single", code: "Single" },
    { name: "Taken", code: "Taken" },
    { name: "Married", code: "Married" },
  ];

  const genderOption = [
    { name: "Male", code: "Male" },
    { name: "Female", code: "Female" },
  ];

  const handleISTChange = (date) => {

    const utcDate = new Date(date);

    const istOffset = 5.5 * 60 * 60 * 1000; 
    const istDate = new Date(utcDate.getTime() + istOffset);

    return istDate
  }

  const [showSection, setShowSection] = useState("about");
  const [school, setSchool] = useState();

  const handleUpdate = () => {
    handleUpdateDetails(sampleUserData);
    setIsLoading(true);

    // console.log(sampleUserData);


 

    // console.log("UTC Date:", utcDate.toISOString());
    // console.log("IST Date:", istDate.toISOString());
    // console.log("IST Date (Local):", istDate.toString());
  };

  const handleCancel = () => {
    setShowName("");
    setSampleUserData(userData);
  };

  const handleSchoolInputChange = (e) => {
    const { name, value } = e.target;
    setSchoolDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSchoolDateChange = (name, value) => {
    setSchoolDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleUpdateSchool = () => {
    setSampleUserData((prevData) => {
      const updatedData = {
        ...prevData,
        schools: [...(prevData.schools || []), schoolDetails],
      };
      handleUpdateDetails(updatedData);
      return updatedData;
    });

    setSchoolDetails({
      schoolName: "",
      from: null,
      to: null,
      education: "",
    });

    setIsLoading(true);
  };

  const handleCollegeInputChange = (e) => {
    const { name, value } = e.target;
    setCollegeDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleCollegeDateChange = (name, value) => {
    setCollegeDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleUpdateCollege = () => {
    setSampleUserData((prevData) => {
      const updatedData = {
        ...prevData,
        colleges: [...(prevData.colleges || []), collegeDetails],
      };
      handleUpdateDetails(updatedData);
      return updatedData;
    });

    setCollegeDetails({
      collegeName: "",
      from: null,
      to: null,
      degree: "",
    });

    setIsLoading(true);
  };

  const handleWorkInputChange = (e) => {
    const { name, value } = e.target;
    setWorkDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleWorkDateChange = (name, value) => {
    setWorkDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleUpdateWork = () => {
    setSampleUserData((prevData) => {
      const updatedData = {
        ...prevData,
        works: [...(prevData.works || []), workDetails],
      };
      handleUpdateDetails(updatedData);
      return updatedData;
    });

    setWorkDetails({
      companyName: "",
      from: null,
      to: null,
      designation: "",
    });

    setIsLoading(true);
  };

  const handleUpdateDetails = async (a) => {
    console.log(a);
    try {
      const response = await axios.post(
        `http://localhost:8080/user/update-datails`,
        a,
        {
          headers: {
            Authorization: `Bearer ${Bearer}`,
          },
        }
      );

      setUserData((prevData) => ({
        ...prevData,
        ...response.data,
      }));

      console.log(response);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch {}
  };

  function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
  }

  const formatDateForDisplay = (date) =>
    date ? format(date, "dd/MM/yyyy") : "";
  const parseDateFromISO = (isoDate) => (isoDate ? parseISO(isoDate) : null);
  const convertDateToISO = (date) => (date ? date.toISOString() : "");

  return (
    <div className="edit-profile-main">
      {!isLoading ? (
        <div className="edit-profile-container">
          <Divider layout="vertical" type="solid" />
          <div className="edit-profile-sec-one">
            <div
              className="ep-sec-one-containers"
              onClick={() => setShowSection("about")}
            >
              About
            </div>
            <div
              className="ep-sec-one-containers"
              onClick={() => setShowSection("security")}
            >
              Security
            </div>
          </div>
          <Divider layout="vertical" type="solid" />
          <div className="edit-profile-sec-two">
            {showSection === "about" && (
              <div className="ep-about-sec">
                <div className="ep-about-sec-items">
                  <span onClick={() => setShowName("name")}>Name</span>
                </div>
                {showName === "name" && (
                  <div className="show-section-name">
                    <div className="show-section-name-part-one">
                      <InputText
                        placeholder={
                          userData?.firstName
                            ? userData?.firstName
                            : "First Name"
                        }
                        onChange={(e) =>
                          setSampleUserData({
                            ...userData,
                            firstName: e.target.value,
                          })
                        }
                      />
                      <InputText
                        placeholder={
                          userData?.lastName ? userData?.lastName : "Last Name"
                        }
                        onChange={(e) =>
                          setSampleUserData({
                            ...userData,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="show-section-name-part-two">
                      <Button
                        label="cancel"
                        className="name-cancel"
                        onClick={handleCancel}
                      />
                      <Button
                        label="Update"
                        className="name-cancel"
                        onClick={handleUpdate}
                      />
                    </div>
                  </div>
                )}
                <div className="ep-about-sec-items">
                  <span onClick={() => setShowName("bio")}>Bio</span>
                </div>
                {showName === "bio" && (
                  <div className="show-section-name">
                    <div className="show-section-name-part-one">
                      <InputText
                        placeholder={userData?.bio ? userData?.bio : "Bio"}
                        className="bio-input"
                        onChange={(e) =>
                          setSampleUserData({
                            ...userData,
                            bio: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="show-section-name-part-two">
                      <Button
                        label="cancel"
                        className="name-cancel"
                        onClick={handleCancel}
                      />
                      <Button
                        label="Update"
                        className="name-cancel"
                        onClick={handleUpdate}
                      />
                    </div>
                  </div>
                )}
                <div className="ep-about-sec-items">
                  <span onClick={() => setShowName("relationship")}>
                    Relationship Status
                  </span>
                </div>
                {showName === "relationship" && (
                  <div className="show-section-name">
                    <div className="show-section-name-part-one">
                      <Dropdown
                        //   value={userData.relationShipStatus}
                        onChange={(e) =>
                          setSampleUserData({
                            ...userData,
                            relationShipStatus: e.value.name,
                          })
                        }
                        options={statusOption}
                        optionLabel="name"
                        placeholder={
                          sampleUserData?.relationShipStatus
                            ? sampleUserData?.relationShipStatus
                            : "Status"
                        }
                        className="bio-input"
                      />
                    </div>
                    <div className="show-section-name-part-two">
                      <Button
                        label="cancel"
                        className="name-cancel"
                        onClick={handleCancel}
                      />
                      <Button
                        label="Update"
                        className="name-cancel"
                        onClick={handleUpdate}
                      />
                    </div>
                  </div>
                )}
                <div className="ep-about-sec-items">
                  <span onClick={() => setShowName("school")}>School</span>
                </div>
                {showName === "school" && (
                  <div className="show-section-name">
                    <div className="show-section-name-part-one">
                      <InputText
                        placeholder="School"
                        name="schoolName"
                        value={schoolDetails.schoolName}
                        onChange={handleSchoolInputChange}
                      />

                      <div className="year-container">
                        <Calendar
                          view="year"
                          dateFormat="yy"
                          className="year"
                          placeholder="From"
                          value={schoolDetails.from}
                          onChange={(e) =>
                            handleSchoolDateChange("from", e.value)
                          }
                        />
                        <span> to</span>
                        <Calendar
                          view="year"
                          dateFormat="yy"
                          className="year"
                          placeholder="To"
                          value={schoolDetails.to}
                          onChange={(e) =>
                            handleSchoolDateChange("to", e.value)
                          }
                        />
                      </div>
                      <InputText
                        placeholder="Description"
                        className="school-description"
                        name="education"
                        value={schoolDetails.education}
                        onChange={handleSchoolInputChange}
                      />
                    </div>
                    <div className="show-section-name-part-two">
                      <Button
                        label="cancel"
                        className="name-cancel"
                        onClick={handleCancel}
                      />
                      <Button
                        label="Update"
                        className="name-cancel"
                        onClick={handleUpdateSchool}
                      />
                    </div>
                  </div>
                )}
                <div className="ep-about-sec-items">
                  <span onClick={() => setShowName("college")}>College</span>
                </div>
                {showName === "college" && (
                  <div className="show-section-name">
                    <div className="show-section-name-part-one">
                      <InputText
                        placeholder="College"
                        name="collegeName"
                        value={collegeDetails.collegeName}
                        onChange={handleCollegeInputChange}
                      />

                      <div className="year-container">
                        <Calendar
                          view="year"
                          dateFormat="yy"
                          className="year"
                          placeholder="From"
                          value={collegeDetails.from}
                          onChange={(e) =>
                            handleCollegeDateChange("from", e.value)
                          }
                        />
                        <span> to</span>
                        <Calendar
                          view="year"
                          dateFormat="yy"
                          className="year"
                          placeholder="To"
                          value={collegeDetails.to}
                          onChange={(e) =>
                            handleCollegeDateChange("to", e.value)
                          }
                        />
                      </div>
                      <InputText
                        placeholder="Degree"
                        className="school-description"
                        name="degree"
                        value={collegeDetails.degree}
                        onChange={handleCollegeInputChange}
                      />
                    </div>
                    <div className="show-section-name-part-two">
                      <Button
                        label="cancel"
                        className="name-cancel"
                        onClick={handleCancel}
                      />
                      <Button
                        label="Update"
                        className="name-cancel"
                        onClick={handleUpdateCollege}
                      />
                    </div>
                  </div>
                )}
                <div className="ep-about-sec-items">
                  <span onClick={() => setShowName("work")}>Work</span>
                </div>
                {showName === "work" && (
                  <div className="show-section-name">
                    <div className="show-section-name-part-one">
                      <InputText
                        placeholder="Company"
                        name="companyName"
                        value={workDetails.companyName}
                        onChange={handleWorkInputChange}
                      />

                      <div className="year-container">
                        <Calendar
                          view="year"
                          dateFormat="yy"
                          className="year"
                          placeholder="From"
                          value={workDetails.from}
                          onChange={(e) =>
                            handleWorkDateChange("from", e.value)
                          }
                        />
                        <span> to</span>
                        <Calendar
                          view="year"
                          dateFormat="yy"
                          className="year"
                          placeholder="To"
                          value={workDetails.To}
                          onChange={(e) => handleWorkDateChange("to", e.value)}
                        />
                      </div>
                      <InputText
                        placeholder="Designation"
                        className="school-description"
                        name="designation"
                        value={workDetails.designation}
                        onChange={handleWorkInputChange}
                      />
                    </div>
                    <div className="show-section-name-part-two">
                      <Button
                        label="cancel"
                        className="name-cancel"
                        onClick={handleCancel}
                      />
                      <Button
                        label="Update"
                        className="name-cancel"
                        onClick={handleUpdateWork}
                      />
                    </div>
                  </div>
                )}
                <div className="ep-about-sec-items">
                  <span onClick={() => setShowName("gender")}>Gender</span>
                </div>
                {showName === "gender" && (
                  <div className="show-section-name">
                    <div className="show-section-name-part-one">
                      <Dropdown
                        //   value={userData.gender}
                        onChange={(e) =>
                          setSampleUserData({
                            ...userData,
                            gender: e.value.name,
                          })
                        }
                        options={genderOption}
                        optionLabel="name"
                        placeholder={sampleUserData?.gender}
                        className="bio-input"
                      />
                    </div>
                    <div className="show-section-name-part-two">
                      <Button
                        label="cancel"
                        className="name-cancel"
                        onClick={handleCancel}
                      />
                      <Button
                        label="Update"
                        className="name-cancel"
                        onClick={handleUpdate}
                      />
                    </div>
                  </div>
                )}
                <div className="ep-about-sec-items">
                  <span onClick={() => setShowName("birthday")}>Birthday</span>
                </div>
                {showName === "birthday" && (
                  <div className="show-section-name">
                    <div className="show-section-name-part-one">
                      <Calendar
                        dateFormat="dd/mm/yy"
                        className="dob"
                        placeholder={
                          userData?.dob
                            ? formatDate(userData?.dob)
                            : "Date Of Birth"
                        }
                        value={userData?.dob || ""}
                        onChange={(e) =>
                          setSampleUserData({
                            ...userData,
                            dob: handleISTChange(e.value),
                          })
                        }
                      />
                    </div>
                    <div className="show-section-name-part-two">
                      <Button
                        label="cancel"
                        className="name-cancel"
                        onClick={handleCancel}
                      />
                      <Button
                        label="Update"
                        className="name-cancel"
                        onClick={handleUpdate}
                      />
                    </div>
                  </div>
                )}
                <div className="ep-about-sec-items">
                  <span onClick={() => setShowName("phone")}>Phone</span>
                </div>
                {showName === "phone" && (
                  <div className="show-section-name">
                    <div className="show-section-name-part-one">
                      <InputText
                        placeholder={
                          userData?.phoneNumber
                            ? userData?.phoneNumber
                            : "Phone"
                        }
                        className="bio-input"
                        keyfilter="int"
                        maxLength={10}
                        onChange={(e) =>
                          setSampleUserData({
                            ...userData,
                            phoneNumber: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="show-section-name-part-two">
                      <Button
                        label="cancel"
                        className="name-cancel"
                        onClick={handleCancel}
                      />
                      <Button
                        label="Update"
                        className="name-cancel"
                        onClick={handleUpdate}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <Divider layout="vertical" type="solid" />
        </div>
      ) : (
        <div className="loading-animation">
          <Lottie animationData={Loading} className="loading-animation" />
        </div>
      )}
    </div>
  );
}
