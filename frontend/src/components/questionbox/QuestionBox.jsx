const QuestionBox = ({ question, selectedAnswer, setAnswer }) => (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h3>{question.question_text}</h3>
      {question.options.map((option, index) => (
        <button
          key={index}
          onClick={() => setAnswer(question.question_id, option)}
          style={{
            backgroundColor: selectedAnswer === option ? "#E94560" : "#1A1A2E",
            color: "white",
            padding: "10px",
            margin: "5px",
            borderRadius: "5px",
            cursor: "pointer",
            border: "none"
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
  
  export default QuestionBox;
  