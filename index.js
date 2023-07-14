const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

const axios = require("axios");

const openai = axios.create({
	baseURL: "https://api.openai.com/v1",
	headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
		"OpenAI-Organization": process.env.OPENAI_ORG_ID,
	},
});

async function createChatCompletion(messages, options = {}) {
	try {
		const response = await openai.post("/chat/completions", {
			model: options.model || "gpt-4",
			messages,
			...options,
		});
		console.log(response.data);
		return response.data.choices;
	} catch (error) {
		console.error("Error creating chat completion:", error);
	}
}

async function main() {
	const messages = [
		{ role: "system", content: fs.readFileSync("system_prompt.txt", "utf8") },
		{ role: "user", content: fs.readFileSync("qstn.txt", "utf8") },
	];

	const options = {
		temperature: 0.8,
		max_tokens: 500,
	};
	console.log(messages);
	const choices = await createChatCompletion(messages, options);

	console.log(choices[0].message);
}

main();
