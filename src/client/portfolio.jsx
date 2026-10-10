
import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import WidgetDisplay from "./pfolioComponents/widgetDisplay.jsx";
import "./portfolio.css"
import PFolioNavBar from './pfolioComponents/navbar.jsx';
import usePortfolio from './pfolioComponents/usePortfolio.js';
import ProfileBanner from './pfolioComponents/profileBanner.jsx';
import PostGrid from './pfolioComponents/postGrid.jsx';
import PostFormModal from './pfolioComponents/postFormModal.jsx';
import defaultPfp from './assets/stockPhotoGuy.png';
import UploadFileModal from './pfolioComponents/uploadFileModal.jsx';
import PostDetailModal from './pfolioComponents/postDetailModal.jsx';

function UserPortfolio(){
    const { uid } = useParams(); 
    const [data, setData] = useState([])
    const { posts, profile, isOwner, editMode, setEditMode, savePost, deletePost, saveProfile } = usePortfolio(uid)
    // null = closed, { post: null } = creating, { post } = editing that post
    const [modal, setModal] = useState(null)
    const [fileModal, setFileModal] = useState(false)
    const [viewing, setViewing] = useState(null)

    // on load, fetch the data with the id passed in the url
    useEffect(() => {
        fetch("/user/widgets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userid: uid
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setData(data);
        });
    }, []);

    return (
        <>
            <PFolioNavBar uid={uid}></PFolioNavBar>
            <div className='portfolioPage'>
                <ProfileBanner
                    profile={profile}
                    defaultPfp={defaultPfp}
                    isOwner={isOwner}
                    editMode={editMode}
                    onSetEditMode={setEditMode}
                    onNewPost={() => setModal({ post: null })}
                    onManageImages={() => setFileModal(true)}
                    onSaveProfile={saveProfile}
                />
                <div className='postContainer'>
                    <PostGrid
                        posts={posts}
                        editable={isOwner && editMode}
                        emptyMessage={isOwner ? 'No posts yet. Use "+ New post" to add your first piece.' : 'No work posted yet.'}
                        onEdit={(post) => setModal({ post })}
                        onDelete={deletePost}
                        onOpen={(post) => setViewing(post)}
                    />

                    {/* <div>{uid}</div>
                    <WidgetDisplay widgets={data} /> */}
                </div>
            </div>
            {isOwner && (
                <PostFormModal
                    uid={uid}
                    show={modal !== null}
                    post={modal?.post ?? null}
                    onHide={() => setModal(null)}
                    onSave={async (fields) => { await savePost(modal?.post, fields); setModal(null); }}
                />
            )}

            {isOwner && (<UploadFileModal show={fileModal} onHide={() => setFileModal(false)} uid={uid} />)}
            <PostDetailModal post={viewing} onHide={() => setViewing(null)} />
            
            
        </>
    );
}
export default UserPortfolio;