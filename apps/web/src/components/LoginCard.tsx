import Box from "@mui/material/Box";
import {
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import Button from "@mui/material/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginCard() {
    const navigate = useNavigate();
    const [isRegistering, setIsRegistering] =
        useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async () => {
        setErrorMsg("");
        const endpoint = isRegistering
            ? "/api/register"
            : "/api/login";

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            if (res.ok) {
                navigate("/lobby");
            } else {
                const data = await res.json();
                if (data.error === "invalid_credentials") {
                    setErrorMsg(
                        "Invalid credentials or password too short.",
                    );
                } else if (
                    data.error === "username_taken"
                ) {
                    setErrorMsg("Username already taken.");
                } else {
                    setErrorMsg("An error occurred.");
                }
            }
        } catch (err) {
            setErrorMsg("Network error." + err);
        }
    };

    return (
        <Box
            sx={{
                boxSizing: "border-box",
                width: "100%",
                maxWidth: "492px",
                height: "auto",
                borderRadius: "28px",
                backgroundColor: "background.paper",
                color: "text.primary",
                boxShadow: 3,
                overflow: "hidden",
                padding: "40px",
            }}
        >
            <Stack sx={{ gap: "24px" }}>
                <Stack sx={{ gap: "8px" }}>
                    {/*welcome back goat tag*/}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row",
                            gap: 1,
                        }}
                    >
                        <ExploreOutlinedIcon
                            sx={{
                                fontFamily:
                                    '"Roboto Mono Variable", monospace',
                                fontSize: "14px",
                                fontWeight: "bold",
                                color: "#FF4D4D",
                            }}
                        />
                        <Typography
                            sx={{
                                fontFamily:
                                    '"Roboto Mono Variable", monospace',
                                fontSize: "10px",
                                fontWeight: "bold",
                                color: "#FF4D4D",
                            }}
                        >
                            {isRegistering
                                ? "WELCOME NEW GOAT!"
                                : "WELCOME BACK GOAT!"}
                        </Typography>
                    </Box>

                    {/*ready to explore campus tag*/}
                    <Typography
                        sx={{
                            fontFamily: "Inter",
                            fontSize: "32px",
                            fontWeight: "bold",
                            color: "#0B0B0B",
                        }}
                    >
                        Ready to explore campus?
                    </Typography>

                    <Typography
                        sx={{
                            fontFamily: "Inter",
                            fontSize: "14px",
                            fontWeight: "400px",
                            color: "#6B6B6B",
                        }}
                    >
                        {isRegistering
                            ? "Create an account to start your campus streak."
                            : "Sign in to continue your campus streak and pick up where you left off."}
                    </Typography>
                </Stack>

                {/*text boxes*/}
                <Stack sx={{ gap: "16px" }}>
                    {errorMsg && (
                        <Typography
                            sx={{
                                fontFamily: "Inter",
                                fontSize: "12px",
                                color: "#FF4D4D",
                            }}
                        >
                            {errorMsg}
                        </Typography>
                    )}

                    {/*username section*/}
                    <Box sx={{ gap: "7px" }}>
                        <Typography
                            sx={{
                                fontFamily: "Inter",
                                fontSize: "12px",
                                fontWeight: "bold",
                            }}
                        >
                            Username
                        </Typography>
                        <TextField
                            fullWidth
                            id="username-text"
                            variant="outlined"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                        />
                    </Box>

                    {/*password section*/}
                    <Box sx={{ gap: "7px" }}>
                        <Typography
                            sx={{
                                fontFamily: "Inter",
                                fontSize: "12px",
                                fontWeight: "bold",
                            }}
                        >
                            Password
                        </Typography>
                        <TextField
                            fullWidth
                            id="password-text"
                            variant="outlined"
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />
                    </Box>
                </Stack>

                {/*log in button*/}
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
                        height: "56px",
                        borderRadius: "14px",
                        backgroundColor: "#FF4D4D",
                        fontFamily: "Inter",
                        fontSize: "16px",
                        fontWeight: "normal",
                        textTransform: "none",
                    }}
                >
                    {isRegistering
                        ? "Create account & explore"
                        : "Log in & explore campus"}
                </Button>

                {/*create new account tag*/}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: "Inter",
                            fontSize: "14px",
                        }}
                    >
                        {isRegistering
                            ? "Already have an account?"
                            : "New to WPI Geo?"}
                    </Typography>
                    <Button
                        variant="text"
                        onClick={() => {
                            setIsRegistering(
                                !isRegistering,
                            );
                            setErrorMsg("");
                        }}
                        sx={{
                            fontFamily: "Inter",
                            fontSize: "14px",
                            color: "#FF4D4D",
                            "&:hover": {
                                backgroundColor:
                                    "transparent",
                            },
                        }}
                    >
                        {isRegistering
                            ? "Log in"
                            : "Create an account"}
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
}
