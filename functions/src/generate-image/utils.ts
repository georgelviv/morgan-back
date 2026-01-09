import { GoogleGenAI } from '@google/genai';
import { SecretParam } from 'firebase-functions/params';
import * as logger from 'firebase-functions/logger';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';
import { GalleryItem } from './models';

type LoggerType = typeof logger;

const COLLECTION_NAME = 'gallery';

export async function generateImage(
  {
    geminiApiKey, logger, prompt, model
  } : {
    geminiApiKey: SecretParam, logger: LoggerType,
    prompt: string, model: string
  }
): Promise<string | undefined> {
  const ai = new GoogleGenAI({
    apiKey: geminiApiKey.value()
  });
  const response = await ai.models.generateImages({
    model,
    prompt,
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

export async function saveImageToBucket(base64Image: string): Promise<string> {
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

  return filePath;
}

export async function saveImageToCollection(item: GalleryItem): Promise<string> {
  const db = getFirestore();
  const docRef = await db.collection(COLLECTION_NAME).add(item);

  return docRef.id;
}