import api from "./Api";

export const userService = {
  // Create a new product using your centralized Axios client
  registerUser: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
}