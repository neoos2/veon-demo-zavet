// Public assets through BASE_URL: the demo is published in a sub-folder (/veon-demo-zavet/), so no root-absolute paths.
const base = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
export const asset = (path: string): string => base + path.replace(/^\/+/, "");
