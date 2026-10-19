import api from "./Api";

export const productService = {
  // Create a new product using your centralized Axios client
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  getAllProducts: async () => {
    const response = await api.get('/products');
    return response.data; // Axios ya parsea el JSON automáticamente aquí
  },


  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  deleteProductById: async (id) =>{
    const response = await api.delete(`/products/${id}`);
    return response;
  }
};