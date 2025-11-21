import { Header } from "@/components/Header";
import { BusinessCard } from "@/components/BusinessCard";
import { mockBusinesses } from "@/data/mockData";
import { Briefcase } from "lucide-react";

const Businesses = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Sustainable Businesses</h1>
          </div>
          <p className="text-muted-foreground">Companies committed to environmental responsibility</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockBusinesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Businesses;
