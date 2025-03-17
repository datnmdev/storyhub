const UrlUtils = {
  generateUrl(uri: string) {
    return `${import.meta.env.VITE_SERVER_HOST}${import.meta.env.VITE_BASE_URI}${uri}`;
  },
};

export default UrlUtils;
