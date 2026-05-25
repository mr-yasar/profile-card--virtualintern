document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const profileForm = document.getElementById('profileForm');
  const inputName = document.getElementById('inputName');
  const inputRole = document.getElementById('inputRole');
  const inputLocation = document.getElementById('inputLocation');
  const inputImageUrl = document.getElementById('inputImageUrl');
  const inputBio = document.getElementById('inputBio');
  const inputSkills = document.getElementById('inputSkills');
  const inputGithub = document.getElementById('inputGithub');
  const inputLinkedin = document.getElementById('inputLinkedin');
  const inputTwitter = document.getElementById('inputTwitter');
  
  const charNum = document.getElementById('charNum');
  const nameError = document.getElementById('nameError');
  const submitBtn = document.getElementById('submitBtn');
  const previewWrapper = document.getElementById('previewWrapper');
  const cardPlaceholder = document.getElementById('cardPlaceholder');
  const generatedCard = document.getElementById('generatedCard');
  const cardActions = document.getElementById('cardActions');
  const copyDetailsBtn = document.getElementById('copyDetailsBtn');
  const resetBtn = document.getElementById('resetBtn');
  
  // Background glowing orbs
  const glowBg1 = document.getElementById('glowBg1');
  const glowBg2 = document.getElementById('glowBg2');

  // Active processed card state
  let currentCardData = null;

  // --- Character Counter ---
  inputBio.addEventListener('input', () => {
    const len = inputBio.value.length;
    charNum.textContent = len;
    if (len >= 230) {
      charNum.style.color = '#ef4444'; // Red when close to limit
    } else if (len >= 180) {
      charNum.style.color = '#f59e0b'; // Amber warning
    } else {
      charNum.style.color = 'var(--text-muted)';
    }
  });

  // --- Live Input Validation ---
  inputName.addEventListener('input', () => {
    if (inputName.value.trim() !== '') {
      inputName.closest('.form-group').classList.remove('has-error');
    }
  });

  // --- Dynamic Background Glow adjustment based on selected theme ---
  const themeRadios = document.querySelectorAll('input[name="theme"]');
  themeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const selectedTheme = e.target.value;
      updateGlowBackground(selectedTheme);
    });
  });

  function updateGlowBackground(theme) {
    if (theme === 'glass') {
      glowBg1.style.background = 'radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, rgba(168, 85, 247, 0.2) 70%)';
      glowBg2.style.background = 'radial-gradient(circle, rgba(168, 85, 247, 0.5) 0%, rgba(59, 130, 246, 0.2) 70%)';
    } else if (theme === 'cyberpunk') {
      glowBg1.style.background = 'radial-gradient(circle, rgba(255, 0, 127, 0.6) 0%, rgba(0, 0, 0, 0) 70%)';
      glowBg2.style.background = 'radial-gradient(circle, rgba(0, 243, 255, 0.5) 0%, rgba(0, 0, 0, 0) 70%)';
    } else if (theme === 'sunset') {
      glowBg1.style.background = 'radial-gradient(circle, rgba(245, 158, 11, 0.5) 0%, rgba(244, 63, 94, 0.2) 70%)';
      glowBg2.style.background = 'radial-gradient(circle, rgba(244, 63, 94, 0.5) 0%, rgba(139, 92, 246, 0.2) 70%)';
    } else if (theme === 'emerald') {
      glowBg1.style.background = 'radial-gradient(circle, rgba(16, 185, 129, 0.5) 0%, rgba(6, 78, 59, 0.2) 70%)';
      glowBg2.style.background = 'radial-gradient(circle, rgba(52, 211, 153, 0.4) 0%, rgba(2, 44, 34, 0.2) 70%)';
    }
  }

  // --- Form Submission Handling ---
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Client-Side Validation
    const nameVal = inputName.value.trim();
    if (!nameVal) {
      const parent = inputName.closest('.form-group');
      parent.classList.add('has-error');
      inputName.focus();
      return;
    }

    // 2. Setup Loading UI
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Get selected theme
    const themeVal = document.querySelector('input[name="theme"]:checked').value;

    // Build the request payload matching backend structure
    const payload = {
      name: nameVal,
      role: inputRole.value,
      location: inputLocation.value,
      bio: inputBio.value,
      imageUrl: inputImageUrl.value,
      theme: themeVal,
      skills: inputSkills.value,
      github: inputGithub.value,
      linkedin: inputLinkedin.value,
      twitter: inputTwitter.value
    };

    try {
      // 3. Make POST request to backend API
      const response = await fetch('/api/generate-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Server error generating card');
      }

      // Keep reference to generated card JSON
      currentCardData = result.data;

      // 4. Render Card with processed data
      renderProfileCard(result.data);

      // Smooth scroll preview into view on small screens
      if (window.innerWidth <= 768) {
        previewWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message || 'Something went wrong while creating your card.'}`);
    } finally {
      // Restore Button UI
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });

  // --- Card Rendering Engine ---
  function renderProfileCard(data) {
    // Determine the class theme
    let themeClass = 'theme-glass-card';
    if (data.theme === 'cyberpunk') themeClass = 'theme-cyberpunk-card';
    if (data.theme === 'sunset') themeClass = 'theme-sunset-card';
    if (data.theme === 'emerald') themeClass = 'theme-emerald-card';

    // Format date nicely
    const createdDate = new Date(data.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    // Handle skills array rendering
    let skillsHTML = '';
    if (data.skills && data.skills.length > 0) {
      skillsHTML = `
        <div class="card-skills-title">Key Competencies</div>
        <div class="card-skills">
          ${data.skills.map(skill => `<span class="skill-badge">${escapeHTML(skill)}</span>`).join('')}
        </div>
      `;
    }

    // Handle social links rendering
    let socialsHTML = '';
    const { github, linkedin, twitter } = data.socials;
    if (github || linkedin || twitter) {
      socialsHTML = `<div class="card-socials">`;
      if (github) {
        socialsHTML += `
          <a href="${escapeHTML(github)}" target="_blank" rel="noopener noreferrer" class="social-link-btn" title="GitHub Profile">
            <i class="fa-brands fa-github"></i>
          </a>
        `;
      }
      if (linkedin) {
        socialsHTML += `
          <a href="${escapeHTML(linkedin)}" target="_blank" rel="noopener noreferrer" class="social-link-btn" title="LinkedIn Profile">
            <i class="fa-brands fa-linkedin-in"></i>
          </a>
        `;
      }
      if (twitter) {
        socialsHTML += `
          <a href="${escapeHTML(twitter)}" target="_blank" rel="noopener noreferrer" class="social-link-btn" title="X Profile">
            <i class="fa-brands fa-x-twitter"></i>
          </a>
        `;
      }
      socialsHTML += `</div>`;
    }

    // Compose final template HTML
    const cardTemplate = `
      <div class="card-inner ${themeClass}">
        <div class="card-header-gradient"></div>
        <div class="avatar-container">
          <div class="avatar-border">
            <img src="${escapeHTML(data.imageUrl)}" alt="${escapeHTML(data.name)}'s Avatar" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=8b5cf6&color=ffffff&size=256'">
          </div>
        </div>
        <div class="card-body">
          <h3 class="card-name">${escapeHTML(data.name)}</h3>
          <div class="card-role">${escapeHTML(data.role)}</div>
          <div class="card-location">
            <i class="fa-solid fa-location-dot"></i> ${escapeHTML(data.location)}
          </div>
          <p class="card-bio">"${escapeHTML(data.bio)}"</p>
          
          ${skillsHTML}
          ${socialsHTML}

          <div class="card-footer-meta">
            <span class="card-date"><i class="fa-regular fa-calendar"></i> ${createdDate}</span>
            <span class="card-id">${escapeHTML(data.id)}</span>
          </div>
        </div>
      </div>
    `;

    // Reset components & Inject
    cardPlaceholder.style.display = 'none';
    generatedCard.innerHTML = cardTemplate;
    generatedCard.style.display = 'block';
    
    // Trigger animation frame delay so class transition handles scale/fade correctly
    requestAnimationFrame(() => {
      generatedCard.classList.add('active');
      cardActions.style.display = 'flex';
    });
  }

  // --- Copy JSON Action ---
  copyDetailsBtn.addEventListener('click', () => {
    if (!currentCardData) return;
    
    const jsonString = JSON.stringify(currentCardData, null, 2);
    
    navigator.clipboard.writeText(jsonString).then(() => {
      // Toggle button text as a micro-feedback state
      const originalText = copyDetailsBtn.innerHTML;
      copyDetailsBtn.innerHTML = `<i class="fa-solid fa-check"></i> Copied JSON!`;
      copyDetailsBtn.style.borderColor = '#10b981';
      copyDetailsBtn.style.color = '#10b981';
      
      setTimeout(() => {
        copyDetailsBtn.innerHTML = originalText;
        copyDetailsBtn.style.borderColor = '';
        copyDetailsBtn.style.color = '';
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  });

  // --- Reset Application Action ---
  resetBtn.addEventListener('click', () => {
    // Clear Form inputs
    profileForm.reset();
    charNum.textContent = '0';
    charNum.style.color = 'var(--text-muted)';
    
    // Clear validation error classes
    inputName.closest('.form-group').classList.remove('has-error');

    // Hide generated card and actions
    generatedCard.classList.remove('active');
    generatedCard.style.display = 'none';
    generatedCard.innerHTML = '';
    cardActions.style.display = 'none';

    // Restore Placeholder State
    cardPlaceholder.style.display = 'flex';
    
    // Reset background glow states
    updateGlowBackground('glass');
    currentCardData = null;
    
    // Smooth scroll back to form on mobile
    if (window.innerWidth <= 768) {
      profileForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Helper utility to escape HTML inputs (preventing XSS)
  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
