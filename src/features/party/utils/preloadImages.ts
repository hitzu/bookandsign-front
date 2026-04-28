const preloadImage = (url: string): Promise<void> =>
  new Promise((resolve) => {
    if (typeof window === "undefined" || !url) {
      resolve();
      return;
    }

    const image = new window.Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = url;
  });

export const preloadImages = async (urls: string[]): Promise<void> => {
  const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));
  await Promise.all(uniqueUrls.map(preloadImage));
};

