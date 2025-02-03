import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { ResponseAdapter, UserAdapter } from "@/adapters/ckan";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BaseRoutes } from "@/models";
import { register } from "@/services/ckan";
import { extractDefaultValues, loadAbortable } from "@/utils";

import registerBackground from "@/assets/images/register-background.png";
import { Loader2 } from "lucide-react";

const userRegisterSchema = z
  .object({
    username: z
      .string({
        required_error: "El nombre de usuario es requerido",
        invalid_type_error: "El nombre de usuario debe ser de tipo string",
      })
      .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
      .default(""),
    fullname: z
      .string({
        required_error: "El nombre completo es requerido",
        invalid_type_error: "El nombre completo debe ser de tipo string",
      })
      .optional()
      .default(""),
    email: z
      .string({
        required_error: "El email es requerido",
        invalid_type_error: "El email debe ser de tipo string",
      })
      .email("El email debe ser válido")
      .default(""),
    password: z
      .string({
        required_error: "La contraseña es requerida",
        invalid_type_error: "La contraseña debe ser de tipo string",
      })
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .default(""),
    confirmPassword: z
      .string({
        required_error: "La contraseña de confirmación es requerida",
        invalid_type_error: "La contraseña de confirmación debe ser de tipo string",
      })
      .min(8, "La contraseña de confirmación debe tener al menos 8 caracteres")
      .default(""),
    profilePicture: z
      .instanceof(File)
      .refine((file) => file.size <= 1048576, { message: "El archivo debe ser menor a 1 MB" })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export function Register() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof userRegisterSchema>>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: extractDefaultValues(userRegisterSchema.innerType()),
  });

  const onSubmit = async (data: z.infer<typeof userRegisterSchema>) => {
    // TODO: crear un servicio aparte para subir imágenes
    const response = await loadAbortable(register(UserAdapter.toUserRequest(data)));
    if (!response || ResponseAdapter.isError(response)) return; // TODO: mostrar error
    navigate(BaseRoutes.LOGIN, { replace: true, relative: "route" });
  };

  return (
    <div className="w-full h-full grid grid-cols-3">
      <div className="max-h-full col-span-1 overflow-hidden relative">
        <div className="bg-custom-primary-2/30 w-full h-full absolute top-0 left-0" />
        <img src={registerBackground} alt="Login background" />
      </div>

      <div className="col-span-2 flex flex-col items-center justify-center bg-rose-800/80">
        <Card className="bg-white w-3/4">
          <CardHeader>
            <CardTitle className="font-medium text-custom-secondary-2 flex flex-col items-center justify-center font-arciform">
              <h1 className="text-3xl border-0 border-b-[1px] border-custom-secondary-2 h-8">
                COCHABAMBA
              </h1>
              <h2 className="text-lg tracking-wider">DATOS ABIERTOS</h2>
            </CardTitle>
            <CardDescription>
              Si ya tienes una cuenta,{" "}
              <Link
                className={cn(buttonVariants({ variant: "link" }), "p-0 h-4")}
                to={BaseRoutes.LOGIN}
              >
                inicia sesión aqu&iacute;
              </Link>
              .
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      {/* <FormLabel className="text-xl">Username</FormLabel> */}
                      <FormControl>
                        <Input
                          {...field}
                          className="border-0 border-b-2 rounded-none focus:rounded-lg font-poppins pb-0"
                          type="text"
                          placeholder="Nombre de usuario"
                        />
                      </FormControl>
                      <FormMessage className="font-poppins" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      {/* <FormLabel className="text-xl">Fullname</FormLabel> */}
                      <FormControl>
                        <Input
                          {...field}
                          className="border-0 border-b-2 rounded-none focus:rounded-lg font-poppins pb-0"
                          type="text"
                          placeholder="Dirección de correo electrónico"
                        />
                      </FormControl>
                      <FormMessage className="font-poppins" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      {/* <FormLabel className="text-xl">Password</FormLabel> */}
                      <FormControl>
                        <Input
                          {...field}
                          className="border-0 border-b-2 rounded-none focus:rounded-lg font-poppins pb-0"
                          type="password"
                          placeholder="Contraseña"
                        />
                      </FormControl>
                      <FormMessage className="font-poppins" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      {/* <FormLabel className="text-xl">Password</FormLabel> */}
                      <FormControl>
                        <Input
                          {...field}
                          className="border-0 border-b-2 rounded-none focus:rounded-lg font-poppins pb-0"
                          type="password"
                          placeholder="Confirmar contraseña"
                        />
                      </FormControl>
                      <FormMessage className="font-poppins" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      {/* <FormLabel className="text-xl">Fullname</FormLabel> */}
                      <FormControl>
                        <Input
                          {...field}
                          className="border-0 border-b-2 rounded-none focus:rounded-lg font-poppins pb-0"
                          type="text"
                          placeholder="Nombre completo"
                        />
                      </FormControl>
                      <FormMessage className="font-poppins" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profilePicture"
                  render={({ field }) => (
                    <FormItem className="mb-4 col-span-2">
                      {/* <FormLabel className="text-xl">Password</FormLabel> */}
                      <FormControl>
                        <Input
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          name={field.name}
                          className="border-0 border-b-2 rounded-none focus:rounded-lg font-poppins pb-0"
                          type="file"
                          accept="image/png, image/jpeg"
                          placeholder="Imagen de perfil"
                        />
                      </FormControl>
                      <FormMessage className="font-poppins" />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col justify-start">
            <Button
              className="w-full bg-custom-primary-2 hover:bg-custom-secondary-2"
              disabled={form.formState.isSubmitting}
              onClick={form.handleSubmit(onSubmit)}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Cargando...
                </>
              ) : (
                "Ingresar"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Register;
