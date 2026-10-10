import { useState, useEffect } from "react";
import { api } from "../api.js";

// Loads a portfolio's profile + posts + whether the logged in user owns it,
// and exposes the owner actions (create / edit / delete posts, edit profile).
export default function usePortfolio(uid) {
    const [posts, setPosts] = useState([]);
    // { username, bio, avatarUrl } of the portfolio being viewed
    const [profile, setProfile] = useState(null);
    // From the server, which compares the session user to uid. Only decides
    // which UI to show -- the server re-checks ownership on every edit.
    const [isOwner, setIsOwner] = useState(false);
    // Owner can turn this off to see the page the way visitors do
    const [editMode, setEditMode] = useState(true);

    useEffect(() => {
        api("GET", `/api/portfolio/${uid}`)
            .then(data => {
                setPosts(data.posts);
                setProfile(data.profile);
                setIsOwner(data.isOwner);
            })
            .catch(err => console.error("Failed to load portfolio:", err));
    }, [uid]);

    // existingPost = null to create, or the post being edited
    const savePost = async (existingPost, fields) => {
        if (existingPost) {
            const updated = await api("PUT", `/api/posts/${existingPost._id}`, fields);
            setPosts(prev => prev.map(p => p._id === updated._id ? updated : p));
        } else {
            const created = await api("POST", "/api/posts", fields);
            setPosts(prev => [created, ...prev]);
        }
    };

    const deletePost = async (post) => {
        if (!window.confirm(`Delete "${post.title}"? This can't be undone.`)) return;
        try {
            await api("DELETE", `/api/posts/${post._id}`);
            setPosts(prev => prev.filter(p => p._id !== post._id));
        } catch (err) {
            alert(err.message);
        }
    };

    // fields = { bio, avatarUrl }. Throws on failure so the form can show the error.
    const saveProfile = async (fields) => {
        const saved = await api("PUT", "/api/profile", fields);
        setProfile(prev => ({ ...prev, ...saved }));
    };

    return { posts, profile, isOwner, editMode, setEditMode, savePost, deletePost, saveProfile };
}
