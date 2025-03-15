import React, { useState } from "react";
import StartScreen from "./screen/StartScreen";
import ChooseScreen from "./screen/ChooseScreeen";
import WebcamCapture from "./screen/WebcamCapture"; // 예시 프레임 카메라 컴포넌트
import PhotoFrame from "./screen/PhotoFrame";
import DownloadButton from "./screen/DownloadButton";
import IdolCam from "./screen/IdolCam";
import TutorialScreen from "./screen/TutorialScreen";

import "./App.css";

function App() {
  const [photos, setPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("start"); // "start", "tutorial", "choose", "capture", "result"
  const [selectedFrame, setSelectedFrame] = useState(null);

  const addPhoto = (photo) => {
    if (photos.length < 4) {
      setPhotos((prevPhotos) => [...prevPhotos, photo]);
    }
    if (photos.length === 3) {
      // 마지막 사진이 추가되었을 때
      setIsCapturing(false); // 촬영 종료
      setCurrentScreen("result");
    }
  };

  const handleStart = () => {
    setCurrentScreen("tutorial"); // StartScreen에서 Tutorial로 이동
  };

  const handleTutorialComplete = () => {
    setCurrentScreen("choose"); // Tutorial에서 ChooseScreen으로 이동
  };

  const handleFrameSelect = (frame) => {
    setSelectedFrame(frame); // 선택한 프레임 설정
    setIsCapturing(true); // 사진 촬영 시작
    setCurrentScreen("capture"); // 캡처 화면으로 전환
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "start":
        return <StartScreen onStart={handleStart} />;
      case "tutorial":
        return <TutorialScreen onComplete={handleTutorialComplete} />;
      case "choose":
        return <ChooseScreen selectFrame={handleFrameSelect} />;
      case "capture":
        return selectedFrame === "park_frame" ? (
          <IdolCam
            addPhoto={addPhoto}
            photoCount={photos.length}
            setIsCapturing={setIsCapturing}
          />
        ) : (
          <WebcamCapture addPhoto={addPhoto} photoCount={photos.length} />
        );
      case "result":
        return (
          <div>
            <PhotoFrame photos={photos} frameType={selectedFrame} />
            <DownloadButton />
          </div>
        );
      default:
        return <StartScreen onStart={handleStart} />;
    }
  };

  return <div className="App">{renderScreen()}</div>;
}

export default App;