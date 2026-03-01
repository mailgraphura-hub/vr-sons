import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/blog/Sidebar";
import { getService } from "../../service/axios";
import Navbar from "../../components/homePageComp/Navbar";
import Footer from "../../components/homePageComp/Footer";

export default function Blog() {
  useEffect(() => {
    document.title = "Import Export Insights & Guides";
  }, []);

  const getFallbackImage = (title) => {
    const colors = [
      "1a1a2e/e94560",
      "0f3460/e94560",
      "16213e/0f3460",
      "1b262c/0a3d62",
      "2c3e50/3498db",
      "1a1a1a/f39c12",
    ];
    const index = title ? title.charCodeAt(0) % colors.length : 0;
    return `https://placehold.co/600x400/${colors[index]}?text=${encodeURIComponent(
      title?.slice(0, 30) || "Blog"
    )}`;
  };

  const [allBlogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const apiResponse = await getService("/customer/blog");
        if (!apiResponse.ok) {
          console.log(apiResponse.message);
          return;
        }
        setBlogs(apiResponse.data.data.blogList);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* ── HERO SECTION ── */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden mt-16 md:mt-0">
        <style>{`
          @keyframes kenBurns {
            0%   { transform: scale(1.05) translate(0px, 0px); }
            25%  { transform: scale(1.12) translate(-15px, -8px); }
            50%  { transform: scale(1.08) translate(-8px, 10px); }
            75%  { transform: scale(1.13) translate(12px, -6px); }
            100% { transform: scale(1.05) translate(0px, 0px); }
          }

          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          @keyframes overlayPulse {
            0%, 100% { opacity: 0.60; }
            50%       { opacity: 0.50; }
          }

          @keyframes cardFadeIn {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          .hero-img     { animation: kenBurns 18s ease-in-out infinite; }
          .hero-overlay { animation: overlayPulse 18s ease-in-out infinite; }
          .hero-content { animation: fadeInUp 1s ease-out both; }

          .blog-card {
            animation: cardFadeIn 0.5s ease-out both;
          }

          .blog-card:hover .card-img {
            transform: scale(1.05);
          }
        `}</style>

        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1578575437130-527eed3abbec"
          alt="Import Export Logistics"
          className="object-cover w-full h-full hero-img"
        />

        {/* Overlay */}
        <div className="absolute inset-0 hero-overlay bg-black/60" />

        {/* Hero Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white hero-content">
          <span className="mb-3 inline-block px-4 py-1 text-xs font-semibold tracking-widest uppercase bg-white/10 border border-white/20 rounded-full backdrop-blur-sm">
            Trade Knowledge Hub
          </span>
          <h1 className="max-w-4xl text-3xl font-bold leading-tight md:text-5xl drop-shadow-lg">
            Import Export Insights &amp; Guides
          </h1>
          <p className="max-w-2xl mt-4 text-base md:text-lg text-white/80">
            Practical strategies, documentation help, global trade insights and
            step-by-step guides to grow your international business.
          </p>
          <Link
            to="/ContactUs"
            className="inline-block px-6 py-3 mt-6 font-semibold transition-all shadow-lg bg-black/80 hover:bg-black rounded-xl hover:scale-105"
          >
            Get Expert Guidance →
          </Link>
        </div>
      </div>

      {/* ── BLOG LAYOUT ── */}
      <div className="container px-4 py-12 mx-auto">
        <div className="grid gap-8 lg:grid-cols-4">

          {/* ── Blog Grid ── */}
          <div className="lg:col-span-3">
            {loading ? (
              /* Skeleton Loader */
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
                  >
                    <div className="w-full h-48 bg-gray-200" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-100 rounded w-1/3 mt-4" />
                      <div className="h-8 bg-gray-200 rounded-lg w-28 mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : allBlogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <svg className="w-16 h-16 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium">No blog posts yet.</p>
                <p className="text-sm mt-1">Check back soon for new articles.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {allBlogs.map((blog, index) => (
                  <div
                    key={blog._id}
                    className="blog-card bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    {/* Card Image */}
                    <div className="w-full h-48 overflow-hidden flex-shrink-0">
                      <img
                        src={
                          blog.blogMedia?.length
                            ? blog.blogMedia[0]
                            : getFallbackImage(blog.title)
                        }
                        alt={blog.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getFallbackImage(blog.title);
                        }}
                        className="card-img object-cover w-full h-full transition-transform duration-500"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-col flex-1 p-5">
                      {/* Category tag (optional — uses first tag if available) */}
                      {blog.category && (
                        <span className="mb-2 inline-block self-start px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full">
                          {blog.category}
                        </span>
                      )}

                      {/* Title */}
                      <h2 className="mb-2 text-base font-semibold leading-snug line-clamp-2 group-hover:text-black transition-colors">
                        {blog.title}
                      </h2>

                      {/* Meta */}
                      <p className="text-xs text-gray-400">
                        <span className="font-medium text-gray-500">
                          {blog.author || "Admin"}
                        </span>
                        <span className="mx-1">•</span>
                        {new Date(blog.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>

                      {/* Spacer pushes button to bottom */}
                      <div className="flex-1" />

                      {/* CTA */}
                      <div className="mt-4">
                        <Link
                          to={`/blog/${blog._id}`}
                          className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white rounded-lg bg-black/80 hover:bg-black transition-all hover:gap-2"
                        >
                          Read More <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}