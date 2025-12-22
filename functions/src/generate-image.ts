import { GoogleGenAI } from '@google/genai';
import { onCall } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import { defineSecret } from 'firebase-functions/params';

const GEMINI_API_KEY = defineSecret('GEMINI_API_KEY');

export const generateImageFn = onCall(
  {
    enforceAppCheck: true,
    consumeAppCheckToken: true,
    secrets: [
      GEMINI_API_KEY
    ]
  },
  async () => {

  try {
    const ai = new GoogleGenAI({
      apiKey: GEMINI_API_KEY.value()
    });
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: 'Funny puppy',
      config: {
        numberOfImages: 1,
      }
    });

    if (!response.generatedImages) {
      logger.error('Failed to generate image');
      return {
        success: false
      }
    }
    const generatedImage = response.generatedImages[0].image?.imageBytes;

    return {
      image: generatedImage,
      success: true
    };
  } catch (err) {
    logger.error(err);

    return {
      success: false
    }
  }

});