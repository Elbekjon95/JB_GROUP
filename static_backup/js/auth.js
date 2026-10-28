/**
 * UZW - Avtorizatsiya va Foydalanuvchi Sessiyasi Boshqaruvi
 */

const Auth = {
  getCurrentUser() {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  login(email, password) {
    const users = DataStore.getUsers();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const matched = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === cleanPass);
    if (matched) {
      const safeUser = {
        id: matched.id,
        email: matched.email,
        fullName: matched.fullName,
        role: matched.role,
        company: matched.company
      };
      this.setCurrentUser(safeUser);
      return { success: true, user: safeUser };
    }
    return { success: false, message: 'Elektron pochta yoki parol noto\'g\'ri!' };
  },

  register({ fullName, email, password, company, role }) {
    const users = DataStore.getUsers();
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !password || !fullName) {
      return { success: false, message: 'Iltimos, barcha majburiy maydonlarni to\'ldiring!' };
    }

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'Bu elektron pochta bilan allaqachon ro\'yxatdan o\'tilgan!' };
    }

    const newUser = {
      fullName: fullName.trim(),
      email: cleanEmail,
      password: password.trim(),
      company: company ? company.trim() : 'Mening Omborim',
      role: role || 'Ombor Menejeri'
    };

    const created = DataStore.addUser(newUser);
    const safeUser = {
      id: created.id,
      email: created.email,
      fullName: created.fullName,
      role: created.role,
      company: created.company
    };
    this.setCurrentUser(safeUser);
    return { success: true, user: safeUser };
  },

  logout() {
    this.setCurrentUser(null);
    window.location.reload();
  }
};
