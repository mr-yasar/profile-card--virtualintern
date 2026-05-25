const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for development
app.use(cors());

// Parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoint to process profile card details
app.post('/api/generate-card', (req, res) => {
  const {
    name,
    role,
    location,
    bio,
    imageUrl,
    theme,
    skills,
    github,
    linkedin,
    twitter
  } = req.body;

  // Server-side validation
  if (!name || name.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Name is required to generate a profile card.'
    });
  }

  // Sanitize and trim inputs
  const cleanedName = name.trim();
  const cleanedRole = (role || 'Creative Professional').trim();
  const cleanedLocation = (location || 'Remote').trim();
  const cleanedBio = (bio || 'No bio provided. This professional prefers to let their work speak for itself!').trim();
  
  // Format skills: split by comma, trim, and filter out empty strings
  let skillsArray = [];
  if (skills && typeof skills === 'string') {
    skillsArray = skills
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
  } else if (Array.isArray(skills)) {
    skillsArray = skills.map(s => String(s).trim()).filter(s => s.length > 0);
  }

  // Handle Profile Image Fallback
  let finalImageUrl = (imageUrl || '').trim();
  if (!finalImageUrl) {
    // Generate a beautiful avatar fallback based on the user's name
    const initials = cleanedName
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    
    // UI-Avatars fallback with high-resolution and premium gradient backgrounds
    finalImageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanedName)}&background=6366f1&color=ffffff&size=256&bold=true&font-size=0.33`;
  }

  // Validate and format social links
  const formatUrl = (url, prefix) => {
    if (!url || url.trim() === '') return '';
    let trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    // If user typed username instead of URL
    if (trimmed.startsWith('@')) {
      trimmed = trimmed.substring(1);
    }
    return `${prefix}${trimmed}`;
  };

  const formattedGithub = formatUrl(github, 'https://github.com/');
  const formattedLinkedin = formatUrl(linkedin, 'https://linkedin.com/in/');
  const formattedTwitter = formatUrl(twitter, 'https://twitter.com/');

  // Generate metadata
  const cardId = `card_${Math.random().toString(36).substring(2, 11)}`;
  const createdAt = new Date().toISOString();

  // Return the processed data back to the frontend
  return res.status(200).json({
    success: true,
    data: {
      id: cardId,
      name: cleanedName,
      role: cleanedRole,
      location: cleanedLocation,
      bio: cleanedBio,
      imageUrl: finalImageUrl,
      theme: theme || 'glass',
      skills: skillsArray,
      socials: {
        github: formattedGithub,
        linkedin: formattedLinkedin,
        twitter: formattedTwitter
      },
      createdAt
    }
  });
});

// Fallback to index.html for single page applications
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
