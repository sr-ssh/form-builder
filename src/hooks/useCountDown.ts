import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns-jalali";
import { formatDuration } from "../utils/date";

interface UseCountdown {
  time: string;
  reset: () => void;
  finished: boolean;
}

function useCountdown(
  startTimeInSeconds: number,
  maxDurationInSeconds: number,
): UseCountdown {
  const [timeLeft, setTimeLeft] = useState<number>(startTimeInSeconds);

  useEffect(() => {
    const fetchServerTime = async () => {
      try {
        // const response = await fetch("YOUR_SERVER_API_ENDPOINT");
        // const { time } = await response.json();
        // setServerTime(new Date(time));
        setTimeLeft(
          maxDurationInSeconds -
            (new Date().getTime() - startTimeInSeconds) / 1000,
        );
      } catch (error) {
        console.error("Error fetching server time:", error);
      }
    };

    // Fetch server time initially
    fetchServerTime();

    // Fetch server time every minute
    const intervalId = setInterval(fetchServerTime, 60000);

    return () => clearInterval(intervalId);
  }, [maxDurationInSeconds, startTimeInSeconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((timeLeft) => timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const reset = useCallback(() => {
    setTimeLeft(
      maxDurationInSeconds - (new Date().getTime() - startTimeInSeconds) / 1000,
    );
  }, [maxDurationInSeconds, startTimeInSeconds]);

  return {
    time: formatDuration(timeLeft),
    reset,
    finished: timeLeft <= 0,
  };
}

export default useCountdown;
