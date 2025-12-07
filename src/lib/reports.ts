
'use client';

import {
  collection,
  addDoc,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export type Report = {
  userId: string;
  title: string;
  type: 'Climate Risk' | 'Soil Analysis' | 'Profit Planner' | 'Plant Diagnosis';
  createdAt?: any; 
};

/**
 * Creates a new report document in Firestore for the current user.
 * This is a non-blocking operation.
 *
 * @param firestore - The Firestore database instance.
 * @param userId - The ID of the currently authenticated user.
 * @param reportData - The report data to be saved.
 */
export function createReport(
  firestore: Firestore,
  userId: string,
  reportData: Omit<Report, 'userId' | 'createdAt'>
) {
  if (!userId) {
    console.error('User must be authenticated to create a report.');
    return;
  }

  const reportsCollection = collection(firestore, 'reports');

  const newReport: Report = {
    ...reportData,
    userId: userId,
    createdAt: serverTimestamp(),
  };

  // Non-blocking fire-and-forget write with error handling
  addDoc(reportsCollection, newReport).catch((error) => {
    console.error('Error creating report:', error);
    // Emit a detailed error for debugging, which will be caught by the FirebaseErrorListener
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: reportsCollection.path,
        operation: 'create',
        requestResourceData: newReport,
      })
    );
  });
}

    