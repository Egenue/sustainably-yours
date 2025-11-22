import { Header } from "@/components/Header";
import { BusinessCard } from "@/components/BusinessCard";
import { Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
import { businessesService } from "@/lib/services/businesses";

const Businesses = () => {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    let mounted = true;
    businessesService
      .list()
      .then((res) => { if (!mounted) return; setBusinesses(res.data || []); })
      .catch(() => { if (!mounted) return; setBusinesses([]); })
    return () => { mounted = false; };
  }, []);

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
          {businesses.map((business) => (
            <BusinessCard key={business._id} business={business} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Businesses;
