import React, { useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.bubble.css';  
import 'quill-emoji/dist/quill-emoji.css';
import "./QuillEditor.scss"

function QuillEditor() {
  const editorRef = useRef(null);

  React.useEffect(() => {
    const quill = new Quill(editorRef.current, {
      theme: 'bubble', 
      modules: {
        toolbar: [
          [{ 'header': '1' }, { 'header': '2' }],
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ['link', 'image']
        ]
      },
      placeholder:"Share something....."
    });
  }, []);

  return (
    <div className='quill-main'>
      <div className='quill-container' ref={editorRef} style={{ height: '200px' }}></div>
    </div>
  );
}

export default QuillEditor;
