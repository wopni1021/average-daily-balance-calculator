import React from 'react';
import './Feedback.scss';

const ROOT = 'adb-feedback';
const test = 3;

const Feedback = () => {
  return (
    <div className={ROOT}>
      <iframe
        title="feedback"
        src="https://docs.google.com/forms/d/e/1FAIpQLScdYrG9Q-t6bIecCju4se-JPRRXxrGd0i0A__mSZa1SL8pg5g/viewform?embedded=true"
        className="google-form"
        width="100%"
        style={{ border: 'none' }}
        allowFullScreen
      >
        Loading…
      </iframe>
    </div>
  );
};

export default Feedback;
