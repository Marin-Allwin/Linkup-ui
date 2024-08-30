import React, { useRef, useState } from "react";
import ReactDOM from "react-dom"; // Import ReactDOM for React Portal
import ReactProfile, { openEditor } from "react-profile";
import "react-profile/themes/default.min.css";
import "./MyReactProfile.scss";
import { Button } from "primereact/button";

export default function MyReactProfile({ imageSrc }) {
  const [editedImageSrc, setEditedImageSrc] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const editingSectionRef = useRef(null);

  const handleImageEdit = async () => {
    if (imageSrc && editingSectionRef.current) {
      try {
        setIsEditorOpen(true);
        const editedImage = await openEditor({ src: imageSrc });
        setEditedImageSrc(editedImage);
        setIsEditorOpen(false);
      } catch (error) {
        console.error("Image editing failed:", error);
        setIsEditorOpen(false);
      }
    }
  };

  const handleCancel = () => {
    setIsEditorOpen(false); // Close the editor
    // setIsDialogVisible(false); // Close the dialog
  };

  return (
    <div className="my-react-profile">
      {imageSrc && (
        <div className="my-react-profile-container">
          <img
            src={editedImageSrc || imageSrc}
            alt="Selected"
            style={{ height: "180px", width: "200px", objectFit: "cover" }}
            className="image-styling"
          />

          <div style={{ alignContent: "end" }}>
            <Button label="edit" onClick={handleImageEdit} className="edit-button">
              {/* <i className="pi pi-pencil "> </i> */}
            </Button>
          </div>

          <div id="editing-section" ref={editingSectionRef}></div>
          {isEditorOpen &&
            ReactDOM.createPortal(
              <div className="editor-container ">
                <ReactProfile src={editedImageSrc || imageSrc}  onCancel={handleCancel}/>
              </div>,
              editingSectionRef.current
            )}
        </div>
      )}
    </div>
  );
}
