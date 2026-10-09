import LoginCard from "./LoginCard";
import WPIScene from "/WPIScene.png";
import Box from "@mui/material/Box";
import CycloneOutlinedIcon from "@mui/icons-material/CycloneOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Divider, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    // I'm adding some auto-routing so we don't log in if we are already logged in.
    const navigate = useNavigate();
    useEffect(() => {
        fetch("/api/me")
            .then((res) => {
                if (res.ok) {
                    navigate("/lobby");
                }
            })
            .catch(console.error);
    }, [navigate]);

    return (
        <Box
            sx={{
                position: "relative",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 8,
                color: "white",
                backgroundImage: `
              linear-gradient(
                90deg,
                rgba(11, 11, 11, 0.8) 0%,
                rgba(11, 11, 11, 0.6) 48%,
                rgba(11, 11, 11, 0.4) 76%,
                rgba(11, 11, 11, 0.2) 100%
              ),
              url(${WPIScene})
            `,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Stack sx={{ gap: "36px", width: "100%" }}>
                {/*WPI GEO tag*/}
                <Box
                    sx={{
                        position: "absolute",
                        top: 32,
                        left: 64,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <CycloneOutlinedIcon fontSize="large" />
                        <Box>
                            <Typography
                                sx={{
                                    fontFamily: "Inter",
                                    fontSize: "22px",
                                    lineHeight: 1.1,
                                }}
                            >
                                WPI GUESSER
                            </Typography>

                            <Typography
                                sx={{
                                    fontFamily:
                                        '"Roboto Mono Variable", monospace',
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    color: "#FF4D4D",
                                }}
                            >
                                Guess the campus
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/*main hero page section*/}
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "72px",
                    }}
                >
                    {/*explore your campus section*/}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "28px",
                            width: "100%",
                            maxWidth: "764px",
                            height: "auto",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "18px",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: "Inter",
                                    fontSize: "68px",
                                    fontWeight: "bold",
                                    maxWidth: "690px",
                                    lineHeight: 0.98,
                                }}
                            >
                                EXPLORE <br />
                                YOUR CAMPUS
                            </Typography>

                            <Typography
                                sx={{
                                    fontFamily: "Inter",
                                    fontSize: "18px",
                                    color: "#FFD7D7",
                                    maxWidth: "570px",
                                }}
                            >
                                Drop into a campus photo,
                                read the buildings, and
                                trust your instincts. Every
                                quad, walkway, and landmark
                                has a story—how close can
                                you get?
                            </Typography>
                        </Box>

                        {/*app stats section*/}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "28px",
                            }}
                        >
                            {/*10+ locations tag*/}
                            <Box>
                                <Typography
                                    sx={{
                                        fontFamily: "Inter",
                                        fontSize: "24px",
                                        color: "#FF4D4D",
                                    }}
                                >
                                    10+
                                </Typography>

                                <Typography
                                    sx={{
                                        fontFamily:
                                            '"Roboto Mono Variable", monospace',
                                        fontSize: "10px",
                                        fontWeight: 600,
                                        color: "#FFD7D7",
                                    }}
                                >
                                    LOCATIONS
                                </Typography>
                            </Box>

                            <Divider
                                orientation="vertical"
                                variant="middle"
                                flexItem
                                sx={{
                                    backgroundColor:
                                        "#FFFFFF",
                                }}
                            />

                            {/*30+ buildings tag*/}
                            <Box>
                                <Typography
                                    sx={{
                                        fontFamily: "Inter",
                                        fontSize: "24px",
                                    }}
                                >
                                    30+
                                </Typography>

                                <Typography
                                    sx={{
                                        fontFamily:
                                            '"Roboto Mono Variable", monospace',
                                        fontSize: "10px",
                                        fontWeight: 600,
                                        color: "#FFD7D7",
                                    }}
                                >
                                    BUILDINGS
                                </Typography>
                            </Box>

                            <Divider
                                orientation="vertical"
                                variant="middle"
                                flexItem
                                sx={{
                                    backgroundColor:
                                        "#FFFFFF",
                                }}
                            />

                            {/*30+ buildings tag*/}
                            <Box>
                                <Typography
                                    sx={{
                                        fontFamily: "Inter",
                                        fontSize: "24px",
                                    }}
                                >
                                    95
                                </Typography>

                                <Typography
                                    sx={{
                                        fontFamily:
                                            '"Roboto Mono Variable", monospace',
                                        fontSize: "10px",
                                        fontWeight: 600,
                                        color: "#FFD7D7",
                                    }}
                                >
                                    ACRES
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <LoginCard />
                </Box>
            </Stack>

            {/*coordinates at the bottom of the page*/}
            <Box
                sx={{
                    position: "absolute",
                    bottom: 24,
                    left: 64,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 0.6,
                }}
            >
                <LocationOnIcon sx={{ color: "#FF4D4D" }} />
                <Typography
                    variant="overline"
                    sx={{ color: "#FFD7D7" }}
                >
                    42.274° N · 71.808° W
                </Typography>
            </Box>
        </Box>
    );
}
