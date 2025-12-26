const STORAGE_KEY = "xmas_user";

export class AuthService {
  constructor() {}

  async login(nickname: string): Promise<{ color: string }> {
    const API_URL = import.meta.env.DEV
      ? import.meta.env.VITE_DEV_SERVER_URL
      : import.meta.env.VITE_SERVER_URL;

    const response = await fetch(`${API_URL}/api/entrance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickname: nickname.trim() }),
    });

    const data = await response.json();
    if (!data.available) {
      throw new Error(data.error || "Failed to enter the Christmas Room.");
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ nickname, color: data.color })
    );
    return { color: data.color };
  }

  logout() {
    localStorage.removeItem(STORAGE_KEY);
  }
}
