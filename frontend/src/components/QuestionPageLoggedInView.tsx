import { useEffect, useState } from "react";
import { Spinner, Toast } from "react-bootstrap";
import { Question as QuestionModel } from '../models/question';
import Question from "./Question";
import * as UserApi from "../network/user_api";
import { User } from "../models/user";

interface QuestionPageLoggedInProps {
  user : User,
  category: string,
  questionCount: number,
  liveCorrections: Boolean,
}

const QuestionPageLoggedInView = (props : QuestionPageLoggedInProps) => {
    const [question, setQuestion] = useState<QuestionModel>({
        "question": "LOADING QUESTION",
        "answerChoiceA": "ANSWER A",
        "answerChoiceB": "ANSWER B",
        "answerChoiceC": "ANSWER C",
        "answerChoiceD": "ANSWER D",
        "answerChoiceE": "ANSWER E",
        "correctAnswer": 1,
        "pageNumberStart": 20,
        "pageNumberEnd": 20
      });
    
      const [questionLoading, setQuestionLoading] = useState(true);
      const [showQuestionLoadingError, setShowQuestionLoadingError] = useState(false);
      const [chosenAnswer, setChosenAnswer] = useState(-1);
      const [answered, setAnswered] = useState(false);
      const [questionPosition, setQuestionPosition] = useState(0);

      const [correctAnswers, setCorrectAnswers] = useState(0);

      const [quizComplete, setQuizComplete] = useState(false);

 
    async function loadQuestion(){
      try {
        setShowQuestionLoadingError(false);
        setQuestionLoading(true);
        const response = await fetch("/api/questions/" + props.category + "/random", {method: "GET"});
        const questions = await response.json();
        
        setQuestion(questions);
        setAnswered(false);
      } catch (error) {
        console.log(error);
        setShowQuestionLoadingError(true);
      } finally {
        setQuestionLoading(false);
      }
      
    }
      
  useEffect(() => {
    loadQuestion();
  }, []);

  const errorToast = <Toast>
                      <Toast.Header>
                        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                        <strong className="me-auto">Hugo Training Platform</strong>
                      </Toast.Header>
                      <Toast.Body>Something went wrong! Please try refreshing the page</Toast.Body>
                    </Toast>

    return ( 
        <>
            {questionLoading && <Spinner animation='border' variant='primary'></Spinner>}
            {showQuestionLoadingError && errorToast}
            {!questionLoading && !showQuestionLoadingError && !quizComplete && <Question 
            question={question}
            liveCorrections={props.liveCorrections}
            currentQuestionCount={props.questionCount - questionPosition}
            onAnsOneClick={() => {setChosenAnswer(0)}}
            onAnsTwoClick={() => {setChosenAnswer(1)}}
            onAnsThreeClick={() => {setChosenAnswer(2)}}
            onAnsFourClick={() => {setChosenAnswer(3)}}
            onAnsFiveClick={() => {setChosenAnswer(4)}}
            onSubmitClick={(isCorrect) => {
              if (answered) return;

              setAnswered(true);
              

              if (isCorrect){
                setCorrectAnswers(correctAnswers + 1);

                UserApi.setStat({
                  username: props.user.username,
                  newValue: 1,
                  stat: props.category
                })
              }else{
                UserApi.setStat({
                  username: props.user.username,
                  newValue: 0,
                  stat: props.category
                })
              }

            }}
            onNextQuestionClick={()=> {
              loadQuestion(); 
              setQuestionPosition(questionPosition + 1)
              if (questionPosition == props.questionCount - 1){
                setQuizComplete(true);
              }
            }}
          
            ></Question>}

            {quizComplete && 
              
              <div>
                <h1 style={{fontFamily:"Baron", color:"#E0FBFC"}}>Quiz Complete!</h1>
                <h2 style={{color:"#E0FBFC"}}>Great Work</h2>
                <h1 style={{marginTop:"9rem", color:"#E0FBFC", fontFamily:"Baron"}}>{correctAnswers + " Correct out of " + props.questionCount}</h1>
              </div>
              
            }
        </>
        
     );
}
 
export default QuestionPageLoggedInView;