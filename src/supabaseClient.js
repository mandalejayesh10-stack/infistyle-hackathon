const BACKEND_URL = 'http://localhost:3000';

let isMockMode = false;

// Mock database in localStorage to maintain simulation state when offline
const getMockProfilesDb = () => {
  const db = localStorage.getItem('sb_mock_profiles_db');
  if (db) return JSON.parse(db);
  const initialDb = {
    'admin@infistyle.com': {
      id: 'admin-uuid-1111',
      name: 'InfiStyle Admin',
      email: 'admin@infistyle.com',
      phone: '9999999999',
      role: 'admin',
      company_name: 'InfiStyle Corporate',
      gstin: '27INFIS7777E1Z5',
      billing_address: 'BKC G-Block, Mumbai, Maharashtra - 400051',
      shipping_address: 'BKC G-Block, Mumbai, Maharashtra - 400051',
      created_at: new Date().toISOString()
    },
    'jayesh@acme.com': {
      id: 'jayesh-uuid-4444',
      name: 'Jayesh Sharma',
      email: 'jayesh@acme.com',
      phone: '9876543210',
      role: 'customer',
      company_name: 'Acme Corp',
      gstin: '27ACME1234F1Z1',
      billing_address: 'Nariman Point, Mumbai',
      shipping_address: 'Nariman Point, Mumbai',
      created_at: new Date().toISOString()
    }
  };
  localStorage.setItem('sb_mock_profiles_db', JSON.stringify(initialDb));
  return initialDb;
};

const saveMockProfile = (email, data) => {
  const db = getMockProfilesDb();
  db[email] = { ...db[email], ...data };
  localStorage.setItem('sb_mock_profiles_db', JSON.stringify(db));
};

// Active listeners for auth state changes
const listeners = new Set();
const notifyChange = (event, session) => {
  listeners.forEach(cb => cb(event, session));
};

const attemptTokenRefresh = async () => {
  const refreshToken = localStorage.getItem('infistyle_refresh_token');
  if (!refreshToken) return false;
  
  try {
    const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('infistyle_access_token', data.access_token);
      localStorage.setItem('infistyle_refresh_token', data.refresh_token);
      return true;
    }
  } catch (e) {
    console.error('Failed to refresh tokens:', e);
  }
  
  localStorage.removeItem('infistyle_access_token');
  localStorage.removeItem('infistyle_refresh_token');
  return false;
};

const backendFetch = async (path, options = {}) => {
  const accessToken = localStorage.getItem('infistyle_access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      ...options,
      headers,
    });
    
    if (res.status === 401 && path !== '/auth/login' && path !== '/auth/refresh') {
      const refreshSuccess = await attemptTokenRefresh();
      if (refreshSuccess) {
        const newAccessToken = localStorage.getItem('infistyle_access_token');
        headers['Authorization'] = `Bearer ${newAccessToken}`;
        return fetch(`${BACKEND_URL}${path}`, {
          ...options,
          headers,
        });
      }
    }
    
    return res;
  } catch (err) {
    console.warn(`⚠️ NestJS backend offline or unreachable at ${BACKEND_URL}. Using LOCAL MOCK SIMULATOR.`);
    isMockMode = true;
    throw err;
  }
};

// Mock fallback runners
const runMockSignUp = (email, password, options) => {
  const db = getMockProfilesDb();
  if (db[email]) {
    return { data: { user: null }, error: { message: 'User already exists' } };
  }
  const newUser = {
    id: 'user-' + Math.random().toString(36).substring(2, 10),
    email,
    name: options?.data?.name || email.split('@')[0],
    role: 'customer',
    created_at: new Date().toISOString()
  };
  saveMockProfile(email, newUser);
  return { data: { user: newUser, session: null }, error: null };
};

const runMockSignIn = (email, password) => {
  const db = getMockProfilesDb();
  const profile = db[email];
  if (!profile) {
    return { data: { user: null, session: null }, error: { message: 'Invalid login credentials' } };
  }
  const session = {
    access_token: 'mock_token_' + Math.random().toString(36).substring(2),
    user: profile
  };
  localStorage.setItem('infistyle_access_token', session.access_token);
  notifyChange('SIGNED_IN', session);
  return { data: { user: profile, session }, error: null };
};

const runMockOAuthSignIn = () => {
  const email = 'google-user@gmail.com';
  const db = getMockProfilesDb();
  let profile = db[email];
  if (!profile) {
    profile = {
      id: 'google-uuid-' + Math.random().toString(36).substring(2, 10),
      name: 'Google User',
      email,
      phone: '',
      role: 'customer',
      created_at: new Date().toISOString()
    };
    saveMockProfile(email, profile);
  }
  const session = {
    access_token: 'mock_google_token_' + Math.random().toString(36).substring(2),
    user: profile
  };
  localStorage.setItem('infistyle_access_token', session.access_token);
  notifyChange('SIGNED_IN', session);
  return { data: { url: window.location.href }, error: null };
};

