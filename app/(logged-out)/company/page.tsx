// CompanyPage.tsx
"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useRouter } from "next/navigation";
import { companyLogin, LoginPayload } from "@/redux/actions/companyActions";
import { useAppDispatch } from "@/redux/hook";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

const formSchema = z.object({
  CompanyCode: z.string().nonempty("Şirket kodu gerekli"),
  password: z.string().nonempty("Şifre gerekli"),
});

export default function CompanyPage() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const className = document.body.className;
    setIsDarkMode(className.includes("dark"));

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const className = document.body.className;
          setIsDarkMode(className.includes("dark"));
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
    });

    return () => observer.disconnect();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      CompanyCode: "",
      password: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const actionResult = await dispatch(companyLogin(data as LoginPayload));
    if (companyLogin.fulfilled.match(actionResult)) {
      if (actionResult.payload) {
        toast({
          title: "Giriş Başarılı",
          description: "Başarıyla giriş yaptınız.",
        });
        router.push("/welcome");
      } else {
        toast({
          title: "Giriş Başarısız",
          description: "Geçersiz yanıt formatı.",
          variant: "destructive",
        });
      }
    } else if (companyLogin.rejected.match(actionResult)) {
      toast({
        title: "Giriş Başarısız",
        description: actionResult.payload as React.ReactNode,
        variant: "destructive",
      });
    }
  };

  const handleForgotInfoPress = () => {
    window.location.href =
      "mailto:destek@Projectxwire.com?subject=Bilgilerimi Unuttum&body=Merhaba, bilgilerimi unuttum, yardımcı olabilir misiniz?";
  };

  const handleApplyPress = () => {
    window.location.href =
      "mailto:basvur@Projectxwire.com?subject=Başvuru&body=Merhaba, şirket kodu başvurusunda bulunmak istiyorum.";
  };

  return (
    <>
      <Image
        src={isDarkMode ? "/img/logo-white.png" : "/img/logo-black.png"}
        width="175"
        height="55"
        alt="Projectxwire"
        style={{ width: "175px", height: "55px" }}
        className="hidden sm:block"
      />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Şirket Giriş</CardTitle>
          <CardDescription>
            Şirket bilgileri ile giriş yapabilirsiniz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              {/* Company Code Input */}
              <FormField
                control={form.control}
                name="CompanyCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şirket Kodu</FormLabel>
                    <FormControl>
                      <Input placeholder="sirketkodu" {...field} />
                    </FormControl>
                    <FormDescription>Şirket Kodunuzu girin</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Password Input */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şifre</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormDescription>Şifrenizi girin</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Şirket Girişi</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div>
            <small>Şirket Kodunuz yok mu?</small>
            <Button
              variant="link"
              onClick={handleApplyPress}
              className="text-xs font-bold underline"
            >
              Başvur
            </Button>
          </div>
          <Button
            variant="link"
            onClick={handleForgotInfoPress}
            className="text-xs font-bold underline"
          >
            Şirket giriş bilgilerimi unuttum.
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
