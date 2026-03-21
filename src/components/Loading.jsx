import React from 'react';
import { Html } from '@react-three/drei';
import './Loading.css';

const Loading = () => {
  return (
    <Html center>
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading 3D Dog...</p>
      </div>
    </Html>
  );
};

export default Loading;