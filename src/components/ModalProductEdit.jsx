import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field"; // Añadido FieldLabel si es necesario
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { Controller, useForm } from "react-hook-form";
import { Textarea } from "./ui/textarea";
import { useEffect, useState } from "react";
import { categoryService } from "@/services/CategoryService";
import { productService } from "@/services/ProductService";
import { Attachment, AttachmentAction, AttachmentActions, AttachmentGroup, AttachmentMedia, AttachmentTrigger } from "./ui/attachment";
import { XIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "./ui/input-group";
import { ScrollArea } from "./ui/scroll-area";
import { deleteMultipleImages, uploadMultipleImagesAndGetUrls } from "@/services/StorageService";
import { useAuth } from "@/context/AuthContext";


export function ModalProductEdit({ open, onOpenChange,productId,onRefresh }) {
    
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [originalSelectedFiles, setoriginalSelectedFiles] = useState([]);
    
    const { user } = useAuth();  

    const { 
       register, 
        handleSubmit,
        reset,
        control, // 🔑 Extrae el objeto 'control' aquí
        setValue,
        formState: { errors },  // Agregamos isSubmitting para controlar el botón
    } = useForm({
      mode: "onBlur",
      defaultValues: {
        vendedorId: user.id,
        titulo: '',
        condicion: '',
        descripcion: '', // 👈 DEBES AGREGARLA AQUÍ
        precio: 0.00,
        estado: '',
        categoriaId: ''
      }
    });

   useEffect(() => {
    const fetchProductDetails = async () => {
        console.log("Modal abierto:", open, "ID del producto:", productId);
      if (!open || !productId) return; // Si el modal está cerrado o no hay ID, NO HACE NADA

      try {
        setLoading(true);
        // La petición a Spring Boot se ejecuta JUSTO AQUÍ al hacer clic
        const data = await productService.getProductById(productId);
        setoriginalSelectedFiles(data.files);
        setSelectedFiles(data.files);
        const precioFormateado = data.precio ? parseFloat(data.precio).toFixed(2) : "0.00";

        // Mapeamos los datos del servidor a los inputs de React Hook Form
        reset({
          titulo: data.titulo || '',
          descripcion: data.descripcion || '',
          precio: precioFormateado || 0.00,
          condicion: data.condicion || '',
          estado: data.estado || '',
          categoriaId: data.categoriaId || ''
        }, {
          keepFocused: false, // 🔑 CLAVE: Fuerza a React Hook Form a reescribir el valor aunque tenga el foco nativo
        });
      } catch (error) {
        console.error("Error al cargar detalles bajo demanda:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [open, productId, reset]); // Solo se ejecuta si cambia el estado de apertura o el ID



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
          url: URL.createObjectURL(file), // <-- El enlace virtual para el src
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
  const rawValue = e.target.value;

  // 1. Limpiamos todo lo que no sea un número dígito
  const digitsOnly = rawValue.replace(/\D/g, "");

  // 2. Si el campo está vacío o se borró todo, dejamos que React Hook Form guarde "0.00"
  if (!digitsOnly) {
    setValue("precio", "0.00", { shouldValidate: true });
    return;
  }

  // 3. Convertimos a número flotante dividiendo por 100 y forzamos el formato de 2 decimales
  const formattedValue = (parseFloat(digitsOnly) / 100).toFixed(2);

  // 4. Actualizamos manualmente el valor en React Hook Form en tiempo real
  setValue("precio", formattedValue, { shouldValidate: true });
};

const handleBlurPrecio = (e) => {
  const currentPrecio = e.target.value;

  // Al salir del campo, si está vacío o incompleto, aseguramos el formato base
  if (!currentPrecio || isNaN(parseFloat(currentPrecio))) {
    setValue("precio", "0.00", { shouldValidate: true });
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
    try {

      if(productId==null) {
        console.log(data);
        const imagenesSubidas = await uploadMultipleImagesAndGetUrls(selectedFiles, 'productos');
        const arregloDeFiles = imagenesSubidas.map((imagen, index) => ({
          url: imagen.url,    // 🔑 Extrae la URL pública del objeto
          fileOrder: index,         // El primer archivo tendrá 0, el segundo 1, etc.
          uniqueName: imagen.uniqueName // 🔑 Asigna el nombre único para poder borrarlo en el futuro
        }));
        data.files=arregloDeFiles;
        const newProduct = await productService.createProduct(data);
        console.log('Producto creado:', newProduct);
        alert('¡Cambios guardados con éxito!');

      }else{
        const removeFilesUniqueNames = originalSelectedFiles
            .filter(file => !selectedFiles.includes(file))
            .map(file => file.uniqueName);

        const addFilesUniqueNames = selectedFiles
            .filter(file => !originalSelectedFiles.includes(file))

        const arregloDef = originalSelectedFiles.filter(r => !removeFilesUniqueNames.includes(r.uniqueName));


        // 3. Solo llamar a la API de borrado si realmente hay archivos para eliminar
        if (removeFilesUniqueNames.length > 0) {
           const resul= await deleteMultipleImages(removeFilesUniqueNames);
           console.log(resul);
        }

        if (addFilesUniqueNames.length >0){
          const imagenesSubidas =  await uploadMultipleImagesAndGetUrls(addFilesUniqueNames, 'productos');
          const arregloDeFilesNew = imagenesSubidas.map((imagen, index) => ({
            url: imagen.url,    // 🔑 Extrae la URL pública del objeto
            fileOrder: index,         // El primer archivo tendrá 0, el segundo 1, etc.
            uniqueName: imagen.uniqueName // 🔑 Asigna el nombre único para poder borrarlo en el futuro
          }));
          arregloDeFilesNew.forEach(r=>{
            arregloDef.push(r);
          })
        }

        data.files=arregloDef;
        const newProduct2 = await productService.updateProductById(productId,data);

        console.log('Producto creado:', newProduct2);
      }
        
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Hubo un error al guardar los cambios.');
    }
  };

  const OnDelete = async () => {
    try {

        const resultadoDelete = await deleteMultipleImages(selectedFiles.map(m=>m.uniqueName))


        console.log(resultadoDelete);
        const newProduct = await productService.deleteProductById(productId);
        console.log('Producto eliminado:', newProduct);
        alert('¡Cambios eliminados con éxito!');

         if (onRefresh) {
          onRefresh(); 
        }

        
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Hubo un error al guardar los cambios.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] md:max-w-5/6 max-h-[99vh]">
        <form  id="product-form" onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {productId?'Editar':'Crear'} artículo
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
                                    <FieldLabel htmlFor="titulo">Nombre del artículo</FieldLabel>
                                    <Input 
                                            id="titulo" 
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

                                        <Controller
                                        name="categoriaId"
                                        control={control}
                                        rules={{ required: "La categoría es obligatoria" }}
                                        render={({ field }) => (
                                          <Select 
                                            // 🔑 SOLUCIÓN: Pasa el arreglo al componente raíz para que traduzca el VALUE a LABEL
                                            items={categories} 
                                            value={field.value || ""} 
                                            onValueChange={field.onChange}
                                            disabled={loading}
                                          >
                                            <SelectTrigger id="categoria-select" className="w-full">
                                              {/* Radix ahora buscará de forma segura en 'items' la etiqueta correcta */}
                                              <SelectValue placeholder="Selecciona una categoría" />
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
                                        )}
                                      />
                                    </Field>


                                    <Field>
                                      <Label htmlFor="precio-input">Precio</Label>
                                      <InputGroup>
                                        <InputGroupAddon>
                                          <InputGroupText>S/</InputGroupText>
                                        </InputGroupAddon>
                                        
                                        <InputGroupInput 
                                          id="precio-input"
                                          type="text" 
                                          inputMode="decimal" 
                                          placeholder={loading ? "Cargando..." : "0.00"}
                                          disabled={loading}
                                          {...register("precio", { 
                                            required: "El precio es obligatorio",
                                            // 🔑 Opcional: Evita que publiquen artículos gratis con valor "0.00"
                                            validate: (value) => parseFloat(value) > 0 || "El precio debe ser mayor a 0.00",
                                            onChange: handlePrecioChange, 
                                            onBlur: handleBlurPrecio 
                                          })}
                                          aria-invalid={errors.precio ? "true" : "false"}
                                        />
                                        
                                        <InputGroupAddon align="inline-end">
                                          <InputGroupText>PEN</InputGroupText>
                                        </InputGroupAddon>
                                      </InputGroup>

                                      {errors.precio && (
                                        <p className="text-red-500 text-xs mt-1 transition-colors">
                                          {errors.precio.message}
                                        </p>
                                      )}
                                    </Field>



                                    <Field>
                                      <Label htmlFor="condicion-select">Condición</Label>
                                      
                                      <Controller
                                        name="condicion"
                                        control={control}
                                        rules={{ required: "La condición es obligatoria" }}
                                        render={({ field }) => (
                                          <Select 
                                            // 🔑 SOLUCIÓN: Pasa el arreglo al componente raíz para que traduzca el VALUE a LABEL
                                            items={condiciones} 
                                            value={field.value || ""} 
                                            onValueChange={field.onChange}
                                            disabled={loading}
                                          >
                                            <SelectTrigger id="condicion-select" className="w-full">
                                              {/* Radix ahora buscará de forma segura en 'items' la etiqueta correcta */}
                                              <SelectValue placeholder="Selecciona una condición" />
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
                                        )}
                                      />

                                    </Field>


                                    <Field>
                                        <Label htmlFor="estado-select">Estado</Label>

                                        <Controller
                                        name="estado"
                                        control={control}
                                        render={({ field }) => (
                                          <Select 
                                            // 🔑 SOLUCIÓN: Pasa el arreglo al componente raíz para que traduzca el VALUE a LABEL
                                            items={estados} 
                                            value={field.value || ""} 
                                            onValueChange={field.onChange}
                                            disabled={loading}
                                          >
                                            <SelectTrigger id="estado-select" className="w-full">
                                              {/* Radix ahora buscará de forma segura en 'items' la etiqueta correcta */}
                                              <SelectValue placeholder="Selecciona un estado" />
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
                                        )}
                                      />
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
                        <Attachment key={`${image.name}-${index}`} orientation="vertical" className="size-80">
                            <AttachmentMedia variant="image">
                            {/* Usamos previewUrl que contiene el Blob local */}
                            <img 
                                src={image.url} 
                                alt={image.url} 
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

            {/* 👈 Condicional: El botón "Close" solo se renderiza si existe un productId */}
            {productId ? (
              <Button variant="destructive"  
                onClick={() => 
                  {
                    OnDelete()       // Abrimos el modal instantáneamente
                  }}>
                Eliminar artículo
              </Button>
            ) : (
              // 🔑 Opcional: Un div vacío mantiene el empuje flex a la derecha si no hay productId
              <div className="hidden sm:block" /> 
            )}
            

            <div className="flex items-center gap-5 w-full sm:w-auto sm:ml-auto">
              <DialogClose  variant="ghost">
                Cancelar
              </DialogClose>
              
              <Button 
                form="product-form"  
                type="submit" 
                className="bg-violet-700 hover:bg-violet-800"
              >
                Guardar
              </Button>
            </div>
          </DialogFooter>

        </form>
        </DialogContent>
      
    </Dialog>
  )
}
