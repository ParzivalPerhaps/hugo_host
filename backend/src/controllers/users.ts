import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";

export const getAuthenticatedUser : RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        if (!authenticatedUserId){
            throw createHttpError(401, "Authentication failed")
        }

        const user = await UserModel.findById(authenticatedUserId).select("+email").exec();
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

interface SignUpBody {
    username?: string,
    email?: string,
    password?: string,
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;

    console.log("Creating new user");
    
    
    try {
        if (!username || !email || !passwordRaw){
            throw createHttpError(400, "Missing parameters");
        }

        const existingUsername = await UserModel.findOne({username:username});

        if (existingUsername){
            throw createHttpError(409, "Username already exists");
        }

        const existingEmail = await UserModel.findOne({email:email});

        if (existingEmail){
            throw createHttpError(409, "Email already registered. Please log in instead");
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newUser = await UserModel.create({
            username:username,
            email:email,
            password:passwordHashed
        });

        req.session.userId = newUser._id;

        res.status(201).json(newUser);
    }catch (error){
        next(error);
    }
}

interface LoginBody {
    username?: string,
    password?: string,
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        if (!username || !password){
            throw createHttpError(400, "Missing parameters");
        }        

        const user = await UserModel.findOne({username:username}).select("+password +email").exec();

        if (!user){
            throw createHttpError(401, "Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch){
            throw createHttpError(401, "Invalid credentials");
        }

        req.session.userId = user._id;
        res.status(201).json(user);
    }catch (error){
        next(error);
    }
}

interface UserStatsRequestBody {
    username?: string,
}

export const getUserStats: RequestHandler<unknown, unknown, UserStatsRequestBody, unknown> = async (req, res, next) => {
    const username = req.body.username;

    try {
        if (!username){
            throw createHttpError(400, "Missing parameters");
        }        

        const user = await UserModel.findOne({username:username}).select("+socialScienceQuestionsAnswered +socialScienceQuestionsCorrect +scienceQuestionsAnswered +scienceQuestionsCorrect +econQuestionsAnswered +econQuestionsCorrect +litQuestionsAnswered +litQuestionsCorrect +artQuestionsAnswered +artQuestionsCorrect +musicQuestionsAnswered +musicQuestionsCorrect +mathQuestionsAnswered +mathQuestionsCorrect +questionNumSetting +liveCorrectionsSetting +pageNumbersSetting").exec();

        if (!user){
            throw createHttpError(401, "Invalid username");
        }

        res.status(200).json(user);
    }catch (error){
        next(error);
    }
}

interface UserStatPostBody {
    username?: string,
    stat?: string,
    newValue?: number
}

export const setUserStat: RequestHandler<unknown, unknown, UserStatPostBody, unknown> = async (req, res, next) => {
    console.log("Got set stat request");
    
    const stat = req.body.stat;
    const newValue = req.body.newValue;
    const username = req.body.username;
    
    try {
        const user = await UserModel.findOne({username:username}).select("+socialScienceQuestionsAnswered +socialScienceQuestionsCorrect +scienceQuestionsAnswered +scienceQuestionsCorrect +econQuestionsAnswered +econQuestionsCorrect +litQuestionsAnswered +litQuestionsCorrect +artQuestionsAnswered +artQuestionsCorrect +musicQuestionsAnswered +musicQuestionsCorrect +mathQuestionsAnswered +mathQuestionsCorrect +questionNumSetting +liveCorrectionsSetting +pageNumbersSetting").exec();

        if (!user){
            createHttpError(401, "Invalid user")
        }

        let answeredValue;
        let correctValue;

        switch (stat) {
            case "socialScience":
                console.log("Social science");

                answeredValue = user?.socialScienceQuestionsAnswered ?? 0;
                correctValue = user?.socialScienceQuestionsCorrect ?? 0;

                switch (newValue) {
                    case 1:
                        // correct
                        console.log("Correct");

                        await user?.updateOne({socialScienceQuestionsAnswered: answeredValue + 1});
                        await user?.updateOne({socialScienceQuestionsCorrect: correctValue + 1});

                        break;
                    case 0:
                        // incorrect
                        console.log("Incorrect");
                        
                        await user?.updateOne({socialScienceQuestionsAnswered: answeredValue + 1});
                        break;
                
                    default:
                        break;
                }
                
                break;
        
                case "science":
                    answeredValue = user?.scienceQuestionsAnswered ?? 0;
                    correctValue = user?.scienceQuestionsCorrect ?? 0;

                    switch (newValue) {
                        case 1:
                            // correct
                            console.log("Correct");

                            await user?.updateOne({scienceQuestionsAnswered: answeredValue + 1});
                            await user?.updateOne({scienceQuestionsCorrect: correctValue + 1});

                            break;
                        case 0:
                            // incorrect
                            console.log("Incorrect");
                            
                            await user?.updateOne({scienceQuestionsAnswered: answeredValue + 1});
                            break;
                    
                        default:
                            break;
                    }
                    
                    break;
                case "econ":
                    answeredValue = user?.econQuestionsAnswered ?? 0;
                    correctValue = user?.econQuestionsCorrect ?? 0;

                    switch (newValue) {
                        case 1:
                            // correct
                            console.log("Correct");

                            await user?.updateOne({econQuestionsAnswered: answeredValue + 1});
                            await user?.updateOne({econQuestionsCorrect: correctValue + 1});

                            break;
                        case 0:
                            // incorrect
                            console.log("Incorrect");
                            
                            await user?.updateOne({econQuestionsAnswered: answeredValue + 1});
                            break;
                    
                        default:
                            break;
                    }
                    
                    break;
                case "lit":
                    answeredValue = user?.litQuestionsAnswered ?? 0;
                    correctValue = user?.litQuestionsCorrect ?? 0;

                    switch (newValue) {
                        case 1:
                            // correct
                            console.log("Correct");

                            await user?.updateOne({litQuestionsAnswered: answeredValue + 1});
                            await user?.updateOne({litQuestionsCorrect: correctValue + 1});

                            break;
                        case 0:
                            // incorrect
                            console.log("Incorrect");
                            
                            await user?.updateOne({litQuestionsAnswered: answeredValue + 1});
                            break;
                    
                        default:
                            break;
                    }
                    
                    break;
                case "art":
                    answeredValue = user?.artQuestionsAnswered ?? 0;
                    correctValue = user?.artQuestionsCorrect ?? 0;

                    switch (newValue) {
                        case 1:
                            // correct
                            console.log("Correct");

                            await user?.updateOne({artQuestionsAnswered: answeredValue + 1});
                            await user?.updateOne({artQuestionsCorrect: correctValue + 1});

                            break;
                        case 0:
                            // incorrect
                            console.log("Incorrect");
                            
                            await user?.updateOne({artQuestionsAnswered: answeredValue + 1});
                            break;
                    
                        default:
                            break;
                    }
                    
                    break;
                case "music":
                    answeredValue = user?.musicQuestionsAnswered ?? 0;
                    correctValue = user?.musicQuestionsCorrect ?? 0;

                    switch (newValue) {
                        case 1:
                            // correct
                            console.log("Correct");

                            await user?.updateOne({musicQuestionsAnswered: answeredValue + 1});
                            await user?.updateOne({musicQuestionsCorrect: correctValue + 1});

                            break;
                        case 0:
                            // incorrect
                            console.log("Incorrect");
                            
                            await user?.updateOne({musicQuestionsAnswered: answeredValue + 1});
                            break;
                    
                        default:
                            break;
                    }
                
                    break;
                case "math":
                    answeredValue = user?.mathQuestionsAnswered ?? 0;
                    correctValue = user?.mathQuestionsCorrect ?? 0;

                    switch (newValue) {
                        case 1:
                            // correct
                            console.log("Correct");

                            await user?.updateOne({mathQuestionsAnswered: answeredValue + 1});
                            await user?.updateOne({mathQuestionsCorrect: correctValue + 1});

                            break;
                        case 0:
                            // incorrect
                            console.log("Incorrect");
                            
                            await user?.updateOne({mathQuestionsAnswered: answeredValue + 1});
                            break;
                    
                        default:
                            break;
                    }
                
                break;
                case "questionNumSetting":
                    await user?.updateOne({questionNumSetting: newValue})    
                    break;
                case "liveCorrectionsSetting":
                    await user?.updateOne({liveCorrectionsSetting: (newValue == 1)})    
                    break;
                case "pageNumbersSetting":
                    await user?.updateOne({pageNumbersSetting: (newValue == 1)})    
                    break;

            default:
                break;
        }
    } catch (error) {
        next(error);
    }
}

export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy(error =>{
        if (error){
            next(error);
        }else{
            res.sendStatus(200);
        }
    })
}