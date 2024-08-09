"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/stores/user/user.store";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { authUser } from "@/api/auth/auth.api";
import { Spinner } from "@/components/custom/spinner";

export default function Form() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form, setForm] = useState({
    doc: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    doc: {
      error: false,
      message: "",
    },
    password: {
      error: false,
      message: "",
    },
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const FormSchema = z.object({
    doc: z
      .string()
      .min(7)
      .max(8)
      .regex(/^[0-9]{7,8}$/),
    password: z.string().trim().min(8),
  });

  const login = useAuthStore((state) => state.login);

  const handleOnChange = (name: string, text: string) => {
    setFormErrors({
      ...formErrors,
      [name]: {
        error: false,
        message: "",
      },
    });
    setForm({ ...form, [name]: text });
  };

  const handleSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    const isFormValid = FormSchema.safeParse(form);
    if (!isFormValid.success) {
      const { doc, password } = isFormValid.error.format();
      setFormErrors({
        doc: {
          error: doc ? true : false,
          message: doc?._errors ? "La cedula de identidad no es valida." : "",
        },
        password: {
          error: password ? true : false,
          message: password?._errors ? "La contraseña no es valida." : "",
        },
      });
      setIsLoading(false);
    } else {
      const { data, status } = await authUser(form);
      if (status !== 201) {
        console.log("data", data);
        setFormErrors({
          ...formErrors,
          password: {
            error: true,
            message: `Las credendenciales no son validas.`,
          },
        });
        setIsLoading(false);
      } else {
        login(data.token, data.user);
        router.push("/dashboard");
        // setIsLoading(false);
      }
    }
  };
  
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 4000);

      return () => clearTimeout(timer); // Limpia el temporizador
    }
  }, [errorMessage]);
  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-fit min-w-[400px]">
        <CardHeader>
          <CardTitle className="text-xl">Iniciar Sesion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-3">
              <Label htmlFor="doc">Cedula de Identidad</Label>
              <Input
                id="doc"
                placeholder="Cedula de Identidad"
                onChange={(e) => handleOnChange("doc", e.target.value)}
              />
              {formErrors.doc.error && (
                <p className="text-red-500 text-xs">{formErrors.doc.message}</p>
              )}
            </div>
            <div className="flex flex-col space-y-3">
              <Label htmlFor="password">Contraseña</Label>
              <div className="flex flex-row items-center justify-between gap-2 w-full h-fit">
                <Input
                  id="password"
                  placeholder="Contraseña"
                  type={passwordVisible ? "text" : "password"}
                  onChange={(e) => handleOnChange("password", e.target.value)}
                />
                <Button
                  size="icon"
                  className="px-2"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  type="button"
                >
                  {passwordVisible ? (
                    <Eye size={18} color="white" />
                  ) : (
                    <EyeOff size={18} color="white" />
                  )}
                </Button>
              </div>
              {formErrors.password.error && (
                <p className="text-red-500 text-xs">
                  {formErrors.password.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClickCapture={() => router.push("/")}
          >
            Volver
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="flex flex-row items-center justify-between gap-1.5 dark:text-white"
            disabled={
              form.doc.trim() === "" ||
              form.password.trim() === "" ||
              formErrors.doc.error ||
              formErrors.password.error
            }
          >
            Iniciar Sesion {isLoading && <Spinner size="small" />}
          </Button>
        </CardFooter>
        {errorMessage && (
          <div className="mt-4 text-red-500 text-center">{errorMessage}</div>
        )}
      </Card>
    </form>
  );
}
