import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { RatingDisplay } from "@/components/RatingDisplay";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { productsService } from "@/lib/services/products";
import { API_ORIGIN } from '@/lib/api';
import { getImageUrl } from '@/lib/getImageUrl';
import { Leaf, Award, Package, Globe, ArrowLeft } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    productsService.get(id)
      .then((res) => { if (!mounted) return; setProduct(res.data || null); })
      .catch(() => { if (!mounted) return; setProduct(null); })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground">Loading product details...</h1>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground">Product not found</h1>
          <Link to="/products">
            <Button className="mt-4">Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(product.image, 'https://via.placeholder.com/400');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Link to="/products">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            <img 
              src={imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div>
            <p className="text-muted-foreground mb-2">{product.brand}</p>
            <h1 className="text-4xl font-bold text-foreground mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <RatingDisplay rating={product.averageRating} size="lg" />
              <span className="text-sm text-muted-foreground">
                ({product.ratings.length} {product.ratings.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            <div className="text-3xl font-bold text-primary mb-6">${product.price}</div>

            <p className="text-foreground mb-6 leading-relaxed">{product.description}</p>

            <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-success" />
                  <span className="font-semibold text-foreground">Sustainability Score</span>
                </div>
                <span className="text-2xl font-bold text-success">{product.sustainabilityScore}</span>
              </div>
              <Progress value={product.sustainabilityScore} className="h-2" />
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Certifications
              </h3>
              <div className="flex gap-2 flex-wrap">
                {product.certifications.map((cert) => (
                  <Badge key={cert} variant="secondary">{cert}</Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button size="lg" className="flex-1">Add to Cart</Button>
              <Button size="lg" variant="outline">Learn More</Button>
            </div>
          </div>
        </div>

        {/* Sustainability Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Sustainability Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Materials</span>
                  <span className="text-sm text-muted-foreground">95/100</span>
                </div>
                <Progress value={95} className="h-2 mb-4" />
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Packaging</span>
                  <span className="text-sm text-muted-foreground">90/100</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Carbon Footprint</span>
                  <span className="text-sm text-muted-foreground">88/100</span>
                </div>
                <Progress value={88} className="h-2 mb-4" />
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Labor Practices</span>
                  <span className="text-sm text-muted-foreground">95/100</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <Card>
          <CardHeader>
            <CardTitle>Rate This Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Your Rating</Label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button key={star} variant="outline" size="icon" className="h-10 w-10">
                      {star}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="review">Your Review</Label>
                <Textarea 
                  id="review"
                  placeholder="Share your experience with this product..."
                  className="mt-2"
                  rows={4}
                />
              </div>

              <Button>Submit Review</Button>
            </div>

            {product.ratings.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-foreground mb-4">Customer Reviews</h3>
                <div className="space-y-4">
                  {product.ratings.map((rating) => (
                    <div key={rating.id} className="border-b border-border pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">{rating.userName}</span>
                        <span className="text-sm text-muted-foreground">{rating.date}</span>
                      </div>
                      <RatingDisplay rating={rating.rating} size="sm" showNumber={false} />
                      <p className="text-foreground mt-2">{rating.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetail;
