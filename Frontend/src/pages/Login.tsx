import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UserRole } from "@/types";
import { Leaf } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext"; // Fixed path (was "@/context/")

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["buyer", "seller"]),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // Fixed: was "auth.login", now "login"
  const [userRole, setUserRole] = useState<UserRole>("buyer");
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "buyer",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password, data.role);
      toast({
        title: "Login successful",
        description: `Welcome back as a ${data.role}!`,
      });
      navigate(from, { replace: true });
    } catch (err) {
      toast({
        title: "Login failed",
        description: err?.response?.data?.message || err?.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (value: string) => {
    const role = value as UserRole;
    setUserRole(role);
    form.setValue("role", role);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary rounded-full p-3">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={userRole} onValueChange={handleRoleChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="buyer">Buyer</TabsTrigger>
                <TabsTrigger value="seller">Seller</TabsTrigger>
              </TabsList>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormControl>
                          <input type="hidden" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : `Sign in as ${userRole === "buyer" ? "Buyer" : "Seller"}`}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link
                  to="/register"
                  state={{ role: userRole }}
                  className="text-primary hover:underline font-medium"
                >
                  {userRole === "buyer" ? "Register as Buyer" : "Register as Seller"}
                </Link>
              </div>

              <div className="mt-4 text-center">
                <Link
                  to="/register"
                  state={{ role: userRole === "buyer" ? "seller" : "buyer" }}
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Create {userRole === "buyer" ? "Seller" : "Buyer"} account instead
                </Link>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;