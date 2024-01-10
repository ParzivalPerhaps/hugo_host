import "dotenv/config";
import env from "./util/validateEnv"

import mongoose from "mongoose";
import app from "./app";

const port = env.PORT; // port the server connects to

mongoose.connect(env.MONGO_CONNECTION_STRING)
.then(() => {
    console.log("Mongoose Connection Successful!");

    app.listen(port, () =>{
        console.log(`Server Started, Listening on port ${port}...`);
    });
})
.catch((console.error));
