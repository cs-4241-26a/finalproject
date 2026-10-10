import { Button, ButtonGroup } from 'react-bootstrap';
import UserInfo from './userInfo.jsx';
import ProfileEditor from './profileEditor.jsx';
import FileUpload from './fileUpload.jsx';

// Top of the portfolio page: avatar + username + bio, and (owner only) the button column.
// Viewing shows UserInfo; editing swaps in ProfileEditor in the same spot.
function ProfileBanner({ profile, defaultPfp, isOwner, editMode, onSetEditMode, onNewPost, onManageImages, onSaveProfile }) {
    const editing = isOwner && editMode && profile;

    return (
        <section className="profileBanner">
            {editing ? (
                <ProfileEditor profile={profile} username={profile.username} defaultPfp={defaultPfp} onSave={onSaveProfile} />
            ) : (
                <UserInfo img={profile?.avatarUrl || defaultPfp} username={profile?.username} txt={profile?.bio || "No bio yet."} />
            )}

            {isOwner && (
                <div className="ownerActions">
                    <ButtonGroup className="w-100">
                        <Button variant={editMode ? "primary" : "outline-primary"} onClick={() => onSetEditMode(true)}>Editing</Button>
                        <Button variant={editMode ? "outline-primary" : "primary"} onClick={() => onSetEditMode(false)}>Viewing</Button>
                    </ButtonGroup>
                    {editMode && (
                        <>
                            <Button onClick={onNewPost}>+ New post</Button>
                            <FileUpload onOpen={onManageImages} />
                        </>
                    )}
                </div>
            )}
        </section>
    );
}
export default ProfileBanner;
