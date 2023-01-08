export async function request(url: `/${string}`, options?: RequestInit) {
  const res = await fetch(`http://localhost:4000/api/v1${url}`, options);
  return res.json();
}
