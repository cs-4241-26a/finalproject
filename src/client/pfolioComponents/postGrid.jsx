import { Card, Button } from 'react-bootstrap';
import "./editTools.css";

// Grid of the artist's posts. `editable` only controls whether Edit/Delete render.
function PostGrid({ posts, editable, emptyMessage, onEdit, onDelete, onOpen }) {
    if (posts.length === 0) {
        return <p className="text-muted mb-0">{emptyMessage}</p>;
    }
    //sort array by priority variable in descending order
    posts.sort((a, b) => parseInt(b.priority, 10) - parseInt(a.priority, 10));
    return (
        <div className="postGrid">
            {posts.map(post => ( 
                <Card key={post._id} onClick={() => onOpen(post)}>
                    {post.imageUrl && (
                        <Card.Img variant="top" src={post.imageUrl} alt={post.title} className="postCardImg" />
                    )}
                    <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                    </Card.Body>
                    {editable && (
                        <Card.Footer className="d-flex gap-2">
                            <Button size="sm" variant="outline-primary" onClick={(e) => {e.stopPropagation(); onEdit(post);}}>Edit</Button>
                            <Button size="sm" variant="outline-danger" onClick={(e) => {e.stopPropagation(); onDelete(post);}}>Delete</Button>
                        </Card.Footer>
                    )}
                </Card>
            ))}
        </div>
    );
}
export default PostGrid;
