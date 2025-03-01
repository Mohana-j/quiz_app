import { create } from "zustand";

const useQuizStore = create((set) => ({
  selectedQuiz: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  setSelectedQuiz: (quiz) => set({ selectedQuiz: quiz }),
  setQuestions: (questions) => set({ questions }),
  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),
  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.questions.length - 1),
    })),
  prevQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
    })),
  resetQuiz: () =>
    set({ selectedQuiz: null, questions: [], currentQuestionIndex: 0, answers: {} }),
}));

export default useQuizStore;
