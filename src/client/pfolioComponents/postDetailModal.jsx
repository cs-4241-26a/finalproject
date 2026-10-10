import { Modal } from 'react-bootstrap';
import "./editTools.css";

//On click brings up full image with a title and the post description at the bottom
function PostDetailModal({ post, onHide }) {
    return (
        <Modal show={post !== null} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{post?.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {post?.imageUrl && <img src={post.imageUrl} alt={post.title} className="postDetailImg" />}
                {post?.description && <p className="postDetailText">{post.description}</p>}
            </Modal.Body>
        </Modal>
        
    )
}
export default PostDetailModal;