import React, { useEffect, useState } from "react";
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
      let nextFriday = dayjs
        .utc()
        .day(5)
        .hour(18)
        .minute(0)
        .second(0)
        .millisecond(0);

      if (now.isAfter(nextFriday)) {
        nextFriday = nextFriday.add(1, "week");
      }

      const diff = nextFriday.diff(now);
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
    <Badge
      variant="default"
      className="bg-purple-400 hover:bg-purple-400 flex flex-col items-center rounded-full px-4 py-1 min-w-[120px]"
    >
      <span className="text-[11px] text-white/90">Round ends in</span>
      <span className="text-xs font-semibold text-white leading-tight">
        {timeLeft}
      </span>
    </Badge>
  );
}
