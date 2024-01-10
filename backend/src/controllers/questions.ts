import "dotenv/config";
import { RequestHandler } from "express";
import QuestionModel from "../models/question"
import soSciQuestionsBank from "../../question_bank/social_science/questions.json";


export const getQuestions: RequestHandler = async (req, res, next) =>{
    try {
        const questions = soSciQuestionsBank.questions[0];
        res.status(200).json(questions);
    } catch (error) {
        next(error);
    }
    
}

export const getQuestion: RequestHandler = async (req, res, next) =>{
    const id = req.params.questionId;

    try {
        const questions = soSciQuestionsBank.questions[0];
        res.status(200).json(questions);
    } catch (error) {
        next(error);
    }
}

export const getRandomSoSciQuestion: RequestHandler = async (req, res, next) =>{
    try {
        console.log(soSciQuestionsBank.questions.length);
        
        const index = getRandomInt(0, soSciQuestionsBank.questions.length);

        const questions = soSciQuestionsBank.questions[index];
        res.status(200).json(questions);
    } catch (error) {
        next(error);
    }
}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

// delete?
export const createQuestion: RequestHandler = async (req, res, next) =>{
    const question = req.body.question;
    const answerChoiceA = req.body.answerChoiceA;
    const answerChoiceB = req.body.answerChoiceB;
    const answerChoiceC = req.body.answerChoiceC;
    const answerChoiceD = req.body.answerChoiceD;
    const answerChoiceE = req.body.answerChoiceE;
    const correctAnswer = req.body.correctAnswer;
    const pageNumberStart = req.body.pageNumberStart;
    const pageNumberEnd = req.body.pageNumberEnd;

    try {
        const newQuestion = await QuestionModel.create({
            question: question,
            answerChoiceA: answerChoiceA,
            answerChoiceB: answerChoiceB,
            answerChoiceC: answerChoiceC,
            answerChoiceD: answerChoiceD,
            answerChoiceE: answerChoiceE,
            correctAnswer: correctAnswer,
            pageNumberStart: pageNumberStart,
            pageNumberEnd: pageNumberEnd
        });

        res.status(201).json(newQuestion);
    } catch (error) {
        next(error);
    }
    
}