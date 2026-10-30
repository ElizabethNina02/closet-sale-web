import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field";
import { ScrollArea } from "@/components/ui/scroll-area";
import { productService } from "@/services/ProductService";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(true); // 💡 Estado para controlar la espera

  const navigate = useNavigate();
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        console.log("Producto cargado con éxito:", data);
        setProductDetail(data);
      } catch (error) {
        console.error(
          "Error cargando el producto:",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false); // Finaliza la carga tanto si fue exitosa como si falló
      }
    };

    fetchProduct();
  }, [id]);


  const handleSolicitarCompra = () => {
    const numeroTelefono = "51"+productDetail.whatsappNumber;
    // 1. Armamos el texto detallado
    const mensajeBase = `¡Hola! Estoy interesado en solicitar la compra de este producto: ${productDetail.product.titulo}`;

    const urlApi = new URL(`https://wa.me/${numeroTelefono}`);
    urlApi.searchParams.append("text", mensajeBase);
    window.open(urlApi.toString(), "_blank", "noopener,noreferrer");
  };

  // 🛡️ CONTROL DE SEGURIDAD 1: Si está cargando, muestra un mensaje temporal
  if (loading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center text-gray-500">
        Obteniendo información de la prenda...
      </div>
    );
  }

  // 🛡️ CONTROL DE SEGURIDAD 2: Si terminó de cargar pero no encontró el producto
  if (!productDetail) {
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
                    {productDetail.product.files.map((file, index) => (
                      <CarouselItem key={index} className="h-full">
                        <div className="p-1 h-full flex items-center justify-center">
                          {/* Forzamos a la tarjeta a expandirse al máximo ancho disponible conservando la relación cuadrada */}
                          <Card className="w-full max-w-[500px] md:max-w-[600px] aspect-square shadow-md overflow-hidden">
                            {/* Eliminamos los paddings internos (p-6) para que la imagen toque los bordes del Card */}
                            <CardContent className="flex items-center justify-center p-0 w-full h-full bg-slate-50 dark:bg-slate-900">
                              <img
                                className="w-full h-full object-cover"
                                src={file.url}
                                alt={`Imagen ${index + 1} de ${productDetail.nombre}`}
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
                    <FieldLegend>
                      <span className="text-2xl font-bold block uppercase">
                        {productDetail.product.titulo}
                      </span>
                    </FieldLegend>

                    <FieldLegend>S/{productDetail.product.precio}</FieldLegend>
                    <Badge
                      className={
                        {
                          DISPONIBLE:
                            "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
                          RESERVADO:
                            "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
                          VENDIDO:
                            "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
                        }[productDetail.product.estado] ||
                        "bg-gray-50 text-gray-700" // Clase por defecto
                      }
                    >
                      {productDetail.product.estado}
                    </Badge>

                    <FieldLegend>Descripción</FieldLegend>
                    <FieldDescription>
                      {productDetail.product.descripcion}
                    </FieldDescription>

                    <FieldLegend>Ubicación</FieldLegend>
                    <FieldDescription>
                      {productDetail.departmentName} /{" "}
                      {productDetail.provinceName} /{" "}
                      {productDetail.districtName}
                    </FieldDescription>

                    <FieldLegend>Vendido por</FieldLegend>
                    <FieldDescription className="flex items-center gap-3 mt-2">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage
                          src={productDetail.urlImage}
                          alt={`${productDetail.firstName} ${productDetail.lastName}`}
                        />
                      </Avatar>

                      <span className="font-medium text-foreground">
                        {productDetail.firstName} {productDetail.lastName}
                      </span>
                    </FieldDescription>

                    <FieldLegend>Número de Whatsapp</FieldLegend>
                    <FieldDescription>
                      +51 {productDetail.whatsappNumber}
                    </FieldDescription>
                  </FieldSet>
                </div>
              </ScrollArea>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => navigate(-1)} // 👈 Regresa exactamente a la página anterior
        >
          Volver
        </Button>
        <Button onClick={handleSolicitarCompra}>
          <svg
            xmlns="http://w3.org"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5 shrink-0"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>{" "}
          Solicitar Compra
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProductDetail;
