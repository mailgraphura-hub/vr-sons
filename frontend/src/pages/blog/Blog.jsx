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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
          className="object-cover w-full h-full hero-img"
        />

        {/* Dark Overlay with subtle pulse */}
        <div className="absolute inset-0 hero-overlay bg-black/60"></div>

        {/* Hero Content with fade-in */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white hero-content">
          <h1 className="max-w-4xl text-3xl font-bold leading-tight md:text-5xl">
            Import Export Insights & Guides
          </h1>

          <p className="max-w-2xl mt-4 text-lg text-danger pacity-90">
            Practical strategies, documentation help, global trade insights and
            step-by-step guides to grow your international business.
          </p>

          <Link
            to="/contact"
            className="inline-block px-6 py-3 mt-6 font-semibold transition shadow-lg bg-black/80 hover:bg-black rounded-xl"
          >
            Get Expert Guidance →
          </Link>
        </div>
      </div>

      {/* Blog Layout */}
      <div className="container px-4 py-12 mx-auto">
        <div className="grid gap-10 lg:grid-cols-4">

          {/* Blog Grid */}
          <div className="grid items-start gap-8 lg:col-span-3 md:grid-cols-2 xl:grid-cols-3">
            {allBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col h-[380px]"
              >
                {/* Image */}
                <div className="w-full h-48">
                  <img
                    src={
                      blog.blogMedia?.length
                        ? blog.blogMedia[0]
                        : getOnlineImage(blog.title)
                    }
                    alt={blog.title}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between flex-1 p-5">
                  <div>
                    <h2 className="mb-2 text-lg font-semibold line-clamp-2">
                      {blog.title}
                    </h2>

                    <p className="mb-2 text-sm text-gray-500">
                      {blog.author || "Admin"} <span className="mx-1">•</span>{" "}
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
                      className="inline-block px-4 py-2 text-sm font-medium text-white transition rounded-lg bg-black/80 hover:bg-black"
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