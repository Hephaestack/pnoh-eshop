"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw } from 'lucide-react';

import useCartStore from '@/lib/store/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Sample product data
const sampleProducts = [
  {
    id: 1,
    name: 'Χειροποίητο Δαχτυλίδι Ασημένιο',
    price: 45.00,
    originalPrice: 55.00,
    image: '/images/silver-ring.jpg',
    rating: 4.8,
    reviews: 124,
    description: 'Εκλεπτυσμένο χειροποίητο δαχτυλίδι από ασήμι 925, με μοναδικό σχέδιο που εκφράζει την κομψότητα και τη γυναικεία αισθητική.',
    variants: {
      sizes: ['S', 'M', 'L', 'XL'],
    },
    inStock: true,
    fastShipping: true
  },
  {
    id: 2,
    name: 'Χρυσό Κολιέ με Κρεμαστό',
    price: 89.00,
    image: '/images/gold-necklace.jpg',
    rating: 4.9,
    reviews: 89,
    description: 'Πολυτελές χρυσό κολιέ με εκλεπτυσμένο κρεμαστό, ιδανικό για ειδικές περιστάσεις και καθημερινή χρήση.',
    variants: {
      lengths: ['40cm', '45cm', '50cm'],
    },
    inStock: true,
    fastShipping: false
  },
  {
    id: 3,
    name: 'Σκουλαρίκια με Πέρλες',
    price: 32.00,
    originalPrice: 42.00,
    image: '/images/pearl-earrings.jpg',
    rating: 4.7,
    reviews: 67,
    description: 'Κλασικά σκουλαρίκια με φυσικές πέρλες, που προσδίδουν αριστοκρατική αύρα σε κάθε εμφάνιση.',
    variants: {},
    inStock: false,
    fastShipping: true
  }
];

function ProductCard({ product }) {
  const [selectedVariant, setSelectedVariant] = useState({});
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      variant: selectedVariant,
      quantity: 1
    });

    // Show a simple success message (you can replace with a toast)
    alert('Το προϊόν προστέθηκε στο καλάθι!');
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm mx-auto"
    >
      <Card className="bg-[#232326] border-gray-700 overflow-hidden group hover:shadow-xl transition-all duration-300">
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <img
            src={product.image || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {hasDiscount && (
              <Badge className="bg-red-600 text-white">
                -{discountPercentage}%
              </Badge>
            )}
            {product.fastShipping && (
              <Badge className="bg-green-600 text-white">
                Ταχεία Αποστολή
              </Badge>
            )}
            {!product.inStock && (
              <Badge className="bg-gray-600 text-white">
                Εξαντλημένο
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 w-8 h-8 p-0 rounded-full bg-white/90 hover:bg-white"
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            <Heart 
              className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </Button>
        </div>

        {/* Product Info */}
        <CardContent className="p-4">
          {/* Rating */}
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-400'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400">
              {product.rating} ({product.reviews})
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Variants */}
          {product.variants.sizes && (
            <div className="mb-3">
              <span className="text-sm text-gray-300 block mb-1">Μέγεθος:</span>
              <div className="flex gap-2">
                {product.variants.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedVariant({ ...selectedVariant, size })}
                    className={`px-2 py-1 text-xs border rounded ${
                      selectedVariant.size === size
                        ? 'border-white bg-white text-black'
                        : 'border-gray-600 text-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.variants.lengths && (
            <div className="mb-3">
              <span className="text-sm text-gray-300 block mb-1">Μήκος:</span>
              <div className="flex gap-2">
                {product.variants.lengths.map((length) => (
                  <button
                    key={length}
                    onClick={() => setSelectedVariant({ ...selectedVariant, length })}
                    className={`px-2 py-1 text-xs border rounded ${
                      selectedVariant.length === length
                        ? 'border-white bg-white text-black'
                        : 'border-gray-600 text-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {length}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-white text-xl font-bold">
              €{product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-gray-500 text-sm line-through">
                €{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full bg-white text-black hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-300"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.inStock ? 'Προσθήκη στο Καλάθι' : 'Εξαντλημένο'}
          </Button>

          {/* Features */}
          <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <Truck className="w-3 h-3" />
              <span>Δωρεάν αποστολή €50+</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>Εγγύηση</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function SampleProductsPage() {
  return (
    <div className="min-h-screen bg-[#18181b] py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Δείγμα Προϊόντων
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Δοκιμάστε τη λειτουργικότητα του καλαθιού με αυτά τα δείγματα προϊόντων. 
            Προσθέστε προϊόντα στο καλάθι και προχωρήστε στην ολοκλήρωση παραγγελίας.
          </p>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center items-center space-x-8 mb-12"
        >
          <div className="flex items-center space-x-2 text-gray-300">
            <Truck className="w-5 h-5" />
            <span className="text-sm">Δωρεάν Μεταφορικά €50+</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300">
            <Shield className="w-5 h-5" />
            <span className="text-sm">Εγγύηση Ποιότητας</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300">
            <RotateCcw className="w-5 h-5" />
            <span className="text-sm">30 Ημέρες Επιστροφή</span>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <Card className="bg-[#232326] border-gray-700 p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              Είστε έτοιμοι να δοκιμάσετε το καλάθι;
            </h2>
            <p className="text-gray-400 mb-6">
              Προσθέστε κάποια προϊόντα στο καλάθι και δείτε πώς λειτουργεί 
              η ολοκληρωμένη διαδικασία παραγγελίας.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-black hover:bg-gray-100" asChild>
                <a href="#products">
                  Δείτε τα Προϊόντα
                </a>
              </Button>
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700" asChild>
                <a href="/cart">
                  Προβολή Καλαθιού
                </a>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
