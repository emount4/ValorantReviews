// Константы и утилиты для аутентификации
export const API_BASE_URL = "http://localhost:8000";

// Функция для получения данных пользователя
export const fetchUserData = async (token) => {
  try {
    const res = await fetch(`${API_BASE_URL}/protected`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    
    if (res.ok) {
      const userData = await res.json();
      return { 
        success: true, 
        user: { email: userData.message.replace("Hello ", "") } 
      };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { success: false };
  }
};

// Функция для логина
export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ 
        username: email, 
        password: password 
      }).toString(),
    });
    
    if (res.ok) {
      const data = await res.json();
      return { success: true, token: data.access_token };
    } else {
      const errorData = await res.json();
      return { success: false, error: errorData.detail };
    }
  } catch (error) {
    return { success: false, "error": error };
  }
};

// Функция для регистрации
export const registerUser = async (username, email, password) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    
    if (res.ok) {
      return { success: true };
    } else {
      const errorData = await res.json();
      return { success: false, error: errorData.detail };
    }
  } catch (error) {
    return { success: false, "error":  error };
  }
};