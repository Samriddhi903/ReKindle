const CreatePostButton = ({ onClick, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      position: 'fixed',
      bottom: '40px',
      left: '40px',
      width: '96px',
      height: '96px',
      backgroundColor: '#ef4444',
      borderRadius: '50%',
      color: 'white',
      fontSize: '36px',
      fontWeight: 'bold',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
      zIndex: 9999,
      border: '4px solid white',
      cursor: 'pointer',
    }}
    aria-label="Create new post"
  >
    +
  </button>
);

export default CreatePostButton; 