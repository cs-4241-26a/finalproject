import { useState, useEffect } from "react";
import { Button, Form, Alert } from 'react-bootstrap';
import "./editTools.css";

// Edit-mode version of the profile banner: profile picture + bio
function ProfileEditor({ profile, username, defaultPfp, onSave }) {
    const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
    const [bio, setBio] = useState(profile.bio);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null); // { variant, text }

    // keep the form in sync if a different profile loads
    useEffect(() => {
        setAvatarUrl(profile.avatarUrl);
        setBio(profile.bio);
    }, [profile.avatarUrl, profile.bio]);

    const changed = avatarUrl !== profile.avatarUrl || bio !== profile.bio;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await onSave({ avatarUrl, bio });
            setMessage({ variant: "success", text: "Profile saved" });
        } catch (err) {
            setMessage({ variant: "danger", text: err.message });
        } finally {
            setSaving(false);
        }
    };
    const handlePostFile = async (e) => {
        e.preventDefault()
         e.preventDefault()
        const file = e.target.files[0]
        const formData = new FormData();
        formData.append("files", file)
        const currentUrl = window.location.origin
        try {
            const response = await fetch("/api/files", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Files uploaded successfully:", result.uploads);
                const cleanResult = result.uploads.replace(/[\[\]"]/g, '');
                setAvatarUrl(`${currentUrl}` + `${cleanResult}`)
            }
        } catch (err) {
            console.log(err.message);
        } 
    }

    return (
        <>
        {/* the avatar doubles as the preview; click it to upload a new picture */}
        <div className="avatarWrap">
            <img src={avatarUrl || defaultPfp} alt="Profile picture preview" className="avatar" />
            <label className="avatarChange">
                Change photo
                <input
                    type="file"
                    name="files"
                    accept="image/png, image/jpeg"
                    hidden
                    onChange={handlePostFile}
                />
            </label>
        </div>

        <Form onSubmit={handleSubmit} className="profileText">
            <h1 className="profileName">{username}</h1>

            <Form.Group className="bioEditor mb-2" controlId="profile-bio">
                <Form.Control
                    as="textarea"
                    rows={3}
                    maxLength={1000}
                    placeholder="Write a short bio..."
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                />
                <Form.Text muted>{bio.length}/1000</Form.Text>
            </Form.Group>

            <Form.Group className="bioEditor mb-2" controlId="profile-avatar">
                <Form.Label className="small mb-1">Profile picture URL</Form.Label>
                <Form.Control
                    type="url"
                    size="sm"
                    placeholder="https://..."
                    value={avatarUrl}
                    onChange={e => setAvatarUrl(e.target.value)}
                />
            </Form.Group>

            {message && <Alert variant={message.variant} className="bioEditor py-1 px-2 small">{message.text}</Alert>}
            <Button type="submit" variant="secondary" disabled={!changed || saving}>
                {saving ? "Saving..." : "Save profile"}
            </Button>
        </Form>
        </>
    );
}
export default ProfileEditor;
