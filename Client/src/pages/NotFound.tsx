import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-muted px-4">
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardContent className="flex flex-col items-center gap-6 py-10">
          <AlertTriangle className="w-16 h-16 text-destructive" />
          <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
          <p className="text-muted-foreground">
            Oops! The page you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </CardContent>
      </Card>
    </div>
  );
}
