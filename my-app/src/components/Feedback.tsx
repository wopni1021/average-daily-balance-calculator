import React from "react";
import "./Feedback.scss";

const ROOT = "adb-feedback";

const Feedback = () => {
  return (
    <div className={ROOT}>
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLScdYrG9Q-t6bIecCju4se-JPRRXxrGd0i0A__mSZa1SL8pg5g/viewform?embedded=true"
        width="840"
        height="100%"
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
      >
        Loading…
      </iframe>
    </div>
  );
};

export default Feedback;
