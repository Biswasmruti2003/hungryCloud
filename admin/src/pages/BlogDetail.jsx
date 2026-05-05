// src/pages/BlogDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

// Simulated shared blog data (same as in Blog.jsx)
const posts = [
  {
    id: "meal-plan-guide",
    title: "Ultimate Guide to Custom Meal Plans",
    author: "NutriBlent Team",
    date: "July 12, 2025",
    img: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0",
    content: `
At NutriBlent, we believe every meal should serve a purpose.

🥗 Balanced macros  
👨‍🍳 Chef-crafted meals  
📋 Nutritionist approved

From muscle gain to weight loss, we tailor your meals to fit your daily needs.

---

✨ *Read on to learn how we personalize every dish just for you!* ✨
    `,
    tags: ["Meal Plans", "Nutrition", "Fitness", "Health"],
  },
  {
    id: "nutrition-tips",
    title: "Top 5 Nutritionist Tips for Busy Professionals",
    author: "Dr. Reema Sinha",
    date: "July 10, 2025",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    content: `
Eating healthy doesn't need to be hard.

1️⃣ Start your day with hydration  
2️⃣ Keep healthy snacks handy  
3️⃣ Never skip protein  
4️⃣ Prep meals in advance  
5️⃣ Avoid ultra-processed foods

Small habits make a big difference.
    `,
    tags: ["Busy Life", "Nutrition", "Tips"],
  },
  {
    id: "vegan-protein",
    title: "Plant-Based Protein: Myths vs Facts",
    author: "NutriBlent Research",
    date: "July 5, 2025",
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
    content: `
Are plant proteins really incomplete?  
Do vegans need supplements?  
We break down the most common myths.

💡 Spoiler: You *can* build muscle on plants — it just takes planning and variety.
    `,
    tags: ["Vegan", "Protein", "Health"],
  },
];

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const post = posts.find((p) => p.id === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Post Not Found</h1>
          <button
            onClick={() => navigate("/blog")}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-yellow-50 via-white to-green-100 min-h-screen py-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-2xl"
      >
        <img
          src={`${post.img}?auto=format&fit=crop&w=1200&h=600`}
          alt={post.title}
          className="w-full h-64 object-cover rounded-2xl mb-6"
        />
        <h1 className="text-4xl font-bold text-green-800 mb-4">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-6">
          By {post.author} | {post.date}
        </p>
        <div className="text-gray-700 text-lg whitespace-pre-wrap leading-relaxed mb-6">
          {post.content}
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BlogDetail;
