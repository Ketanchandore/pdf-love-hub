import { Link } from "react-router-dom";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  color?: string;
}

const ToolCard = ({ title, description, href, icon, color = "bg-primary" }: ToolCardProps) => {
  return (
    <Link
      to={href}
      className="group block p-4 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110 text-white", color)}>
          {icon}
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;
