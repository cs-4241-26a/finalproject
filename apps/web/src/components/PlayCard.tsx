import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import WPIPlayScene from "/WPIPlayScene.png";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function PlayCard() {
    const navigate = useNavigate();
    return (
        <Box
            sx={{
                boxSizing: "border-box",
                width: "100%",
                height: "clamp(380px, calc(100vh - 400px), 484px)",
                borderRadius: "28px",
                display: "flex",
                flexDirection: "row",
                overflow: "hidden",
            }}
        >
            {/*left side - wpi image*/}
            <Box
                sx={{
                    flex: 2,
                    backgroundImage: `url("${WPIPlayScene}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            ></Box>

            {/*right side - text*/}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "40px",
                    gap: "24px",
                    backgroundColor: "#FFF0EF",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "18px",
                    }}
                >
                    {/*your next campus adventure text*/}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row",
                            gap: 0.8,
                        }}
                    >
                        <ExploreOutlinedIcon
                            sx={{
                                fontFamily:
                                    '"Roboto Mono Variable", monospace',
                                fontSize: "18px",
                                fontWeight: "bold",
                                color: "#D83438",
                            }}
                        />
                        <Typography
                            variant="overline"
                            sx={{
                                color: "#D83438",
                                fontFamily:
                                    '"Roboto Mono Variable", monospace',
                                fontSize: "10px",
                                fontWeight: "bold",
                            }}
                        >
                            Your next campus adventure
                        </Typography>
                    </Box>

                    {/*main text*/}
                    <Typography
                        sx={{
                            fontFamily: "Inter",
                            fontSize: "36px",
                            fontWeight: 800,
                            lineHeight: 1.1,
                            color: "black",
                        }}
                    >
                        Think you know
                        <br />
                        your campus?
                    </Typography>

                    <Typography
                        sx={{
                            fontFamily: "Inter",
                            fontSize: "16px",
                            color: "#72706F",
                        }}
                    >
                        See a photo taken somewhere on WPI
                        campus. Guess its location on the
                        campus map. Find out how close you
                        got.
                    </Typography>
                </Box>

                {/*play button*/}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "13px",
                    }}
                >
                    <Button
                        onClick={() => navigate("/game")}
                        fullWidth
                        variant="contained"
                        sx={{
                            borderRadius: "14px",
                            backgroundColor: "#FF4D4D",
                            px: "24px",
                            height: "68px",
                            textTransform: "none",
                            justifyContent: "space-between",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                            }}
                        >
                            <PlayArrowOutlinedIcon
                                sx={{
                                    fontFamily: "Inter",
                                    fontSize: "34px",
                                    fontWeight: 800,
                                    color: "white",
                                }}
                            />
                            <Typography
                                sx={{
                                    fontFamily: "Inter",
                                    fontSize: "22px",
                                    fontWeight: 800,
                                    color: "white",
                                }}
                            >
                                Play
                            </Typography>
                        </Box>

                        <ArrowForwardOutlinedIcon
                            sx={{
                                fontFamily: "Inter",
                                fontSize: "34px",
                                fontWeight: 800,
                                color: "white",
                            }}
                        />
                    </Button>

                    <Typography
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            fontFamily: "Inter",
                            fontSize: "12px",
                            color: "#72706F",
                        }}
                    >
                        Follow the clues. Trust your
                        instincts.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
