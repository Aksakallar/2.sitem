import { useState, useEffect } from "react";
import { Blogs } from "../data/BlogData";
import { fetchPosts, fetchPostById } from "../config/api";

const mapPost = (p) => ({
  id: p.id,
  name: p.title,
  tags: p.tags ? p.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
  date: p.publishedAt
    ? new Date(p.publishedAt).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "",
  imgSrc: p.coverImage || "",
  summary: p.summary || "",
  description: p.content || "",
});

export const useBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts()
      .then(({ data }) => {
        if (Array.isArray(data) && data.length > 0) {
          setBlogs(data.map(mapPost));
        } else {
          setBlogs(Blogs); // fallback
        }
      })
      .catch(() => setBlogs(Blogs))
      .finally(() => setLoading(false));
  }, []);

  return { blogs, loading };
};

export const useBlogDetail = (id) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPostById(id)
      .then((data) => {
        if (data) {
          setBlog(mapPost(data));
        } else {
          // Fallback: statik veriden ID ile bul
          const staticBlog = Blogs.find((b) => String(b.id) === String(id));
          setBlog(staticBlog || null);
        }
      })
      .catch(() => {
        const staticBlog = Blogs.find((b) => String(b.id) === String(id));
        setBlog(staticBlog || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { blog, loading };
};
