"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "@zumer/orbit/style";
import "./App.css";

export default function PomodoroTimer() {
  const [time, setTime] = useState(25 * 60000);
  const [currentTimer, setCurrentTimer] = useState("pomodoro");
  const [started, setStarted] = useState(false);
  const [label, setLabel] = useState("start");

  let labels = ["start", "pause", "reset"];

  const navigate = useNavigate();

  useEffect(() => {
    void import("@zumer/orbit");
  }, []);

  const buttons = (timerType) => {
    const handleClick = () => {
      setStarted(false);
      if (timerType == "pomodoro") {
        setTime(25 * 60000);
        setCurrentTimer("pomodoro");
        setLabel(labels[0]);
      } else if (timerType == "short break") {
        setTime(5 * 60000);
        setCurrentTimer("short break");
        setLabel(labels[0]);
      } else if (timerType == "long break") {
        setTime(15 * 60000);
        setCurrentTimer("long break");
        setLabel(labels[0]);
      }
    };

    return <button onClick={() => handleClick()}>{timerType}</button>;
  };

  useEffect(() => {
    if (!started) return;

    if (time <= 0) {
      setStarted(false);
      setLabel("reset");
      return;
    }

    const timeoutId = setTimeout(() => {
      setTime(time - 1000);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [time, started]);

  const handleClick = () => {
    if (label == "reset") {
      if (currentTimer == "pomodoro") setTime(25 * 60000);
      if (currentTimer == "short break") setTime(5 * 60000);
      if (currentTimer == "long break") setTime(15 * 60000);
      setStarted(true);
    }
    setStarted(!started);
    setLabel(started ? "start" : "pause");
  };

  const getFormattedTime = (milliseconds) => {
    let total_seconds = Math.floor(milliseconds / 1000);
    let total_minutes = Math.floor(total_seconds / 60);

    let seconds = total_seconds % 60;
    let minutes = total_minutes % 60;

    if (seconds < 10)
      if (minutes < 10) return `0${minutes}:0${seconds}`;
      else return `${minutes}:0${seconds}`;

    if (minutes < 10)
      if (seconds < 10) return `0${minutes}:0${seconds}`;
      else return `0${minutes}:${seconds}`;

    return `${minutes}:${seconds}`;
  };

  return (
    <>
      <div>
        <button onClick={() => navigate("/")}>home</button>
        <h1>study timer</h1>

        <div className="timer-container">
          <div
            className="bigbang orbit-example"
            role="img"
            aria-label="3 satellites across 105 degrees"
          >
            <div className="gravity-spot">
              <div className="orbit-5 guide"></div>
              <div className="orbit-7 guide"></div>
              <div className="orbit-9 guide example-ring fit-range">
                <div className="satellite grow-2x">{buttons("pomodoro")}</div>
                <div className="satellite grow-2x">
                  {buttons("short break")}
                </div>
                <div className="satellite grow-2x">{buttons("long break")}</div>
              </div>
              <div className="orbit-0">
                <div className="satellite at-center">
                  <div className="capsule example-center">
                    <img src="/crescent_moon_colored.png"></img>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2>pomodoro timer</h2>
          <h1>{getFormattedTime(time)}</h1>
          <button onClick={() => handleClick()}>{label}</button>
        </div>
      </div>
    </>
  );
}
