import React from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";

import type { SimpleUser } from "../../../../shared/types/User";
import { RES_HALLS } from "../../types/model";

interface AccountDialogProps {
    open: boolean;
    user: SimpleUser;
    onClose: () => void;
    onSave: (
        displayName: string,
        residence: string
    ) => Promise<void>;
}

export default function AccountDialog({
    open,
    user,
    onClose,
    onSave,
}: AccountDialogProps) {
    const [displayName, setDisplayName] =
        React.useState(user.display_name);

    const [residence, setResidence] =
        React.useState(user.residence);

    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState("");

    // Refresh the form whenever a different user is opened.
    React.useEffect(() => {
        if (open) {
            setDisplayName(user.display_name);
            setResidence(user.residence);
            setError("");
        }
    }, [open, user]);

    const handleSave = async () => {
        if (!displayName.trim()) {
            setError("Display name is required.");
            return;
        }

        if (!residence) {
            setError("Please select a residence hall.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            await onSave(displayName.trim(), residence);
            onClose();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update your account."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={saving ? undefined : onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Account Details
            </DialogTitle>

            <DialogContent>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2.5,
                        pt: 1,
                    }}
                >
                    {error && (
                        <Alert severity="error">
                            {error}
                        </Alert>
                    )}

                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            User ID
                        </Typography>
                        <Typography sx={{ overflowWrap: "anywhere" }}>
                            {user.user_id}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Member since
                        </Typography>
                        <Typography>
                            {user.created
                                ? new Date(
                                    user.created
                                ).toLocaleDateString()
                                : "Unknown"}
                        </Typography>
                    </Box>

                    <TextField
                        label="Display Name"
                        fullWidth
                        value={displayName}
                        onChange={(event) =>
                            setDisplayName(event.target.value)
                        }
                        disabled={saving}
                        required
                    />

                    <TextField
                        select
                        label="Residence Hall"
                        fullWidth
                        value={residence}
                        onChange={(event) =>
                            setResidence(event.target.value)
                        }
                        disabled={saving}
                        required
                    >
                        {RES_HALLS.map((hall) => (
                            <MenuItem
                                key={hall}
                                value={hall}
                            >
                                {hall}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={onClose}
                    disabled={saving}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <CircularProgress
                            size={22}
                            color="inherit"
                        />
                    ) : (
                        "Save Changes"
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}