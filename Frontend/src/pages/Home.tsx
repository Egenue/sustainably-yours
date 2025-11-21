import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { BusinessCard } from "@/components/BusinessCard";
import { productsService } from "@/lib/services/products";
import { businessesService } from "@/lib/services/businesses";
import { Leaf, Award, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([productsService.list({ limit: 6 }), businessesService.list({ limit: 6 })])
      .then(([pr, br]) => { if (!mounted) return; setProducts(pr.data || []); setBusinesses(br.data || []); })
      .catch(() => { if (!mounted) return; setProducts([]); setBusinesses([]); })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const featuredProducts = products.slice(0, 3);
  const featuredBusinesses = businesses;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full mb-6">
              <Leaf className="h-4 w-4" />
              <span className="text-sm font-medium">Discover Sustainable Living</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Find Eco-Friendly Products & Businesses
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of conscious consumers making sustainable choices. 
              Rate brands, discover green alternatives, and make a positive impact.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="text-lg">
                  Explore Products
                </Button>
              </Link>
              <Link to="/businesses">
                <Button size="lg" variant="outline" className="text-lg">
                  Browse Businesses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Eco Products</div>
            </div>
            <div className="text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">200+</div>
              <div className="text-sm text-muted-foreground">Green Businesses</div>
            </div>
            <div className="text-center">
              <div className="bg-success/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-success" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">10K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">25K+</div>
              <div className="text-sm text-muted-foreground">Reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Highly rated eco-friendly products</p>
            </div>
            <Link to="/products">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Sustainable Businesses</h2>
              <p className="text-muted-foreground">Companies leading the green revolution</p>
            </div>
            <Link to="/businesses">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {businesses.map((b) => (
              <BusinessCard key={b._id} business={b} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Make Every Purchase Count
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Your ratings help others make informed decisions. Join our community and 
              contribute to a more sustainable future.
            </p>
            <Button size="lg" variant="secondary" className="text-lg">
              Start Rating Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">EcoDiscover</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 EcoDiscover. Making sustainability accessible to all.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
