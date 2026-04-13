import { Heart, ShoppingBag, ThumbsUp } from "lucide-react";

function Button({ handleAddToCart, adding }) {
  return (
    <button
      onClick={handleAddToCart}
      disabled={adding}
      className="relative overflow-hidden rounded-lg group transition-colors duration-300 hover:bg-gray-200 text-2xl h-full w-[70%] lg:w-[80%]"
    >
      {/* TOP LAYER */}
      <span className="absolute inset-0 flex items-center justify-center gap-2 bg-gray-500 text-white font-[bebas-neue] transform translate-y-0 group-hover:-translate-y-full transition-transform duration-300">
        <ShoppingBag size={20} /> Add to Cart
      </span>

      {/* BOTTOM LAYER */}
      <span className="absolute inset-0 flex items-center justify-center gap-2 bg-gray-200 text-gray-600 font-[bebas-neue] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <ShoppingBag size={20} /> Add to Cart
      </span>
    </button>
  );
}

export default Button;
