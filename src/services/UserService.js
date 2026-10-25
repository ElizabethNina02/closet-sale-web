import api from "./Api";

export const userService = {
  // Create a new product using your centralized Axios client
  registerUser: async (userData) => {
    console.log('rreer')
    const response = await api.post('/auth/register', userData);
    return await response.data;
  },
}