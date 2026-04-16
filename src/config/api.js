const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5100';
const SITE_ID = process.env.REACT_APP_SITE_ID || '2d894f9d-0cf0-4c84-94d5-5171521cb50c';

const headers = {
  'Content-Type': 'application/json',
  'X-Site-ID': SITE_ID,
};

export async function fetchAbout() {
  const res = await fetch(`${API_URL}/api/settings/about`, { headers });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchSkills() {
  const res = await fetch(`${API_URL}/api/settings/skills`, { headers });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchSocialLinks() {
  const res = await fetch(`${API_URL}/api/settings/social`, { headers });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchPosts({ page = 1, pageSize = 20 } = {}) {
  const res = await fetch(
    `${API_URL}/api/posts?page=${page}&pageSize=${pageSize}&published=true`,
    { headers }
  );
  if (!res.ok) return { data: [], total: 0 };
  return res.json();
}

export async function fetchPostBySlug(slug) {
  // Slug'a göre tüm postları çekip filtrele (API slug endpoint yoksa)
  const res = await fetch(`${API_URL}/api/posts?pageSize=100&published=true`, { headers });
  if (!res.ok) return null;
  const { data } = await res.json();
  return data.find(p => p.slug === slug) || null;
}

export async function fetchPostById(id) {
  const res = await fetch(`${API_URL}/api/posts/${id}`, { headers });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchProjects({ published = true } = {}) {
  const res = await fetch(
    `${API_URL}/api/projects?published=${published}`,
    { headers }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function fetchServices() {
  const res = await fetch(`${API_URL}/api/services?activeOnly=true`, { headers });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchAvailability(serviceId, date) {
  const res = await fetch(
    `${API_URL}/api/appointments/availability?serviceId=${serviceId}&date=${date}`,
    { headers }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.available || [];
}

export async function createAppointment(data) {
  const res = await fetch(`${API_URL}/api/appointments`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Randevu oluşturulamadı.');
  return json;
}

export async function submitContactMessage(data) {
  const res = await fetch(`${API_URL}/api/messages`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Mesaj gönderilemedi.');
  return json;
}

export async function subscribeNewsletter(email, name) {
  const res = await fetch(`${API_URL}/api/subscribers`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, name }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Abonelik başarısız.');
  return json;
}

export async function fetchPublicComments(postId) {
  const res = await fetch(`${API_URL}/api/comments?postId=${postId}`, { headers });
  if (!res.ok) return [];
  return res.json();
}

export async function createComment(data) {
  const res = await fetch(`${API_URL}/api/comments`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Yorum gönderilemedi.');
  return json;
}

export async function fetchTracks(type) {
  const qs = type ? `?type=${type}` : '';
  const res = await fetch(`${API_URL}/api/tracks${qs}`, { headers });
  if (!res.ok) return [];
  return res.json();
}