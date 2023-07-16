import express from 'express';

import  GPT from "./gpt.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post("/variations",async(req,res)=>
{
    const qstn=req.body.qstn;
    try{
        const ans=await GPT(qstn);
        res.status(200).json(ans);
    }
    catch(e){
        res.status(500).json({message:e.message});
    }
})



export default app