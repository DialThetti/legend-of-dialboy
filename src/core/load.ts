export async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise(e => {
    const cached = document.querySelector(`[data-id="${url}"]`) as HTMLImageElement;
    if (cached) {
      return e(cached);
    }
    const img = new Image();
    img.dataset['id'] = url;
    img.src = url;
    img.onload = () => e(img);
    document.querySelector('#img-reg')?.appendChild(img);
  });
}

export async function loadJson<T>(url: string): Promise<T> {
  const f = await fetch(url);
  const data = await f.json();
  return data as T;
}
