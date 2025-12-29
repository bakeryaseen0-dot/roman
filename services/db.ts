
import { UserAccount } from "../types";

/**
 * Mock Database "Server" using LocalStorage
 * This mimics a real backend API with async methods
 */
const USERS_KEY = 'sword_knowledge_users';
const SESSION_KEY = 'sword_knowledge_current';

export class UserDataServer {
  private static delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async register(username: string, password: string, avatar: string): Promise<UserAccount> {
    await this.delay(800);
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    
    if (users[username]) {
      throw new Error('اسم المستخدم موجود بالفعل!');
    }

    const newUser: UserAccount = {
      username,
      avatar,
      totalScore: 0,
      level: 1,
      wins: 0,
      gamesPlayed: 0
    };

    users[username] = { ...newUser, password };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newUser;
  }

  static async login(username: string, password: string, remember: boolean): Promise<UserAccount> {
    await this.delay(600);
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    const user = users[username];

    if (user && user.password === password) {
      const { password: _, ...userData } = user;
      if (remember) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
      }
      return userData as UserAccount;
    }
    
    throw new Error('خطأ في اسم المستخدم أو كلمة المرور');
  }

  static async logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  static async getSession(): Promise<UserAccount | null> {
    const saved = localStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  }

  static async updateUserStats(username: string, stats: Partial<UserAccount>): Promise<UserAccount> {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    if (!users[username]) throw new Error('User not found');

    const updatedUser = { ...users[username], ...stats };
    users[username] = updatedUser;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Update current session if applicable
    const current = await this.getSession();
    if (current && current.username === username) {
      const { password: _, ...sessionData } = updatedUser;
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    }

    const { password: _, ...userData } = updatedUser;
    return userData as UserAccount;
  }
}
