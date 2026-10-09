import React from "react";

import { Box, Button, Dialog, DialogContent, DialogTitle, MenuItem, TextField } from "@mui/material";
import { useModel } from "../../context/ModelContext";
import { RES_HALLS } from "../../types/model";

interface CreateUserDialogProps {
    open: boolean;
    onClose: () => void;
}

export default function CreateUserDialog({
    open,
    onClose,
}: CreateUserDialogProps) {

    const { createUser } = useModel();

    const [username, setUsername] = React.useState("");

    const [password, setPassword] = React.useState("");

    const [displayName, setDisplayName] = React.useState("");

    const [residence, setResidence] = React.useState("");

    const [usernameError, setUsernameError] = React.useState("");

    const [passwordError, setPasswordError] = React.useState("");

    const [displayNameError, setDisplayNameError] = React.useState("");

    const [submitting, setSubmitting] = React.useState(false);

    const resetForm = () => {

        setUsername("");
        setPassword("");
        setDisplayName("");
        setResidence("");

        setUsernameError("");
        setPasswordError("");
        setDisplayNameError("");

        setSubmitting(false);
    };

    const handleClose = () => {
        if (submitting) {return;}
        resetForm();
        onClose();
    };

    const handleCreateUser = async () => {
        let hasError = false;

        if (username.trim() === "") {
            setUsernameError("Username cannot be empty");
            hasError = true;
        } else if (username.length > 30) {
            setUsernameError("Username cannot exceed 30 characters");
            hasError = true;
        } else {
            setUsernameError("");
        }

        if (password === "") {
            setPasswordError("Password cannot be empty");
            hasError = true;
        } else if (password.length > 30) {
            setPasswordError("Password cannot exceed 30 characters");
            hasError = true;
        } else {
            setPasswordError("");
        }


        if (displayName.trim() === "") {
            setDisplayNameError("Display name cannot be empty");
            hasError = true;
        } else {
            setDisplayNameError("");
        }

        if (hasError) {return;}

        setSubmitting(true);

        try {
            await createUser({
                user_id: "0",
                username: username.trim(),
                password,
                display_name:
                    displayName.trim(),

                ...(residence !== ""
                    ? { residence }
                    : {}),

                created: "",
            });

            handleClose();

        } catch (error) {

            const message = error instanceof Error ? error.message : "Unable to create account.";

            if (message.toLowerCase().includes("username")) {
                setUsernameError(message);
            } else {
                setPasswordError(message);
            }

        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth  maxWidth="sm">

            <DialogTitle>
                Create an account
            </DialogTitle>

            <DialogContent>
                <Box sx={{display: "flex", flexDirection: "column", gap: 2, paddingTop: 1,}}>
                    <TextField
                        label="Username"
                        fullWidth
                        value={username}
                        error={usernameError !== ""}
                        helperText={usernameError || `${username.length}/30 characters`}
                        onChange={(event) => {
                            setUsername(event.target.value);
                            setUsernameError("");
                        }}
                    />

                    <TextField
                        label="Password"
                        fullWidth
                        type="password"
                        value={password}
                        error={passwordError !== ""}
                        helperText={passwordError || `${password.length}/30 characters`}
                        onChange={(event) => {
                            setPassword(event.target.value);
                            setPasswordError("");
                        }}
                    />

                    <TextField
                        label="Display Name"
                        fullWidth
                        value={displayName}
                        error={displayNameError !== ""}
                        helperText={displayNameError}
                        onChange={(event) => {
                            setDisplayName(event.target.value);
                            setDisplayNameError("");
                        }}
                    />

                    <TextField
                        select
                        label="Residence"
                        fullWidth
                        value={residence}
                        helperText="Optional"
                        onChange={(event) => setResidence(event.target.value)}
                    >

                        <MenuItem value="">
                            None
                        </MenuItem>

                        {RES_HALLS.map(
                            (hall) => (
                                <MenuItem key={hall} value={hall}>
                                    {hall}
                                </MenuItem>
                            )
                        )}

                    </TextField>


                    <Button
                        variant="contained"
                        disabled={submitting}
                        onClick={handleCreateUser}
                    >
                        {submitting ? "Creating..." : "Create Account"}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}