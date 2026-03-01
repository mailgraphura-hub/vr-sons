import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import blogs from "../../data/blogData";
import { getService } from "../../service/axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function SingleBlog() {
  const { id } = useParams();
  // const blog = blogs.find((b) => b.id === parseInt(id));

  const navigate = useNavigate();

  const [blog, setBlog] = useState(null)

  useEffect(() => {
    ; (
      async () => {
        const apiResponse = await getService(`/customer/blog/blogId?blogId=${id}`);

        if (!apiResponse.ok) {
          console.log(apiResponse.message)
        }

        // console.log(apiResponse.data.data)
        setBlog(apiResponse.data.data)

        console.log(apiResponse.data.data.description)
      }
    )()
  }, [])

  const normalizeContent = (text) => {
  if (!text) return "";

  return text
    // Match ANY common bullet character
    .replace(/[\u2022\u25CF\u25E6\u2043\u2219]\s*/g, "\n- ")
    // Ensure space after colon section
    .replace(/(involves:)/i, "$1\n")
    .trim();
};

  if (!blog)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Blog not found
      </div>
    );

  const wordCount = blog.description.split(" ").length;
  const readTime = Math.ceil(wordCount / 200);

  // useEffect(() => {
  //   document.title = blog.title;
  // }, [blog]);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">

      {/*  HERO SECTION */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <img
          src={blog.blogMedia[0]}
          alt={blog.title}
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold max-w-4xl leading-tight">
            {blog.title}
          </h1>
          <p className="mt-4 text-sm md:text-base opacity-90">
            {blog.author} • {new Date(blog.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })} • {readTime} min read
          </p>
        </div>
      </div>

      {/*  MAIN CONTENT */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">

        <Link
          to="/blog"
          className="inline-block mb-8 text-black/80 hover:text-black font-medium transition"
        >
          ← Back to Blog
        </Link>

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ node, ...props }) => (
              <p className="mb-4 leading-relaxed text-gray-700" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="leading-relaxed" {...props} />
            ),
          }}
        >
          {normalizeContent(blog.description)}
        </ReactMarkdown>

        {/*  Divider */}
        <div className="my-12 border-t"></div>

        {/*  Call To Action */}
        <div className="bg-black/80 text-white p-8 rounded-2xl shadow-xl text-center">
          <h3 className="text-2xl font-semibold mb-3">
            Want to Start Your Export Business?
          </h3>
          <p className="opacity-90 mb-5">
            Get expert guidance, documentation support and buyer sourcing help.
          </p>
          <Link
            to="/ContactUs"
            className="inline-block bg-white text-black/80 hover:text-black font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition"
          >
            Contact Our Experts
          </Link>
        </div>

      </div>
    </div>
  );
}