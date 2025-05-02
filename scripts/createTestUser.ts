import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig.local";

async function createTestUser() {
  try {
    console.log("Creating test user...");
    const testUserData = {
      firstName: "Doe",
      lastName: "John",
      phoneNumber: "+1234567890",
      email: "doe.john@example.com",
      createdAt: Timestamp.now()
    };

    // Create a document with a specific ID
    await setDoc(doc(db, "users", "test-user-1"), testUserData);
    
    console.log("Test user document created successfully!");
  } catch (error) {
    console.error("Error creating test user:", error);
  }
}

createTestUser(); 