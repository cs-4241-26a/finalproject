import React from "react";
import { AppBar, Toolbar, IconButton, Box, Tooltip, Typography, Avatar, Menu, Button, MenuItem } from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";

import { useNavigate } from "react-router-dom";

import { useModel } from "../context/ModelContext";
import AccountDialog from "./auth/AccountDialog";
import type { SimpleUser } from "../../../shared/types/User";

interface NavBarProps {
  basic: boolean;
}

export default function NavBar({ basic }: NavBarProps) {

  const { model, logout, editCurrentUser } = useModel();

  const navigate = useNavigate();

  const [accountOpen, setAccountOpen] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const menuOpen = Boolean(anchorEl);

  const avatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const avatarClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    avatarClose();
    try {
      await logout();

      navigate("/");

    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleAccountSave = async (displayName: string, residence: string) => {
    const currentUser = model.currUser;

    if (!currentUser) {
      throw new Error("No authenticated user found.");
    }

    const updatedUser: SimpleUser = {
      ...currentUser,
      display_name: displayName,
      residence,
    };

    await editCurrentUser(updatedUser);
  };


  return (
    <AppBar position="fixed">
      <Toolbar sx={{ display: "flex", alignItems: "center" }}>
        {basic === true ? <></> :
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Go to Board" arrow>
              <IconButton
                sx={{ width: 50, height: 50, backgroundColor: "info.main", color: "white", "&:hover": { backgroundColor: "info.dark" } }}
                onClick={() => navigate("/board")}
                disabled={!model.isAuthenticated}
              >
                <HomeIcon sx={{ fontSize: 35, }} />
              </IconButton>
            </Tooltip>
          </Box>}

        <Box sx={{ flexGrow: 1, textAlign: "center", }}>
          <Typography variant="h5">
            Gompei's Lost & Found
          </Typography>
        </Box>

        {basic === true ? <></> :
          <>
            <Box>
              <IconButton onClick={avatarClick} size="small" disabled={!model.isAuthenticated}>
                <Avatar sx={{ bgcolor: "secondary.main" }}>
                  {model.currUser?.display_name?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={avatarClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >

              <Typography sx={{ padding: "8px 16px 0" }}>
                Logged in as:
              </Typography>

              <Typography sx={{ padding: "0px 16px 8px", fontWeight: "bold" }}>
                {model.currUser?.display_name}
              </Typography>

              <MenuItem
                onClick={() => {
                  avatarClose();
                  setAccountOpen(true);
                }}
              >
                View Account
              </MenuItem>

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "center",
                  width: "100%",
                }}
              >

                <Button
                  variant="contained"
                  sx={{ margin: "10px" }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Box>
            </Menu>
          </>}
      </Toolbar>
      {model.currUser && (
        <AccountDialog
          open={accountOpen}
          user={model.currUser}
          onClose={() => setAccountOpen(false)}
          onSave={handleAccountSave}
        />
      )}
    </AppBar>
  );
}