import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  items: { label: string; active?: boolean }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      <Home className="h-4 w-4 text-muted-foreground" />
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className={item.active ? 'font-medium' : 'text-muted-foreground'}>
            {item.label}
          </span>
        </div>
      ))}
    </nav>
  );
}
