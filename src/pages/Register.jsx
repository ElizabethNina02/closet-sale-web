import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentMedia,
  AttachmentTrigger,
} from "@/components/ui/attachment";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { useAuth } from "@/context/AuthContext";
import { departmentService } from "@/services/DepartmentService";
import { districtService } from "@/services/DistrictService";
import { uploadSingleUserImage } from "@/services/StorageService";
import { userService } from "@/services/UserService";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function Register() {
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const [selectedImage, setselectedImage] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loadingDepartment, setLoadingDepartment] = useState([]);

  const [districts, setDistricts] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  // Función para cargar los distritos según el ID del departamento seleccionado
  const handleDepartmentChange = async (departmentId, formOnChange) => {
    // 1. Actualizamos el valor en el estado de React Hook Form
    formOnChange(departmentId);
    
    // Opcional: Limpiamos el valor del distrito previo en el formulario si existiera
    // setValue("districtId", ""); 

    if (!departmentId) {
      setDistricts([]);
      return;
    }

    try {
      setLoadingDistricts(true);
      const data = await districtService.getDistrictsById(departmentId);
          
      const formattedCategories = data.map((district) => ({
        label: district.name, 
        value: String(district.id)
      }));

      setDistricts(formattedCategories); 
    } catch (error) {
      console.error("Error al cargar distritos:", error);
      setDistricts([]);
    } finally {
      setLoadingDistricts(false);
    }
  };


  const handleRemoveFile = () => {
    setselectedImage(null);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      username: "",
      whatsappNumber: "",
    },
  });

   const handleFileChange = (e) => {
    // 1. Corregido: Usar 'files' en plural
    const files = e.target.files; 
    
    if (files && files.length > 0) {
        const file = files[0]; // Tomamos el primer archivo seleccionado

        // 2. Creamos un nuevo objeto limpio con los datos que tu componente necesita
        const imageObject = Object.assign(file, {
            url: URL.createObjectURL(file), 
            meta: `${(file.size / 1024).toFixed(1)} KB`
        });

        // 3. Guardamos el objeto directamente en el estado
        setselectedImage(imageObject);

        // 4. Limpiamos el input para permitir volver a subir el mismo archivo si se desea
        e.target.value = ""; 
    }
};

  useEffect(() => {
      const fetchCategories = async () => {
        try {
          setLoadingDepartment(true);
          const data = await departmentService.getAllDepartments();
          
          const formattedCategories = data.map((category) => ({
            label: category.name, 
            value: String(category.id)
          }));
  
          setDepartments(formattedCategories);
        } catch (error) {
          // Axios guarda la respuesta del servidor en error.response
          console.error("Error cargando categorías desde el servidor:", error.response?.data || error.message);
        } finally {
          setLoadingDepartment(false);
        }
      };
  
      fetchCategories();
    }, []);

  const { login } = useAuth(); 

  const onSubmit = async (data) => {
    setCargando(true);
    try {
      if(selectedImage){
        const profileImage = await uploadSingleUserImage(selectedImage, 'users')
      

        data.urlImage=profileImage.url
        data.uniqueNameImage=profileImage.uniqueName
        
        console.log(data)
        // Petición POST real a tu controlador de Spring Boot
        const response = await userService.registerUser(data);
        console.log(response);
        const { user, auth } = response;

        if (auth.token) {
          login(user, auth.token)
          navigate("/");
        }
      }
      
    } catch (err) {
      console.log(err);
      const errorMsg =
        err.response?.data?.message || "Usuario o contraseña incorrectos.";
      const id = toast.add({
        title: "Error al registar usuario",
        description: errorMsg,
        actionProps: {
          children: "Cerrar",
          onClick() {
            toast.close(id);
          },
        },
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 px-4">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Registro</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="form-login" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="items-center">

            {!selectedImage && (
              <Field>
                <FieldLabel htmlFor="picture">Foto de perfil</FieldLabel>
                <Input id="picture" type="file" 
                  onChange={handleFileChange}/>
              </Field>
            )}
              {selectedImage && (
                <Attachment key={selectedImage.name} orientation="vertical" className="size-35">
                  <AttachmentMedia variant="image">
                    <img src={selectedImage.url} alt={selectedImage.url} 
                                className="object-cover w-full h-full" />
                  </AttachmentMedia>
                  <AttachmentActions>
                    <AttachmentAction
                      aria-label={`Remove ${selectedImage.name}`}
                      onClick={() => handleRemoveFile()}
                    >
                      <XIcon />
                    </AttachmentAction>
                  </AttachmentActions>
                  <AttachmentTrigger
                    render={
                      <a
                        href={selectedImage.src}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${selectedImage.name}`}
                      />
                    }
                  />
                </Attachment>
              )}

              <Controller
                name="firstName"
                control={control} // Usamos 'control' en vez de 'register.control'
                rules={{ required: "El nombre es obligatorio" }} // Las validaciones van aquí en vez de {...register}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-username">Nombre</FieldLabel>
                    <Input
                      {...field}
                      id="login-username"
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="Ingresa tu nombre"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="lastName"
                control={control} // Usamos 'control' en vez de 'register.control'
                rules={{ required: "El apellido es obligatorio" }} // Las validaciones van aquí en vez de {...register}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-username">Apellido</FieldLabel>
                    <Input
                      {...field}
                      id="login-username"
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="Ingresa tu apellido"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={control} // Usamos 'control' en vez de 'register.control'
                rules={{ required: "El email es obligatorio" }} // Las validaciones van aquí en vez de {...register}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-username">Email</FieldLabel>
                    <Input
                      {...field}
                      id="login-username"
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="Ingresa tu email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="username"
                control={control} // Usamos 'control' en vez de 'register.control'
                rules={{ required: "El usuario es obligatorio" }} // Las validaciones van aquí en vez de {...register}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-username">Usuario</FieldLabel>
                    <Input
                      {...field}
                      id="login-username"
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="Ingresa tu usuario"
                      autoComplete="username"
                    />
                    {errors.username && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.username.message}
                      </p>
                    )}
                  </Field>
                )}
              />

              {/* CAMPO: PASSWORD */}
              <Controller
                name="password"
                control={control}
                rules={{ required: "La contraseña es obligatoria" }}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-password">Contraseña</FieldLabel>
                    <Input
                      {...field}
                      id="login-password"
                      type="password" // Tipo password para ocultar los caracteres
                      aria-invalid={fieldState.invalid}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="whatsappNumber"
                control={control}
                rules={{ required: "El número de Whatsapp es obligatoria" }}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-password">
                      Número de Whatsapp
                    </FieldLabel>
                    <Input
                      {...field}
                      id="login-password"
                      type="text" // Tipo password para ocultar los caracteres
                      aria-invalid={fieldState.invalid}
                    />
                    {errors.whatsappNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.whatsappNumber.message}
                      </p>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="departmentId"
                control={control}
                rules={{ required: "El número de Whatsapp es obligatoria" }}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-password">
                      Ubicación
                    </FieldLabel>
                    <Select 
                      // 🔑 SOLUCIÓN: Pasa el arreglo al componente raíz para que traduzca el VALUE a LABEL
                      items={departments} 
                      value={field.value || ""} 
                      onValueChange={(value) => handleDepartmentChange(value, field.onChange)}
                      disabled={loadingDepartment}
                    >
                      <SelectTrigger id="categoria-select" className="w-full">
                        {/* Radix ahora buscará de forma segura en 'items' la etiqueta correcta */}
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Categorías disponibles</SelectLabel>
                          {departments.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
              <Controller
                name="districtId"
                control={control}
                rules={{ required: "El número de Whatsapp es obligatoria" }}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Select 
                      // 🔑 SOLUCIÓN: Pasa el arreglo al componente raíz para que traduzca el VALUE a LABEL
                      items={districts} 
                      value={field.value || ""} 
                      onValueChange={field.onChange}
                      disabled={loadingDistricts}
                    >
                      <SelectTrigger id="categoria-select" className="w-full">
                        {/* Radix ahora buscará de forma segura en 'items' la etiqueta correcta */}
                        <SelectValue placeholder="Selecciona un distrito" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Categorías disponibles</SelectLabel>
                          {districts.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <div className="flex w-full justify-between items-center gap-4">
            <Button
              className="text-violet-700 hover:text-violet-800"
              type="button"
              variant="outline"
              onClick={() => navigate("/login")}
            >
              Inicia sesión
            </Button>
            <Button type="submit" disabled={cargando} form="form-login" className="bg-violet-700 hover:bg-violet-800"
              >
              {cargando ? "Autenticando..." : "Registrar e ingresar"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Register;
