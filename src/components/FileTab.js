import React from 'react';

const FileTab = ({ file, isActive, onClick }) => {
  return (
    <div
      className={`file-tab ${isActive ? 'active' : ''}`}
      onClick={() => onClick(file)}
    >
      {file.name}
    </div>
  );
};

export default FileTab;
