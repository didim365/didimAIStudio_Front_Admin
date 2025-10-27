import { Card, CardContent } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";

export default function LoginPage() {
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
            <form className="space-y-5" action={"/dashboard"}>
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
                  required
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
                  required
                  className="h-11 bg-white border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-slate-600 cursor-pointer"
                  >
                    로그인 상태 유지
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm text-slate-900 hover:text-slate-600 transition-colors"
                >
                  비밀번호 찾기
                </a>
              </div>
              <Button
                type="submit"
                className="w-full h-11 bg-theme-primary hover:opacity-90 text-white transition-all"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                로그인
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
