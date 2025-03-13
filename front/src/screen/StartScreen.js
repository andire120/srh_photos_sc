import React from "react";
import "./StartScreen.css"; // Importing CSS for styles

const StartScreen = ({ onStart }) => {
  return (
    <div className="start-screen">
      <div>
        <img src="./spamlogo.png" alt="Spam Logo" className="logo" />
        <p className="jum">●</p>
      </div>
      <div>
        <img src="./spamlogo2.png" alt="Spam Logo Ver2" className="logo2" />
        <h2 className="big">Self Photo Booth</h2><h4 className="smail">of SRH</h4>
      </div>

      
      <button onClick={onStart}>시작하기</button>
    </div>
  );
};

export default StartScreen;