import React from "react";

import { Box, Button, Grid, Typography } from "@mui/material";
import LoginForm from "../components/auth/LoginForm";
import CreateUserDialog from "../components/auth/CreateUserDialog";
import NavBar from "../components/navbar";
import AlertBar from "../components/alertbar";

export default function LoginPage() {

    const [
        createUserOpen,
        setCreateUserOpen,
    ] = React.useState(false);

    return (<>
        <NavBar basic={true} />
        <AlertBar/>
        <Box>
            <CreateUserDialog
                open={createUserOpen}
                onClose={() => setCreateUserOpen(false)}
            />

            <Grid
                container
                spacing={1}
                sx={{ display: "flex", margin: "8vh 0", flexDirection: "column", alignItems: "center" }}
            >
                <Grid
                    size={{ xs: 11, sm: 8, md: 5 }}
                    sx={{ display: "flex", justifyContent: "center" }}
                >
                    <Typography
                        variant="h2"
                        sx={(_theme) => ({
                            display: "inline-block",
                            marginLeft: "20px",
                            marginRight: "20px",
                            fontWeight: "bold",
                            textAlign: "center",
                            background: "linear-gradient(0.25turn, #14b8a6, #1976d2)",
                            WebkitTextFillColor: "transparent",
                            WebkitBackgroundClip: "text",
                        })}
                    >
                        Welcome to 
                        <br/>
                        Gompei's Lost &amp; Found
                    </Typography>
                </Grid>
                <Typography variant="h4" sx={{pt: "20px"}}>
                    Join this WPI community and make the lost found
                </Typography>


                <Grid
                    size={{ xs: 11, sm: 8, md: 5 }}
                    sx={{ marginTop: "5vh" }}
                >
                    <LoginForm />
                </Grid>
                <Grid
                    size={{ xs: 11, sm: 8, md: 5 }}
                    sx={{ marginTop: "5vh", display: "flex", flexDirection: "column", alignItems: "center" }}
                >
                    <Typography variant="h5">
                        No account?
                    </Typography>
                    <Typography variant="h5">
                        Create one here!
                    </Typography>
                </Grid>


                <Grid
                    size={{ xs: 11, sm: 8, md: 5 }}
                    sx={{ display: "flex", justifyContent: "center" }}
                >
                    <Button
                        variant="contained"
                        onClick={() => setCreateUserOpen(true)}
                        sx={{ height: "5vh", width: "15vw", fontSize: "1.2rem", minWidth: "180px", }}
                    >
                        Register
                    </Button>
                </Grid>
            </Grid>
        </Box>
    </>);
}