"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { usePostLogin } from "../_hooks/usePostLogin";
import MENU from "@/shared/constants/menu";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: login, isPending } = usePostLogin({
    meta: {
      successMessage: "로그인에 성공하였습니다.",
    },
    onSuccess: () => {
      router.push(MENU[0].href);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({
      email,
      password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Admin Console
          </h1>
          <p className="text-slate-500">DidimAI Studio 관리자 콘솔</p>
        </div>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-900"
                >
                  이메일
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@didim365.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isPending}
                  className="h-11 bg-white border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-900"
                >
                  비밀번호
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isPending}
                  className="h-11 bg-white border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                />
              </div>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-11 bg-theme-primary hover:opacity-90 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "로그인 중..." : "로그인"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
