import { FieldValue } from 'firebase-admin/firestore';

export interface GalleryItem {
  path: string;
  prompt: string;
  model: string;
  createdAt: FieldValue;
}