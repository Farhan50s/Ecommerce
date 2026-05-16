import { useState, useEffect } from 'react';

const useCountdown = (saleEndsAt) => {
  const calculateTimeLeft = () => {
    if (!saleEndsAt) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    
    const difference = saleEndsAt - Date.now();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        expired: false
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    // Re-evaluate immediately in case saleEndsAt changed from undefined
    const initialRemaining = calculateTimeLeft();
    setTimeLeft(initialRemaining);

    if (initialRemaining.expired) return;

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining.expired) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [saleEndsAt]);

  return timeLeft;
};

export default useCountdown;
