import { onCall } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import { defineSecret } from 'firebase-functions/params';
import { generateImage, saveImageToBucket, saveImageToCollection } from './utils';
import { GalleryItem } from './models';
import { FieldValue } from 'firebase-admin/firestore';

const GEMINI_API_KEY = defineSecret('GEMINI_API_KEY');
const PROMPT = 'Funny puppy';
const MODEL = 'imagen-4.0-generate-001';

export const generateImageFn = onCall(
  {
    enforceAppCheck: true,
    consumeAppCheckToken: true,
    secrets: [
      GEMINI_API_KEY
    ]
  }, async () => {

  try {
    const base64Image = await generateImage({
      geminiApiKey: GEMINI_API_KEY,
      logger, prompt: PROMPT, model: MODEL
    });
    if (!base64Image) {
      return {
        success: false,
        message: 'Error to generate image'
      };
    }

    logger.info(`Image generated`);
    const filePath = await saveImageToBucket(base64Image);
    logger.info(`Image stored to bucket`);
    const item: GalleryItem = {
      prompt: PROMPT,
      model: MODEL,
      path: filePath,
      createdAt: FieldValue.serverTimestamp()
    };
  
    const itemId = await saveImageToCollection(item);
    logger.info(`Image added to firestore ${itemId}`);

    return {
      image: itemId,
      success: true
    };
  } catch (err) {
    logger.error(err);

    return {
      success: false,
      error: err,
      message: 'Not handled error'
    }
  }

});