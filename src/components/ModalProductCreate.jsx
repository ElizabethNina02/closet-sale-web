import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field"; // Añadido FieldLabel si es necesario
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { useForm } from "react-hook-form";
import { Textarea } from "./ui/textarea";
import { useEffect, useState } from "react";
import { categoryService } from "@/services/CategoryService";
import { productService } from "@/services/ProductService";
import { Attachment, AttachmentAction, AttachmentActions, AttachmentGroup, AttachmentMedia, AttachmentTrigger } from "./ui/attachment";
import { XIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "./ui/input-group";
import { ScrollArea } from "./ui/scroll-area";
import { uploadMultipleImagesAndGetUrls } from "@/services/StorageService";


export function ModalProductCreate() {
    const { 
    register, 
    handleSubmit,
  setValue,    // <-- Agrega esto para actualizar valores manualmente
  getValues, 
    formState: { errors }, // Agregamos isSubmitting para controlar el botón
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      vendedorId: 1,
      titulo: '',
      condicion: '',
      precio: 0.0,
      estado: '',
      categoriaId: ''
    }
  });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
// Registramos el campo manualmente al iniciar el componente
useEffect(() => {
  register("condicion", { required: "La condición es obligatoria" });
}, [register]);
   // 4. useEffect para llamar a la API cuando el componente se cargue
  useEffect(() => {
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      
      const formattedCategories = data.map((category) => ({
        label: category.nombre, 
        value: String(category.id)
      }));

      setCategories(formattedCategories);
    } catch (error) {
      // Axios guarda la respuesta del servidor en error.response
      console.error("Error cargando categorías desde el servidor:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchCategories();
}, []);
  // Estado para acumular todos los archivos cargados
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
  const files = e.target.files;
  if (files && files.length > 0) {
    const newFilesArray = Array.from(files);

    setSelectedFiles((prevFiles) => {
      // Filtramos duplicados por nombre y tamaño para no repetir
      const filteredNewFiles = newFilesArray.filter(
        (newFile) => !prevFiles.some((f) => f.name === newFile.name && f.size === newFile.size)
      );

      // Mapeamos los archivos inyectándoles la URL de previsualización local
      const filesWithPreviews = filteredNewFiles.map((file) => {
        // Generamos un objeto personalizado que hereda del archivo nativo
        return Object.assign(file, {
          previewUrl: URL.createObjectURL(file), // <-- El enlace virtual para el src
          meta: `${(file.size / 1024).toFixed(1)} KB` // Metadata automática para tu AttachmentDescription
        });
      });

      return [...prevFiles, ...filesWithPreviews];
    });

    e.target.value = ""; // Limpiamos el input
  }
};

  // Función para remover un archivo específico del listado acumulado
  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };



const handlePrecioChange = (e) => {
  const value = e.target.value;
  const regex = /^\d*(\.\d{0,2})?$/;

  // Si cumple la regla o está vacío, actualizamos el valor en React Hook Form
  if (regex.test(value) || value === "") {
    setValue("precio", value); // <-- Reemplaza setProductData
  }
};

