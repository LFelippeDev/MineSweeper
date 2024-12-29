import { createContext, useContext, useMemo, useState } from 'react';

interface TimerContextData {
  hours: string;
  minutes: string;
  seconds: string;
  clearTimer: () => void;
  pauseTimer: () => void;
  startTimer: () => void;
}

const TICK_TIME = 1000;
const ONE_MINUTE = 60;
const ONE_HOUR = 3600;

const DEFAULT_CONTEXT_DATA = {
  hours: '00',
  minutes: '00',
  seconds: '00',
  clearTimer: () => {},
  pauseTimer: () => {},
  startTimer: () => {},
};

const formatNumber = (number: number) =>
  number < 10 ? `0${number}` : number.toString();

const TimerContext = createContext<TimerContextData>(DEFAULT_CONTEXT_DATA);

const TimerProvider = ({ children }) => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [nodeIntervalId, setNodeIntervalId] = useState<NodeJS.Timeout | null>(
    null
  );

  const { hours, minutes, seconds } = useMemo(() => {
    if (timeSpent < ONE_MINUTE)
      return { hours: '00', minutes: '00', seconds: formatNumber(timeSpent) };

    const formattedSeconds = timeSpent % ONE_MINUTE;
    const formattedHours = Math.floor(timeSpent / ONE_HOUR);
    const formattedMinutes =
      timeSpent < ONE_HOUR
        ? Math.floor(timeSpent / ONE_MINUTE)
        : Math.floor((timeSpent % ONE_HOUR) / ONE_MINUTE);

    return {
      hours: timeSpent < ONE_HOUR ? '00' : formatNumber(formattedHours),
      minutes: formatNumber(formattedMinutes),
      seconds: formatNumber(formattedSeconds),
    };
  }, [timeSpent]);

  const startTimer = () => {
    const intervalId = setInterval(() => {
      setTimeSpent((prevState) => prevState + 1);
    }, TICK_TIME);

    setNodeIntervalId(intervalId);
  };

  const pauseTimer = () => {
    if (nodeIntervalId) clearInterval(nodeIntervalId);

    setNodeIntervalId(null);
  };

  const clearTimer = () => {
    if (nodeIntervalId) clearInterval(nodeIntervalId);

    setTimeSpent(0);
    setNodeIntervalId(null);
  };

  return (
    <TimerContext.Provider
      value={{ hours, minutes, seconds, clearTimer, pauseTimer, startTimer }}
    >
      {children}
    </TimerContext.Provider>
  );
};

const useTimer = (): TimerContextData => {
  const context = useContext(TimerContext);

  if (!context)
    throw new Error('useTimer must be used within an TimerProvider');

  return context;
};

export { TimerProvider, useTimer };
