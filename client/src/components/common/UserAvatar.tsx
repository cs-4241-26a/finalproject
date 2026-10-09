import React from "react";
import { IconButton, Box, Typography, Avatar, Menu, Grid } from "@mui/material";

import { useModel } from "../../context/ModelContext";
import { type SimpleUser } from "../../../../shared/types/User";

interface AvatarProps {
    userId: string
    displayName: string
    clickable?: boolean
}

export default function UserAvatar({ userId, displayName, clickable=true }: AvatarProps) {

    const { getUser } = useModel();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const [user, setUser] = React.useState<SimpleUser>({
        user_id: "",
        display_name: displayName,
        residence: "",
        created: ""
    })

    const menuOpen = Boolean(anchorEl);

    const avatarClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        getUserDetails();
        setAnchorEl(event.currentTarget);
    };

    const avatarClose = () => {
        setAnchorEl(null);
    };

    const getUserDetails = async () => {
        try {
            setUser(await getUser(userId));

        } catch (error) {
            console.error("GetUser failed:", error);
        }
    }

    if (clickable) {
        return (
            <>
                <Box>
                    <IconButton onClick={avatarClick} size="small">
                        <Avatar sx={{ bgcolor: "secondary.main" }}>
                            {user.display_name === undefined ? "" : user.display_name.charAt(0).toUpperCase()}
                        </Avatar>
                    </IconButton>
                </Box>

                <Menu
                    anchorEl={anchorEl}
                    open={menuOpen}
                    onClose={avatarClose}
                    onClick={(event) => event.stopPropagation()}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                    <Grid container spacing={2}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            minWidth: "250px",
                            minHeight: "75px"
                        }}
                    >
                        <Grid size={8} sx={{justifyContent: "center", alignContent: "center"}}>
                            <Typography sx={{justifySelf:"center", fontWeight: "bold", ml: "10px"}}>
                                {user.display_name}
                            </Typography>

                            <Typography sx={{ml: "10px"}}>
                                Residence: {user.residence}
                            </Typography>
                        </Grid>

                        <Grid size={4} sx={{justifyContent: "center", alignContent: "center"}}>
                            <Typography variant="caption" color="text.secondary">
                                User since: {new Date(user.created).toLocaleDateString()}
                            </Typography>
                        </Grid>
                    </Grid>
                </Menu>
            </>
        );
    } else {
        return (
            <Avatar sx={{ bgcolor: "secondary.main" }}>
                {user.display_name === undefined ? "" : user.display_name.charAt(0).toUpperCase()}
            </Avatar>
        );
    }
}