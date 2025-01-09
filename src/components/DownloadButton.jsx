// Used to download the cleaned contacts data as a CSV file
import React from "react";

const DownloadButton = ({ onDownload }) => {
  return (
    <button onClick={onDownload} className="download-button">
      Download CSV
    </button>
  );
};

export default DownloadButton;