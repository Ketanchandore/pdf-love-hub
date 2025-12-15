import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolHeroProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
}

const ToolHero = ({ title, description, icon: Icon, color = "bg-primary" }: ToolHeroProps) => {
  return (
    <section className="hero-gradient py-12 md:py-16">
      <div className="container text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className={cn("mx-auto flex h-20 w-20 items-center justify-center rounded-2xl animate-fade-in", color)}>
            <Icon className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl animate-fade-in animation-delay-200">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in animation-delay-400">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ToolHero;
