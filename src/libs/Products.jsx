import { useState } from "react";
import { DialogDemo } from "@/components/ModalProductCreate";

function Products() {
  // Datos de ejemplo adaptados a tu closet sale
  const [products] = useState([
    { 
      id: 1, 
      name: "Vestido de Noche Negro", 
      price: 45.00, 
      description: "San Isidro, Lima",
      image: "https://hmperu.vtexassets.com/unsafe/1440x0/center/middle/https%3A%2F%2Fhmperu.vtexassets.com%2Fassets%2Fvtex.file-manager-graphql%2Fimages%2Faadf9280-b72d-4280-834d-38b942128bbd___f496300d666b0df74dcc29fc8c510148.jpg",
      tags: ["#vestidos", "#elegante", "#oferta"]
    },
    { 
      id: 2, 
      name: "Casaca de Cuero Vintage", 
      price: 75.00, 
      description: "Los Olivos, Lima",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZOdJSI0vqcLAfxjprJ9F2GbO5I2v-36pC_xXAz1ilT4oFAR8rL0xf0Q0M&s=10",
      tags: ["#casacas", "#vintage", "#cuero"]
    },
    { 
      id: 3, 
      name: "Zapatos de Tacón Rojo", 
      price: 35.00, 
      description: "Callao, Perú",
      image: "https://image.hm.com/assets/hm/b6/25/b625c3a006899dce16f451b43c5dad3ef9328670.jpg",
      tags: ["#calzado", "#tacones", "#rojo"]
    },
  ]);

  
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

        <button className="mt-4 sm:mt-0 bg-violet-700 hover:bg-violet-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-xs"
         >
          + Agregar prenda
        </button>
        <DialogDemo />
      </div>
    
      {/* Grid contenedor que renderiza tus tarjetas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {products.map((product) => (
          /* Tu tarjeta personalizada adaptada a React y Tailwind v4 */
          <div 
            key={product.id} 
            className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col justify-between"
          >
            <div>
              {/* Imagen del Producto */}
              <div className="w-full p-4">
                <img 
                  className="w-full aspect-square object-cover" 
                  src={product.image} 
                  alt={product.name} 
                />
              </div>

              
              {/* Contenido de la Tarjeta */}
              <div className="px-6 p-4 pt-0">
                  <span className="font-extrabold text-lg text-indigo-600 dark:text-indigo-400">
                    ${product.price.toFixed(2)}
                  </span>
                  <div className="flex justify-between items-center mb-2">
                  <div className="font-bold text-xl text-slate-800 dark:text-slate-100">
                    {product.name}
                  </div>
                  
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-base">
                  {product.description}
                </p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
