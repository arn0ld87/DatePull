import React, { useRef, useEffect, useState } from 'react';

interface VideoIntroProps {
  onComplete: () => void;
}

const VideoIntro: React.FC<VideoIntroProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [canSkip, setCanSkip] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Erlaube Skip nach 2 Sekunden
    const skipTimer = setTimeout(() => {
      setCanSkip(true);
    }, 2000);

    const handleEnded = () => {
      setIsEnding(true);
      setTimeout(() => {
        onComplete();
      }, 300);
    };

    video.addEventListener('ended', handleEnded);

    return () => {
      clearTimeout(skipTimer);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (canSkip) {
      setIsEnding(true);
      setTimeout(() => {
        onComplete();
      }, 300);
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-300 ${
        isEnding ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleSkip}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-contain"
      >
        <source src="/media/Download.mp4" type="video/mp4" />
        Dein Browser unterstützt keine Videos.
      </video>
      
      {canSkip && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center animate-pulse">
          <p className="text-sm opacity-75">Klicken zum Überspringen</p>
        </div>
      )}
    </div>
  );
};

export default VideoIntro;
