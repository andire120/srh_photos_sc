import React from "react";
import "./StartScreen.css"; // Importing CSS for styles
import spamLogo from '../../public/spamlogo.png';
import spamLogo2 from '../../public/spamlogo2.png';

const StartScreen = ({ onStart }) => {
  return (
    <div className="start-screen">
      <div className="h-container">
        <div className="height">
          <div className="left-container">
          <img src={spamLogo} alt="Spam Logo" className="Logo" />
            <p className="jum">●</p>
          </div>
          <div className="right-container">
          <img src={spamLogo2} alt="Spam Logo2" className="Logo2" />
            <div className="text-group">
              <h2 className="big">Self Photo Booth</h2><h4 className="smail">of SRH</h4>
            </div>   
          </div>
      </div>
      
      </div>
      
      <button className="start-button" onClick={onStart}>시작하기</button>
    </div>
  );
};

export default StartScreen;