import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { BusinessCard } from "@/components/BusinessCard";
import { businessesAPI } from "@/lib/api";
import { Briefcase, Loader2 } from "lucide-react";

const Businesses = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['businesses'],
    queryFn: () => businessesAPI.getAll({ limit: 100 }),
  });

  const businesses = data?.businesses || [];

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

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">Failed to load businesses. Please try again later.</p>
          </div>
        )}

        {/* Businesses Grid */}
        {!isLoading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business: any) => (
                <BusinessCard key={business._id || business.id} business={business} />
              ))}
            </div>

            {businesses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No businesses found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Businesses;