const handleBlur = () => {
  const currentPrecio = getValues("precio"); // <-- Reemplaza productData.precio

  if (currentPrecio && !isNaN(currentPrecio)) {
    // Formateamos a dos decimales y actualizamos el formulario
    setValue("precio", parseFloat(currentPrecio).toFixed(2));
  }
};

  const condiciones = [
    { label: "Nuevo", value: "NUEVO" },
    { label: "Como nuevo", value: "USADO_COMO_NUEVO" },
    { label: "Buen estado", value: "BUEN_ESTADO" }
  ]


  const estados = [
    { label: "Disponible", value: "DISPONIBLE" },
    { label: "Reservado", value: "RESERVADO" },
    { label: "Vendido", value: "VENDIDO" }
  ]


   // 2. Esta función recibe los datos limpios y validados automáticamente
  const onSubmit = async (data) => {
      alert('¡Cambios guardados con éxito!');
    try {
        console.log(data);
        const urlsDeImagenesPublicas = await uploadMultipleImagesAndGetUrls(selectedFiles, 'productos');
        const arregloDeFiles = urlsDeImagenesPublicas.map((url, index) => ({
          url: url,
          order: index // El primer archivo tendrá 0, el segundo 1, etc.
        }));
        data.files=arregloDeFiles;
        const newProduct = await productService.createProduct(data);
      console.log('Producto creado:', newProduct);
      alert('¡Cambios guardados con éxito!');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Hubo un error al guardar los cambios.');
    }
  };

  return (
    <Dialog>
        <DialogTrigger render={<Button className="mt-4 sm:mt-0 bg-violet-700 hover:bg-violet-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-xs">+ Agregar artículo</Button>} />
        <DialogContent className="max-w-[95vw] md:max-w-5/6 max-h-[99vh]">
        <form  id="product-form" onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Añadir artículo
            </DialogTitle>
            <DialogDescription>
              Llena los campos a continuación para agregar un nuevo artículo a tu closet sale. Todos los campos son obligatorios, y puedes subir múltiples imágenes para mostrar tu prenda de la mejor manera posible.
            </DialogDescription>
          </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
                {/* --- COLUMNA IZQUIERDA --- */}



                <div className="space-y-4  overflow-y-auto max-h-[70vh]">
                <ScrollArea className="h-full w-full">
                    <div className="p-4">
                        <FieldGroup>
                                    <Field>
                                    <FieldLabel htmlFor="name">Nombre del artículo</FieldLabel>
                                    <Input 
                                            id="name" 
                                            placeholder="Ej: Casaca de mezclilla Levi's"
                                            {...register("titulo", { required: "El nombre es obligatorio" })}
                                            aria-invalid={errors.titulo ? "true" : "false"}
                                        />

                                        {errors.titulo && (
                                            <p className="text-red-500 text-xs mt-1 transition-colors">
                                            {errors.titulo.message}
                                            </p>
                                        )}
                                    </Field>
                                    
                                    <Field>
                                        <FieldLabel htmlFor="descripcion">Descripción</FieldLabel>
                                        <Textarea
                                            id="descripcion"
                                            placeholder="Describe la prenda..."
                                            {...register("descripcion", { required: "La descripción es obligatoria" })}
                                            aria-invalid={errors.descripcion ? "true" : "false"}
                                        />
                                        {errors.descripcion && (
                                            <p className="text-red-500 text-xs mt-1 transition-colors">
                                            {errors.descripcion.message}
                                            </p>
                                        )}
                                    </Field>

                                    {/* 5. Reemplazamos las frutas por tus Categorías dinámicas */}
                                    <Field>
                                        <Label htmlFor="category-select">Categoría</Label>
                                        <Select items={categories}   onValueChange={(value) => setValue("categoriaId", value, { shouldValidate: true })}>
                                        <SelectTrigger id="category-select" className="w-full">
                                            <SelectValue placeholder={loading ? "Cargando categorías..." : "Selecciona una categoría"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                            <SelectLabel>Categorías disponibles</SelectLabel>
                                            {categories.map((category) => (
                                                <SelectItem key={category.value} value={category.value}>
                                                {category.label}
                                                </SelectItem>
                                            ))}
                                            </SelectGroup>
                                        </SelectContent>
                                        </Select>
                                    </Field>
                                    <Field>
                                        <Label htmlFor="category-select">Precio</Label>
                                        <InputGroup>
                                            <InputGroupAddon>
                                            <InputGroupText>S/</InputGroupText>
                                            </InputGroupAddon>
                                            <InputGroupInput 
                                                id="precio-input"
                                                type="text" // Usamos 'text' para que el control de la RegEx sea 100% estricto e inmediato
                                                inputMode="decimal" // Muestra el teclado numérico con punto en celulares
                                                placeholder="0.00" 
                                                onChange={handlePrecioChange}
                                                onBlur={handleBlur}
                                                />
                                            <InputGroupAddon align="inline-end">
                                            <InputGroupText>PEN</InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </Field>

                                    <Field>
                                        <Label htmlFor="category-select">Condición</Label>
                                        <Select items={condiciones}  onValueChange={(value) => setValue("condicion", value, { shouldValidate: true })}>
                                        <SelectTrigger id="category-select" className="w-full">
                                            <SelectValue placeholder={ "Selecciona una condición"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                            <SelectLabel>Condiciones disponibles</SelectLabel>
                                            {condiciones.map((condicion) => (
                                                <SelectItem key={condicion.value} value={condicion.value}>
                                                {condicion.label}
                                                </SelectItem>
                                            ))}
                                            </SelectGroup>
                                        </SelectContent>
                                        </Select>
                                    </Field>


                                    <Field>
                                        <Label htmlFor="category-select">Estado</Label>
                                        <Select items={estados}  onValueChange={(value) => setValue("estado", value, { shouldValidate: true })}>
                                        <SelectTrigger id="category-select" className="w-full">
                                            <SelectValue placeholder={ "Selecciona un estado"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                            <SelectLabel>Estados disponibles</SelectLabel>
                                            {estados.map((estado) => (
                                                <SelectItem key={estado.value} value={estado.value}>
                                                {estado.label}
                                                </SelectItem>
                                            ))}
                                            </SelectGroup>
                                        </SelectContent>
                                        </Select>
                                    </Field>
                                    
                                </FieldGroup>
                    </div>
                    </ScrollArea>
             
                </div>

                {/* --- COLUMNA DERECHA --- */}
                <div className="space-y-4">
                
                <FieldGroup className="p-4">
                <Field>
                        <FieldLabel htmlFor="picture">Imagenes</FieldLabel>
                        
                        {/* Input con múltiples archivos habilitado */}
                        <Input 
                        id="picture" 
                        type="file" 
                        multiple 
                        onChange={handleFileChange} 
                        />
                        
                        <FieldDescription>Cada vez que selecciones archivos, se sumarán a la lista de abajo.</FieldDescription>
                    </Field>

                    <AttachmentGroup className="w-full scrollbar-auto overflow-auto" orientation="horizontal">
                        {selectedFiles.map((image, index) => (
                        <Attachment key={`${image.name}-${index}`} orientation="vertical" className="size-60">
                            <AttachmentMedia variant="image">
                            {/* Usamos previewUrl que contiene el Blob local */}
                            <img 
                                src={image.previewUrl} 
                                alt={image.name} 
                                className="object-cover w-full h-full" 
                            />
                            </AttachmentMedia>
                            
                            <AttachmentActions>
                            {/* Agregamos el evento onClick para remover el elemento de la lista */}
                            <AttachmentAction 
                                aria-label={`Remove ${image.name}`}
                                onClick={() => handleRemoveFile(index)} 
                            >
                                <XIcon />
                            </AttachmentAction>
                            </AttachmentActions>
                            
                            <AttachmentTrigger
                            render={
                                <a
                                href={image.previewUrl}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`Open ${image.name}`}
                                />
                            }
                            />
                        </Attachment>
                        ))}
                    </AttachmentGroup>
                </FieldGroup>
                </div>

            </div>
            

          
         
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button form="product-form"  type="submit" className="bg-violet-700 hover:bg-violet-800">
              Save changes
            </Button>
          </DialogFooter>
        </form>
        </DialogContent>
      
    </Dialog>
  )
}
