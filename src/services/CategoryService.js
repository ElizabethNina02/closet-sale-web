import api from "./Api";

export const categoryService = {
  // Get all categories usando tu cliente de Axios centralizado
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data; // Axios ya parsea el JSON automáticamente aquí
  },
};