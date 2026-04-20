export const jwtAuthService = {
  login: async (username: string) => {
    const response = await fetch('/api/auth/login-demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    return response.json();
  },
  
  getMe: async () => {
    const response = await fetch('/api/auth/me');
    if (!response.ok) throw new Error('Unauthorized');
    return response.json();
  },
};
