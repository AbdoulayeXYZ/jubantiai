# DeepEval - Plateforme d'Évaluation Intelligente

<div align="center">

![JubantiAI Logo](public/favicon.ico)

**Une solution innovante d'évaluation automatique propulsée par l'IA**

</div>

## 🚀 Aperçu

DeepEval est une plateforme SaaS révolutionnaire conçue pour automatiser et améliorer le processus d'évaluation académique. En utilisant des modèles d'IA avancés basés sur DeepSeek, notre système offre une correction automatique des examens, une détection de plagiat et des analyses détaillées des performances des étudiants.

### ✨ Caractéristiques Principales

- **Évaluation Automatique par IA** : Correction intelligente des examens utilisant DeepSeek via Ollama
- **Détection de Plagiat** : Identification automatique des similitudes entre les soumissions
- **Interface Intuitive** : Tableaux de bord distincts pour enseignants et étudiants
- **Analyse des Performances** : Visualisations graphiques des résultats avec Chart.js
- **Support Multi-format** : Traitement des soumissions en PDF et texte brut
- **Chatbot Interactif** : Chatbot pour des questions spécifiques

## 🛠️ Technologies Utilisées

### Frontend
- **Angular 19** : Framework frontend moderne et robuste
- **TailwindCSS 4** : Pour un design responsive et élégant
- **Chart.js** : Visualisation interactive des données

### Backend
- **Node.js & Express** : Serveur API RESTful
- **TypeScript** : Pour un code typé et maintenable
- **Sequelize** : ORM pour la gestion de la base de données
- **MySQL** : Base de données relationnelle

### Intelligence Artificielle
- **DeepSeek** : Modèle d'IA avancé pour l'évaluation automatique
- **Ollama** : Interface pour l'exécution locale de modèles d'IA
- **PDF-Parse** : Extraction de texte à partir de documents PDF

## 📋 Prérequis

- Node.js (v18+)
- MySQL (v8+)
- Ollama avec le modèle DeepSeek installé
- Angular CLI (v19+)

## 🔧 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/AbdoulayeXYZ/jubantiai.git
cd jubantiai
```

### 2. Installer les dépendances

```bash
# Installer les dépendances du projet principal
npm install

# Installer les dépendances du backend
cd backend
npm install
cd ..
```

### 3. Configuration de la base de données

- Créez une base de données MySQL pour le projet
- Copiez le fichier `.env.example` en `.env` et configurez les variables d'environnement:

```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
DB_DATABASE=jubantiai
JWT_SECRET=votre_secret_jwt
```

### 4. Configuration d'Ollama

- Installez Ollama depuis [ollama.ai](https://ollama.ai)
- Téléchargez le modèle DeepSeek:

```bash
ollama pull deepseek-r1:latest
```

### 5. Exécuter les migrations

```bash
npm run migration:run
```

### 6. Démarrer l'application

```bash
# Dans un terminal, démarrez le backend
cd backend
npm run dev

# Dans un autre terminal, démarrez le frontend
cd ..
npm start
```

L'application sera accessible à l'adresse `http://localhost:4200`

## 🏗️ Architecture du Projet

```
jubantiai/
├── src/                  # Code source frontend (Angular)
│   ├── app/
│   │   ├── portal/       # Module d'authentification et accueil
│   │   ├── student/      # Interface étudiant
│   │   ├── teacher/      # Interface enseignant
│   │   └── shared/       # Composants partagés
│   └── environments/     # Configuration des environnements
├── backend/              # Code source backend (Node.js)
│   ├── src/
│   │   ├── controllers/  # Contrôleurs API
│   │   ├── models/       # Modèles de données
│   │   ├── services/     # Services métier
│   │   ├── entities/     # Entités TypeORM
│   │   └── routes/       # Routes API
│   └── uploads/          # Stockage des fichiers soumis
└── public/               # Ressources statiques
```

## 🔍 Fonctionnalités Détaillées

### Pour les Enseignants

- **Création d'Examens** : Créez des examens avec titre, description, date limite et fichier sujet
- **Tableau de Bord** : Visualisez les statistiques de soumission et les performances des étudiants
- **Évaluation Manuelle** : Possibilité de réviser et ajuster les notes générées automatiquement
- **Alertes de Plagiat** : Notifications automatiques en cas de détection de similitudes
- **Export des Résultats** : Exportez les résultats dans différents formats (CSV, Excel)
- **Gestion des Étudiants** : Affichage des informations des étudiants,
- **Gestion des Examens** : Affichage des informations des examens

### Pour les Étudiants

- **Soumission de Travaux** : Interface simple pour télécharger les réponses aux examens
- **Feedback Instantané** : Réception rapide des évaluations automatiques
- **Historique des Notes** : Suivi des performances sur tous les examens
- **Alertes de Nouveautés** : Notifications pour les examens nouveaux ou modifiés
- **Analyse des Performances** : Visualisation des tendances et des résultats
- **Chatbot ** : Chatbot interactif pour des questions spécifiques

## 🧠 Système d'IA

JubantiAI utilise le modèle DeepSeek via Ollama pour:

1. **Analyse de Contenu** : Extraction et compréhension du contenu des soumissions
2. **Évaluation Structurée** : Notation basée sur plusieurs critères (compréhension, méthodologie, structure, créativité)
3. **Feedback Détaillé** : Génération de commentaires constructifs et personnalisés
4. **Détection de Similitudes** : Comparaison intelligente entre les soumissions

## 📊 Démonstration

![Dashboard Demo](https://via.placeholder.com/800x400?text=Dashboard+Demo)

## 🤝 Contribution

Les contributions sont les bienvenues! Veuillez suivre ces étapes:

1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add some amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence [MIT](LICENSE).

## 👥 Équipe

- **Développeurs Principaux** : 
    - **Abdoulaye NIASSE** - [niasseabdoulaye64@gmail.com](mailto:niasseabdoulaye64@gmail.com) - [GitHub](https://github.com/AbdoulayeXYZ)
    - **Mame Diarra MBACKÉ** - [mamediarram664@gmail.com](mailto:mamediarram664@gmail.com) - [GitHub](https://github.com/mdmbest)
    - **Serigne Mame SARR** - [serignemamesarr@esp.sn](mailto:serignemamesarr@esp.sn) - [GitHub](https://github.com/serignemamesarr)
    - **Salamata DIEDHOU** - [salamatadiedhiou020204@gmail.com](mailto:salamatadiedhiou020204@gmail.com) - [GitHub](https://github.com/Salathm)
    - **Ahmadoul Khadim TOURÉ** - [ahmadoulkhadimtoure@esp.sn](mailto:ahmadoulkhadimtoure@esp.sn) - [GitHub](https://github.com/ahmadoulkhadim)

---

<div align="center">

**DeepEval** - Révolutionner l'évaluation académique avec l'intelligence artificielle

</div>
