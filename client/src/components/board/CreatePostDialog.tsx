import React from "react";
import { Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { useModel } from "../../context/ModelContext";
import { type PostType } from "../../types/model";

interface CreatePostDialogProps {
    open: boolean;
    onClose: () => void;
}

export default function CreatePostDialog({
    open,
    onClose,
}: CreatePostDialogProps) {
    const { model, createPost } = useModel();

    const [postType, setPostType] = React.useState<PostType>("Lost");
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [imageData, setImageData] = React.useState("");

    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState("");

    const reset = () => {
        setTitle("");
        setDescription("");
        setImageData("");
        setError("");
    };

    const handleClose = () => {
        if (submitting) {
            return;
        }

        reset();
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

        if (!model.currUser) {
            setError("You must be logged in to create a post.");
            return;
        }

        setError("");
        setSubmitting(true);

        try {
            await createPost({
                post_id: "0",
                user_id: model.currUser.user_id,
                userDisplayName: model.currUser.display_name,
                title: title.trim(),
                description: description.trim(),
                postType: postType,
                isResolved: false,
                created: new Date().toISOString(),
                ...(imageData ? { imageData } : {}),
            });

            reset();
            onClose();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to create post."
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
            <DialogTitle>Create Lost & Found Post</DialogTitle>

            <ButtonGroup
                disableElevation
                variant="contained"
                aria-label="Disabled button group"
                sx={{justifyContent: "center"}}
            >
                <Button
                    onClick={() => {setPostType("Lost");}}
                    variant={postType === "Lost" ? "contained" : "outlined"}
                >
                    Lost
                </Button>
                <Button
                    onClick={() => {setPostType("Found");}}
                    variant={postType === "Found" ? "contained" : "outlined"}
                >
                    Found
                </Button>
            </ButtonGroup>

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
                    Add Image
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
                    <div style={{ marginTop: 12 }}>
                        <Typography sx={{ color: "red" }}>
                            {error}
                        </Typography>
                    </div>
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
                    {submitting ? "Creating..." : (postType === "Lost" ? "Create New Lost Post" : "Create New Found Post")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}