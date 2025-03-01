import { useEffect, useState } from "react";
import { fetchQuizzes } from "../../services/quizService"; // Ensure correct path

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetchQuizzes().then(setQuizzes);
  }, []);

  return (
    <div>
      <h2>Select a Quiz</h2>
      {quizzes.map((quiz) => (
        <button key={quiz.id}>{quiz.title}</button>
      ))}
    </div>
  );
};

export default QuizList;
