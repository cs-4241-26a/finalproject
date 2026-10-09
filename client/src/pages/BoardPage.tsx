import React from "react";
import { Alert, Box, CircularProgress, Container, Typography } from "@mui/material";

import NavBar from "../components/navbar";
import BoardFilters, {
    type UserFilter,
    type BoardFilter,
} from "../components/board/BoardFilters";
import CreatePostDialog from "../components/board/CreatePostDialog";
import PostCard from "../components/board/PostCard";

import { useModel } from "../context/ModelContext";

// Corkboard images
import corkboardTop from "../assets/corkboard-top.png";
import corkboardBody from "../assets/corkboard-body.png";
import corkboardBottom from "../assets/corkboard-bottom.png";
import AlertBar from "../components/alertbar";

export default function BoardPage() {
    const { model, loadBoard } = useModel();

    const [search, setSearch] = React.useState("");
    const [filter, setFilter] = React.useState<BoardFilter>("all");
    const [userFilter, setUserFilter] = React.useState<UserFilter>("all");
    const [archive, setArchive] = React.useState(false);

    const [createPostOpen, setCreatePostOpen] = React.useState(false);

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");

    const load = async () => {
            try {
                setLoading(true);
                setError("");

                await loadBoard();
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load the board."
                );
            } finally {
                setLoading(false);
            }
        };

    React.useEffect(() => {
        load();
    }, [loadBoard]);

    const posts = model.board ?? [];

    const userOptions = React.useMemo(() => {
        const users = new Map<
            string,
            { user_id: string; display_name: string }
        >();

        for (const post of posts) {
            if (!users.has(post.user_id)) {
                users.set(post.user_id, {
                    user_id: post.user_id,
                    display_name: post.userDisplayName,
                });
            }
        }

        return Array.from(users.values()).sort((a, b) =>
            a.display_name.localeCompare(b.display_name)
        );
    }, [posts]);

    const filteredPosts = posts.filter((post) => {
        const searchText = search.trim().toLowerCase();

        const matchesSearch = searchText === "" || post.title.toLowerCase().includes(searchText) || post.userDisplayName.toLowerCase().includes(searchText);

        let matchesFilter = true;

        if (filter === "lost") {
            matchesFilter = post.postType === "Lost";
        }

        if (filter === "found") {
            matchesFilter = post.postType === "Found";
        }

        const matchesArchive = post.isResolved === archive;

        let matchesUser = true;

        if (userFilter === "me") {
            matchesUser = post.user_id === model.currUser?.user_id;
        } else if (userFilter !== "all") {
            matchesUser = post.user_id === userFilter;
        }

        return (
            matchesSearch && matchesFilter && matchesArchive && matchesUser
        );
    });

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#ffffff",
            }}
        >
            {/* Navbar */}
            <NavBar basic={false} />
            <AlertBar/>

            {/* Board controls */}
            <Box
                sx={{
                    position: "sticky",
                    top: "70px",
                    zIndex: 1000,

                    backgroundColor: "background.paper",

                    borderBottom: "1px solid",
                    borderColor: "divider",

                    boxShadow:
                        "0 2px 6px rgba(0, 0, 0, 0.2)",
                }}
            >
                <Container maxWidth="xl">
                    <Box
                        sx={{
                            py: 2,
                        }}
                    >
                        <BoardFilters
                            search={search}
                            filter={filter}
                            userFilter={userFilter}
                            userOptions={userOptions}
                            archive={archive}
                            onSearchChange={setSearch}
                            onFilterChange={setFilter}
                            onUserFilterChange={setUserFilter}
                            onArchiveChange={setArchive}
                            onCreatePost={() => setCreatePostOpen(true)}
                        />
                    </Box>
                </Container>
            </Box>

            {/* Corkboard begins immediately below filters */}
            <Box
                sx={{
                    width: "100%",
                    overflow: "hidden",
                    pt: "70px"
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
                        justifySelf: "center"
                    }}
                />

                {/* Corkboard body */}
                <Box
                    sx={{
                        width: "90%",
                        justifySelf: "center",

                        backgroundImage: `url(${corkboardBody})`,
                        backgroundRepeat: "repeat-y",
                        backgroundPosition: "top center",

                        /*
                         * Scale the 786px-wide source image to
                         * whatever width the board currently has.
                         */
                        backgroundSize: "100% auto",

                        /*
                         * Make sure there is enough room for the
                         * board content even when there are no posts.
                         */
                        minHeight: 400,

                        py: {
                            xs: 2,
                            sm: 3,
                            md: 4,
                        },
                    }}
                >
                    <Container maxWidth="xl">
                        {loading ? (
                            <Box
                                sx={{
                                    minHeight: 300,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        ) : error ? (
                            <Alert severity="error">
                                {error}
                            </Alert>
                        ) : filteredPosts.length === 0 ? (
                            <Box
                                sx={{
                                    minHeight: 300,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                    textAlign: "center",
                                }}
                            >
                                <Typography
                                    variant="h2"
                                    sx={{
                                        color: "white",
                                        fontWeight: "bold",
                                    }}
                                >
                                    No posts found
                                </Typography>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        color: "white",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Try changing your search or filters.
                                </Typography>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    columnCount: {
                                        xs: 1,
                                        sm: 2,
                                        md: 3,
                                        lg: 4,
                                    },

                                    columnGap: {
                                        xs: 1.5,
                                        sm: 2,
                                        md: 2.5,
                                    },
                                }}
                            >
                                {filteredPosts.map((post) => (
                                    <PostCard
                                        key={post.post_id}
                                        post={post}
                                    />
                                ))}
                            </Box>
                        )}
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
                        justifySelf: "center"
                    }}
                />
            </Box>

            <CreatePostDialog
                open={createPostOpen}
                onClose={() => {
                        setCreatePostOpen(false)
                        load();
                    }
                }
            />
        </Box>
    );
}