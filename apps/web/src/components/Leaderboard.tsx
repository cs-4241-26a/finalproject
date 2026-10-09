import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Stack,
    Button,
    Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Leaderboard() {
    const navigate = useNavigate();
    const [scores, setScores] = useState<
        { username: string; best_score: number }[]
    >([]);

    useEffect(() => {
        fetch("/api/leaderboard")
            .then((res) => res.json())
            .then((data) => setScores(data))
            .catch(console.error);
    }, []);

    return (
        <Box
            sx={{
                boxSizing: "border-box",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                p: 4,
                backgroundImage: `
              linear-gradient(
                90deg,
                rgba(11, 11, 11, 0.8) 0%,
                rgba(11, 11, 11, 0.6) 48%,
                rgba(11, 11, 11, 0.4) 76%,
                rgba(11, 11, 11, 0.2) 100%
              ),
              url('/WPIScene.png')
            `,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Stack
                spacing={4}
                sx={{ width: "100%", maxWidth: "600px" }}
            >
                <Typography
                    variant="h3"
                    color="#FF4D4D"
                    sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                    }}
                >
                    Top Explorers
                </Typography>

                <Paper
                    sx={{
                        bgcolor: "rgba(255, 255, 255, 1)",
                        borderRadius: 2,
                        overflow: "hidden",
                    }}
                >
                    {scores.map((score, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                px: 3,
                                py: 1,
                                p: 1.5,
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{ color: "black" }}
                            >
                                <span
                                    style={{
                                        color: "#FF4D4D",
                                        marginRight: "16px",
                                    }}
                                >
                                    #{index + 1}
                                </span>
                                {score.username}
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: "bold",
                                    color: "black",
                                }}
                            >
                                {score.best_score} pts
                            </Typography>
                        </Box>
                    ))}
                    {scores.length === 0 && (
                        <Typography
                            sx={{
                                textAlign: "center",
                                p: 4,
                                color: "black",
                            }}
                        >
                            No scores yet.
                        </Typography>
                    )}
                </Paper>

                <Button
                    variant="contained"
                    onClick={() => navigate("/lobby")}
                    sx={{
                        bgcolor: "#FF4D4D",
                        py: 2,
                        borderRadius: 2,
                        fontSize: "16px",
                        "&:hover": { bgcolor: "#D83438" },
                    }}
                >
                    Back to Lobby
                </Button>
            </Stack>
        </Box>
    );
}
