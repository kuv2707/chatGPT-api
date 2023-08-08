import fs from "fs";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const openai = axios.create({
	baseURL: "https://api.openai.com/v1",
	headers: {
		Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
		"OpenAI-Organization": process.env.OPENAI_ORG_ID,
	},
});

async function createChatCompletion(messages) {
	
	const options = {
		temperature: 0.8,
		max_tokens: 500,
	};
	try {
		const response = await openai.post("/chat/completions", {
			model: options.model || "gpt-4",
			messages,
			...options,
		});
		return response.data.choices[0];
	} catch (error) {
		console.error("Error creating chat completion:", error);
	}
}


const system_prompt_gen=fs.readFileSync("./prompts/system_prompt_gen.txt", "utf8")
const sample_qstn=fs.readFileSync("./prompts/sample_qstn.txt", "utf8")
const ideal_response=fs.readFileSync("./prompts/ideal_response.txt", "utf8")
const system_prompt_qstn=fs.readFileSync("./prompts/system_prompt_qstn.txt", "utf8")

async function main(QSTN) {


	const prompt1=[
		{
			role: "system",
			content: system_prompt_gen,
		},
		{
			role: "user",
			content:sample_qstn
		},
		{
			role:"assistant",
			content:ideal_response
		},
		{
			role:"user",
			content:QSTN
		}
	]

	let res1=await createChatCompletion(prompt1)
	console.log(res1.message)

	// return "fdsa"

	const prompt2=[
		{
			role: "system",
			content: system_prompt_qstn,
		},
		{
			role: "user",
			content:res1.message.content
		}
	]

	let res2=await createChatCompletion(prompt2)
	console.log(res2.message)

}


console.log("->",await main(fs.readFileSync("q.txt", "utf8")))

export default main