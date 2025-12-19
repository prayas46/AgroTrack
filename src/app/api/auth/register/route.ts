import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/server";
import { hash } from "bcryptjs";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const userRef = db.collection("users").doc(email);
    const authUserRef = db.collection("auth_users").doc(email);

    const [existingUserSnap, existingAuthUserSnap] = await Promise.all([
      userRef.get(),
      authUserRef.get(),
    ]);

    if (existingUserSnap.exists || existingAuthUserSnap.exists) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const passwordHash = await hash(password, 10);

    await authUserRef.set({
      email,
      passwordHash,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    await userRef.set({
      email,
      name: name || null,
      provider: "credentials",
      role: "Farmer",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      { id: userRef.id, email, name: name || null },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
