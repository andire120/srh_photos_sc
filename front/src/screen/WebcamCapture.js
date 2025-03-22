import React from "react";
import "./StartScreen.css"; // Importing CSS for styles

const StartScreen = ({ onStart }) => {
  return (
    <div className="start-screen">
      <div className="h-container">
        <div className="height">
          <div className="left-container">
            <div 
              className="logo" 
              style={{
                backgroundImage: `url(/public/spamlogo.png)`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
              aria-label="Spam Logo"
            ></div>
            <p className="jum">●</p>
          </div>
          <div className="right-container">
            <div 
              className="logo2" 
              style={{
                backgroundImage: `url(/public/spamlogo2.png)`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
              aria-label="Spam Logo Ver2"
            ></div>
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