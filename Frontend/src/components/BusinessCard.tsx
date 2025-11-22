import React from "react";
import { Link } from "react-router-dom";
import { Business } from "@/types";
import { getImageUrl } from "@/lib/getImageUrl";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star, MapPin, Leaf } from "lucide-react";

interface BusinessCardProps {
  business: Business;
}

export const BusinessCard = ({ business }: BusinessCardProps) => {
  const logoUrl = getImageUrl(business.logo, 'https://via.placeholder.com/200');

  return (
    <Link to={`/business/${business._id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full group">
        <div className="relative h-32 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
          <img 
            src={logoUrl} 
            alt={business.name}
            className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
          />
          <div className="absolute top-3 right-3">
            <Badge className="bg-success text-success-foreground">
              <Leaf className="h-3 w-3 mr-1" />
              {business.sustainabilityScore}
            </Badge>
          </div>
        </div>
        
        <CardContent className="pt-4">
          <h3 className="font-bold text-lg text-foreground mb-2">{business.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {business.description}
          </p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4" />
            <span>{business.location}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {business.categories.slice(0, 2).map((category) => (
              <Badge key={category} variant="outline" className="text-xs">
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-semibold text-foreground">{business.averageRating}</span>
            <span className="text-sm text-muted-foreground ml-1">rating</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
