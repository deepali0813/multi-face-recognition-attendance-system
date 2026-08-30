"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { loginSchema } from "@/lib/validations/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage(){
    const router=useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();
        setError("");
        setFieldErrors({});

        // client side validation
        const parsed = loginSchema.safeParse({ email, password });
        if (!parsed.success) {
          setFieldErrors(parsed.error.flatten().fieldErrors);
          return;
        }
        setIsLoading(true);
        try{
            // call the login post route
            const res=await axios.post("/auth/login",parsed.data);
            if(res.data.success){
              toast.success("Login successful");

              router.push("/dashboard");
            }
        } catch(err:any){
            const message=err.response?.data?.message || "Something went wrong . please try again ";
            toast.error(message);
            setError(message);

        } finally{
            setIsLoading(false);
        }
    };

    return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl">Admin Login</CardTitle>
          <CardDescription>Sign in to access the attendance dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@aisoc.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {fieldErrors.email && (
                <p className="text-sm text-red-500">{fieldErrors.email[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-sm text-red-500">{fieldErrors.password[0]}</p>
              )}
            </div>

            {error && <p className="text-center text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


