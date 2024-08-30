import React, { createContext, useState, useContext, useRef } from "react";
import api from "../axiosInceptor/api";
import Cookies from "js-cookie";
import { Toast } from "primereact/toast";

const UserContext = createContext();

export const UserProvider = ({ children }) => {

  const [userData, setUserData] = useState(null);
  const [refresh, setRefresh] = useState(true);

  const [showAddPost, SetShowAddPost] = useState(false);
  const [textValue, setTextValue] = useState("");
  // const postPicRef = useRef(null);
  // const [selectedFile, setSelectedFile] = useState(null);
  // const [imagePreview, setImagePreview] = useState(null);

  // const handlePostImgClick = () => {
  //   postPicRef.current.click();
  // };

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        refresh,
        setRefresh,
        showAddPost,
        SetShowAddPost,
        textValue,
        setTextValue,
        // handlePostImgClick,
        // handleFileChange,
        // selectedFile,
        // imagePreview,
        // postPicRef,
        // handleAddPost,
        // setSelectedFile
      }}
    >
      {" "}
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
