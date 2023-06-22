export async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise(e => {
    const img = new Image();
    img.src = url;
    img.onload = () => e(img);
  });
}

export async function loadJson<T>(url: string): Promise<T> {
  const f = await fetch(url);
  const data = await f.json();
  return data as T;
}
