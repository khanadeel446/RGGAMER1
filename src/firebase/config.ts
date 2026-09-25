import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  getDocFromServer,
  collection,
  getDocs
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore (using specific database ID if configured)
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)"
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Connection test as required by Firebase skill
async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore connection: Client is offline or initializing.");
    }
  }
}
testFirestoreConnection();

// Central Plan definitions
export interface PlanDefinition {
  id: "free" | "premium";
  name: string;
  price: string;
  badge: string;
  ramLimitMB: number;
  diskLimitGB: number;
  cpuPercent: number;
  maxServers: number;
  features: string[];
  recommended?: boolean;
}

export const DEFAULT_PLANS: Record<"free" | "premium", PlanDefinition> = {
  free: {
    id: "free",
    name: "Free Tier",
    price: "$0 / month",
    badge: "Community",
    ramLimitMB: 2048,
    diskLimitGB: 10,
    cpuPercent: 100,
    maxServers: 1,
    features: [
      "1 Minecraft Server",
      "2 GB High-Speed RAM",
      "10 GB NVMe Storage",
      "100% Dedicated CPU Share",
      "Live Console & Web Terminal",
      "Full File Manager & SFTP",
      "Playit.gg Zero-Port Tunnel",
      "Community Discord Support"
    ]
  },
  premium: {
    id: "premium",
    name: "Premium Pro",
    price: "$9.99 / month",
    badge: "Unlimited Pro",
    ramLimitMB: 16384,
    diskLimitGB: 60,
    cpuPercent: 400,
    maxServers: 10,
    features: [
      "Up to 10 Game Servers",
      "Up to 16 GB DDR5 RAM",
      "60 GB Enterprise NVMe",
      "400% Turbo CPU Power",
      "Automated Daily Backups",
      "Multi-World Instant Switcher",
      "Full Plugin & Mod Library",
      "Custom Domain Support",
      "24/7 Priority Discord & Ticket Support"
    ],
    recommended: true
  }
};

/**
 * Save user plan selection to Firestore
 */
export async function saveUserPlanToFirestore(userId: string, plan: "free" | "premium", email?: string, username?: string) {
  try {
    const userRef = doc(db, "users", userId);
    const existing = await getDoc(userRef);
    
    const now = new Date().toISOString();
    if (existing.exists()) {
      await updateDoc(userRef, {
        plan,
        planSelectedAt: now,
        updatedAt: now
      });
    } else {
      await setDoc(userRef, {
        id: userId,
        email: email || "",
        username: username || email?.split("@")[0] || "Player",
        role: "user",
        plan,
        planSelectedAt: now,
        createdAt: now
      });
    }
    return { success: true };
  } catch (error: any) {
    console.error("Error saving user plan to Firestore:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch user profile from Firestore
 */
export async function getUserProfileFromFirestore(userId: string) {
  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile from Firestore:", error);
    return null;
  }
}

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  firebaseSignOut, 
  updateProfile,
  onAuthStateChanged,
  type FirebaseUser
};
