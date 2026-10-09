import React from "react";
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

import SendIcon from "@mui/icons-material/Send";

import type { Message } from "../../../../shared/types/Message";
import UserAvatar from "../common/UserAvatar";
import { useModel } from "../../context/ModelContext";

interface MessageThread {
    thread_id: string;
    post_id: string;
    other_user_id: string;
    otherUserDisplayName: string;
}

interface MessagePanelProps {
    isPoster: boolean;

    threads: MessageThread[];

    selectedThread: MessageThread | null;

    onThreadChange: (
        thread: MessageThread
    ) => void;

    messages: Message[];

    loading: boolean;

    messageText: string;

    onMessageTextChange: (
        value: string
    ) => void;

    onSendMessage: (imageData: string) => void | Promise<void>;

    sending: boolean;

    onStartThread: () => void;

    startingThread: boolean;

    currentUserId?: string;
}

export default function MessagePanel({
    isPoster,
    threads,
    selectedThread,
    onThreadChange,
    messages,
    loading,
    messageText,
    onMessageTextChange,
    onSendMessage,
    sending,
    onStartThread,
    startingThread,
    currentUserId,
}: MessagePanelProps) {
    const { model } = useModel();
    const hasThread = selectedThread !== null;

    const [imageData, setImageData] = React.useState("");
    const [imageError, setImageError] = React.useState("");

    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        // Allow choosing the same file again after removing it.
        event.target.value = "";

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setImageError("Please select an image file.");
            return;
        }

        // Optional client-side limit: 5 MB.
        if (file.size > 5 * 1024 * 1024) {
            setImageError("Please select an image smaller than 5 MB.");
            return;
        }

        setImageError("");

        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === "string") {
                setImageData(reader.result);
            } else {
                setImageError("Unable to read the selected image.");
            }
        };

        reader.onerror = () => {
            setImageError("Unable to read the selected image.");
        };

        reader.readAsDataURL(file);
    };

    const handleSend = async () => {
        if (sending || (!messageText.trim() && !imageData)) return;

        try {
            await onSendMessage(imageData);
            setImageData("");
            setImageError("");
        } catch {
            // Keep the selected image so the user can retry.
        }
    };

    return (
        <Box
            sx={{
                minWidth: 0,

                borderTop: {
                    xs: "1px solid",
                    md: "none",
                },

                borderLeft: {
                    xs: "none",
                    md: "1px solid",
                },

                borderColor: "divider",

                display: "flex",
                flexDirection: "column",

                height: {
                    xs: 600,
                    md: 700,
                },
                maxHeight: "80vh",
                minHeight: 0,
                overflow: "hidden"
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    px: {
                        xs: 2,
                        sm: 3,
                    },
                    py: 2,

                    display: "flex",
                    alignItems: "center",
                    gap: 2,

                    minHeight: 72,
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: "bold",
                        flex: 1,
                    }}
                >
                    Messages
                </Typography>

                {/* Thread selector */}
                {isPoster && threads.length > 1 && (
                    <Select
                        size="small"
                        value={
                            selectedThread?.thread_id ?? ""
                        }
                        onChange={(event) => {
                            const thread =
                                threads.find(
                                    (item) =>
                                        item.thread_id ===
                                        event.target.value
                                );

                            if (thread) {
                                onThreadChange(thread);
                            }
                        }}
                        sx={{
                            minWidth: {
                                xs: 140,
                                sm: 190,
                            },
                            maxWidth: "50%",
                        }}
                    >
                        {threads.map((thread) => (
                            <MenuItem
                                key={thread.thread_id}
                                value={thread.thread_id}
                            >
                                {thread.otherUserDisplayName}
                            </MenuItem>
                        ))}
                    </Select>
                )}
            </Box>

            <Divider />

            {/* No thread */}
            {!hasThread ? (
                <Box
                    sx={{
                        flex: 1,

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        p: 3,

                        textAlign: "center",
                    }}
                >
                    {isPoster ? (
                        <Typography
                            color="text.secondary"
                        >
                            No conversations yet.
                        </Typography>
                    ) : (
                        <Stack
                            spacing={2}
                            sx={{ alignItems: "center" }}
                        >
                            <Typography
                                color="text.secondary"
                            >
                                You haven't started a
                                conversation with the
                                poster yet.
                            </Typography>

                            <Button
                                variant="contained"
                                onClick={onStartThread}
                                disabled={startingThread}
                            >
                                {startingThread
                                    ? "Starting..."
                                    : "Start Conversation"}
                            </Button>
                        </Stack>
                    )}
                </Box>
            ) : (
                <>
                    {/* Messages */}
                    <Box
                        sx={{
                            flex: 1,

                            minHeight: 0,

                            overflowY: "auto",

                            px: {
                                xs: 2,
                                sm: 3,
                            },

                            py: 2,

                            backgroundColor:
                                "rgba(0,0,0,0.025)",
                        }}
                    >
                        {loading ? (
                            <Box
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                }}
                            >
                                <CircularProgress
                                    size={28}
                                />
                            </Box>
                        ) : messages.length === 0 ? (
                            <Box
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    textAlign: "center",
                                }}
                            >
                                <Typography
                                    color="text.secondary"
                                >
                                    No messages yet.
                                    <br />
                                    Start the conversation!
                                </Typography>
                            </Box>
                        ) : (
                            <Stack spacing={1.5}>
                                {messages.map((message) => {
                                    const isMine =
                                        message.sender_id === currentUserId;

                                    const avatarUserId = isMine
                                        ? currentUserId
                                        : selectedThread?.other_user_id;

                                    const avatarDisplayName = isMine
                                        ? model.currUser?.display_name ?? "Me"
                                        : selectedThread?.otherUserDisplayName ?? "User";

                                    return (
                                        <Box
                                            key={message.message_id}
                                            sx={{
                                                display: "flex",
                                                justifyContent: isMine
                                                    ? "flex-end"
                                                    : "flex-start",
                                                alignItems: "flex-start",
                                                gap: 1,
                                            }}
                                        >
                                            {/* Their avatar: left side */}
                                            {!isMine && (
                                                <Box sx={{ flexShrink: 0 }}>
                                                    <UserAvatar
                                                        userId={avatarUserId ?? ""}
                                                        displayName={avatarDisplayName}
                                                    />
                                                </Box>
                                            )}

                                            {/* Message bubble */}
                                            <Box
                                                sx={{
                                                    maxWidth: {
                                                        xs: "75%",
                                                        sm: "65%",
                                                    },
                                                    minWidth: 0,
                                                    px: 2,
                                                    py: 1.25,
                                                    borderRadius: 2,
                                                    backgroundColor: isMine
                                                        ? "primary.main"
                                                        : "grey.200",
                                                    color: isMine
                                                        ? "primary.contrastText"
                                                        : "text.primary",
                                                    boxShadow:
                                                        "0 1px 3px rgba(0,0,0,0.15)",
                                                    borderBottomRightRadius: isMine
                                                        ? 0.5
                                                        : 2,
                                                    borderBottomLeftRadius: isMine
                                                        ? 2
                                                        : 0.5,
                                                }}
                                            >
                                                {/* Keep your existing message content here */}
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        whiteSpace: "pre-wrap",
                                                        overflowWrap: "anywhere",
                                                    }}
                                                >
                                                    {message.body}
                                                </Typography>

                                                {message.imageData && (
                                                    <Box
                                                        component="img"
                                                        src={message.imageData}
                                                        alt="Image attachment"
                                                        sx={{
                                                            display: "block",
                                                            maxWidth: "100%",
                                                            maxHeight: 260,
                                                            objectFit: "contain",
                                                            borderRadius: 1,
                                                            mt: message.body ? 1 : 0,
                                                        }}
                                                    />
                                                )}

                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        display: "block",
                                                        mt: 0.5,
                                                        opacity: 0.7,
                                                        textAlign: isMine ? "right" : "left",
                                                    }}
                                                >
                                                    {new Date(message.time).toLocaleTimeString(
                                                        [],
                                                        {
                                                            hour: "numeric",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </Typography>
                                            </Box>

                                            {/* Your avatar: right side */}
                                            {isMine && (
                                                <Box sx={{ flexShrink: 0 }}>
                                                    <UserAvatar
                                                        userId={avatarUserId ?? ""}
                                                        displayName={avatarDisplayName}
                                                    />
                                                </Box>
                                            )}
                                        </Box>
                                    );
                                })}
                            </Stack>
                        )}
                    </Box>

                    <Divider />

                    {/* Message input */}
                    <Box
                        sx={{
                            p: {
                                xs: 1.5,
                                sm: 2,
                            },
                        }}
                    >
                        {imageData && (
                            <Box
                                sx={{
                                    mb: 1.5,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                }}
                            >
                                <Box
                                    component="img"
                                    src={imageData}
                                    alt="Selected attachment preview"
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        objectFit: "cover",
                                        borderRadius: 1,
                                        border: "1px solid",
                                        borderColor: "divider",
                                    }}
                                />

                                <Button
                                    size="small"
                                    color="error"
                                    onClick={() => {
                                        setImageData("");
                                        setImageError("");
                                    }}
                                    disabled={sending}
                                >
                                    Remove image
                                </Button>
                            </Box>
                        )}

                        {imageError && (
                            <Typography
                                color="error"
                                variant="caption"
                                sx={{ display: "block", mb: 1 }}
                            >
                                {imageError}
                            </Typography>
                        )}

                        <Box
                            sx={{
                                display: "flex",
                                gap: 1,
                                alignItems: "flex-end",
                            }}
                        >
                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                size="small"
                                placeholder="Type a message..."
                                value={messageText}
                                onChange={(event) =>
                                    onMessageTextChange(event.target.value)
                                }
                                onKeyDown={(event) => {
                                    if (
                                        event.key === "Enter" &&
                                        !event.shiftKey
                                    ) {
                                        event.preventDefault();

                                        if (messageText.trim() || imageData) {
                                            void handleSend();
                                        }
                                    }
                                }}
                                disabled={sending}
                            />

                            <Button
                                component="label"
                                variant="outlined"
                                aria-label="Add image attachment"
                                disabled={sending}
                                sx={{
                                    minWidth: 48,
                                    width: 48,
                                    height: 40,
                                    p: 0,
                                    flexShrink: 0,
                                }}
                            >
                                <AddPhotoAlternateIcon />
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </Button>

                            <Button
                                variant="contained"
                                onClick={() => void handleSend()}
                                disabled={
                                    sending ||
                                    (!messageText.trim())
                                }
                                aria-label="Send message"
                                sx={{
                                    minWidth: 48,
                                    width: 48,
                                    height: 40,
                                    p: 0,
                                    flexShrink: 0,
                                }}
                            >
                                {sending ? (
                                    <CircularProgress size={22} color="inherit" />
                                ) : (
                                    <SendIcon />
                                )}
                            </Button>
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
}