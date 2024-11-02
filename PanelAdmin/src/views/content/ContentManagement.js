import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ContentManagement = () => {
  const [content, setContent] = useState('');

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleSaveContent = () => {
    // Logic to save content to the database
    console.log('Content saved:', content);
  };

  return (
    <div>
      <h2>Content Management</h2>
      <ReactQuill value={content} onChange={handleContentChange} />
      <button onClick={handleSaveContent}>Save Content</button>
    </div>
  );
};

export default ContentManagement;
