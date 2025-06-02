
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import WordPressApp from './WordPressApp'
import './index.css'

const queryClient = new QueryClient();

// WordPress integration - mount when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('catering-menu-root');
  if (container) {
    const root = createRoot(container);
    root.render(
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <WordPressApp />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }
});
