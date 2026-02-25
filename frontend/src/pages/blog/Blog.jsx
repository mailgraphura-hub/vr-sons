import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import blogs from "../../data/blogData";
import Sidebar from "../../components/blog/Sidebar";
import { getService } from "../../service/axios";
import Navbar from "../../components/homePageComp/Navbar";
import Footer from "../../components/homePageComp/Footer";

export default function Blog() {

  useEffect(() => {
    document.title = "Import Export Insights & Guides";
  }, []);

  const getOnlineImage = (title) => {
    return `https://source.unsplash.com/600x400/?export,shipping,logistics,${encodeURIComponent(
      title
    )}`;
  };

  // const allBlogs = blogs.map((blog) => ({
  //   ...blog,
  //   image: blog.image ? blog.image : getOnlineImage(blog.title),
  // }));

  const [allBlogs, setBlogs] = useState([])

  useEffect(() => {
    ; (
      async () => {
        const apiResponse = await getService("/customer/blog");

        if (!apiResponse.ok) {
          console.log(apiResponse.message);
          return
        }

        console.log(apiResponse.data.data.blogList)

        setBlogs(apiResponse.data.data.blogList)

      }
    )()
  }, [])

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <Navbar/>

      {/* HERO SECTION */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">

        {/* Keyframe styles */}
        <style>{`
          @keyframes kenBurns {
            0%   { transform: scale(1.05) translate(0px, 0px); }
            25%  { transform: scale(1.12) translate(-15px, -8px); }
            50%  { transform: scale(1.08) translate(-8px, 10px); }
            75%  { transform: scale(1.13) translate(12px, -6px); }
            100% { transform: scale(1.05) translate(0px, 0px); }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(24px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes overlayPulse {
            0%, 100% { opacity: 0.60; }
            50%       { opacity: 0.50; }
          }

          .hero-img {
            animation: kenBurns 18s ease-in-out infinite;
          }

          .hero-overlay {
            animation: overlayPulse 18s ease-in-out infinite;
          }

          .hero-content {
            animation: fadeInUp 1s ease-out both;
          }
        `}</style>

        {/* Background Image with Ken Burns */}
        <img
          src="https://images.unsplash.com/photo-1578575437130-527eed3abbec"
          alt="Import Export Logistics"
          className="hero-img w-full h-full object-cover"
        />

        {/* Dark Overlay with subtle pulse */}
        <div className="hero-overlay absolute inset-0 bg-black/60"></div>

        {/* Hero Content with fade-in */}
        <div className="hero-content absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
          <h1 className="text-3xl md:text-5xl font-bold max-w-4xl leading-tight">
            Import Export Insights & Guides
          </h1>

          <p className="mt-4 max-w-2xl text-lg opacity-90">
            Practical strategies, documentation help, global trade insights and
            step-by-step guides to grow your international business.
          </p>

          <Link
            to="/contact"
            className="mt-6 inline-block bg-black/80 hover:bg-black px-6 py-3 rounded-xl font-semibold transition shadow-lg"
          >
            Get Expert Guidance →
          </Link>
        </div>
      </div>

      {/* Blog Layout */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-4">

          {/* Blog Grid */}
          <div className="lg:col-span-3 grid gap-8 md:grid-cols-2 xl:grid-cols-3 items-start">
            {allBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col h-[380px]"
              >
                {/* Image */}
                <div className="h-48 w-full">
                  <img
                    src={
                      blog.blogMedia?.length
                        ? blog.blogMedia[0]
                        : getOnlineImage(blog.title)
                    }
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h2 className="font-semibold text-lg mb-2 line-clamp-2">
                      {blog.title}
                    </h2>

                    <p className="text-sm text-gray-500 mb-2">
                      {blog.author || "Admin"} •{" "}
                      {new Date(blog.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="mt-auto">
                    <Link
                      to={`/blog/${blog._id}`}
                      className="inline-block px-4 py-2 bg-black/80 text-white rounded-lg text-sm font-medium hover:bg-black transition"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>
      <Footer/>
    </div>
  );
}