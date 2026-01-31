export const getTokenPayload = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  try {
    const base64 = token.split(".")[1]?.replace(/-/g, "+").replace(/_/g, "/");
    if (!base64) return null;
    const json = atob(base64);
    return JSON.parse(json);
  } catch (err) {
    return null;
  }
};

export const getUserRole = () => {
  const payload = getTokenPayload();
  return payload?.type || null;
};

export const getUserId = () => {
  const payload = getTokenPayload();
  return payload?.user_id || payload?.userId || payload?.id || null;
};
