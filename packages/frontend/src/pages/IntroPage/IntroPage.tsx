import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './IntroPage.css';

const IntroPage: React.FC = () => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/home');
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleEnter();
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  return (
    <div className="intro-page">
      <div className="intro-content">
        <div className="logo">z</div>
        <button className="enter-button" onClick={handleEnter}>Enter</button>
      </div>
      <div className="footer">
        <div>Humans + Machines</div>
        <div>Powered by Zaaz</div>
      </div>
    </div>
  );
};

export default IntroPage;
