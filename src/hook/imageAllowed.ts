const allowedDomains = ["images.unsplash.com", "i.pinimg.com"];

export function imageAllowed(url: string) {
  try {
    const domain = new URL(url).hostname;
    return allowedDomains.includes(domain);
  } catch {
    return false;
  }
}
