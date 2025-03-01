const Button = ({ text, onClick, color = "#E94560" }) => (
    <button onClick={onClick} style={{
      backgroundColor: color,
      border: "none",
      padding: "10px 20px",
      color: "white",
      cursor: "pointer",
      margin: "5px",
      borderRadius: "5px"
    }}>
      {text}
    </button>
  );
  
  export default Button;
  