// src/data/projects.js
const projects = [
  {
    id: 'plaro',
    title: 'Plaro — Educational Social Platform',
    short: 'Cross-platform educational social app connecting students, staff and professionals.',
    description:
      'Plaro is a complete educational social platform with notes, quizzes, XP/levels, daily streaks, feeds, reels, real-time chat, and competition discovery with geolocation. Built as a team project to connect learners and professionals with modern UX.',
    tech: ['Flutter', 'Supabase', 'Riverpod', 'Realtime'],
    role: 'Mobile lead — auth, profile, UI logic, integrations',
    links: {
      live: '#', // replace with real link if available
      github: '#'
    }
  },
  {
    id: 'solar-system',
    title: 'Solar System 3D Simulation',
    short: 'Interactive 3D planetary simulation using Three.js.',
    description:
      'A real-time solar system simulation with orbital mechanics, smooth camera controls, and optimized rendering. The project showcases modular Three.js scene organization and performance-aware rendering techniques.',
    tech: ['Three.js', 'React', 'GLTF'],
    role: '3D scene design, performance tuning',
    links: { live: '#', github: '#' }
  },
  {
    id: 'portfolio',
    title: 'Interactive Portfolio with Plasma Effects',
    short: 'My personal portfolio with custom plasma shader backgrounds and optimized fallbacks.',
    description:
      'This portfolio showcases my design and development work with an emphasis on performance and small bundle sizes. Includes an optimized Plasma background (GPU shader) with framerate & DPR adaptation and a lightweight fallback for low-end devices.',
    tech: ['React', 'Tailwind', 'OGL / WebGL'],
    role: 'Design, frontend, performance optimizations',
    links: { live: '#', github: '#' }
  },
  {
    id: 'diabetes-predictor',
    title: 'Diabetes Prediction (AdaBoost)',
    short: 'A deployed AdaBoost-based diabetes prediction model with a Django frontend.',
    description:
      'Trained an AdaBoost model to predict diabetes outcome. The model is serialized and used inside a Django app that accepts user inputs and returns a prediction with explanations for preprocessing steps.',
    tech: ['Python', 'Scikit-learn', 'Django'],
    role: 'Model training, preprocessing, deployment integration',
    links: { live: '#', github: '#' }
  },
  {
    id: 'explicit-detection',
    title: 'Explicit Content Detection (ML)',
    short: 'A model pipeline for detecting explicit content intended for educational apps.',
    description:
      'Developed a transfer-learning based classifier to detect explicit imagery. Focused on dataset hygiene, augmentation, and a lightweight model suitable for mobile inference.',
    tech: ['TensorFlow', 'Transfer Learning', 'Dataset Curation'],
    role: 'Dataset curation, model prototyping',
    links: { live: '#', github: '#' }
  },
  {
    id: 'fraud-detection',
    title: 'Credit Card Fraud Detection (Research)',
    short: 'Anomaly detection & supervised models for fraud detection.',
    description:
      'Researched real-world fraud patterns and built ML models with feature engineering and class imbalance handling. Explored anomaly detection and evaluated performance across precision/recall tradeoffs.',
    tech: ['Python', 'Scikit-learn', 'XGBoost'],
    role: 'Feature engineering, modeling, evaluation',
    links: { live: '#', github: '#' }
  }
];

export default projects;
