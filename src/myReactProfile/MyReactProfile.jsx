import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';  // Import ReactDOM for React Portal
import ReactProfile, { openEditor } from 'react-profile';
import 'react-profile/themes/default.min.css';
import './MyReactProfile.scss';

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
        console.error('Image editing failed:', error);
        setIsEditorOpen(false); 
      }
    }
  };

  return (
    <div className="my-react-profile">
      {imageSrc && (
        <div>
          <img
            src={editedImageSrc || imageSrc}
            alt="Selected"
            style={{ height: '150px', width: '200px', objectFit: 'cover' }}
          />
          <button onClick={handleImageEdit} className="edit-button">
            Edit Image
          </button>
          <div id='editing-section' ref={editingSectionRef}></div>
          {isEditorOpen && ReactDOM.createPortal(
            <div className="editor-container ">
              <ReactProfile src={editedImageSrc || imageSrc} />
            </div>,
            editingSectionRef.current  
          )}
        </div>
      )}
    </div>
  );
}
