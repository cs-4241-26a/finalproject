import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
} from "@mui/material";

import { useModel } from "../../context/ModelContext";
import type { Post } from "../../../../shared/types/Post";

interface EditPostDialogProps {
    open: boolean;
    post: Post;
    onClose: () => void;
    onSaved?: (post: Post) => void;
}

export default function EditPostDialog({
    open,
    post,
    onClose,
    onSaved,
}: EditPostDialogProps) {
    const { editPost } = useModel();

    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [imageData, setImageData] = React.useState("");

    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        if (!open) {
            return;
        }

        setTitle(post.title);
        setDescription(post.description);
        setImageData(post.imageData ?? "");
        setError("");
    }, [open, post]);

    const handleClose = () => {
        if (submitting) {
            return;
        }

        setError("");
        onClose();
    };

    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === "string") {
                setImageData(reader.result);
            }
        };

        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            setError("Title cannot be empty.");
            return;
        }

        setError("");
        setSubmitting(true);

        try {
            const updatedPost = await editPost({
                ...post,
                title: title.trim(),
                description: description.trim(),
                ...(imageData
                    ? { imageData }
                    : { imageData: "" }),
            });

            onSaved?.(updatedPost);
            onClose();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to edit post."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>Edit Lost & Found Post</DialogTitle>

            <DialogContent>
                <TextField
                    autoFocus
                    fullWidth
                    label="Title"
                    value={title}
                    onChange={(event) =>
                        setTitle(event.target.value)
                    }
                    margin="normal"
                />

                <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    label="Description"
                    value={description}
                    onChange={(event) =>
                        setDescription(event.target.value)
                    }
                    margin="normal"
                />

                <Button
                    component="label"
                    variant="outlined"
                    sx={{ mt: 2 }}
                >
                    Change Image
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </Button>

                {imageData && (
                    <img
                        src={imageData}
                        alt="Post preview"
                        style={{
                            display: "block",
                            width: "100%",
                            maxHeight: 250,
                            objectFit: "contain",
                            marginTop: 16,
                        }}
                    />
                )}

                {error && (
                    <Typography
                        sx={{
                            color: "error.main",
                            mt: 1.5,
                        }}
                    >
                        {error}
                    </Typography>
                )}
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={handleClose}
                    disabled={submitting}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? "Saving..." : "Save Changes"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}