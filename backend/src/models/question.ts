import { InferSchemaType, Schema, model } from "mongoose";

const questionSchema = new Schema({
    question : {type:String, require: true},
    answerChoiceA : {type:String, require: true},
    answerChoiceB : {type:String, require: true},
    answerChoiceC : {type:String, require: true},
    answerChoiceD : {type:String, require: true},
    answerChoiceE : {type:String, require: true},
    correctAnswer : {type:Number, require: true},
    pageNumberStart : {type:Number, require: false},
    pageNumberEnd : {type:Number, require: false}
});

type Question = InferSchemaType<typeof questionSchema>;

export default model<Question>("Question", questionSchema);