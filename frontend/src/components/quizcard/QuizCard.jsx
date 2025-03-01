const QuizCard = ({ quiz, onSelect }) => (
    <div onClick={() => onSelect(quiz)} style={{
      background: "#1A1A2E",
      color: "white",
      padding: "20px",
      margin: "10px",
      borderRadius: "10px",
      cursor: "pointer",
      textAlign: "center",
      width: "200px"
    }}>
      <h3>{quiz.title}</h3>
      <p>{quiz.description}</p>
    </div>
  );
  
  export default QuizCard;
  