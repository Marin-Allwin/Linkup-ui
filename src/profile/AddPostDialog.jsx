// import React, { useContext } from "react";
// import { Dialog } from "primereact/dialog";
// import { Tooltip } from "primereact/tooltip";
// import { Button } from "primereact/button";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.bubble.css";
// import "./AddPostDialog.scss";
import { useUserContext } from "../contextFolder/UserProvider ";
// import { Toast } from "primereact/toast";

// const AddPostDialog = () => {
//   const {
//     showAddPost,
//     setShowAddPost,
//     textValue,
//     setTextValue,
//     handlePostImgClick,
//     handleFileChange,
//     selectedFile,
//     imagePreview,
//     postPicRef,
//     handleAddPost,
//   } = useUserContext();
//   return (
//     <>
//       <Toast ref={toast} />

//       <Dialog
//         header="Add Post"
//         visible={showAddPost}
//         style={{ width: "50vw" }}
//         draggable={false}
//         onHide={() => {
//           if (!showAddPost) return;
//           setShowAddPost(false);
//           setTextValue("");
//         }}
//         className="add-post-dialoge"
//       >
//         <Tooltip
//           target=".add-image"
//           content="Upload an image"
//           position="right"
//         />
//         <div className="editor-container">
//           <ReactQuill
//             theme="bubble"
//             value={textValue}
//             onChange={setTextValue}
//             className="add-post-editor"
//             placeholder="Share something....."
//           />
//         </div>
//         <div className="add-post-image">
//           <span>
//             <i className="pi pi-image add-image" onClick={handlePostImgClick}>
//               <input
//                 type="file"
//                 ref={postPicRef}
//                 style={{ display: "none" }}
//                 accept="image/jpeg,image/png"
//                 onChange={handleFileChange}
//               />
//             </i>
//           </span>
//           <div className="show-image-container">
//             {selectedFile && (
//               <img
//                 src={imagePreview}
//                 alt="Selected"
//                 style={{ width: "180px", height: "200px" }}
//                 className="post-image"
//               />
//             )}
//           </div>
//         </div>
//         <div className="add-post-button">
//           <Button
//             label="Post"
//             onClick={handleAddPost}
//             disabled={!selectedFile && !textValue}
//           />
//         </div>
//       </Dialog>
//     </>
//   );
// };

// export default AddPostDialog;

import React, { useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Tooltip } from "primereact/tooltip";
import { Button } from "primereact/button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import "./AddPostDialog.scss";
import Cookies from "js-cookie";
import api from "../axiosInceptor/api";
import { Toast } from "primereact/toast";


const AddPostDialog = () => {
  const {
    showAddPost,
    SetShowAddPost,
    textValue,
    setTextValue,
    postPicRef,
  } = useUserContext();

  const Bearer = Cookies.get("access_Token");
  const email = localStorage.getItem("userEmail");
  const toast = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const addPostForm = new FormData();

  const handlePostImgClick = () => {
    postPicRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddPost = () => {
    addPostForm.append("email", email);

    if (textValue) {
      addPostForm.append("content", textValue);
    }

    if (selectedFile) {
      addPostForm.append("postImage", selectedFile);
    }

    console.log(selectedFile);
    console.log(textValue);

    api
      .post(`/user/add-post`, addPostForm, {
        headers: {
          Authorization: `Bearer ${Bearer}`,
        },
      })
      .then((response) => {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Posted Successfully",
        });
        console.log(response);
        setTimeout(() => {
          SetShowAddPost(false);
          setSelectedFile(null);
          setImagePreview(null);
          setTextValue("");
        }, 2000);
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="Add Post"
        visible={showAddPost}
        style={{ width: "50vw" }}
        draggable={false}
        onHide={() => {
          SetShowAddPost(false);
          setTextValue("");
          setSelectedFile("");
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
      </Dialog>
    </>
  );
};

export default AddPostDialog;
