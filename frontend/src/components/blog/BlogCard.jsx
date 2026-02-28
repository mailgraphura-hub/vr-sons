import { Link } from "react-router-dom";

export default function BlogCard({ blog }) {
  const readTime = Math.ceil(blog.content.split(" ").length / 200);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4">
      <img
        src={blog.image}
        alt={blog.title}
        className="rounded-xl mb-4"
        loading="lazy"
      />

      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
        {blog.category}
      </span>

      <h3 className="text-lg font-semibold mt-2">{blog.title}</h3>

      <p className="text-sm text-gray-500 mt-1">
        {blog.author} • {readTime} min read
      </p>

      <Link
        to={`/blog/${blog.id}`}
        className="inline-block mt-3 text-blue-600 font-medium"
      >
        Read More →
      </Link>
    </div>
  );
}