import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useState, useEffect } from "react";
import { NavbarBrand, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/tempLogo.png';


function PFolioNavBar() {
    const [username, setUsername] = useState("")

    useEffect(() => {
        // GET request using fetch inside useEffect React hook
        fetch('/user/username')
            .then(response => response.json())
            .then(data => setUsername(data));

    // empty dependency array means this effect will only run once (like componentDidMount in classes)
    }, []);

    const handleLogOut = async (e) => {
        console.log("Client Logout")
        e.preventDefault()
        const response = await fetch('/auth/logout', {
            method: "GET",
            redirect: "manual"
            })
        if (response.type === 'opaqueredirect') {
            window.location.href = response.url
        }
    }
    const handleLogInRedirect = (e) => {
        window.location.href = '/'
    }

    return (
        <>
        <Navbar bg="primary" data-bs-theme="dark">
            <Container>
                <Navbar.Brand>
                    <img
                        alt = ""
                        src = {logo}
                        width = "30"
                        height = "30"
                        className = "d-inline-block align top"
                    />{' '}
                    Art Port
                </Navbar.Brand>
                {username !== "" ? <Button onClick={handleLogOut}>Log Out {username}</Button> : <Button onClick={handleLogInRedirect}>Log In</Button>}
            </Container>
        </Navbar>
        </>
    );
}


export default PFolioNavBar;