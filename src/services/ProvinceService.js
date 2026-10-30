import api from "./Api";

export const provinceService = {
  // Get all categories usando tu cliente de Axios centralizado
  getProvincesByDepartmentId: async (id) => {
    const response = await api.get(`/provinces/${id}`);
    return response.data; // Axios ya parsea el JSON automáticamente aquí
  },
};