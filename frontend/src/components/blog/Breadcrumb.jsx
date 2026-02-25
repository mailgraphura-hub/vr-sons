import { Link, useLocation } from "react-router-dom";

export default function Breadcrumb() {
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav
      className="text-sm text-gray-500 mb-6"
      aria-label="Breadcrumb"
    >
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
        </li>

        {pathnames.map((value, index) => {
          const to = "/" + pathnames.slice(0, index + 1).join("/");
          const isLast = index === pathnames.length - 1;

          return (
            <li key={to} className="flex items-center gap-2">
              <span>›</span>

              {isLast ? (
                <span className="text-gray-800 font-medium capitalize">
                  {value.replace("-", " ")}
                </span>
              ) : (
                <Link
                  to={to}
                  className="hover:text-blue-600 capitalize"
                >
                  {value.replace("-", " ")}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}