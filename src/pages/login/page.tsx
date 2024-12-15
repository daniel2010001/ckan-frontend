import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore, useUserStore } from "@/hooks";
import { cn } from "@/lib/utils";
import { AuthType, BaseRoutes } from "@/models";
import { extractDefaultValues } from "@/utils";

import loginBackground from "@/assets/images/login-background.png";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  const { login, logout, reset } = useAuthStore();
  const { fetchUserDetails } = useUserStore();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: extractDefaultValues(LoginSchema),
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    const authType: AuthType = data.remember ? AuthType.ACCESS_AND_REFRESH : AuthType.TOKEN;
    if (!(await login({ ...data, authType }))) {
      toast.error("Error al iniciar sesión");
      return;
    }
    if (await fetchUserDetails()) {
      toast.success("Sesión iniciada correctamente");
      navigate(BaseRoutes.HOME, { replace: true, relative: "route" });
    } else if (!(await logout())) reset();
  };

  return (
    <div className="w-full h-full grid grid-cols-2">
      <div className="col-span-1 flex flex-col items-center justify-center bg-rose-800/80">
        <Card className="bg-white">
          <CardHeader className="w-[400px]">
            <CardTitle className="font-medium text-custom-secondary-2 flex flex-col items-center justify-center font-arciform">
              <h1 className="text-3xl border-0 border-b-[1px] border-custom-secondary-2 h-8">
                COCHABAMBA
              </h1>
              <h2 className="text-lg tracking-wider">DATOS ABIERTOS</h2>
            </CardTitle>
            <CardDescription>
              Si ya tienes una cuenta, ingresa con tu nombre de usuario y contraseña. Si no tienes
              una cuenta,{" "}
              <Link
                className={cn(buttonVariants({ variant: "link" }), "p-0 h-4")}
                to={BaseRoutes.REGISTER}
              >
                regístrate aqu&iacute;
              </Link>
              .
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form>
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
                    <FormItem className="w-full flex items-center justify-start gap-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Mantener ses&iacute;on iniciada?</FormLabel>
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

      <div className="max-h-full col-span-1 overflow-hidden relative">
        <div className="bg-custom-primary-2/30 w-full h-full absolute top-0 left-0" />
        <img src={loginBackground} alt="Login background" />
      </div>
    </div>
  );
}

export default Login;
