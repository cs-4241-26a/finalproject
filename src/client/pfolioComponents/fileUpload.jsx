import { Button } from 'react-bootstrap';

// Owner-only "Manage images" button in the profile banner's button column.
function FileUpload({ onOpen }) {
    return (
        <Button variant="outline-secondary" onClick={onOpen}>
            🖹 Manage images
        </Button>
    );
}
export default FileUpload;
