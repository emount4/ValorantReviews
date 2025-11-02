import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("access_token");
    if (t) {
      setToken(t);
      setUser({ email: "user@example.com", username: "user" }); // Для демо
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:8000/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ 
          username: email, 
          password: password 
        }).toString(),
      });
      
      if (res.ok) {
        const data = await res.json();
        setToken(data.access_token);
        localStorage.setItem("access_token", data.access_token);
        setUser({ email, username: email.split('@')[0] });
        return { success: true };
      } else {
        let errorMessage = "Ошибка авторизации";
        try {
          const errorData = await res.json();
          // Обрабатываем разные форматы ошибок от FastAPI
          if (typeof errorData.detail === 'string') {
            errorMessage = errorData.detail;
          } else if (Array.isArray(errorData.detail)) {
            // Обрабатываем ошибки валидации Pydantic
            errorMessage = errorData.detail.map(err => 
              `${err.loc ? err.loc.join('.') + ': ' : ''}${err.msg}`
            ).join(', ');
          } else {
            errorMessage = JSON.stringify(errorData.detail);
          }
        } catch (e) {
          errorMessage = `HTTP error ${res.status}`;
        }
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password: password 
        }),
      });
      
      if (res.ok) {
        return { success: true };
      } else {
        let errorMessage = "Ошибка регистрации";
        try {
          const errorData = await res.json();
          console.log('Registration error response:', errorData); // Для отладки
          
          // Обрабатываем разные форматы ошибок от FastAPI
          if (typeof errorData.detail === 'string') {
            errorMessage = errorData.detail;
          } else if (Array.isArray(errorData.detail)) {
            // Обрабатываем ошибки валидации Pydantic
            errorMessage = errorData.detail.map(err => 
              `${err.loc ? err.loc.slice(1).join('.') + ': ' : ''}${err.msg}`
            ).join(', ');
          } else if (errorData.detail && typeof errorData.detail === 'object') {
            errorMessage = JSON.stringify(errorData.detail);
          } else {
            errorMessage = `HTTP error ${res.status}`;
          }
        } catch (e) {
          errorMessage = `HTTP error ${res.status}`;
        }
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Registration fetch error:', error);
      return { success: false, error: "Network error" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("access_token");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading,
      login, 
      logout, 
      register,
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};