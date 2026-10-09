import { Box, Card, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { SimplePost } from "../../../../shared/types/Post";
import UserAvatar from "../common/UserAvatar";

interface PostCardProps {
    post: SimplePost;
}

export default function PostCard({ post }: PostCardProps) {
    const navigate = useNavigate();

    return (
        <Card
            onClick={() => navigate(`/post/${post.post_id}`)}
            sx={{
                display: "inline-block",
                width: "100%",
                mb: 2,
                breakInside: "avoid",

                cursor: "pointer",

                borderRadius: 1,
                border: "1px solid rgba(0, 0, 0, 0.15)",

                boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.25)",

                transition: "transform 0.15s ease, box-shadow 0.15s ease",

                "&:hover": {
                    transform: "translateY(-3px) rotate(-0.2deg)",
                    boxShadow: "5px 7px 12px rgba(0, 0, 0, 0.3)",
                },
            }}
        >
            {post.imageData && (
                <Box
                    component="img"
                    src={post.imageData}
                    alt={post.title}
                    sx={{
                        display: "block",
                        width: "100%",
                        maxHeight: 300,
                        objectFit: "cover",
                    }}
                />
            )}

            <Grid container>
                <Grid size={10}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: "bold",
                            mb: 1,
                            ml: "5px"
                        }}
                    >
                        {post.title}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1, ml: "5px"}}
                    >
                        Posted by {post.userDisplayName}
                    </Typography>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ml: "5px"}}
                    >
                        {new Date(post.created).toLocaleDateString()}
                    </Typography>
                </Grid>

                <Grid size={2} sx={{alignContent: "center", minWidth: "50px"}}>
                    <UserAvatar userId={post.user_id} displayName={post.userDisplayName}/>
                </Grid>
            </Grid>
        </Card>
    );
}