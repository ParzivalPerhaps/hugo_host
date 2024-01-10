import express from "express";
import * as QuestionsController from "../controllers/questions";

const router = express.Router();

router.get("/", QuestionsController.getQuestions);

//router.post("/", QuestionsController.createQuestion);

router.get("/socialscience/random", QuestionsController.getRandomSoSciQuestion);

export default router;