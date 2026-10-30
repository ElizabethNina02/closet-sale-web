import api from "./Api";

export const districtService = {
  // Get all categories usando tu cliente de Axios centralizado
  getDistrictsByProvinceId: async (id) => {
    const response = await api.get(`/districts/${id}`);
    return response.data; // Axios ya parsea el JSON automáticamente aquí
  },
};