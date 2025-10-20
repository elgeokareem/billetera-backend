type Credentials = { email: string; password: string };

export async function registerUser(data: Credentials) {
  // TODO: persist user & hash password
  return { ok: true, userId: 'u_123' };
}

export async function loginUser(data: Credentials) {
  // TODO: verify credentials against storage
  const valid = data.email === 'demo@example.com' && data.password === 'password123';
  if (!valid) return { ok: false };
  return { ok: true, sessionId: 'sess_abc' };
}

export async function getProfile(sessionId: string) {
  // TODO: lookup profile by sessionId
  return { userId: 'u_123', email: 'demo@example.com' };
}
