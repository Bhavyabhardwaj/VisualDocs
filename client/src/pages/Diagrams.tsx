import { Card } from '../components/ui/Card';
import { FileCode2 } from 'lucide-react';

export function Diagrams() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-app-foreground mb-2">
          Diagrams
        </h1>
        <p className="text-app-muted">
          View and manage all your generated diagrams
        </p>
      </div>

      <Card className="p-12 text-center">
        <div className="w-16 h-16 bg-app-border rounded-full flex items-center justify-center mx-auto mb-4">
          <FileCode2 className="w-8 h-8 text-app-muted" />
        </div>
        <h3 className="text-lg font-semibold text-app-foreground mb-2">
          No diagrams yet
        </h3>
        <p className="text-app-muted">
          Create a project and generate diagrams to see them here
        </p>
      </Card>
    </div>
  );
}
