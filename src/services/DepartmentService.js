import api from "./Api";

export const departmentService = {
  // Get all categories usando tu cliente de Axios centralizado
  getAllDepartments: async () => {
    const response = await api.get('/departments');
    return response.data; // Axios ya parsea el JSON automáticamente aquí
  },
};