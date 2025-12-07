'use client';

import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  type Firestore,
  type Timestamp,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export type ReportType = 'Climate Risk' | 'Soil Analysis' | 'Profit Planner' | 'Plant Diagnosis' | 'Irrigation' | 'Crop Management';

export interface Report {
  id: string;
  userId: string;
  title: string;
  type: ReportType;
  content?: Record<string, any>; // Optional detailed content
  metadata?: {
    location?: string;
    cropType?: string;
    season?: string;
    area?: number;
    [key: string]: any;
  };
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface CreateReportData {
  title: string;
  type: ReportType;
  content?: Record<string, any>;
  metadata?: Report['metadata'];
  status?: Report['status'];
}

/**
 * Creates a new report document in Firestore for the current user.
 * Returns a promise that resolves with the created report ID or rejects with an error.
 *
 * @param firestore - The Firestore database instance.
 * @param userId - The ID of the currently authenticated user.
 * @param reportData - The report data to be saved.
 * @returns Promise<string> - The ID of the created report document.
 * @throws {Error} If user is not authenticated or Firestore operation fails.
 */
export async function createReport(
  firestore: Firestore,
  userId: string,
  reportData: CreateReportData
): Promise<string> {
  // Validate inputs
  if (!firestore) {
    throw new Error('Firestore instance is required');
  }
  
  if (!userId) {
    throw new Error('User must be authenticated to create a report.');
  }

  if (!reportData.title?.trim()) {
    throw new Error('Report title is required.');
  }

  if (!reportData.type) {
    throw new Error('Report type is required.');
  }

  try {
    // Create a reference to a new document in the 'reports' collection
    const newReportRef = doc(collection(firestore, 'reports'));

    const newReport: Omit<Report, 'createdAt' | 'id'> & { createdAt: any, id: string } = {
      id: newReportRef.id,
      userId: userId,
      title: reportData.title.trim(),
      type: reportData.type,
      content: reportData.content || {},
      metadata: reportData.metadata || {},
      status: reportData.status || 'completed',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Save the report to Firestore
    await setDoc(newReportRef, newReport);

    console.log('Report created successfully:', newReportRef.id);
    
    // Return the report ID for further reference
    return newReportRef.id;

  } catch (error: any) {
    console.error('Error creating report:', error);
    
    // Handle Firestore permission errors more robustly
    if (error.code === 'permission-denied' || error.code === 'permission_denied') {
      const permissionError = new FirestorePermissionError({
        path: `reports/${doc(collection(firestore, 'reports')).id}`,
        operation: 'create',
        requestResourceData: reportData,
      });
      
      errorEmitter.emit('permission-error', permissionError);
      throw permissionError;
    }
    
    // Re-throw a more generic error for the caller to handle
    throw new Error(`Failed to create report: ${error.message || 'Unknown error'}`);
  }
}