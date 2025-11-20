import { Link } from "react-router-dom";
import { Product } from "@/types";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star, Leaf } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const productId = (product as any)._id || product.id;
  const imageUrl = product.image?.startsWith('http') 
    ? product.image 
    : product.image?.startsWith('/uploads') 
      ? `http://localhost:5000${product.image}`
      : product.image || 'https://via.placeholder.com/400';

  return (
    <Link to={`/product/${productId}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full group">
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <Badge className="bg-success text-success-foreground">
              <Leaf className="h-3 w-3 mr-1" />
              {product.sustainabilityScore}
            </Badge>
          </div>
        </div>
        
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
          <h3 className="font-semibold text-foreground mb-2 line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.description}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {product.certifications && product.certifications.length > 0 ? (
              product.certifications.slice(0, 2).map((cert) => (
                <Badge key={cert} variant="outline" className="text-xs">
                  {cert}
                </Badge>
              ))
            ) : null}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-semibold text-foreground">{product.averageRating}</span>
          </div>
          <span className="text-lg font-bold text-primary">${product.price}</span>
        </CardFooter>
      </Card>
    </Link>
  );
};
