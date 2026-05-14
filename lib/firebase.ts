import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

let firebaseConfig: any = null;
try {
  // Check the root directory (one level up from /lib)
  firebaseConfig = require('/firebase-applet-config.json');
} catch (e) {
  // Fallback if the above fails
  try {
     firebaseConfig = require('../firebase-applet-config.json');
  } catch (e2) {
    firebaseConfig = {
      apiKey: "placeholder",
      authDomain: "placeholder",
      projectId: "placeholder",
      storageBucket: "placeholder",
      messagingSenderId: "placeholder",
      appId: "placeholder"
    };
  }
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  console.error('Firestore Error: ', error);
  throw new Error(String(error));
}