const supabase = {
  auth: {
    getSession: async () => {
      const token = localStorage.getItem('infistyle_access_token');
      if (!token) return { data: { session: null }, error: null };
      
      if (isMockMode) {
        const db = getMockProfilesDb();
        const firstUser = Object.values(db)[0];
        return { data: { session: { access_token: token, user: firstUser } }, error: null };
      }

      try {
        const res = await backendFetch('/users/me');
        if (res.ok) {
          const user = await res.json();
          return { data: { session: { access_token: token, user } }, error: null };
        }
      } catch (e) {
        // Fallback
        const db = getMockProfilesDb();
        const user = Object.values(db).find(u => token.includes(u.id)) || Object.values(db)[0];
        return { data: { session: { access_token: token, user } }, error: null };
      }
      return { data: { session: null }, error: null };
    },

    signUp: async ({ email, password, options }) => {
      if (isMockMode) return runMockSignUp(email, password, options);
      try {
        const res = await backendFetch('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            email,
            name: options?.data?.name || email.split('@')[0],
            passwordHash: password,
          }),
        });
        if (!res.ok) {
          const errData = await res.json();
          return { data: { user: null }, error: { message: errData.message || 'Signup failed' } };
        }
        const data = await res.json();
        localStorage.setItem('infistyle_access_token', data.access_token);
        localStorage.setItem('infistyle_refresh_token', data.refresh_token);
        notifyChange('SIGNED_IN', { user: data.user, access_token: data.access_token });
        return { data: { user: data.user, session: data }, error: null };
      } catch (e) {
        return runMockSignUp(email, password, options);
      }
    },

    signInWithPassword: async ({ email, password }) => {
      if (isMockMode) return runMockSignIn(email, password);
      try {
        const res = await backendFetch('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, passwordHash: password }),
        });
        if (!res.ok) {
          const errData = await res.json();
          return { data: { user: null, session: null }, error: { message: errData.message || 'Login failed' } };
        }
        const data = await res.json();
        localStorage.setItem('infistyle_access_token', data.access_token);
        localStorage.setItem('infistyle_refresh_token', data.refresh_token);
        notifyChange('SIGNED_IN', { user: data.user, access_token: data.access_token });
        return { data: { user: data.user, session: data }, error: null };
      } catch (e) {
        return runMockSignIn(email, password);
      }
    },

    signInWithOAuth: async ({ provider }) => {
      if (isMockMode) return runMockOAuthSignIn();
      try {
        const res = await backendFetch('/auth/google-simulated', {
          method: 'POST',
          body: JSON.stringify({}),
        });
        if (!res.ok) {
          const errData = await res.json();
          return { error: { message: errData.message || 'Google OAuth failed' } };
        }
        const data = await res.json();
        localStorage.setItem('infistyle_access_token', data.access_token);
        localStorage.setItem('infistyle_refresh_token', data.refresh_token);
        notifyChange('SIGNED_IN', { user: data.user, access_token: data.access_token });
        return { data: { url: window.location.href }, error: null };
      } catch (e) {
        return runMockOAuthSignIn();
      }
    },

    resetPasswordForEmail: async (email) => {
      if (isMockMode) return { data: {}, error: null };
      try {
        const res = await backendFetch('/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ email }),
        });
        if (!res.ok) {
          const errData = await res.json();
          return { error: { message: errData.message || 'Forgot password request failed' } };
        }
        return { data: {}, error: null };
      } catch (e) {
        return { data: {}, error: null };
      }
    },

    updateUser: async ({ password }) => {
      if (isMockMode) return { data: {}, error: null };
      try {
        // Find token from URL search params
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token') || 'simulatedToken';
        const res = await backendFetch('/auth/reset-password', {
          method: 'POST',
          body: JSON.stringify({ token, passwordHash: password }),
        });
        if (!res.ok) {
          const errData = await res.json();
          return { error: { message: errData.message || 'Reset password failed' } };
        }
        return { data: {}, error: null };
      } catch (e) {
        return { data: {}, error: null };
      }
    },

    signOut: async () => {
      const refreshToken = localStorage.getItem('infistyle_refresh_token');
      if (!isMockMode) {
        await backendFetch('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refresh_token: refreshToken }),
        }).catch(() => {});
      }
      localStorage.removeItem('infistyle_access_token');
      localStorage.removeItem('infistyle_refresh_token');
      notifyChange('SIGNED_OUT', null);
      return { error: null };
    },

    onAuthStateChange: (cb) => {
      listeners.add(cb);
      // Retrieve session on registration
      supabase.auth.getSession().then(({ data: { session } }) => {
        cb(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
      });
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              listeners.delete(cb);
            }
          }
        }
      };
    }
  },
  
  from: (table) => {
    return {
      select: (columns) => {
        return {
          eq: (col, val) => {
            return {
              single: async () => {
                if (table === 'profiles') {
                  if (isMockMode) {
                    const db = getMockProfilesDb();
                    const profile = Object.values(db).find(p => p.id === val || p.email === val);
                    return { data: profile || null, error: profile ? null : { message: 'Not found' } };
                  }
                  try {
                    const res = await backendFetch('/users/me');
                    if (res.ok) {
                      const user = await res.json();
                      return { data: user, error: null };
                    }
                  } catch (e) {
                    const db = getMockProfilesDb();
                    const profile = Object.values(db).find(p => p.id === val || p.email === val);
                    return { data: profile || null, error: null };
                  }
                }
                return { data: null, error: { message: 'Not found' } };
              },
              then: async (resolve) => {
                // Return matching profile lists
                if (table === 'profiles') {
                  if (isMockMode) {
                    const db = getMockProfilesDb();
                    const list = Object.values(db).filter(p => p[col] === val);
                    resolve({ data: list, error: null });
                    return;
                  }
                  try {
                    const res = await backendFetch('/admin/users');
                    if (res.ok) {
                      const list = await res.json();
                      resolve({ data: list.filter(u => u[col] === val), error: null });
                      return;
                    }
                  } catch (e) {
                    const db = getMockProfilesDb();
                    const list = Object.values(db).filter(p => p[col] === val);
                    resolve({ data: list, error: null });
                  }
                }
                resolve({ data: [], error: null });
              }
            };
          },
          then: async (resolve) => {
            if (table === 'profiles') {
              if (isMockMode) {
                const db = getMockProfilesDb();
                resolve({ data: Object.values(db), error: null });
                return;
              }
              try {
                const res = await backendFetch('/admin/users');
                if (res.ok) {
                  const list = await res.json();
                  resolve({ data: list, error: null });
                  return;
                }
              } catch (e) {
                const db = getMockProfilesDb();
                resolve({ data: Object.values(db), error: null });
              }
            }
            resolve({ data: [], error: null });
          }
        };
      },
      update: (updateData) => {
        return {
          eq: (col, val) => ({
            select: () => ({
              single: async () => {
                if (table === 'profiles') {
                  if (isMockMode) {
                    const db = getMockProfilesDb();
                    const key = Object.keys(db).find(k => db[k].id === val || db[k].email === val);
                    if (key) {
                      db[key] = { ...db[key], ...updateData };
                      localStorage.setItem('sb_mock_profiles_db', JSON.stringify(db));
                      return { data: db[key], error: null };
                    }
                    return { data: null, error: { message: 'Not found' } };
                  }
                  
                  try {
                    // Check if it's admin role/status update or standard profile update
                    if (updateData.role !== undefined) {
                      const res = await backendFetch(`/admin/users/${val}/role`, {
                        method: 'PATCH',
                        body: JSON.stringify({ role: updateData.role }),
                      });
                      if (res.ok) return { data: await res.json(), error: null };
                    } else if (updateData.is_disabled !== undefined) {
                      const res = await backendFetch(`/admin/users/${val}/status`, {
                        method: 'PATCH',
                        body: JSON.stringify({ is_disabled: updateData.is_disabled }),
                      });
                      if (res.ok) return { data: await res.json(), error: null };
                    } else {
                      // Map frontend camelcase names to backend schema fields
                      const backendData = {
                        name: updateData.name,
                        phone: updateData.phone,
                        companyName: updateData.company_name,
                        gstin: updateData.gstin,
                        billingAddress: updateData.billing_address,
                        shippingAddress: updateData.shipping_address,
                        profilePhoto: updateData.profile_photo,
                      };
                      const res = await backendFetch('/users/profile', {
                        method: 'PUT',
                        body: JSON.stringify(backendData),
                      });
                      if (res.ok) {
                        const updated = await res.json();
                        return { data: updated, error: null };
                      }
                    }
                  } catch (e) {
                    const db = getMockProfilesDb();
                    const key = Object.keys(db).find(k => db[k].id === val || db[k].email === val);
                    if (key) {
                      db[key] = { ...db[key], ...updateData };
                      localStorage.setItem('sb_mock_profiles_db', JSON.stringify(db));
                      return { data: db[key], error: null };
                    }
                  }
                }
                return { data: null, error: { message: 'Failed to update' } };
              }
            })
          })
        };
      }
    };
  }
};

export { supabase };
