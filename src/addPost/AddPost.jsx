import React, { useState } from "react";
import "./AddPost.scss";
import Editor from "../confugurations/Editor";
import { InputText } from "primereact/inputtext";
import { openEditor } from "react-profile";

export default function AddPost() {
    
    const [imageSrc, setImageSrc] = useState(null);

    const change = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const image = await openEditor({ src: file });
        setImageSrc(image);
      }
    };

  return (
    <div className="add-post-main">
    <div className="add-post-container">
      <div className="add-post-image">
        <InputText
          type="file"
          accept="image/jpeg;image/png"
          onChange={change}
        />
        {imageSrc && (
          <div className="image-editor-container">
            {/* Display the edited image */}
            <img src={URL.createObjectURL(imageSrc)} alt="Edited" />
          </div>
        )}
      </div>
    </div>
  </div>
  );
}

{
  /* <h2>Create a New Post</h2>
          <Editor onChange={handleEditorChange} />
          
          <div className="rendered-content">
            {editorData &&
              editorData.blocks.map((block, index) => (
                <div key={index}>{renderBlock(block)}</div>
              ))}
          </div> */
}
