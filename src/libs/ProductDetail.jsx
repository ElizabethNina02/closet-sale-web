import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field";
import { ScrollArea } from "@/components/ui/scroll-area";
import { productService } from "@/services/ProductService";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ProductDetail() {
    const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // 💡 Estado para controlar la espera

  const navigate = useNavigate();
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return; 
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        console.log("Producto cargado con éxito:", data);
        setProduct(data);
      } catch (error) {
        console.error("Error cargando el producto:", error.response?.data || error.message);
      } finally {
        setLoading(false); // Finaliza la carga tanto si fue exitosa como si falló
      }
    };
  
    fetchProduct();
  }, [id]);

  // 🛡️ CONTROL DE SEGURIDAD 1: Si está cargando, muestra un mensaje temporal
  if (loading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center text-gray-500">
        Obteniendo información de la prenda...
      </div>
    );
  }

  // 🛡️ CONTROL DE SEGURIDAD 2: Si terminó de cargar pero no encontró el producto
  if (!product) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center text-red-500 font-medium">
        No se pudo encontrar el producto solicitado.
      </div>
    );
  }


  return (
    
    
    <Card className="h-[calc(100vh-8rem)] flex flex-col overflow-hidden">
        
        <CardContent className="h-full">
            <form className="h-full">
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 h-full">
                    
                    
                    <div className="w-full h-full md:col-span-8 flex items-center justify-center rounded-xl">
                        <div className="w-full max-w-[40rem] pr-12 pl-12">
                                <Carousel className="w-full h-full flex flex-col justify-center">
                                    <CarouselContent className="h-full">
                                        {product.files.map((file, index) => (
                                            <CarouselItem key={index} className="h-full">
                                                <div className="p-1 h-full flex items-center justify-center">
                                                    
                                                    {/* Forzamos a la tarjeta a expandirse al máximo ancho disponible conservando la relación cuadrada */}
                                                    <Card className="w-full max-w-[500px] md:max-w-[600px] aspect-square shadow-md overflow-hidden">
                                                        {/* Eliminamos los paddings internos (p-6) para que la imagen toque los bordes del Card */}
                                                        <CardContent className="flex items-center justify-center p-0 w-full h-full bg-slate-50 dark:bg-slate-900">
                                                            <img
                                                                className="w-full h-full object-cover"
                                                                src={file.url}
                                                                alt={`Imagen ${index + 1} de ${product.nombre}`}
                                                            />
                                                        </CardContent>
                                                    </Card>

                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    
                                    {/* Controles de navegación */}
                                    <CarouselPrevious className="hidden sm:inline-flex" />
                                    <CarouselNext className="hidden sm:inline-flex" />
                                </Carousel>
                        </div>
                    </div>


                    <div className="space-y-4 h-full md:col-span-4 rounded-xl p-4">
                        <ScrollArea className="h-full w-full">
                            <div className="p-4">
                            <FieldSet>
                                    <FieldLegend>{product.titulo}</FieldLegend>
                                    
                                    <FieldLegend>S/{product.precio}</FieldLegend>
                                    <Badge>{product.estado}</Badge>
                                    
                                    <FieldLegend>Descripción</FieldLegend>
                                    <FieldDescription>
                                    {product.descripcion}
                                    </FieldDescription>
                                </FieldSet> 

                            </div>
                        </ScrollArea>
                        
                    </div>

                </div>
            </form>
        </CardContent>
        <CardFooter className="justify-end gap-2">
            
        <Button variant="outline"  onClick={() => navigate(-1)} // 👈 Regresa exactamente a la página anterior
               >Decline</Button>
            <Button>Solicitar Compra</Button>
        </CardFooter>
    </Card>

  );
}

export default ProductDetail;