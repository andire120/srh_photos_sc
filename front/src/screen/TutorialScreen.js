import React from "react";
import "./TutorialScreen.css";

const TutorialScreen = ({ onComplete }) => {
    //준석아 굴러라 하하
    return(
        <>
            <h1>TutorialScreen</h1>
            <p>ddd</p>
            <button className="start-button" onClick={ onComplete }>프레임 고르러 가기</button> 
        </> 
    )
      
}

export default TutorialScreen;