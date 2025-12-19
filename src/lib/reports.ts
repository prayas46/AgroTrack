
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
  userId: string; // Keep for potential future use, but will be a generic value now
  title: string;
  type: ReportType;
  content?: Record<string, any>;
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
 * Creates a new report document in Firestore.
 * This version does not require a specific user and assigns reports to a generic 'public' user.
 *
 * @param firestore - The Firestore database instance.
 * @param reportData - The report data to be saved.
 * @returns Promise<string> - The ID of the created report document.
 * @throws {Error} If Firestore operation fails.
 */
export async function createReport(
  firestore: Firestore,
  reportData: CreateReportData
): Promise<string> {
  if (!firestore) {
    throw new Error('Firestore instance is required');
  }
  if (!reportData.title?.trim()) {
    throw new Error('Report title is required.');
  }
  if (!reportData.type) {
    throw new Error('Report type is required.');
  }

  try {
    const newReportRef = doc(collection(firestore, 'reports'));

    const newReport: Omit<Report, 'createdAt' | 'updatedAt' | 'id'> & { createdAt: any, updatedAt: any, id: string } = {
      id: newReportRef.id,
      userId: 'public_user', // Assign to a generic ID
      title: reportData.title.trim(),
      type: reportData.type,
      content: reportData.content || {},
      metadata: reportData.metadata || {},
      status: reportData.status || 'completed',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(newReportRef, newReport);
    console.log('Public report created successfully:', newReportRef.id);
    return newReportRef.id;

  } catch (error: any) {
    console.error('Error creating report:', error);
    
    if (error.code === 'permission-denied' || error.code === 'permission_denied') {
      const permissionError = new FirestorePermissionError({
        path: `reports/${doc(collection(firestore, 'reports')).id}`,
        operation: 'create',
        requestResourceData: reportData,
      });
      
      errorEmitter.emit('permission-error', permissionError);
      throw permissionError;
    }
    
    throw new Error(`Failed to create report: ${error.message || 'Unknown error'}`);
  }
}
