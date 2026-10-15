import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Field, FieldGroup, FieldLabel } from "./ui/field"; // Añadido FieldLabel si es necesario
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { useForm } from "react-hook-form";
import { Textarea } from "./ui/textarea";
import { useEffect, useState } from "react";
import { categoryService } from "@/services/CategoryService";


export function DialogDemo() {
    const { 
        register, 
        formState: { errors },
      } = useForm({
        mode: "onBlur",
        defaultValues: {
          name: "",
          price: "",
          description: ""
        }
      });
    

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

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
  

  return (
    <Dialog>
      <form>
        <DialogTrigger render={<Button variant="default" className="mt-4 sm:mt-0 bg-violet-700 hover:bg-violet-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-xs">Agregar artículo</Button>} />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Añadir artículo</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nombre del artículo</FieldLabel>
              <Input 
                    id="name" 
                    placeholder="Ej: Casaca de mezclilla Levi's"
                    {...register("name", { required: "El nombre es obligatorio" })}
                    aria-invalid={errors.name ? "true" : "false"}
                  />

                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 transition-colors">
                      {errors.name.message}
                    </p>
                  )}
            </Field>
            
            <Field>
                  <FieldLabel htmlFor="description">Descripción</FieldLabel>
                  <Textarea
                    id="description"
                    placeholder="Describe la prenda..."
                    {...register("description", { required: "La descripción es obligatoria" })}
                    aria-invalid={errors.description ? "true" : "false"}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1 transition-colors">
                      {errors.description.message}
                    </p>
                  )}
            </Field>

            {/* 5. Reemplazamos las frutas por tus Categorías dinámicas */}
                <Field>
                  <Label htmlFor="category-select">Categoría</Label>
                  <Select items={categories}>
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
          </FieldGroup>
          
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
