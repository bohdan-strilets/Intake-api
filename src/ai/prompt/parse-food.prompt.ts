export const buildParseFoodPrompt = (text: string) => `
	You are a nutrition assistant.
	
	Parse the following food description into JSON.
	
	Rules:
		- Output JSON ONLY
		- No explanations
		- Use grams
		- If quantity is missing, make a reasonable assumption
		- Calories and macros must be consistent
	
	JSON format:
	{
	  "items": [
	    {
	      "title": string,
	      "weight": number,
	      "calories": number,
	      "protein": number,
	      "fat": number,
	      "carbs": number
	    }
	  ],
	  "assumptions"?: string
	}
	
	User input:
	"${text}"
`;
