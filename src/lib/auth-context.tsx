"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  linkWithPopup,
  linkWithCredential,
  PhoneAuthProvider,
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  ConfirmationResult,
} from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";

export interface CustomerProfile {
  uid: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  photoURL: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export interface SavedAddress {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: CustomerProfile | null;
  addresses: SavedAddress[];
  loading: boolean;
  signInWithGoogle: () => Promise<User>;
  sendPhoneOtp: (phoneNumber: string, containerId: string) => Promise<ConfirmationResult>;
  verifyPhoneOtp: (confirmationResult: ConfirmationResult, otp: string) => Promise<User>;
  linkGoogleAccount: () => Promise<void>;
  linkPhoneAccount: (phoneNumber: string, containerId: string) => Promise<ConfirmationResult>;
  confirmLinkPhone: (confirmationResult: ConfirmationResult, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  updateCustomerProfile: (data: Partial<CustomerProfile>) => Promise<void>;
  addSavedAddress: (address: Omit<SavedAddress, "id">) => Promise<string>;
  updateSavedAddress: (id: string, address: Partial<SavedAddress>) => Promise<void>;
  deleteSavedAddress: (id: string) => Promise<void>;
  setDefaultSavedAddress: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Extend Window interface for recaptcha verifier
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync user profile from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Sync or create user profile in /users/{uid}
        const userRef = doc(db, "users", currentUser.uid);
        try {
          const userSnap = await getDoc(userRef);
          const now = new Date().toISOString();

          if (!userSnap.exists()) {
            const initialProfile: CustomerProfile = {
              uid: currentUser.uid,
              displayName: currentUser.displayName || "",
              email: currentUser.email || "",
              phoneNumber: currentUser.phoneNumber || "",
              photoURL: currentUser.photoURL || "",
              role: "customer",
              createdAt: now,
              updatedAt: now,
              lastLoginAt: now,
            };
            await setDoc(userRef, initialProfile);
            setProfile(initialProfile);
          } else {
            const existing = userSnap.data() as CustomerProfile;
            const updated = {
              ...existing,
              displayName: existing.displayName || currentUser.displayName || "",
              email: existing.email || currentUser.email || "",
              phoneNumber: existing.phoneNumber || currentUser.phoneNumber || "",
              photoURL: existing.photoURL || currentUser.photoURL || "",
              lastLoginAt: now,
            };
            await updateDoc(userRef, { lastLoginAt: now });
            setProfile(updated);
          }
        } catch {
          // If firestore rules not yet loaded or offline, fallback to auth user fields
          setProfile({
            uid: currentUser.uid,
            displayName: currentUser.displayName || "",
            email: currentUser.email || "",
            phoneNumber: currentUser.phoneNumber || "",
            photoURL: currentUser.photoURL || "",
          });
        }

        // Subscribe to saved addresses in /users/{uid}/addresses
        const addrColl = collection(db, "users", currentUser.uid, "addresses");
        const addrUnsub = onSnapshot(
          addrColl,
          (snapshot) => {
            const items: SavedAddress[] = snapshot.docs.map((d) => ({
              id: d.id,
              ...(d.data() as any),
            }));
            setAddresses(items);
          },
          () => {
            setAddresses([]);
          }
        );

        setLoading(false);
        return () => addrUnsub();
      } else {
        setProfile(null);
        setAddresses([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Google Login
  async function signInWithGoogle(): Promise<User> {
    const cred = await signInWithPopup(auth, googleProvider);
    return cred.user;
  }

  // Setup Recaptcha and Send Phone OTP
  async function sendPhoneOtp(phoneNumber: string, containerId: string): Promise<ConfirmationResult> {
    if (typeof window === "undefined") throw new Error("Window not defined");

    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch {}
    }

    const verifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
      callback: () => {},
    });
    window.recaptchaVerifier = verifier;

    // Format phone number with +91 if missing
    let formattedPhone = phoneNumber.trim().replace(/\s+/g, "");
    if (!formattedPhone.startsWith("+")) {
      formattedPhone = `+91${formattedPhone}`;
    }

    const confirmation = await signInWithPhoneNumber(auth, formattedPhone, verifier);
    window.confirmationResult = confirmation;
    return confirmation;
  }

  // Verify Phone OTP
  async function verifyPhoneOtp(confirmationResult: ConfirmationResult, otp: string): Promise<User> {
    const cred = await confirmationResult.confirm(otp);
    return cred.user;
  }

  // Account Linking: Link Google to existing user
  async function linkGoogleAccount(): Promise<void> {
    if (!auth.currentUser) throw new Error("No user currently logged in");
    await linkWithPopup(auth.currentUser, googleProvider);

    // Update firestore profile
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      email: auth.currentUser.email || "",
      displayName: auth.currentUser.displayName || "",
      photoURL: auth.currentUser.photoURL || "",
      updatedAt: new Date().toISOString(),
    });
  }

  // Account Linking: Link Phone to existing user
  async function linkPhoneAccount(phoneNumber: string, containerId: string): Promise<ConfirmationResult> {
    if (!auth.currentUser) throw new Error("No user currently logged in");

    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch {}
    }

    const verifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
    });
    window.recaptchaVerifier = verifier;

    let formattedPhone = phoneNumber.trim().replace(/\s+/g, "");
    if (!formattedPhone.startsWith("+")) {
      formattedPhone = `+91${formattedPhone}`;
    }

    const confirmation = await signInWithPhoneNumber(auth, formattedPhone, verifier);
    return confirmation;
  }

  // Confirm Link Phone
  async function confirmLinkPhone(confirmationResult: ConfirmationResult, otp: string): Promise<void> {
    if (!auth.currentUser) throw new Error("No user currently logged in");
    const cred = PhoneAuthProvider.credential(confirmationResult.verificationId, otp);
    await linkWithCredential(auth.currentUser, cred);

    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      phoneNumber: auth.currentUser.phoneNumber || "",
      updatedAt: new Date().toISOString(),
    });
  }

  // Logout
  async function logout(): Promise<void> {
    await signOut(auth);
    setUser(null);
    setProfile(null);
    setAddresses([]);
  }

  // Update Customer Profile
  async function updateCustomerProfile(data: Partial<CustomerProfile>): Promise<void> {
    if (!auth.currentUser) throw new Error("Not authenticated");
    const userRef = doc(db, "users", auth.currentUser.uid);
    const updated = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await updateDoc(userRef, updated);
    setProfile((prev) => (prev ? { ...prev, ...updated } : null));
  }

  // Address Management
  async function addSavedAddress(address: Omit<SavedAddress, "id">): Promise<string> {
    if (!auth.currentUser) throw new Error("Not authenticated");
    const coll = collection(db, "users", auth.currentUser.uid, "addresses");
    const res = await addDoc(coll, {
      ...address,
      createdAt: new Date().toISOString(),
    });
    return res.id;
  }

  async function updateSavedAddress(id: string, address: Partial<SavedAddress>): Promise<void> {
    if (!auth.currentUser) throw new Error("Not authenticated");
    const docRef = doc(db, "users", auth.currentUser.uid, "addresses", id);
    await updateDoc(docRef, address);
  }

  async function deleteSavedAddress(id: string): Promise<void> {
    if (!auth.currentUser) throw new Error("Not authenticated");
    const docRef = doc(db, "users", auth.currentUser.uid, "addresses", id);
    await deleteDoc(docRef);
  }

  async function setDefaultSavedAddress(id: string): Promise<void> {
    if (!auth.currentUser) throw new Error("Not authenticated");
    // Set all others to false, set this to true
    for (const addr of addresses) {
      const docRef = doc(db, "users", auth.currentUser.uid, "addresses", addr.id);
      await updateDoc(docRef, { isDefault: addr.id === id });
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        addresses,
        loading,
        signInWithGoogle,
        sendPhoneOtp,
        verifyPhoneOtp,
        linkGoogleAccount,
        linkPhoneAccount,
        confirmLinkPhone,
        logout,
        updateCustomerProfile,
        addSavedAddress,
        updateSavedAddress,
        deleteSavedAddress,
        setDefaultSavedAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
