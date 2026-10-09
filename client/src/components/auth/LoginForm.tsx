import React from "react";

import { Box, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useModel } from "../../context/ModelContext";

export default function LoginForm() {

    const { model, login } = useModel();

    const navigate = useNavigate();

    const [username, setUsername] = React.useState("");

    const [password, setPassword] = React.useState("");

    const [usernameError, setUsernameError] = React.useState("");

    const [passwordError, setPasswordError] = React.useState("");

    const [submitting, setSubmitting] = React.useState(false);


    const handleLogin = async () => {

        let hasError = false;

        if (username.trim() === "") {
            setUsernameError("Username cannot be empty");
            hasError = true;
        } else {
            setUsernameError("");
        }

        if (password === "") {
            setPasswordError("Password cannot be empty");
            hasError = true;
        } else {
            setPasswordError("");
        }

        if (hasError) {return;}

        setSubmitting(true);


        try {
            await login(username.trim(), password);
            navigate("/board");
        } catch (error) {
            setPasswordError(
                error instanceof Error ? error.message : "Invalid login; try again."
            );
        } finally {
            setSubmitting(false);
        }

        console.log(model);
    };


    return (
        <Box
            component="form"
            onSubmit={(event) => {
                event.preventDefault();
                handleLogin();
            }}
            sx={{width: "100%", display: "flex", flexDirection: "column", gap: 2}}
        >

            <TextField
                label="Username"
                fullWidth
                variant="outlined"
                value={username}
                error={usernameError !== ""}
                helperText={usernameError}
                onChange={(event) => {
                    setUsername(event.target.value);
                    if (event.target.value.trim() !== "") {setUsernameError("");}
                }}
            />


            <TextField
                label="Password"
                fullWidth
                type="password"
                variant="outlined"
                value={password}
                error={passwordError !== ""}
                helperText={passwordError}
                onChange={(event) => {
                    setPassword(event.target.value);
                    if (event.target.value !== "") {setPasswordError("");}
                }}
            />


            <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{height: "7vh", fontSize: "1.5rem"}}
            >
                {submitting ? "Logging in..." : "Login"}
            </Button>
        </Box>
    );
}