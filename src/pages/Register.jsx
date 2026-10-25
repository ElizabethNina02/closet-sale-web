import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { userService } from "@/services/UserService";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function Register() {
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm(
    {
     mode: "onBlur",
     defaultValues:{
        email:"",
        firstName:"",
        lastName:"",
        password:"",
        username:"",
        whatsappNumber:""
     }
    }
  );

  const onSubmit = async (data) => {
    setCargando(true);
    try {
      // Petición POST real a tu controlador de Spring Boot
      const response = userService.registerUser(data);
      const { user, auth } = response.data;

      if (auth.token) {
        localStorage.setItem("token", auth.token);
        if (user) localStorage.setItem("user", user);
        navigate("/");
      }
     
    } catch (err) {
        console.log(err)
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
          <CardTitle>Iniciar Sesión</CardTitle>
        </CardHeader>
        <CardContent>
            <form id="form-login" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
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
                        <FieldLabel htmlFor="login-password">Número de Whatsapp</FieldLabel>
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
            </FieldGroup>
            </form>
        </CardContent>
        <CardFooter>
            <div className="flex w-full justify-between items-center gap-4">
           <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/login")}
            >
              Inicia sesión
            </Button>
            <Button type="submit" disabled={cargando} form="form-login">
              {cargando ? "Autenticando..." : "Registrar e ingresar"}
            </Button>
            </div>
         
        </CardFooter>
      </Card>
    </div>
  );
}

export default Register;
