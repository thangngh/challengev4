import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/authContext';
import { parseJwt } from '../lib/token';
import { getLocalStorage, removeLocalStorage } from '../lib/localstorage';

export const useAuth = () => {
  const authContext = React.useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { auth, setAuth } = authContext;

  useEffect(() => {
    const accessToken = getLocalStorage('access_token');
    const expiredToken = getLocalStorage('access_token_expired') as string;
    if (accessToken) {
      const parsedToken = parseJwt(accessToken).isExpired; // Parse the token
      if (!parsedToken) {
        const { username, userId } = parseJwt(accessToken).body;
        setAuth({
          token: accessToken,
          expired: +expiredToken,
          user: { username, userId },
        });
      } else {
        const tokenExpiryTimer = setTimeout(() => {
          setAuth({
            token: null,
            expired: null,
            user: null,
          });

          removeLocalStorage('access_token');
          removeLocalStorage('access_token_expired');

          navigate('/login');
        }, 500);

        return () => clearTimeout(tokenExpiryTimer);
      }
    } else {
      setAuth({
        token: null,
        expired: null,
        user: null,
      });

      removeLocalStorage('access_token');
      removeLocalStorage('access_token_expired');
    }
  }, [setAuth, navigate]);

  return {
    auth,
    isAuthenticated: !!auth.token,
  };
};
