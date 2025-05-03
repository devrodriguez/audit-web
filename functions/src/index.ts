/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { onCallGenkit } from 'firebase-functions/https';
import { defineSecret } from "firebase-functions/params";

import { generatePoemFlow } from "./flows/generatePoem";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

const googleAIapiKey = defineSecret("GEMINI_API_KEY");
const funcConfig = {
  enforceAppCheck: true,
  consumeAppCheckToken: true,
  secrets: [googleAIapiKey],
  authPolicy: (auth: any) => auth?.token.email_verified ?? false,
}

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

export const generatePoem = onCallGenkit(funcConfig, generatePoemFlow)
