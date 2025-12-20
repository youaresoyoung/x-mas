const STORAGE_KEY = "xmas_nickname";

export class AuthService {
  constructor() {}

  login(nickname: string) {
    localStorage.setItem(STORAGE_KEY, nickname);
  }

  logout() {
    localStorage.removeItem(STORAGE_KEY);
  }
}
