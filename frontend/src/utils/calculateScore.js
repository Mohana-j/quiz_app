export const calculateScore = (answers, questions) => {
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;
  
    questions.forEach((question) => {
      if (!(question.question_id in answers)) {
        skipped++; // No answer selected
      } else if (answers[question.question_id] === question.correct_option) {
        correct++; // Answer is correct
      } else {
        incorrect++; // Answer is incorrect
      }
    });
  
    return { correct, incorrect, skipped };
  };
  