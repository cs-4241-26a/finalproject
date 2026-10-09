import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Typography, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import GuessMap from "./guessMap";
import { useNavigate } from "react-router-dom";
import Results from "./Results";

interface SummaryData {
    history: {
        levelName: string;
        distance: number;
        score: number;
    }[];
    totalScore: number;
}

export default function Game() {
    const navigate = useNavigate();
    const [imageSrc, setImageSrc] = useState<string>("");
    const [level, setLevel] = useState<number>(1);
    const [totalScore, setTotalScore] = useState<number>(0);
    const [roundScore, setRoundScore] = useState<
        number | null
    >(null);
    const [hasGuessed, setHasGuessed] =
        useState<boolean>(false);
    const [summaryData, setSummaryData] =
        useState<SummaryData | null>(null);

    useEffect(() => {
        fetch("/api/me").then((res) => {
            if (!res.ok) navigate("/");
            else fetchGameState();
        });
    }, [navigate]);

    const fetchGameState = () => {
        fetch("/api/game/state")
            .then((res) => res.json())
            .then((data) => {
                if (data.active) {
                    setLevel(data.round);
                    setTotalScore(data.totalScore);
                    loadImage();
                } else {
                    startNewGame();
                }
            });
    };
    const quitGame = () => {
        fetch("/api/game/quit", { method: "POST" })
            .then(() => navigate("/lobby"))
            .catch(console.error);
    };

    const startNewGame = () => {
        fetch("/api/game/start", { method: "POST" }).then(
            () => {
                setLevel(1);
                setTotalScore(0);
                setSummaryData(null);
                setHasGuessed(false);
                loadImage();
            },
        );
    };

    const loadImage = () => {
        fetch("/api/game/image")
            .then((res) => res.blob())
            .then((blob) =>
                setImageSrc(URL.createObjectURL(blob)),
            );
    };

    const handleGuess = (pos: [number, number]) => {
        fetch("/api/game/guess", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                xPosition: pos[1],
                yPosition: pos[0],
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setRoundScore(data.roundScore);
                setTotalScore(data.totalScore);
                setHasGuessed(true);
                if (data.completed) {
                    setSummaryData({
                        history: data.history,
                        totalScore: data.totalScore,
                    });
                }
            });
    };

    const handleNextLevel = () => {
        setHasGuessed(false);
        setRoundScore(null);
        setLevel((prev) => prev + 1);
        loadImage();
    };

    if (summaryData) {
        return (
            <Results
                summaryData={summaryData}
                onPlayAgain={startNewGame}
            />
        );
    }
    return (
        <div
            style={{
                position: "relative",
                width: "100vw",
                height: "100vh",
                backgroundColor: "#000",
            }}
        >
            <div style={{ position: "fixed" }}>
                {imageSrc && (
                    <img
                        src={imageSrc}
                        style={{
                            width: "100vw",
                            height: "100vh",
                            objectFit: "cover",
                        }}
                    />
                )}
            </div>

            <Box
                sx={{
                    p: 1.5,
                    px: 3,
                    borderRadius: "5px",
                    position: "absolute",
                    zIndex: 1,
                    bgcolor: "#FF4D4D",
                    color: "white",
                    top: "20px",
                    left: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    boxShadow: 1,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold" }}
                >
                    Score: {totalScore}
                </Typography>
                {hasGuessed && roundScore !== null && (
                    <Typography
                        sx={{
                            color: "#65ff3fff",
                            fontWeight: "bold",
                        }}
                    >
                        +{roundScore} pts
                    </Typography>
                )}
            </Box>

            <Box
                sx={{
                    position: "absolute",
                    zIndex: 1,
                    top: "20px",
                    right: "20px",
                }}
            >
                <Button
                    variant="contained"
                    onClick={quitGame}
                    sx={{
                        borderRadius: "5px",
                        fontWeight: "bold",
                        bgcolor: "#FF4D4D",
                    }}
                >
                    Quit
                </Button>
            </Box>

            <Box
                sx={{
                    p: 0.5,
                    px: 2,
                    borderRadius: "5px",
                    position: "absolute",
                    zIndex: 1,
                    bgcolor: "#1976d2",
                    color: "white",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    boxShadow: 2,
                }}
            >
                <Typography
                    sx={{
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        letterSpacing: "1px",
                    }}
                >
                    Level: {level} / 5
                </Typography>
            </Box>

            {/* Bottom Right: Map  */}
            {!hasGuessed ? (
                <div
                    style={{
                        position: "absolute",
                        bottom: "20px",
                        right: "20px",
                        zIndex: 10,
                    }}
                >
                    <GuessMap onSubmit={handleGuess} />
                </div>
            ) : (
                summaryData === null && (
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: "20px",
                            right: "20px",
                            zIndex: 10,
                        }}
                    >
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleNextLevel}
                            sx={{
                                backgroundColor: "#FF4D4D",
                                "&:hover": {
                                    backgroundColor:
                                        "#D83438",
                                },
                                py: 1.5,
                                px: 4,
                                fontSize: "1.1rem",
                                borderRadius: "12px",
                                boxShadow: 4,
                            }}
                        >
                            Next Level
                        </Button>
                    </Box>
                )
            )}
        </div>
    );
}
