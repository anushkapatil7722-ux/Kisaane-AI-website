document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Navigation & Scroll Effects
  // ==========================================
  const header = document.getElementById('header');
  const menuBtn = document.getElementById('menu-btn');
  const navLinks = document.getElementById('nav-links');

  // Change header styling on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Toggle mobile navigation menu
  menuBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen);
    menuBtn.textContent = isOpen ? '✕' : '☰';
  });

  // Close mobile navigation when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.textContent = '☰';
    });
  });


  // ==========================================
  // 2. Feature Tab Switcher & Dynamic Demo
  // ==========================================
  const featureCards = document.querySelectorAll('.feature-card');
  const demoTitle = document.getElementById('demo-title');
  
  // Demo containers
  const demos = {
    scanner: document.getElementById('demo-scanner'),
    weather: document.getElementById('demo-weather'),
    fertilizer: document.getElementById('demo-fertilizer'),
    market: document.getElementById('demo-market')
  };

  const demoInfo = {
    scanner: { title: 'AI Crop Scanner', icon: '📸' },
    weather: { title: 'Weather & Irrigation', icon: '🌦️' },
    fertilizer: { title: 'Fertilizer Calculator', icon: '🌿' },
    market: { title: 'Live Mandi Prices', icon: '💰' }
  };

  featureCards.forEach(card => {
    card.addEventListener('click', () => {
      const targetFeature = card.getAttribute('data-feature');
      
      // Toggle active states on feature cards
      featureCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      // Update header of the demo box
      demoTitle.innerHTML = `<span class="demo-title-icon">${demoInfo[targetFeature].icon}</span> ${demoInfo[targetFeature].title}`;

      // Switch displayed demo panel
      Object.keys(demos).forEach(key => {
        if (key === targetFeature) {
          demos[key].style.display = 'flex';
        } else {
          demos[key].style.display = 'none';
        }
      });
    });

    // Make keyboard friendly
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });


  // ==========================================
  // 3. AI Crop Scanner Simulator
  // ==========================================
  const scanButtons = document.querySelectorAll('.scan-sample-btn');
  const defaultLeafSvg = document.getElementById('default-leaf-svg');
  const selectedLeafSvg = document.getElementById('selected-leaf-svg');
  const leafPath = document.getElementById('leaf-path');
  const laser = document.getElementById('scanner-laser');
  const resultsBlock = document.getElementById('scanner-results');
  const resultsHeadline = document.getElementById('results-headline');
  const resultsText = document.getElementById('results-text');

  // Spots representing disease configurations on the SVG leaf
  const spots = [
    document.getElementById('blight-spot-1'),
    document.getElementById('blight-spot-2'),
    document.getElementById('blight-spot-3')
  ];

  const diagnosticDatabase = {
    tomato: {
      headline: '⚠️ Tomato Late Blight Detected',
      text: 'Our AI model detected <strong>Late Blight (Phytophthora infestans)</strong> with 87% confidence. Recommendation: Apply copper-based fungicide or Metalaxyl immediately. Trim lower leaves to improve ventilation and prevent soil-splash transmission.',
      leafColor: '#4CAF50',
      spotsColor: '#5c4033',
      spotsVisible: [true, true, true],
      advice: '🌧️ Alert: Rain predicted tomorrow in Nashik region. High humidity will speed up late blight spread. Apply treatment before rain begins.'
    },
    corn: {
      headline: '⚠️ Common Rust Detected',
      text: 'Our AI model detected <strong>Common Rust (Puccinia sorghi)</strong> with 92% confidence. Recommendation: Apply Mancozeb or Strobilurin fungicides. Clean plant residues after harvest. Rotate with non-grass crops for the next cycle.',
      leafColor: '#8BC34A',
      spotsColor: '#FF9800',
      spotsVisible: [true, false, true],
      advice: '🌾 Alert: High wind speeds (15km/h) today will carry rust spores to adjacent fields. Inform neighboring farmers to inspect corn stalks.'
    },
    cotton: {
      headline: '⚠️ Alternaria Leaf Spot Detected',
      text: 'Our AI model detected <strong>Alternaria Leaf Spot</strong> with 79% confidence. Recommendation: Prune infected parts to restrict progression. Spray Copper Oxychloride (0.3%) at 15-day intervals. Avoid nitrogen excess.',
      leafColor: '#2E7D32',
      spotsColor: '#3E2723',
      spotsVisible: [false, true, true],
      advice: '🌱 Alert: High soil humidity levels. Delay nitrogen top-dressing to prevent leaf softness and fungal penetration.'
    }
  };

  scanButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const crop = btn.getAttribute('data-crop');
      
      // Update selected button styling
      scanButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      // Setup leaf SVG colors
      const data = diagnosticDatabase[crop];
      leafPath.setAttribute('fill', data.leafColor);
      spots.forEach((spot, idx) => {
        spot.setAttribute('fill', data.spotsColor);
        spot.style.display = data.spotsVisible[idx] ? 'block' : 'none';
      });

      // Switch viewfinder to show leaf SVG
      defaultLeafSvg.style.display = 'none';
      selectedLeafSvg.style.display = 'block';

      // Start scanning animation
      laser.style.display = 'block';
      resultsBlock.style.display = 'block';
      resultsHeadline.textContent = 'Scanning...';
      resultsText.innerHTML = 'Computing neural network matrices. Checking leaf pixels...';

      // Delay to simulate AI inference
      setTimeout(() => {
        laser.style.display = 'none';
        resultsHeadline.innerHTML = data.headline;
        resultsText.innerHTML = data.text;

        // Also update the weather advisor suggestion box based on the scanned crop
        document.getElementById('weather-advice-text').innerHTML = data.advice;
      }, 2000);
    });
  });


  // ==========================================
  // 4. Fertilizer Recommendation Logic
  // ==========================================
  const calcBtn = document.getElementById('btn-calc-fertilizer');
  const cropSelect = document.getElementById('crop-select');
  const soilSelect = document.getElementById('soil-select');
  const fertOutput = document.getElementById('fertilizer-output');
  const fertTitle = document.getElementById('fert-title');
  const fertText = document.getElementById('fert-text');

  const fertilizerDatabase = {
    wheat: {
      loamy: {
        mix: '🍀 Optimal NPK Ratio: 120 : 60 : 40 kg/hectare',
        steps: 'Apply all Phosphorus (P) and Potassium (K) at sowing. Split Nitrogen (Urea) into 3 equal doses: at sowing, crown root initiation (21 days), and tillering stage (45 days).'
      },
      clayey: {
        mix: '🍀 Optimal NPK Ratio: 100 : 50 : 30 kg/hectare',
        steps: 'Clayey soils hold Nitrogen well. Apply Nitrogen in 2 split doses: at sowing and jointing stage. Ensure soil is not flooded during application.'
      },
      sandy: {
        mix: '🍂 Optimal NPK Ratio: 120 : 60 : 60 kg/hectare',
        steps: 'Sandy soils leach Potassium and Nitrogen easily. Split Nitrogen into 4 small doses. Apply additional organic compost (15 tonnes/ha) to increase nutrient absorption.'
      }
    },
    rice: {
      loamy: {
        mix: '🍀 Optimal NPK Ratio: 100 : 50 : 50 kg/hectare',
        steps: 'Apply half Nitrogen, full Phosphorus and Potassium before transplanting. Apply remaining Nitrogen in two equal portions at tillering and panicle initiation stages.'
      },
      clayey: {
        mix: '🍀 Optimal NPK Ratio: 80 : 40 : 40 kg/hectare',
        steps: 'Clayey soils hold moisture and fertilizer well. Apply full Phosphorus at sowing, and Nitrogen in 2 equal doses under muddy but not submerged field conditions.'
      },
      sandy: {
        mix: '🍂 Optimal NPK Ratio: 120 : 60 : 60 kg/hectare',
        steps: 'High leaching risk. Split Nitrogen into 4 top-dresses. Apply Zinc Sulfate (25 kg/hectare) to prevent Khaira disease common in sandy soil beds.'
      }
    },
    sugarcane: {
      loamy: {
        mix: '🔥 Optimal NPK Ratio: 250 : 115 : 115 kg/hectare',
        steps: 'High nutritional requirements. Apply full Phosphorus at planting. Split Nitrogen into 4 installments: 30, 60, 90, and 120 days post-planting. Keep fields irrigated.'
      },
      clayey: {
        mix: '🔥 Optimal NPK Ratio: 220 : 100 : 100 kg/hectare',
        steps: 'Split Nitrogen into 3 applications. Clay retention is high; avoid deep nitrogen placement. Apply Potassium in two split applications for optimal cane weight.'
      },
      sandy: {
        mix: '🍂 Optimal NPK Ratio: 280 : 130 : 130 kg/hectare',
        steps: 'Extremely high fertilizer demand due to sandy leaching. Incorporate green manures (Daincha or Sunnhemp) prior to sugarcane sowing. Split N & K fertilizers into 5 small split doses.'
      }
    }
  };

  calcBtn.addEventListener('click', () => {
    const crop = cropSelect.value;
    const soil = soilSelect.value;
    const data = fertilizerDatabase[crop][soil];

    fertTitle.textContent = data.mix;
    fertText.innerHTML = `<strong>Schedule Advice:</strong> ${data.steps}`;
    fertOutput.style.display = 'block';
  });


  // ==========================================
  // 5. Market Price Live Filter
  // ==========================================
  const searchInput = document.getElementById('market-search-input');
  const marketList = document.getElementById('market-list');
  const marketItems = marketList.querySelectorAll('.market-item');

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    marketItems.forEach(item => {
      const crop = item.getAttribute('data-crop').toLowerCase();
      const mandi = item.getAttribute('data-mandi').toLowerCase();
      const content = item.textContent.toLowerCase();

      if (crop.includes(query) || mandi.includes(query) || content.includes(query)) {
        item.style.display = 'flex';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });

    // Remove existing placeholder if it exists
    const existingPlaceholder = document.getElementById('market-empty-placeholder');
    if (existingPlaceholder) {
      existingPlaceholder.remove();
    }

    // If no results, show placeholder
    if (visibleCount === 0) {
      const placeholder = document.createElement('div');
      placeholder.id = 'market-empty-placeholder';
      placeholder.style.textAlign = 'center';
      placeholder.style.padding = '20px';
      placeholder.style.color = 'var(--text-muted)';
      placeholder.style.fontSize = '15px';
      placeholder.textContent = 'No matching mandi prices found.';
      marketList.appendChild(placeholder);
    }
  });


  // ==========================================
  // 6. Scroll Animations (Intersection Observer)
  // ==========================================
  const animatedElements = document.querySelectorAll('.fade-in-scroll');

  const observerOptions = {
    root: null, // default viewport
    rootMargin: '0px',
    threshold: 0.15 // trigger when 15% of the element is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => {
    observer.observe(el);
  });
});
