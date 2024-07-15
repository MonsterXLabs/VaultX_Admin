// LoadingOverlay.js
import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

const LoadingOverlay = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="loading-overlay">
      {}
      <ClipLoader size={60} color={'#3498db'} loading={loading} />
    </div>
  );
};

export default LoadingOverlay;
