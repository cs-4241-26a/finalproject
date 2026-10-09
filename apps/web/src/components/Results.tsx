import {
    Box,
    Typography,
    Stack,
    Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export interface SummaryData {
    history: {
        levelName: string;
        distance: number;
        score: number;
    }[];
    totalScore: number;
}

interface ResultsProps {
    summaryData: SummaryData;
    onPlayAgain: () => void;
}

export default function Results({
    summaryData,
    onPlayAgain,
}: ResultsProps) {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage: `linear-gradient(90deg, rgba(11, 11, 11, 0.8) 0%, rgba(11, 11, 11, 0.7) 50%, rgba(11, 11, 11, 0.8) 100%), url('/WPIScene.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Stack
                spacing={3}
                sx={{
                    bgcolor: "background.paper",
                    p: 5,
                    borderRadius: 4,
                    boxShadow: 3,
                    maxWidth: 500,
                    width: "100%",
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                    }}
                >
                    Game Over!
                </Typography>
                <Typography
                    variant="h5"
                    color="error"
                    sx={{ textAlign: "center" }}
                >
                    Final Score: {summaryData.totalScore}
                </Typography>

                <Box sx={{ my: 2 }}>
                    {summaryData.history.map((h, i) => (
                        <Box
                            key={i}
                            sx={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                mb: 1,
                            }}
                        >
                            <Typography>
                                Round {i + 1}:
                            </Typography>
                            <Typography>
                                {Math.round(
                                    h.distance * 0.77,
                                )}{" "}
                                feet off
                            </Typography>
                            <Typography
                                sx={{ fontWeight: "bold" }}
                            >
                                +{h.score} pts
                            </Typography>
                        </Box>
                    ))}
                </Box>

                <Stack direction="row" spacing={2}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        onClick={onPlayAgain}
                    >
                        Play Again
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => navigate("/lobby")}
                    >
                        Lobby
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}
