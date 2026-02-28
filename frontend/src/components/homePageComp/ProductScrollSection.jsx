import React, { useState, useEffect } from "react";
import { getService } from "../../service/axios";

const ProductScrollSection = () => {
  const [scrollItems, setScrollItems] = useState([])
  useEffect(() => {
    ; (
      async () => {
        const apiResponse = await getService("/customer/product/category");

        if (!apiResponse.ok) {
          console.log(apiResponse.message);
          return
        }
        setScrollItems(apiResponse.data.data.categoryList)

      }
    )()
  }, [])

  return (
    <section className="bg-neutral-200 pb-32 overflow-hidden">

      {/* Animation CSS */}
      <style>
        {`
          @keyframes productScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          .animate-product-scroll {
            animation: productScroll 30s linear infinite;
          }

          .animate-product-scroll:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="max-w-[1500px] mx-auto px-8">

        <h2 className="text-4xl font-semibold mb-16 text-center text-neutral-900">
          Our Product Categories
        </h2>

        <div className="flex gap-12 animate-product-scroll py-8 w-max">

          {(scrollItems.length !== 0) ? [...scrollItems, ...scrollItems].map((item, index) => (
            <div
              key={index}
              className="w-[420px] shrink-0 bg-white rounded-3xl overflow-hidden shadow-xl group hover:-translate-y-4 transition-all duration-300"
            >
              <div className="overflow-hidden">
                <img
                  src={item?.categoryImage}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={item?.name}
                />
              </div>

              <div className="p-8 pb-10">
                <h3 className="font-semibold text-2xl mb-3 text-neutral-900">
                  {item?.name}
                </h3>

                <p className="text-neutral-500 text-sm leading-relaxed">
                  {item.decription}
                </p>
              </div>

            </div>
          )) : <div className="text-center py-20">
            <p className="text-2xl font-semibold text-gray-700">
              No Categories Available
            </p>
            <p className="text-gray-500 mt-3">
              Please check back later.
            </p>
          </div>}

        </div>

        {/* CTA Button */}
        <div className="text-center mt-20">
          <a
            href="/categories"
            className="px-8 py-3 bg-black text-white rounded-full text-sm font-medium hover:scale-105 transition-all duration-300"
          >
            View All Products
          </a>
        </div>

      </div>
    </section>
  );
};

export default ProductScrollSection;