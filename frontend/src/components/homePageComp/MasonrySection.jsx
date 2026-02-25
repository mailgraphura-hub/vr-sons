import React from "react";
import { useEffect, useState } from "react";
import { getService } from "../../service/axios";

// --- DATA ---
// Client ki categories: Food Products, Spices, Agricultural Goods, Bricks 
// Masonry layout ko accha dikhane ke liye maine isme related products aur sub-categories add ki hain, jaise 'Powder'[cite: 71].
// const productCategories = [
//   { id: "01", title: "Premium Spices", height: "h-[280px]", img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2070&auto=format&fit=crop" },
//   { id: "06", title: "Agricultural Goods", height: "h-[400px]", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2074&auto=format&fit=crop" },
//   { id: "02", title: "Food Products", height: "h-[420px]", img: "https://images.unsplash.com/photo-1509315811345-672d83ef2fbc?q=80&w=2070&auto=format&fit=crop" },
//   { id: "07", title: "Construction Bricks", height: "h-[320px]", img: "https://images.unsplash.com/photo-1621259500073-7e62a3962d3a?q=80&w=2070&auto=format&fit=crop" },
//   { id: "03", title: "Spice Powders", height: "h-[300px]", img: "https://images.unsplash.com/photo-1626197031507-c17099753214?q=80&w=2070&auto=format&fit=crop" },
//   { id: "08", title: "Organic Grains", height: "h-[440px]", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2070&auto=format&fit=crop" },
//   { id: "04", title: "Raw Materials", height: "h-[280px]", img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=2089&auto=format&fit=crop" },
//   { id: "09", title: "Dry Fruits & Nuts", height: "h-[260px]", img: "https://images.unsplash.com/photo-1599577180579-7ba2bafbfb2f?q=80&w=2070&auto=format&fit=crop" },
//   { id: "05", title: "Export Quality Pulses", height: "h-[260px]", img: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=1950&auto=format&fit=crop" },
// ];

const MasonrySection = () => {

  const [productCategories, setProductCategories] = useState([]);

  const heights = [
    "h-[260px]",
    "h-[280px]",
    "h-[300px]",
    "h-[320px]",
    "h-[400px]",
    "h-[420px]",
    "h-[440px]"
  ];

  useEffect(() => {
    ; (
      async () => {
        const category = await getService("/customer/product/category");
        const subcategory = await getService("/customer/product/subcategory");

        if (!category.ok) {
          console.log(category.message);
          return
        }

        const categoryItems = category.data.data.categoryList.slice(0, 4);

        if (!subcategory.ok) {
          console.log(subcategory.message);
          return
        }

        const subcategoryItems = subcategory.data.data.subcategoryList.slice(0, 6);

        const combinedItems = [...categoryItems, ...subcategoryItems]
          .map((item, index) => ({
            id: item.skuId,
            title: item.name,
            img: item.categoryImage || item.subcategoryImage,
            height: heights[index % heights.length],
            ...item
          }));

        setProductCategories(combinedItems);
      }
    )()
  }, [])

  return (
    <section className="bg-white py-24">
      <div className="max-w-[1500px] mx-auto px-6">

        {/* Heading Section */}
        <div className="text-center mb-16">
          <p className="text-neutral-500 mb-2 font-medium tracking-wide uppercase">
            • Global Exports
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold text-neutral-900">
            Explore Our Product Categories
          </h2>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 space-y-4">
          {productCategories.map((card) => (
            <div
              key={card._id}
              className={`relative rounded-3xl overflow-hidden group cursor-pointer break-inside-avoid ${card.height}`}
            >
              {/* Product Image */}
              <img
                src={card.img}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt={card.title}
              />

              {/* Dark Gradient for Text Visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90"></div>

              {/* Arrow Icon */}
              <div className="absolute top-5 right-5 z-10">
                <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center shadow-md transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                  →
                </div>
              </div>

              {/* Text Content */}
              <div className="absolute bottom-6 left-6 text-white z-10">
                <p className="text-sm font-light opacity-80 mb-1 tracking-wider">{card.id}</p>
                <h3 className="text-xl font-medium tracking-wide">
                  {card.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Button  */}
        <div className="mt-16 flex justify-center">
          <button className="px-8 py-3 rounded-full bg-black text-white text-sm font-medium hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            View All Products
          </button>
        </div>

      </div>
    </section>
  );
};

export default MasonrySection;