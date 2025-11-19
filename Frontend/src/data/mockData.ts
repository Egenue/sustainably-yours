import { Product, Business } from "@/types";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Organic Cotton T-Shirt",
    brand: "EcoWear",
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    description: "100% organic cotton, ethically sourced and produced with minimal environmental impact.",
    sustainabilityScore: 92,
    price: 29.99,
    certifications: ["GOTS", "Fair Trade", "Carbon Neutral"],
    averageRating: 4.7,
    ratings: [
      {
        id: "r1",
        userId: "u1",
        userName: "Sarah M.",
        rating: 5,
        comment: "Amazing quality and truly eco-friendly!",
        date: "2024-03-10",
        aspects: { materials: 5, packaging: 5, carbonFootprint: 4, laborPractices: 5 }
      }
    ]
  },
  {
    id: "2",
    name: "Bamboo Toothbrush Set",
    brand: "GreenSmile",
    category: "Personal Care",
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400",
    description: "Biodegradable bamboo toothbrushes with charcoal-infused bristles.",
    sustainabilityScore: 95,
    price: 12.99,
    certifications: ["FSC Certified", "Plastic-Free"],
    averageRating: 4.9,
    ratings: []
  },
  {
    id: "3",
    name: "Reusable Water Bottle",
    brand: "HydroEco",
    category: "Home & Kitchen",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
    description: "Stainless steel water bottle, keeps drinks cold for 24 hours.",
    sustainabilityScore: 88,
    price: 24.99,
    certifications: ["BPA-Free", "Recyclable"],
    averageRating: 4.6,
    ratings: []
  },
  {
    id: "4",
    name: "Solar Power Bank",
    brand: "SunCharge",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
    description: "Portable solar charger with 20,000mAh capacity.",
    sustainabilityScore: 85,
    price: 49.99,
    certifications: ["Energy Star", "RoHS"],
    averageRating: 4.5,
    ratings: []
  },
  {
    id: "5",
    name: "Beeswax Food Wraps",
    brand: "WrapItGreen",
    category: "Home & Kitchen",
    image: "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=400",
    description: "Reusable food storage wraps made from organic cotton and beeswax.",
    sustainabilityScore: 93,
    price: 18.99,
    certifications: ["Organic", "Plastic-Free", "Compostable"],
    averageRating: 4.8,
    ratings: []
  },
  {
    id: "6",
    name: "Recycled Yoga Mat",
    brand: "ZenFlow",
    category: "Sports & Fitness",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
    description: "Non-toxic yoga mat made from recycled rubber.",
    sustainabilityScore: 87,
    price: 39.99,
    certifications: ["Recycled Content", "Non-Toxic"],
    averageRating: 4.4,
    ratings: []
  }
];

export const mockBusinesses: Business[] = [
  {
    id: "b1",
    name: "EcoWear",
    description: "Sustainable fashion brand committed to ethical production and organic materials.",
    logo: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=200",
    sustainabilityScore: 91,
    categories: ["Clothing", "Fashion"],
    location: "Portland, OR",
    website: "https://ecowear.example",
    averageRating: 4.7,
    ratings: []
  },
  {
    id: "b2",
    name: "GreenSmile",
    description: "Personal care products with zero plastic waste and natural ingredients.",
    logo: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200",
    sustainabilityScore: 94,
    categories: ["Personal Care", "Health"],
    location: "Seattle, WA",
    website: "https://greensmile.example",
    averageRating: 4.8,
    ratings: []
  }
];
