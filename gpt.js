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
		return response.data.choices;
	} catch (error) {
		console.error("Error creating chat completion:", error);
	}
}

async function main(QSTN) {
	const step1 = [
		{
			role: "system",
			content: fs.readFileSync("system_prompt.txt", "utf8"),
		},
		{ role: "user", content:  QSTN},
	];

	console.log(step1);
	let choices = await createChatCompletion(step1);
	console.log(choices[0].message);



	// return;



	let prevmsg = choices[0].message.content;

	const step2 = [
		{
			role: "system",
			content: fs.readFileSync("qstn_prompt.txt", "utf8"),
		},
		{
			role: "user",
			content: prevmsg,
		},
	];
	console.log(step2);
	choices = await createChatCompletion(step2);
	console.log(choices[0].message);
	return choices[0].message;
}

// main(fs.readFileSync("qstn.txt", "utf8"));


export default main