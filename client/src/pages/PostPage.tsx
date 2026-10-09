import React from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useNavigate, useParams } from "react-router-dom";

import NavBar from "../components/navbar";
import { useModel } from "../context/ModelContext";

import corkboardTop from "../assets/corkboard-top.png";
import corkboardBody from "../assets/corkboard-body.png";
import corkboardBottom from "../assets/corkboard-bottom.png";

import type { Post } from "../../../shared/types/Post";
import type { Message } from "../../../shared/types/Message";
import MessagePanel from "../components/messages/MessagePanel";
import EditPostDialog from "../components/board/EditPostDialog";
import AlertBar from "../components/alertbar";

interface MessageThread {
    thread_id: string;
    post_id: string;
    other_user_id: string;
    otherUserDisplayName: string;
}

export default function PostPage() {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();

    const { model, resolvePost, deletePost, loadPost, loadThreads, loadThread, sendMessage, createThread } = useModel();

    const [post, setPost] = React.useState<Post | null>(null);
    const [threads, setThreads] = React.useState<MessageThread[]>([]);
    const [selectedThread, setSelectedThread] = React.useState<MessageThread | null>(null);

    const [messages, setMessages] = React.useState<Message[]>([]);

    const [editDialogOpen, setEditDialogOpen] = React.useState(false);

    const [loading, setLoading] = React.useState(true);
    const [loadingMessages] = React.useState(false);

    const [resolveDialogOpen, setResolveDialogOpen] = React.useState(false);
    const [resolving, setResolving] = React.useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);

    const [error, setError] = React.useState("");

    const [messageText, setMessageText] = React.useState("");

    const [sending, setSending] = React.useState(false);

    const [startingThread, setStartingThread] = React.useState(false);

    const isPoster = !!post && !!model.currUser && post.user_id === model.currUser.user_id;

    /*
     * Load the post and available threads.
     */
    React.useEffect(() => {
        if (!postId) return;

        const loadingPost = async () => {
            try {
                setLoading(true);
                setError("");

                const loadedPost = await loadPost(postId);
                setPost(loadedPost);

                const loadedThreads = await loadThreads(postId);

                setThreads(loadedThreads);

                if (loadedThreads.length > 0) {
                    setSelectedThread(loadedThreads[0]);
                } else {
                    setSelectedThread(null);
                }
            } catch (error) {
                setError(
                    error instanceof Error ? error.message : "Failed to load post."
                );
            } finally {
                setLoading(false);
            }
        };

        loadingPost();
    }, [postId]);

    /*
     * Load messages whenever the selected thread changes,
     * then poll every 5 seconds while a thread is open.
     */
    React.useEffect(() => {
        if (!selectedThread) {
            setMessages([]);
            return;
        }

        let cancelled = false;
        let timeoutId: ReturnType<typeof setTimeout>;

        const loadMessages = async () => {
            try {
                const loadedMessages = await loadThread(selectedThread.thread_id);

                if (!cancelled) {
                    setMessages(loadedMessages);
                    setError("");
                }
            } catch (error) {
                if (!cancelled) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "Failed to load messages."
                    );
                }
            } finally {
                if (!cancelled) {
                    timeoutId = setTimeout(loadMessages, 5000);
                }
            }
        };

        // Load immediately, then repeat every 5 seconds.
        void loadMessages();

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
        };
    }, [selectedThread?.thread_id]);

    /*
    * Poll for newly created threads every 5 seconds.
    */
    React.useEffect(() => {
        if (!postId) return;

        let cancelled = false;
        let timeoutId: ReturnType<typeof setTimeout>;

        const loadingThreads = async () => {
            try {
                const loadedThreads = await loadThreads(postId);

                if (!cancelled) {
                    setThreads(loadedThreads);

                    setSelectedThread((current) => {
                        if (current) {
                            return (
                                loadedThreads.find(
                                    (thread) => thread.thread_id === current.thread_id
                                ) ??
                                loadedThreads[0] ??
                                null
                            );
                        }

                        return loadedThreads[0] ?? null;
                    });
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Failed to poll threads:", error);
                }
            } finally {
                if (!cancelled) {
                    timeoutId = setTimeout(loadThreads, 5000);
                }
            }
        };

        void loadingThreads();

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
        };
    }, [postId]);

    const handleStartThread = async () => {
        if (!postId) return;

        try {
            setStartingThread(true);
            setError("");

            const newThread = await createThread(postId);

            setThreads((previous) => {
                const alreadyExists = previous.some(
                    (thread) => thread.thread_id === newThread.thread_id
                );

                return alreadyExists ? previous : [...previous, newThread];
            });

            setSelectedThread(newThread);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to start conversation.");
        } finally {
            setStartingThread(false);
        }
    };

    const handleSendMessage = async (imageData: string = "") => {
        if (
            !selectedThread ||
            (!messageText.trim() && !imageData) ||
            sending
        ) {
            return;
        }

        try {
            setSending(true);
            setError("");

            const newMessage = await sendMessage(
                selectedThread.thread_id,
                {
                    body: messageText.trim(),
                    imageData,
                }
            );

            setMessages((previous) => [...previous, newMessage]);
            setMessageText("");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to send message."
            );

            throw error;
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async () => {
        if (!post) return;

        try {
            setResolving(true);
            setError("");

            await deletePost(post.post_id);

            setDeleteDialogOpen(false);
            navigate("/board");
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Failed to delete post."
            );
        } finally {
            setDeleting(false);
        }
    };

    const handleResolve = async () => {
        if (!post) { return; }

        try {
            setResolving(true);
            setError("");

            const resolvedPost = await resolvePost(post.post_id);

            setPost(resolvedPost);
            setResolveDialogOpen(false);
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Failed to resolve post."
            );
        } finally {
            setResolving(false);
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!post) {
        return (
            <Box sx={{ minHeight: "100vh" }}>
                <NavBar basic={false} />

                <Container sx={{ py: 4 }}>
                    <Alert severity="error">
                        {error || "Post not found."}
                    </Alert>
                </Container>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#ffffff",
            }}
        >
            <NavBar basic={false} />
            <AlertBar />

            {/* Corkboard */}
            <Box
                sx={{
                    width: "100%",
                    overflow: "hidden",
                    justifyItems: "center"
                }}
            >
                {/* Corkboard top */}
                <Box
                    component="img"
                    src={corkboardTop}
                    alt=""
                    sx={{
                        display: "block",
                        width: "90%",
                        height: "auto",
                        pt: "70px"
                    }}
                />

                {/* Corkboard body */}
                <Box
                    sx={{
                        width: "90%",
                        backgroundImage: `url(${corkboardBody})`,
                        backgroundRepeat: "repeat-y",
                        backgroundPosition: "top center",
                        backgroundSize: "100% auto",
                        py: {
                            xs: 3,
                            sm: 4,
                            md: 6,
                        },
                    }}
                >
                    <Container maxWidth="xl">
                        {error && (
                            <Alert
                                severity="error"
                                sx={{ mb: 2 }}
                            >
                                {error}
                            </Alert>
                        )}

                        <Card
                            sx={{
                                overflow: "hidden",
                                borderRadius: 2,

                                boxShadow:
                                    "0 8px 20px rgba(0,0,0,0.35)",

                                backgroundColor:
                                    "rgba(255,255,255,0.97)",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "grid",

                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        md: "1fr 1fr",
                                    },
                                }}
                            >
                                {/* ========================= */}
                                {/* POST DETAILS                */}
                                {/* ========================= */}

                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        minWidth: 0,
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            flex: 1,
                                            p: {
                                                xs: 2.5,
                                                sm: 3,
                                                md: 4,
                                            },
                                        }}
                                    >
                                        {post.imageData && (
                                            <Box
                                                component="img"
                                                src={
                                                    post.imageData
                                                }
                                                alt={post.title}
                                                sx={{
                                                    display:
                                                        "block",
                                                    width: "100%",
                                                    maxHeight: 450,
                                                    objectFit:
                                                        "contain",
                                                    borderRadius: 1,
                                                    mb: 3,
                                                }}
                                            />
                                        )}

                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight:
                                                    "bold",
                                                mb: 1.5,
                                            }}
                                        >
                                            {post.title}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 3 }}
                                        >
                                            Posted by{" "}
                                            {
                                                post.userDisplayName
                                            }{" "}
                                            •{" "}
                                            {new Date(
                                                post.created
                                            ).toLocaleDateString()}
                                        </Typography>

                                        <Divider sx={{ mb: 3 }} />

                                        <Typography
                                            variant="body1"
                                            sx={{
                                                whiteSpace:
                                                    "pre-wrap",
                                            }}
                                        >
                                            {
                                                post.description
                                            }
                                        </Typography>
                                    </CardContent>

                                    {/* Post controls */}
                                    {isPoster && (
                                        <Box
                                            sx={{
                                                px: {
                                                    xs: 2,
                                                    sm: 3,
                                                },
                                                pb: {
                                                    xs: 2,
                                                    sm: 3,
                                                },

                                                display: "grid",
                                                gridTemplateColumns:
                                                    "1fr auto 1fr",
                                                alignItems:
                                                    "center",
                                            }}
                                        >
                                            {/* Edit */}
                                            <Box>
                                                <IconButton
                                                    aria-label="Edit post"
                                                    onClick={() => setEditDialogOpen(true)}
                                                    sx={{
                                                        width: 50,
                                                        height: 50,
                                                        border:
                                                            "1px solid",
                                                        borderColor:
                                                            "divider",
                                                        backgroundColor:
                                                            "background.paper",
                                                        boxShadow:
                                                            "0 2px 5px rgba(0,0,0,0.2)",
                                                        "&:hover":
                                                        {
                                                            backgroundColor:
                                                                "grey.100",
                                                        },
                                                    }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Box>

                                            {/* Resolve */}
                                            <Button
                                                variant="contained"
                                                onClick={() => setResolveDialogOpen(true)}
                                                disabled={
                                                    post.isResolved
                                                }
                                                sx={{
                                                    minWidth: {
                                                        xs: 120,
                                                        sm: 160,
                                                    },
                                                }}
                                            >
                                                {post.isResolved
                                                    ? "Resolved"
                                                    : "Resolve"}
                                            </Button>

                                            {/* Delete */}
                                            <Box
                                                sx={{
                                                    display:
                                                        "flex",
                                                    justifyContent:
                                                        "flex-end",
                                                }}
                                            >
                                                <IconButton
                                                    aria-label="Delete post"
                                                    onClick={() => setDeleteDialogOpen(true)}
                                                    sx={{
                                                        width: 50,
                                                        height: 50,
                                                        color: "white",
                                                        backgroundColor:
                                                            "error.main",
                                                        boxShadow:
                                                            "0 2px 5px rgba(0,0,0,0.25)",
                                                        "&:hover":
                                                        {
                                                            backgroundColor:
                                                                "error.dark",
                                                        },
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>

                                {/* ========================= */}
                                {/* MESSAGES                    */}
                                {/* ========================= */}

                                <MessagePanel
                                    isPoster={isPoster}
                                    threads={threads}
                                    selectedThread={
                                        selectedThread
                                    }
                                    onThreadChange={
                                        setSelectedThread
                                    }
                                    messages={messages}
                                    loading={
                                        loadingMessages
                                    }
                                    messageText={
                                        messageText
                                    }
                                    onMessageTextChange={
                                        setMessageText
                                    }
                                    onSendMessage={
                                        handleSendMessage
                                    }
                                    sending={sending}
                                    onStartThread={
                                        handleStartThread
                                    }
                                    startingThread={
                                        startingThread
                                    }
                                    currentUserId={
                                        model.currUser
                                            ?.user_id
                                    }
                                />
                            </Box>
                        </Card>
                    </Container>
                </Box>

                {/* Corkboard bottom */}
                <Box
                    component="img"
                    src={corkboardBottom}
                    alt=""
                    sx={{
                        display: "block",
                        width: "90%",
                        height: "auto",
                    }}
                />
            </Box>
            <Dialog
                open={resolveDialogOpen}
                onClose={() => {
                    if (!resolving) {
                        setResolveDialogOpen(false);
                    }
                }}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>Resolve Post?</DialogTitle>

                <DialogContent>
                    <Typography>
                        Are you sure you want to mark this post as resolved?
                        It will no longer appear on the active Lost & Found
                        board.
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => setResolveDialogOpen(false)}
                        disabled={resolving}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleResolve}
                        disabled={resolving}
                    >
                        {resolving ? "Resolving..." : "Resolve Post"}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={deleteDialogOpen}
                onClose={() => {
                    if (!deleting) {
                        setDeleteDialogOpen(false);
                    }
                }}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>Delete Post?</DialogTitle>

                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this post?
                        It will and all it's messages will be gone forever.
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        disabled={deleting}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {deleting ? "Deleting..." : "Delete Post"}
                    </Button>
                </DialogActions>
            </Dialog>
            <EditPostDialog
                open={editDialogOpen}
                post={post}
                onClose={() => setEditDialogOpen(false)}
                onSaved={(updatedPost) => {
                    setPost(updatedPost);
                }}
            />
        </Box>
    );
}