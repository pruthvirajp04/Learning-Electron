import React, { useState, useEffect } from 'react';
import { useLayoutEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Draggable from 'react-draggable';
import icon from '../../assets/icon.svg';
import './App.css';

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${remainingSeconds}`;
}

function Hello(): JSX.Element {
  const [screenTime, setScreenTime] = useState<number>(0);
  const [isIdle, setIsIdle] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let startTime: number = Date.now();

    const handleActivity = () => {
      startTime = Date.now();
      if (isIdle) {
        setIsIdle(false);
      }
    };

    const handleInactivity = () => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      if (elapsedSeconds >= 60 && !isIdle) {
        setIsIdle(true);
      }
    };

    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('keydown', handleActivity);
    document.addEventListener('mousemove', handleInactivity);
    document.addEventListener('keydown', handleInactivity);

    intervalId = setInterval(() => {
      setScreenTime(prevTime => prevTime + 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('keydown', handleActivity);
      document.removeEventListener('mousemove', handleInactivity);
      document.removeEventListener('keydown', handleInactivity);
    };
  }, [isIdle]);

  const formattedTime: string = formatTime(screenTime);

  return (
    <Draggable>
      <h1 className="draggable-widget">
        {isIdle ? 'Idle' : `Total Screen Time: ${formattedTime}`}
      </h1>
    </Draggable>
  );
}

export default function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
