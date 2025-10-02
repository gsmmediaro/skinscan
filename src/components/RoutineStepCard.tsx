import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Play, Clock } from "lucide-react";

interface ProductRecommendation {
  name: string;
  brand: string;
  price: "$" | "$$" | "$$$";
  ingredients: string[];
  reason: string;
  rating: number;
  reviews: number;
  image: string;
  url: string;
}

interface RoutineStepCardProps {
  stepNumber: number;
  stepName: string;
  why: string;
  howTo: string;
  waitTime: string;
  products: ProductRecommendation[];
  videoUrl?: string;
}

export const RoutineStepCard = ({
  stepNumber,
  stepName,
  why,
  howTo,
  waitTime,
  products,
  videoUrl,
}: RoutineStepCardProps) => {
  const [showProducts, setShowProducts] = useState(false);

  return (
    <Card className="p-6 relative">
      {/* Step Number Badge */}
      <div className="absolute -left-4 top-6 w-10 h-10 rounded-full bg-success text-white flex items-center justify-center font-bold shadow-md">
        {stepNumber}
      </div>

      <div className="ml-8">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">{stepName}</h3>
          <p className="text-muted-foreground text-sm mb-2">{why}</p>
        </div>

        {/* How To */}
        <div className="mb-4 p-4 bg-accent/30 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">How to use:</h4>
          <p className="text-sm">{howTo}</p>
        </div>

        {/* Wait Time */}
        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Wait time: {waitTime}</span>
        </div>

        {/* Video Tutorial */}
        {videoUrl && (
          <Button variant="outline" size="sm" className="mb-4">
            <Play className="w-4 h-4 mr-2" />
            Watch how to apply
          </Button>
        )}

        {/* Product Recommendations */}
        <div>
          <Button
            variant="ghost"
            onClick={() => setShowProducts(!showProducts)}
            className="w-full justify-between p-0 h-auto hover:bg-transparent"
          >
            <span className="font-semibold">Product Recommendations ({products.length})</span>
            {showProducts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>

          {showProducts && (
            <div className="mt-4 space-y-4">
              {products.map((product, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center">
                      <span className="text-2xl">🧴</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h5 className="font-semibold">{product.brand}</h5>
                          <p className="text-sm text-muted-foreground">{product.name}</p>
                        </div>
                        <span className="text-success font-bold">{product.price}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < product.rating ? "text-warning" : "text-muted"}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviews} reviews)
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground mb-2">
                        <span className="font-semibold">Key ingredients:</span> {product.ingredients.join(", ")}
                      </p>

                      <p className="text-xs text-success mb-3">
                        ✓ {product.reason}
                      </p>

                      <Button size="sm" variant="outline" className="w-full">
                        View Product
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
