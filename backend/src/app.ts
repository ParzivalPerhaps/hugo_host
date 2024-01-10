/* eslint-disable @typescript-eslint/no-unused-vars */
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import questionsRoutes from "./routes/questions";
import userRoutes from "./routes/users";
import env from "./util/validateEnv";

import createHttpError, { isHttpError } from "http-errors";
import session from "express-session";
import MongoStore from "connect-mongo";

const app = express(); // app represents the server application

// the order of function definitions mimicks the order of authority for errors and shit
app.use(express.json());

app.use(session({
    secret: env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie : {
        maxAge: 60 * 60 * 1000
    },
    rolling:true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING
    })
}));

app.use("/api/users", userRoutes);
app.use("/api/questions", questionsRoutes);

app.use((req, res, next) =>{
    console.log(req.url);
    
    next(createHttpError(404, "Endpoint not found"));
});

// Error handler
app.use((error: unknown, req: Request, res: Response, next: NextFunction) =>{
    console.log(error);
    let errorMessage = "An unknown error occured";

    let statusCode = 500;
    // check if it's actually an error error and not just an instance of null
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }

    res.status(statusCode).json({error:errorMessage});
});

export default app;