import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const posts = [
  {
    id: "meal-plan-guide",
    title: "Ultimate Guide to Custom Meal Plans",
    excerpt: "How we build personalized plans for muscle gain, weight loss, and wellness.",
    img: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0",
    category: "Muscle Gain",
    date: "2025-07-12",
  },
  {
    id: "nutrition-tips",
    title: "Top 5 Nutritionist Tips for Busy Professionals",
    excerpt: "Quick habits you can start today to improve energy and digestion.",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    category: "Nutrition",
    date: "2025-07-10",
  },
  {
    id: "vegan-protein",
    title: "Plant-Based Protein: Myths vs Facts",
    excerpt: "Separating truth from myth in vegan protein sources.",
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
    category: "Vegan",
    date: "2025-07-05",
  },
];

const categories = ["All", "Nutrition", "Muscle Gain", "Vegan"];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredPosts = posts
    .filter((post) =>
      selectedCategory === "All" ? true : post.category === selectedCategory
    )
    .filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const recentPosts = [...posts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-16">
      <motion.div
        className="text-center px-6 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-bold text-green-700 mb-4">
          NutriBlent Blog
        </h1>
        <p className="text-gray-600 md:text-lg">
          Dive into guides, healthy recipes, and expert nutrition tips.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 md:flex gap-10">
        {/* Sidebar */}
        <aside className="md:w-1/4 mb-10 md:mb-0 space-y-8 sticky top-24">
          {/* Category Filter */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h3 className="text-xl font-semibold text-green-700 mb-4">
              Categories
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`block w-full text-left px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    selectedCategory === cat
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-green-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h3 className="text-xl font-semibold text-green-700 mb-4">
              Search
            </h3>
            <input
              type="text"
              placeholder="Search by keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </div>

          {/* Live Feed */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h3 className="text-xl font-semibold text-green-700 mb-4">
              Recent Posts
            </h3>
            <ul className="space-y-3">
              {recentPosts.slice(0, 3).map((post) => (
                <li
                  key={post.id}
                  onClick={() => navigate(`/blog/${post.id}`)}
                  className="cursor-pointer text-sm text-gray-700 hover:text-green-600 transition"
                >
                  <span className="block font-medium">{post.title}</span>
                  <span className="text-xs text-gray-400">{post.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Posts Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 flex-1"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate(`/blog/${post.id}`)}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={`${post.img}?auto=format&fit=crop&w=800&h=400`}
                  alt={post.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-green-800 mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  {post.date} •{" "}
                  <span className="text-green-600 font-medium">
                    {post.category}
                  </span>
                </p>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <button className="inline-block bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-600 transition">
                  Read More →
                </button>
              </div>
            </motion.div>
          ))}

          {filteredPosts.length === 0 && (
            <div className="col-span-2 text-center text-gray-500 text-lg py-10">
              No posts found matching your criteria.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;
