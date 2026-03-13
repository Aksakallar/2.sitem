import { useState, useEffect } from "react";
import { Blogs } from "../data/BlogData";

const API_URL = "http://localhost:5100";

const mapBlogFromApi = (blog) => ({
  id: blog.id,
  name: blog.baslik,
  tags: blog.etiketListesi || [],
  date: blog.yayinTarihi
    ? new Date(blog.yayinTarihi).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "",
  imgSrc: blog.gorselUrl || "",
  description: blog.icerik || "",
  link: "",
});

export const useBlogList = () => {
  const [blogs, setBlogs] = useState(Blogs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/Blog/GetAktifBloglar`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBlogs(data.map(mapBlogFromApi));
        }
      })
      .catch(() => {
        // API bağlantısı yoksa BlogData.js'deki statik veriler kullanılır
      })
      .finally(() => setLoading(false));
  }, []);

  return { blogs, loading };
};

export const useBlogDetail = (id) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/Blog/GetBlogById?blogId=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setBlog(mapBlogFromApi(data)))
      .catch(() => {
        // API'den bulunamazsa statik veriden aranır
        const staticBlog = Blogs.find((b) => b.id === parseInt(id));
        setBlog(staticBlog || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { blog, loading };
};
