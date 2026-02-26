import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Michael Johnson",
    company: "Global Harvest Inc.",
    country: "USA",
    rating: 5,
    review:
      "Very reliable export partner. Transparent communication and consistent product quality.",
  },
  {
    name: "Carlos Rivera",
    company: "Rivera Imports",
    country: "Spain",
    rating: 5,
    review:
      "The spices quality exceeded expectations. Excellent compliance and shipment handling.",
  },
  {
    name: "David Lee",
    company: "Asia Trade Hub",
    country: "Singapore",
    rating: 5,
    review:
      "Smooth documentation process and professional support throughout the shipment cycle.",
  },
  {
    name: "Omar Hassan",
    company: "Desert Foods Co.",
    country: "Qatar",
    rating: 5,
    review: "High packaging standards and dependable supply chain management.",
  },
  {
    name: "James Wilson",
    company: "Wilson Imports Ltd.",
    country: "UK",
    rating: 5,
    review:
      "Trustworthy supplier with strong export compliance and product consistency.",
  },
];

const getInitials = (name) => {
  const parts = name.split(" ");
  return parts[0][0] + (parts[1] ? parts[1][0] : "");
};

/* Container animation */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

/* Card initial load animation */
const cardVariants = {
  hidden: { opacity: 0, y: 60, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const TestimonialSection = () => {
  const [paused, setPaused] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="py-28 bg-gradient-to-b from-white to-gray-100 overflow-hidden relative"
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-800">
          Trusted By Global Importers
        </h2>
        <p className="text-gray-600 mt-4 max-w-xl mx-auto">
          Building long-term international trade partnerships through quality,
          compliance and reliability.
        </p>
      </div>

      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          className="flex gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          animate={{ x: paused ? undefined : ["0%", "-100%"] }}
          transition={{
            x: {
              repeat: Infinity,
              duration: 35,
              ease: "linear",
            },
          }}
        >
          {[...testimonials, ...testimonials].map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ scale: 1.05, y: -8 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="min-w-[360px] bg-white rounded-3xl p-8 shadow-lg border border-gray-200 flex flex-col justify-between hover:shadow-2xl transition-all duration-300"
            >
              {/* Profile Row */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-semibold text-lg shadow-md">
                  {getInitials(item.name)}
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800">{item.name}</h4>
                  <p className="text-sm text-gray-500">{item.company}</p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex mb-4">
                {[...Array(item.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-yellow-400 fill-yellow-400 mr-1"
                  />
                ))}
              </div>

              {/* Review */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                "{item.review}"
              </p>

              {/* Country Badge */}
              <div>
                <span className="inline-block text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                  {item.country}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Edge Fade */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      </div>
    </motion.section>
  );
};

export default TestimonialSection;
