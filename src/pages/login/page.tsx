import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui";
import { useAuthStore, useUserStore } from "@/hooks";
import { AuthType, BaseRoutes } from "@/models";
import { extractDefaultValues } from "@/utils";
import { useNavigate } from "react-router-dom";

const LoginSchema = z.object({
  username: z
    .string({
      required_error: "El nombre de usuario es requerido",
      invalid_type_error: "El nombre de usuario debe ser de tipo string",
    })
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .default(""),
  password: z
    .string({
      required_error: "La contraseña es requerida",
      invalid_type_error: "La contraseña debe ser de tipo string",
    })
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .default(""),
  remember: z.boolean().default(false).optional(),
});

export function Login() {
  const navigate = useNavigate();
  const { login, logout } = useAuthStore();
  const { fetchUserDetails } = useUserStore();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: extractDefaultValues(LoginSchema),
  });

  const onValid = async (data: z.infer<typeof LoginSchema>) => {
    const authType: AuthType = data.remember ? AuthType.ACCESS_AND_REFRESH : AuthType.TOKEN;
    await login({ ...data, authType });
    await fetchUserDetails();
    navigate(BaseRoutes.HOME, { replace: true, relative: "route" });
  };

  const onInvalid = async (...error: any) => {
    console.log(error);
    await logout().catch((error) => console.log(error));
  };

  return (
    <div className="bg-custom-primary-2 w-full h-full flex flex-col items-center justify-center">
      <div className="bg-white p-6 border-2 rounded-lg">
        <div className="font-medium mb-6 mx-auto text-custom-secondary-2 flex flex-col items-center justify-center">
          <h1 className="text-2xl border-0 border-b-2 border-custom-secondary-2">COCHABAMBA</h1>
          <h2 className="text-xl">Datos Abiertos</h2>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onValid, onInvalid)}>
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
              name="remember"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="me-4">Remember {field.value ? "Yes" : "No"}</FormLabel>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage className="font-poppins" />
                </FormItem>
              )}
            />

            <Button
              className="w-full mt-6 bg-custom-primary-2 hover:bg-custom-secondary-2"
              type="submit"
            >
              Ingresar
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Login;
