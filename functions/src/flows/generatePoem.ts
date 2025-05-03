import { gemini20Flash, googleAI } from "@genkit-ai/googleai";
import { genkit } from "genkit";
import { z } from "zod";

const ai = genkit({
    plugins: [googleAI({
        apiKey: 'AIzaSyDu2d11r8zklhCOfT6KEvMx3I5A6RVWuEU',
    })],
    model: gemini20Flash,
});

export const generatePoemFlow = ai.defineFlow(
    {
        name: "generatePoem",
        inputSchema: z.string(),
        outputSchema: z.string(),
    },
    async (subject: string) => {
        const { text } = await ai.generate(`Compose a poem about ${subject}.`);
        return text;
    }
);