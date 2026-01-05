import { GoogleGenAI } from '@google/genai';
import { onCall } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import { defineSecret } from 'firebase-functions/params';
import { getStorage } from 'firebase-admin/storage';

const GEMINI_API_KEY = defineSecret('GEMINI_API_KEY');

export const generateImageFn = onCall(
  {
    enforceAppCheck: true,
    consumeAppCheckToken: true,
    secrets: [
      GEMINI_API_KEY
    ]
  }, async () => {

  try {
    const base64Image = await generateImage();
    if (!base64Image) {
      return {
        success: false
      };
    }
    const imageBuffer = Buffer.from(base64Image, 'base64');
    const filePath = `generated-images/${Date.now()}.png`;
    const bucket = getStorage().bucket();
    const file = bucket.file(filePath);

    await file.save(imageBuffer, {
      metadata: {
        contentType: 'image/png',
      },
      resumable: false,
    });

    return {
      image: filePath,
      success: true
    };
  } catch (err) {
    logger.error(err);

    return {
      success: false
    }
  }

});

async function generateImage(): Promise<string | undefined> {
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
    return;
  }
  const generatedImageBytes = response.generatedImages[0].image?.imageBytes;

  return generatedImageBytes;
}