// LoadingOverlay.js
import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import './SpinnerOverlay.css'; // Import the CSS for overlay and spinner

const LoadingOverlay = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="loading-overlay">
      <ClipLoader size={60} color={'#3498db'} loading={loading} />
    </div>
  );
};

export default LoadingOverlay;
