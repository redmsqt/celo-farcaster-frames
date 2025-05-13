import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { Badge } from "./ui/badge";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import duration from "dayjs/plugin/duration";

dayjs.extend(utc);
dayjs.extend(duration);

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = dayjs.utc();
      let nextSunday = dayjs
        .utc()
        .day(7)
        .hour(12)
        .minute(0)
        .second(0)
        .millisecond(0);

      if (now.isAfter(nextSunday)) {
        nextSunday = nextSunday.add(1, "week");
      }

      const diff = nextSunday.diff(now);
      const duration = dayjs.duration(diff);

      const days = Math.floor(duration.asDays());
      const hours = duration.hours();
      const minutes = duration.minutes();

      return `${days}d ${hours}h ${minutes}m`;
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Badge variant="default" className="bg-blue-500 hover:bg-blue-500">
      <Clock className="w-3 h-3 mr-1.5" />
      {timeLeft}
    </Badge>
  );
}
