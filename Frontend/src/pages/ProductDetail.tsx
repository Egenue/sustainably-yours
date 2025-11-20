import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { RatingDisplay } from "@/components/RatingDisplay";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { productsAPI, ratingsAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Leaf, Award, Globe, ArrowLeft, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [selectedRating, setSelectedRating] = useState(5);
  const [comment, setComment] = useState("");

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.getById(id!),
    enabled: !!id,
  });

  const { data: ratings = [] } = useQuery({
    queryKey: ['ratings', 'product', id],
    queryFn: () => ratingsAPI.getByProduct(id!),
    enabled: !!id,
  });

  const createRatingMutation = useMutation({
    mutationFn: ratingsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      queryClient.invalidateQueries({ queryKey: ['ratings', 'product', id] });
      toast({
        title: "Review submitted",
        description: "Thank you for your review!",
      });
      setComment("");
      setSelectedRating(5);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to submit review",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitReview = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please log in to submit a review.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!id) return;

    createRatingMutation.mutate({
      productId: id,
      rating: selectedRating,
      comment,
      aspects: {
        materials: selectedRating,
        packaging: selectedRating,
        carbonFootprint: selectedRating,
        laborPractices: selectedRating,
      },
    });
  };

  // Calculate average aspects from ratings
  const averageAspects = ratings.length > 0
    ? ratings.reduce(
        (acc, rating) => ({
          materials: acc.materials + (rating.aspects?.materials || 0),
          packaging: acc.packaging + (rating.aspects?.packaging || 0),
          carbonFootprint: acc.carbonFootprint + (rating.aspects?.carbonFootprint || 0),
          laborPractices: acc.laborPractices + (rating.aspects?.laborPractices || 0),
        }),
        { materials: 0, packaging: 0, carbonFootprint: 0, laborPractices: 0 }
      )
    : { materials: 0, packaging: 0, carbonFootprint: 0, laborPractices: 0 };

  const aspectAverages = ratings.length > 0
    ? {
        materials: Math.round((averageAspects.materials / ratings.length) * 20),
        packaging: Math.round((averageAspects.packaging / ratings.length) * 20),
        carbonFootprint: Math.round((averageAspects.carbonFootprint / ratings.length) * 20),
        laborPractices: Math.round((averageAspects.laborPractices / ratings.length) * 20),
      }
    : { materials: 0, packaging: 0, carbonFootprint: 0, laborPractices: 0 };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !product) {
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

  // Handle image URL - if it's a relative path, prepend API base URL
  const imageUrl = product.image?.startsWith('http') 
    ? product.image 
    : product.image?.startsWith('/uploads') 
      ? `http://localhost:5000${product.image}`
      : product.image || 'https://via.placeholder.com/400';

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
              <RatingDisplay rating={product.averageRating || 0} size="lg" />
              <span className="text-sm text-muted-foreground">
                ({ratings.length} {ratings.length === 1 ? 'review' : 'reviews'})
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
                {product.certifications && product.certifications.length > 0 ? (
                  product.certifications.map((cert: string) => (
                    <Badge key={cert} variant="secondary">{cert}</Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No certifications listed</span>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button size="lg" className="flex-1">Add to Cart</Button>
              <Button size="lg" variant="outline">Learn More</Button>
            </div>
          </div>
        </div>

        {/* Sustainability Breakdown */}
        {ratings.length > 0 && (
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
                    <span className="text-sm text-muted-foreground">{aspectAverages.materials}/100</span>
                  </div>
                  <Progress value={aspectAverages.materials} className="h-2 mb-4" />
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Packaging</span>
                    <span className="text-sm text-muted-foreground">{aspectAverages.packaging}/100</span>
                  </div>
                  <Progress value={aspectAverages.packaging} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Carbon Footprint</span>
                    <span className="text-sm text-muted-foreground">{aspectAverages.carbonFootprint}/100</span>
                  </div>
                  <Progress value={aspectAverages.carbonFootprint} className="h-2 mb-4" />
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Labor Practices</span>
                    <span className="text-sm text-muted-foreground">{aspectAverages.laborPractices}/100</span>
                  </div>
                  <Progress value={aspectAverages.laborPractices} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                    <Button
                      key={star}
                      variant={selectedRating >= star ? "default" : "outline"}
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => setSelectedRating(star)}
                    >
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
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleSubmitReview}
                disabled={createRatingMutation.isPending}
              >
                {createRatingMutation.isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </div>

            {ratings.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-foreground mb-4">Customer Reviews</h3>
                <div className="space-y-4">
                  {ratings.map((rating: any) => (
                    <div key={rating._id || rating.id} className="border-b border-border pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">{rating.userName}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(rating.date).toLocaleDateString()}
                        </span>
                      </div>
                      <RatingDisplay rating={rating.rating} size="sm" showNumber={false} />
                      <p className="text-foreground mt-2">{rating.comment || "No comment provided"}</p>
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
