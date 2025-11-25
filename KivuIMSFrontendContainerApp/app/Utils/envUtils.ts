export const isProd = (): boolean => {
  const { href } = window.location;
  return !href.includes("staging") || href.includes("http://localhost:3000");
};
