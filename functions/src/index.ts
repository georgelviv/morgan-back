import { setGlobalOptions } from "firebase-functions";
import { pingFn } from './ping';
import { generateImageFn } from './generate-image';
import { initializeApp } from 'firebase-admin/app';

setGlobalOptions({ maxInstances: 10 });

initializeApp();

export const ping = pingFn;
export const generateImage = generateImageFn;