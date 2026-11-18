import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import {
  AlertNotification,
  WaterAvailabilityLog,
  TankerSchedule,
  LeakageReport,
  WaterSavingLog,
  GroundwaterReading,
  WaterQualityReading,
  ForumPost,
} from "@/types";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB0qAhaFgNmKQeblBMTuDKBt86zkRVZE6Q",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "aquatrace-d44d7.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "aquatrace-d44d7",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "aquatrace-d44d7.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "231501756698",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:231501756698:web:5a1088e6bb9dddff2414a3",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-VZL4P4C8EM",
};

// Initialize Firebase singleton
let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export function getFirebaseInstance(): { app: FirebaseApp | null; db: Firestore | null } {
  try {
    if (!app) {
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      db = getFirestore(app);
    }
    return { app, db };
  } catch (err) {
    console.warn("Firebase initialization warning (using local fallback):", err);
    return { app: null, db: null };
  }
}

// -------------------------------------------------------------
// Firestore Persistence Functions for History & Notification Logs
// -------------------------------------------------------------

/**
 * Save notification alert to Firestore
 */
export async function saveNotificationToFirestore(alert: AlertNotification): Promise<void> {
  const { db } = getFirebaseInstance();
  if (!db) return;
  try {
    const alertRef = doc(db, "notifications", alert.id);
    await setDoc(alertRef, {
      ...alert,
      createdAt: Timestamp.now(),
      syncSource: "client_event",
    }, { merge: true });
  } catch (err) {
    console.warn("Could not sync notification to Firestore:", err);
  }
}

/**
 * Save daily water availability intake log to Firestore
 */
export async function saveAvailabilityLogToFirestore(log: WaterAvailabilityLog): Promise<void> {
  const { db } = getFirebaseInstance();
  if (!db) return;
  try {
    const logRef = doc(db, "availability_logs", log.id);
    await setDoc(logRef, {
      ...log,
      syncedAt: Timestamp.now(),
    }, { merge: true });
  } catch (err) {
    console.warn("Could not sync availability log to Firestore:", err);
  }
}

/**
 * Save tanker schedule or arrival log to Firestore
 */
export async function saveTankerScheduleToFirestore(schedule: TankerSchedule): Promise<void> {
  const { db } = getFirebaseInstance();
  if (!db) return;
  try {
    const tnkRef = doc(db, "tanker_schedules", schedule.id);
    await setDoc(tnkRef, {
      ...schedule,
      syncedAt: Timestamp.now(),
    }, { merge: true });
  } catch (err) {
    console.warn("Could not sync tanker schedule to Firestore:", err);
  }
}

/**
 * Save citizen leakage report to Firestore
 */
export async function saveLeakageReportToFirestore(report: LeakageReport): Promise<void> {
  const { db } = getFirebaseInstance();
  if (!db) return;
  try {
    const leakRef = doc(db, "leakage_reports", report.id);
    await setDoc(leakRef, {
      ...report,
      syncedAt: Timestamp.now(),
    }, { merge: true });
  } catch (err) {
    console.warn("Could not sync leakage report to Firestore:", err);
  }
}

/**
 * Save groundwater piezometer / manual dip reading to Firestore
 */
export async function saveGroundwaterReadingToFirestore(reading: GroundwaterReading): Promise<void> {
  const { db } = getFirebaseInstance();
  if (!db) return;
  try {
    const gwRef = doc(db, "groundwater_readings", reading.id);
    await setDoc(gwRef, {
      ...reading,
      syncedAt: Timestamp.now(),
    }, { merge: true });
  } catch (err) {
    console.warn("Could not sync groundwater reading to Firestore:", err);
  }
}

/**
 * Save water saving conservation log to Firestore
 */
export async function saveWaterSavingLogToFirestore(saving: WaterSavingLog): Promise<void> {
  const { db } = getFirebaseInstance();
  if (!db) return;
  try {
    const saveRef = doc(db, "water_saving_logs", saving.id);
    await setDoc(saveRef, {
      ...saving,
      syncedAt: Timestamp.now(),
    }, { merge: true });
  } catch (err) {
    console.warn("Could not sync water saving log to Firestore:", err);
  }
}

/**
 * Save water quality sensor sample to Firestore
 */
export async function saveWaterQualityToFirestore(reading: WaterQualityReading): Promise<void> {
  const { db } = getFirebaseInstance();
  if (!db) return;
  try {
    const wqRef = doc(db, "water_quality_readings", reading.id);
    await setDoc(wqRef, {
      ...reading,
      syncedAt: Timestamp.now(),
    }, { merge: true });
  } catch (err) {
    console.warn("Could not sync water quality to Firestore:", err);
  }
}

/**
 * Save community forum discussion post to Firestore
 */
export async function saveForumPostToFirestore(post: ForumPost): Promise<void> {
  const { db } = getFirebaseInstance();
  if (!db) return;
  try {
    const postRef = doc(db, "forum_posts", post.id);
    await setDoc(postRef, {
      ...post,
      syncedAt: Timestamp.now(),
    }, { merge: true });
  } catch (err) {
    console.warn("Could not sync forum post to Firestore:", err);
  }
}

/**
 * Save live storage buffer level to Firestore
 */
export async function updateStorageLevelInFirestore(societyId: string, currentStorageLiters: number): Promise<void> {
  const { db } = getFirebaseInstance();
  if (!db) return;
  try {
    const socRef = doc(db, "society_storage", societyId);
    await setDoc(socRef, {
      societyId,
      currentStorageLiters,
      updatedAt: Timestamp.now(),
    }, { merge: true });
  } catch (err) {
    console.warn("Could not sync storage level to Firestore:", err);
  }
}

/**
 * Fetch historical data collection from Firestore
 */
export async function fetchCollectionFromFirestore<T>(collectionName: string, maxResults = 50): Promise<T[]> {
  const { db } = getFirebaseInstance();
  if (!db) return [];
  try {
    const colRef = collection(db, collectionName);
    const q = query(colRef, limit(maxResults));
    const snapshot = await getDocs(q);
    const items: T[] = [];
    snapshot.forEach((d) => {
      items.push(d.data() as T);
    });
    return items;
  } catch (err) {
    console.warn(`Firestore read failed for collection "${collectionName}":`, err);
    return [];
  }
}
