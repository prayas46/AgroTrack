
'use client';

import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export type Report = {
  id?: string;
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
  reportData: Omit<Report, 'userId' | 'createdAt' | 'id'>
) {
  if (!userId) {
    console.error('User must be authenticated to create a report.');
    return;
  }

  // Create a reference to a new document in the 'reports' collection
  const newReportRef = doc(collection(firestore, 'reports'));

  const newReport: Report = {
    ...reportData,
    id: newReportRef.id, // Add the generated ID to the document data
    userId: userId,
    createdAt: serverTimestamp(),
  };

  // Use setDoc with the new document reference. This is compatible with serverTimestamp.
  setDoc(newReportRef, newReport).catch((error) => {
    console.error('Error creating report:', error);
    // Emit a detailed error for debugging
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: newReportRef.path,
        operation: 'create',
        requestResourceData: newReport,
      })
    );
  });
}
