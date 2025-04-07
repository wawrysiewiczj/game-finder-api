import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Home, Search } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6 p-8 max-w-xl">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link to="/">
            <Button className="gap-2 w-full sm:w-auto">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Link to="/browse">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <Search className="h-4 w-4" />
              Browse Games
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
