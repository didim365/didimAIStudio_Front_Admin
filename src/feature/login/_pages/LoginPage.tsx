"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { usePostLogin } from "../_hooks/usePostLogin";
import MENU from "@/shared/constants/menu";
import { Mail, Lock, LogIn, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: login, isPending } = usePostLogin({
    meta: {
      successMessage: "로그인에 성공하였습니다.",
    },
    onSuccess: () => {
      const firstMenuItem = MENU.find((item) => item.href !== undefined);
      if (firstMenuItem?.href) {
        router.push(firstMenuItem.href);
      }
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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-tr from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-linear-to-r from-violet-500/5 to-fuchsia-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg shadow-slate-900/20 mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent mb-2">
            Admin Console
          </h1>
          <p className="text-slate-500 text-sm">DidimAI Studio 관리자 콘솔</p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-slate-400" />
                  이메일
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@didim365.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isPending}
                    className="h-12 pl-4 bg-slate-50/50 border-slate-200 rounded-xl focus:border-slate-400 focus:ring-slate-400/20 focus:ring-4 transition-all duration-200 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-slate-400" />
                  비밀번호
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isPending}
                    className="h-12 pl-4 bg-slate-50/50 border-slate-200 rounded-xl focus:border-slate-400 focus:ring-slate-400/20 focus:ring-4 transition-all duration-200 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 bg-linear-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-medium shadow-lg shadow-slate-900/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                {isPending ? "로그인 중..." : "로그인"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          © {new Date().getFullYear()} DidimAI Studio. All rights reserved.
        </p>
      </div>
    </div>
  );
}
