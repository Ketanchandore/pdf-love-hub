import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ToolHeroProps {
  title: string;
  description: string;
  icon: ReactNode;
  color?: string;
}

const ToolHero = ({ title, description, icon, color = "bg-primary" }: ToolHeroProps) => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-primary/5 to-background">
      <div className="container text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className={cn("mx-auto flex h-20 w-20 items-center justify-center rounded-2xl", color)}>
            {icon}
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ToolHero;
