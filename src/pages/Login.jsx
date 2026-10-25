import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/Api";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

function Login() {
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  // Desestructuramos "control" para que lo usen los componentes <Controller />
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setCargando(true);

    try {
      // Petición POST real a tu controlador de Spring Boot
      const response = await api.post("/auth/token", data);
      const { token, username } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        if (username) localStorage.setItem("username", username);
        navigate("/");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Usuario o contraseña incorrectos.";
      const id = toast.add({
        title: "Error de autenticación",
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
              {/* CAMPO: USERNAME */}
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
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          {/* Se corrigió la orientación y se enlazó el botón "Regístrate" a tu ruta de registro */}
          <div className="flex w-full justify-between items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/register")}
            >
              Regístrate
            </Button>
            <Button type="submit" disabled={cargando} form="form-login">
              {cargando ? "Autenticando..." : "Ingresar"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
