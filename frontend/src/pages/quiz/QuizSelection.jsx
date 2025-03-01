import { useNavigate } from "react-router-dom";

const QuizSelection = () => {
  const navigate = useNavigate();

  // Predefined quiz categories
  const categories = [
    { id: 9, name: "General Knowledge" },
    { id: 21, name: "Sports" },
    { id: 23, name: "History" },
    { id: 17, name: "Science & Nature" },
    { id: 27, name: "Animals" }
  ];

  const selectQuiz = (categoryId) => {
    navigate(`/quiz?category=${categoryId}`); // Redirect to quiz page with category ID
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Select a Trivia Quiz Category</h2>
      {categories.map((category) => (
        <button 
          key={category.id} 
          onClick={() => selectQuiz(category.id)} 
          style={{ display: "block", margin: "10px auto", padding: "10px 20px" }}>
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default QuizSelection;
