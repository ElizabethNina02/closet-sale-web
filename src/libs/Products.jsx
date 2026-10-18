import { useEffect, useState } from "react";
import { ModalProductCreate } from "@/components/ModalProductCreate";
import { Spinner } from "@/components/ui/spinner";
import { productService } from "@/services/ProductService";
import { ModalProductEdit } from "@/components/ModalProductEdit";

function Products() {
  
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedProductId, setSelectedProductId] = useState(null);

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);
useEffect(() => {
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      
      setProducts(data);
    } catch (error) {
      // Axios guarda la respuesta del servidor en error.response
      console.error("Error cargando productos desde el servidor:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchCategories();
}, []);

  return (
    <div className="space-y-6">
      {/* Encabezado de la página */}
      <div className="sm:flex sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
            Mis Productos 👗
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Gestiona las prendas disponibles en tu closet sale.
          </p>
        </div>

        <ModalProductCreate />
      </div>
    
      {/* Grid contenedor que renderiza tus tarjetas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {products.map((product) => (
          /* Tu tarjeta personalizada adaptada a React y Tailwind v4 */
          <div 
            key={product.id} onClick={() => {
              setSelectedProductId(product.id);  // Guardamos la info del producto para el formulario
              setIsModalOpen(true);        // Abrimos el modal instantáneamente
            }}
            className="max-w-sm hover:underline cursor-pointer rounded-xl overflow-hidden shadow-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col justify-between"
          >
            <div>
              {/* Imagen del Producto */}
              <div className="w-full p-4">
                <img 
                  className="w-full aspect-square object-cover" 
                   src={product.files[0]?.url} 
                  alt={product.files[0]?.order} 
                />
              </div>

              
              {/* Contenido de la Tarjeta */}
              <div className="px-6 p-4 pt-0">
                  <span className="font-extrabold text-lg text-indigo-600 dark:text-indigo-400">
                    ${product.precio.toFixed(2)}
                  </span>
                  <div className="flex justify-between items-center mb-2">
                  <div className="font-bold text-xl text-slate-800 dark:text-slate-100">
                    {product.titulo}
                  </div>
                  
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-base">
                  {product.descripcion}
                </p>
              </div>
            </div>
            </div>
        ))}
        <ModalProductEdit 
          open={isModalOpen} 
          onOpenChange={(isOpen) => {
            setIsModalOpen(isOpen);
            if (!isOpen) setSelectedProductId(null); // Al cerrar, limpiamos el ID
          }} 
          productId={selectedProductId} 
        />
        
        <div className="flex items-center gap-4">
          {loading && <Spinner />}
        </div>
      </div>

    </div>
  );
}

export default Products;
