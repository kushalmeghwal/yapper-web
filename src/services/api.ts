// src/services/api.ts

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL; 
// 🔑 You’ll configure this in .env.local

export async function login(username: string, password: string) {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });
    console.log("after login response")
    const data = await res.json();
    
    if (res.ok && data.success) {
      return { success: true, token: data.token, message: data.message };
    } else {
      return { success: false, message: data.message ?? "Login failed" };
    }
  } catch (err) {
    console.error("Error during login:", err);
    return { success: false, message: "An error occurred. Please try again later." };
  }
}

export async function signUp(nickname: string, username: string, password: string) {
  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, username, password }),
    });
   
    const data = await res.json();

    if (res.ok && data.success) {
      return { success: true, message: "Registration successful" };
    } else {
      return { success: false, message: data.message ?? "Signup failed" };
    }
  } catch (err) {
    console.error("Error during signup:", err);
    return { success: false, message: "An error occurred. Please try again later." };
  }
}

export async function updateFirebaseUserProfile({
  token,
  nickname,
  username,
}: {
  token: string;
  nickname: string;
  username: string;
}) {
  try {
    const res = await fetch(`${BASE_URL}/firebase/update-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nickname, username }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      return { success: true, message: data.message ?? "Profile updated successfully" };
    } else {
      return { success: false, message: data.message ?? "Profile update failed" };
    }
  } catch (err) {
    console.error("Error updating firebase profile:", err);
    return { success: false, message: "An error occurred. Please try again later." };
  }
}
