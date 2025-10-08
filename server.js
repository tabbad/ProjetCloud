import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Exemple d'API backend
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello depuis le backend Node.js !" });
});

// Sert les fichiers statiques du build React
app.use(express.static(path.join(__dirname, "build")));

// Gère les routes React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));
