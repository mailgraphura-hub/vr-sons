import React from 'react';

const DownloadButton = ({ onClick }) => {
  const styles = `
    .Btn {
      width: 50px;
      height: 50px;
      border: none;
      border-radius: 50%;
      background-color: #f0f0f0; /* Changed to white-grey */
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.11);
    }

    .svgIcon {
      fill: rgb(214, 178, 255);
      animation: slide-in-top 0.6s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    }

    .icon2 {
      width: 18px;
      height: 5px;
      border-bottom: 2px solid rgb(182, 143, 255);
      border-left: 2px solid rgb(182, 143, 255);
      border-right: 2px solid rgb(182, 143, 255);
      margin-top: 2px;
    }

    @keyframes slide-in-top {
      0% {
        transform: translateY(-10px);
        opacity: 0;
      }
      100% {
        transform: translateY(0px);
        opacity: 1;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <button className="Btn" onClick={onClick}>
        <svg 
          className="svgIcon" 
          viewBox="0 0 384 512" 
          height="1em" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
        </svg>
        <span className="icon2"></span>
      </button>
    </>
  );
};

export default DownloadButton;