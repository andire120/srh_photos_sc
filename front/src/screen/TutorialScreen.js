import React from "react";
import "./TutorialScreen.css";

const TutorialScreen = ({ onComplete }) => {
    return(
        <>
        <p className="head">HOW TO USE</p>
    <div class="container">
        
    <div class="left">
        <img src="example.png" alt="example" />
    </div>
    <div class="right">
    <ul>
        <li>촬영 전 마음에 드는 프레임을 골라주세요.<br/><br/></li>
        <li>5초에 한번씩 네번의 사진이 촬영됩니다.<br/>시간에 맞추어 포즈를 취해보세요!<br/></li>
        <li>완성된 스팸네컷을 출력하거나 다운로드하여 <br/> 간직하세요.</li>
</ul>
    </div>
    </div>
            <button className="next-button" onClick={ onComplete }>프레임 고르러 가기</button> 
        </> 
    )
}

export default TutorialScreen;