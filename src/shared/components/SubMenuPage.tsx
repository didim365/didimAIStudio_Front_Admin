import Link from "next/link";
import type { Route } from "next";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { ChevronRight } from "lucide-react";

type SubMenuItem = {
  name: string;
  href: Route;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
};

type SubMenuPageProps = {
  title: string;
  description?: string;
  items: SubMenuItem[];
};

export function SubMenuPage({ title, description, items }: SubMenuPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary rounded-lg p-2">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{item.name}</CardTitle>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                {item.description && (
                  <CardDescription className="mt-2">
                    {item.description}
                  </CardDescription>
                )}
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
