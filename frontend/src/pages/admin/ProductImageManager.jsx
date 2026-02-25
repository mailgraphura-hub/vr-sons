import { useState, useEffect } from "react";
import AdminLayout from "../../layout/AdminLayout";
import {
  UploadCloud,
  Eye,
  Trash2,
  Image as ImageIcon,
  Filter,
  ChevronDown,
  Package,
} from "lucide-react";

export default function ProductImageManager() {
  const MAX_IMAGES = 50; // image limit fix
  const ITEMS_PER_PAGE = 10;

  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("productImages")) || [];
    setImages(saved);
  }, []);

  const saveImages = (data) => {
    setImages(data);
    localStorage.setItem("productImages", JSON.stringify(data));
  };

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > MAX_IMAGES) {
      alert(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }

    const newImages = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: (file.size / 1024).toFixed(0) + " KB",
      url: URL.createObjectURL(file),
      primary: images.length === 0 && index === 0,
    }));

    saveImages([...images, ...newImages]);
  };

  const handleDelete = (id) => {
    saveImages(images.filter((img) => img.id !== id));
  };

  const setPrimary = (id) => {
    const updated = images.map((img) => ({
      ...img,
      primary: img.id === id,
    }));
    saveImages(updated);
  };

  const filtered = images.filter((img) =>
    img.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(
    filtered.length / ITEMS_PER_PAGE
  );

  const start = (currentPage - 1) * ITEMS_PER_PAGE;

  const currentImages = filtered.slice(
    start,
    start + ITEMS_PER_PAGE
  );

  return (
    <AdminLayout>
    

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            Product Image Manager
          </h1>
          <p className="text-gray-500 text-sm">
            Upload and manage product media
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow border mb-10 p-8">

          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold">
                Upload Product Media
              </h3>
              <p className="text-sm text-gray-500">
                Supported: WEBP, PNG, JPG (Max 5MB)
              </p>
            </div>

            <div className="text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full font-semibold">
              {images.length}/{MAX_IMAGES} Images
            </div>
          </div>

          <label className="cursor-pointer border-2 border-dashed rounded-xl py-12 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition">

            <UploadCloud
              size={40}
              className="text-gray-400 mb-4"
            />

            <p className="font-semibold">
              Drag & Drop or Click to Upload
            </p>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Gallery Header */}
        <div className="flex justify-between items-center mb-6">

          <h3 className="text-lg font-bold">
            Image Library ({filtered.length})
          </h3>

          <div className="flex gap-3">

            <div className="relative">
              <input
                type="text"
                placeholder="Search images..."
                className="border rounded-lg px-3 py-2 text-sm w-64"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold">
              <Filter size={16} />
              Filter
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">
              <Package size={16} />
              Bulk Actions
            </button>

          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">

          {currentImages.map((img) => (

            <div
              key={img.id}
              className="group relative bg-white rounded-xl border shadow-sm hover:shadow-md transition overflow-hidden"
            >

              <div className="aspect-square relative">

                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-full object-cover"
                />

                {img.primary && (
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    Primary
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition">

                  <button
                    onClick={() => setPrimary(img.id)}
                    className="bg-white p-2 rounded-full"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(img.id)
                    }
                    className="bg-white p-2 rounded-full text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </div>

              <div className="p-3">
                <p className="text-sm font-semibold truncate">
                  {img.name}
                </p>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Auto</span>
                  <span>{img.size}</span>
                </div>
              </div>

            </div>

          ))}

        </div>

        {/* Pagination */}
        <div className="mt-10 flex justify-between items-center border-t pt-6">

          <p className="text-sm text-gray-500">
            Showing {start + 1} to{" "}
            {Math.min(
              start + ITEMS_PER_PAGE,
              filtered.length
            )}{" "}
            of {filtered.length}
          </p>

          <div className="flex gap-2">

            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage(currentPage - 1)
              }
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Previous
            </button>

            {[...Array(totalPages)].map(
              (_, i) => (
                <button
                  key={i}
                  onClick={() =>
                    setCurrentPage(i + 1)
                  }
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "border"
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}

            <button
              disabled={
                currentPage === totalPages
              }
              onClick={() =>
                setCurrentPage(currentPage + 1)
              }
              className="px-3 py-1 border rounded disabled:opacity-40">
              Next
            </button>
          </div>
        </div>

    </AdminLayout>
  );
}