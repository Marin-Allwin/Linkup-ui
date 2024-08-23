import React, { useEffect, useRef } from "react";
import "./Editor.scss"
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Embed from "@editorjs/editorjs";
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import Image from '@editorjs/image';
import Code from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';



const Editor = (props) => {
    const editor = new EditorJS({
        holder: 'editorjs',
      
        tools: {
          header: {
            class: Header,
            inlineToolbar: ['link'],
          },
          list: {
            class: List,
            inlineToolbar: ['link', 'bold'],
          },
          embed: {
            class: Embed,
            inlineToolbar: false,
            config: {
              youtube: true,
              coub: true,
            },
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: ['link', 'bold', 'italic'],
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
          },
          code: {
            class: Code,
            inlineToolbar: true,
          },
          delimiter: {
            class: Delimiter,
          },
        },
      });

  return (
    <div className="editor-main">
      {!props.value && <h4>Write Something........</h4>}
      <div className="editorjs" id="editorjs" ></div>
    </div>
  );
};

export default Editor;
