import { Link } from "react-router-dom";
import { Leaf, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const Header = () => {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-full p-2">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">EcoDiscover</span>
          </Link>
          
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search eco-friendly products..." 
                className="pl-10"
              />
            </div>
          </div>

          <nav className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link to="/products">
              <Button variant="ghost">Products</Button>
            </Link>
            <Link to="/businesses">
              <Button variant="ghost">Businesses</Button>
            </Link>
            <Link to="/login">
              <Button variant="default">Sign In</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
