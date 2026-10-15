const API_URL = "http://localhost:8080/api/auth"; // URL de tu Spring Boot

export const loginService = async (username, password) => {
  const response = await fetch(`${API_URL}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Credenciales incorrectas");
  }

  // Spring Boot debe devolver un objeto como: { token: "eyJhbGci...", username: "..." }
  return await response.json();
};
