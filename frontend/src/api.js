const BASE = "http://localhost:5000/api";


export async function apiGet(path) {
  const res = await fetch(`${BASE}${path}`);
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function apiPut(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function apiDelete(url) {
  const res = await fetch(`http://localhost:5000/api${url}`, {
    method: "DELETE",
  });
  return res.json();
}
