const STATUS_FALLBACK_MESSAGES = {
  400: "La requete est invalide.",
  401: "Session expiree ou identifiants invalides.",
  403: "Acces refuse.",
  404: "Ressource introuvable.",
  409: "Conflit detecte.",
  413: "Fichier trop volumineux.",
  422: "Donnees invalides.",
  429: "Trop de requetes. Reessayez plus tard.",
  500: "Erreur interne du serveur.",
  502: "Service temporairement indisponible.",
  503: "Service indisponible.",
  504: "Delai de reponse depasse.",
};

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

const flattenDetails = (value) => {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) return value.flatMap((item) => flattenDetails(item));
  if (isObject(value)) {
    return Object.entries(value).flatMap(([key, val]) =>
      flattenDetails(val).map((msg) => `${key}: ${msg}`)
    );
  }
  return [String(value)];
};

export const getApiError = (error, fallbackMessage = "Une erreur est survenue.") => {
  if (!error?.response) {
    return {
      status: null,
      code: "NETWORK_ERROR",
      message: "Impossible de contacter le serveur.",
      details: [],
    };
  }

  const status = error.response.status;
  const data = error.response.data;

  if (typeof data === "string") {
    return {
      status,
      code: `HTTP_${status}`,
      message: data,
      details: [],
    };
  }

  if (isObject(data) && isObject(data.error)) {
    const details = flattenDetails(data.error.details);
    return {
      status,
      code: data.error.code || `HTTP_${status}`,
      message: data.error.message || STATUS_FALLBACK_MESSAGES[status] || fallbackMessage,
      details,
    };
  }

  const details = isObject(data) || Array.isArray(data) ? flattenDetails(data) : [];
  const message =
    (isObject(data) && (data.message || data.error || data.detail)) ||
    STATUS_FALLBACK_MESSAGES[status] ||
    fallbackMessage;

  return {
    status,
    code: `HTTP_${status}`,
    message: String(message),
    details,
  };
};
