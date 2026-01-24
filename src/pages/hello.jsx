import React from "react";

function Hello() {
  const token = localStorage.getItem("accessToken");

  // Si aucun token n'est trouvé
  if (!token) {
    return <h1>Pas connecté</h1>;
  }

  try {
    // Décoder la partie "payload" du JWT
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Vérification du username
    if (payload.user_id ==10) {
      return <h1>Hello Rayan 👋</h1>;
    } else {
      return <h1>Bienvenue {payload.username}</h1>;
    }
  } catch (error) {
    console.error("Erreur lors du décodage du token :", error);
    return <h1>Token invalide</h1>;
  }
}

export default Hello;
