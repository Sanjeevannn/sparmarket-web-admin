"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SparLogo } from "@/components/layout/spar-logo";
import { useAuth } from "@/components/auth/auth-provider";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email.trim(), password);
      router.replace("/dashboard");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Unable to sign in. Check API connection.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-admin-bg px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,112,60,0.18),_transparent_55%)]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-spar-green/10 blur-3xl" />
      <div className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full bg-spar-red/10 blur-3xl" />

      <Card className="relative z-10 w-full max-w-md border-none shadow-xl">
        <CardHeader className="items-center gap-4 text-center">
          <div className="flex items-center justify-center rounded-2xl bg-spar-green px-5 py-3">
            <SparLogo />
          </div>
          <div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription className="mt-1">
              Sign in to manage SPAR Market
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="superadmin@supermarket.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-spar-red" role="alert">
                {error}
              </p>
            )}
            <Button
              type="submit"
              className="mt-2 h-10 w-full rounded-full bg-spar-green text-white hover:bg-spar-green-dark"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
