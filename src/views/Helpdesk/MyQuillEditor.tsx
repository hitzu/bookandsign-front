import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

import "react-quill/dist/quill.snow.css"; // Import Quill styles

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false, // This disables SSR for react-quill
});


const MyQuillEditor = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null); // Ref for Quill editor instance

  useEffect(() => {
    if (quillRef.current) {
      editorRef.current = quillRef.current;
      // console.log("Quill instance:", editorRef.current);
    }
  }, []);

  return (
    <ReactQuill
      placeholder="Type your text here..."
      theme="snow"
      value={`
                  <p>hello...</p>
                `}
    />
  );
};

export default MyQuillEditor;
