import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import "./IdolCam.css";

// 포즈 이미지 파일 경로 배열
const idolPoses = [
  "./pose1.png", // 첫 번째 포즈 이미지 경로
  "./pose2.png", // 두 번째 포즈 이미지 경로
  "./pose3.png", // 세 번째 포즈 이미지 경로
  "./pose4.png", // 네 번째 포즈 이미지 경로
];

/**
 * 아이돌 카메라 컴포넌트
 * @param {function} addPhoto - 찍은 사진을 부모 컴포넌트에 전달하는 함수
 * @param {number} photoCount - 현재까지 찍힌 사진 수
 * @param {function} setIsCapturing - 촬영 중인지 여부를 부모 컴포넌트에 알리는 함수
 */
const IdolCam = ({ addPhoto, photoCount, setIsCapturing }) => {
  // 웹캠 참조 객체 생성
  const webcamRef = useRef(null);
  
  // 상태 관리 변수들
  const [capturing, setCapturing] = useState(false); // 현재 촬영 중인지 여부
  const [countdown, setCountdown] = useState(0); // 카운트다운 타이머 값
  const [photoIndex, setPhotoIndex] = useState(0); // 현재 찍는 사진의 인덱스
  const [isProcessing, setIsProcessing] = useState(false); // 이미지 처리 중인지 여부

  /**
   * 촬영 소리를 재생하는 함수
   */
  const playSound = () => {
    const audio = new Audio("./mp3.mp3");
    audio.play();
  };

  /**
   * 사진 촬영 프로세스를 시작하는 함수
   * 이미 4장을 찍었거나 촬영 중이면 실행되지 않음
   */
  const capture = () => {
    if (photoCount >= 4 || capturing) return; // 이미 4장 찍었거나 촬영 중이면 중단
    setCapturing(true); // 촬영 상태 활성화
    setCountdown(5); // 5초 카운트다운 시작
    setPhotoIndex(0); // 사진 인덱스 초기화
  };

  /**
   * 부모 컴포넌트로 사진을 전달하는 함수
   * useCallback을 사용하여 불필요한 리렌더링 방지
   */
  const handleAddPhoto = useCallback(
    (imageSrc) => {
      addPhoto(imageSrc); // 부모 컴포넌트로 사진 전달
    },
    [addPhoto]
  );

  /**
   * 찍힌 이미지를 원하는 크기와 비율로 잘라내고 품질을 향상시키는 함수
   * @param {string} imageSrc - 웹캠에서 캡처한 원본 이미지 데이터
   * @returns {Promise<string>} - 처리된 이미지 데이터
   */
  const cropImage = (imageSrc) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        // 고품질 이미지를 위해 해상도 증가
        canvas.width = 1920; // 너비 증가 (기존 960의 2배)
        canvas.height = 2560; // 높이 증가 (기존 1280의 2배)
        const ctx = canvas.getContext("2d");

        // 이미지가 캔버스를 꽉 채우도록 비율 계산
        const scale = Math.max(
          canvas.width / img.width,
          canvas.height / img.height
        );
        // 이미지를 중앙에 배치하기 위한 좌표 계산
        const x = canvas.width / 2 - (img.width / 2) * scale;
        const y = canvas.height / 2 - (img.height / 2) * scale;

        // 이미지 품질 향상 설정
        ctx.imageSmoothingEnabled = true; // 이미지 스무딩 활성화
        ctx.imageSmoothingQuality = "high"; // 최고 품질로 설정
        
        // 이미지 그리기
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        // 최대 품질(1.0)로 JPEG 이미지 생성
        const croppedImageSrc = canvas.toDataURL("image/jpeg", 1.0);
        resolve(croppedImageSrc);
      };
    });
  };

  /**
   * 카운트다운 및 사진 촬영 프로세스를 관리하는 useEffect
   * 각 사진을 5초 간격으로 찍고, 총 4장을 찍으면 종료
   */
  useEffect(() => {
    let timer;
    
    // 카운트다운이 진행 중일 때
    if (capturing && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1); // 1초씩 감소
      }, 1000);
    } 
    // 카운트다운이 0이 되었고, 아직 4장을 다 찍지 않았을 때
    else if (
      countdown === 0 &&
      capturing &&
      photoIndex < 4 &&
      !isProcessing
    ) {
      setIsProcessing(true); // 이미지 처리 시작
      const imageSrc = webcamRef.current.getScreenshot(); // 스크린샷 촬영
      
      if (imageSrc) {
        // 이미지 크롭 및 품질 향상 처리
        cropImage(imageSrc).then((croppedImage) => {
          handleAddPhoto(croppedImage); // 부모 컴포넌트로 사진 전달
          playSound(); // 촬영 소리 재생
          setPhotoIndex(photoIndex + 1); // 다음 사진 인덱스로 이동
          setCountdown(5); // 다시 5초 카운트다운 시작
          setIsProcessing(false); // 이미지 처리 완료
        });
      } else {
        setIsProcessing(false); // 이미지가 없는 경우 처리 중단
      }
    }

    // 4장의 사진을 모두 찍었을 때 촬영 종료
    if (photoIndex >= 4 || photoCount >= 4) {
      setCapturing(false); // 촬영 상태 비활성화
      setIsCapturing(false); // 부모 컴포넌트에게 촬영 종료 알림
    }

    // 컴포넌트 언마운트 또는 의존성 변경 시 타이머 정리
    return () => clearTimeout(timer);
  }, [
    capturing, // 촬영 중인지 여부
    countdown, // 현재 카운트다운 값
    handleAddPhoto, // 사진 추가 함수
    photoIndex, // 현재 사진 인덱스
    photoCount, // 총 찍은 사진 수
    isProcessing, // 이미지 처리 중인지 여부
    setIsCapturing, // 부모 컴포넌트의 상태 업데이트 함수
  ]);

  // 컴포넌트 렌더링
  return (
    <div className="idol-webcam-container">
      {/* 웹캠과 오버레이를 포함하는 컨테이너 */}
      <div className="idol-content-box">
        {/* 웹캠 컴포넌트 */}
        <Webcam
          audio={false} // 오디오 비활성화
          ref={webcamRef} // 웹캠 참조 연결
          screenshotFormat="image/jpeg" // 스크린샷 형식
          className="idol-webcam" // CSS 클래스
          style={{ transform: "scaleX(-1)" }} // 거울 모드
          videoConstraints={{
            width: 1280, // 더 높은 해상도 설정
            height: 720, // 더 높은 해상도 설정
            facingMode: "user", // 전면 카메라 사용
          }}
        />
        
        {/* 카운트다운 타이머 오버레이 */}
        {capturing && countdown > 0 && (
          <div className="idol-countdown-overlay">{countdown}</div>
        )}
        
        {/* 포즈 가이드 이미지 오버레이 */}
        <img
          src={idolPoses[photoIndex]} // 현재 인덱스에 맞는 포즈 이미지
          alt="Idol Pose" // 대체 텍스트
          className="idol-overlay" // CSS 클래스
        />
      </div>
      
      {/* 현재 페이지 인디케이터 (예: 1/4) */}
      <div className="idol-page-indicator">{photoCount}/4</div>
      
      {/* 구분선 */}
      <div className="idol-divider"></div>
      
      {/* 촬영 컨트롤 영역 */}
      <div className="idol-controls">
        {/* 촬영 버튼 */}
        <button
          className={`idol-camera-icon ${capturing ? "capturing" : ""}`} // 촬영 중일 때 클래스 추가
          onClick={capture} // 클릭 시 촬영 시작
          title="사진 찍기" // 툴팁 텍스트
          disabled={capturing || photoCount >= 4} // 촬영 중이거나 4장 다 찍으면 비활성화
        >
          <img src="/camera.png" alt="사진 찍기" />
        </button>
      </div>
    </div>
  );
};

export default IdolCam;