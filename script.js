/* ============================================================
   for da bday boy — script.js
   ============================================================ */

/* ─────────────────────────────────────
   1. cursor shenanigans n other sparkless
───────────────────────────────────── */
(function initCursorTrail() {
  const canvas = document.getElementById('cursorCanvas');
  const ctx    = canvas.getContext('2d');
  const trail  = [];
  let mx = -100, my = -100;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    document.documentElement.style.setProperty('--cx', mx + 'px');
    document.documentElement.style.setProperty('--cy', my + 'px');

    // Spawn trail particle
    const isCyan = Math.random() > 0.55;
    trail.push({
      x: mx + (Math.random() - 0.5) * 10,
      y: my + (Math.random() - 0.5) * 10,
      alpha: 0.85,
      size: Math.random() * 3 + 1.5,
      cyan: isCyan,
    });
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = trail.length - 1; i >= 0; i--) {
      const p = trail[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.cyan
        ? `rgba(125,232,240,${p.alpha})`
        : `rgba(240,216,132,${p.alpha})`;
      ctx.shadowColor = p.cyan ? '#7de8f0' : '#f0d884';
      ctx.shadowBlur  = 10;
      ctx.fill();
      p.alpha -= 0.045;
      p.size  *= 0.94;
      if (p.alpha <= 0) trail.splice(i, 1);
    }
    requestAnimationFrame(draw);
  }
  draw();
})();


/* ─────────────────────────────────────
   2. hero starfield <3
───────────────────────────────────── */
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  const ctx    = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    generateStars();
  }

  function generateStars() {
    stars = [];
    const n = Math.floor(canvas.width * canvas.height / 2800);
    for (let i = 0; i < n; i++) {
      stars.push({
        x:    Math.random() * canvas.width,
        y:    Math.random() * canvas.height,
        r:    Math.random() * 1.6 + 0.3,
        a:    Math.random(),
        spd:  Math.random() * 0.013 + 0.004,
        cyan: Math.random() > 0.82,
        gold: Math.random() > 0.92,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.a += s.spd;
      if (s.a > 1 || s.a < 0.08) s.spd *= -1;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);

      if (s.gold) {
        ctx.fillStyle   = `rgba(240,216,132,${s.a * 0.85})`;
        ctx.shadowColor = '#f0d884';
        ctx.shadowBlur  = 5;
      } else if (s.cyan) {
        ctx.fillStyle   = `rgba(125,232,240,${s.a * 0.9})`;
        ctx.shadowColor = '#7de8f0';
        ctx.shadowBlur  = 6;
      } else {
        ctx.fillStyle   = `rgba(235,245,255,${s.a})`;
        ctx.shadowColor = 'rgba(235,245,255,0.4)';
        ctx.shadowBlur  = s.r > 1.2 ? 4 : 0;
      }
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
})();


/* ─────────────────────────────────────
   3. floating lil particless
───────────────────────────────────── */
(function initParticles() {
  const field = document.getElementById('particleField');
  for (let i = 0; i < 35; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    const cyan = Math.random() > 0.5;
    p.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random()*100}%;top:${Math.random()*100}%;
      background:${cyan ? 'rgba(125,232,240,0.7)' : 'rgba(240,216,132,0.7)'};
      --dur:${(Math.random()*6+4).toFixed(1)}s;
      --del:-${(Math.random()*8).toFixed(1)}s;
    `;
    field.appendChild(p);
  }
})();


/* ─────────────────────────────────────
   4. scroll for wish cards
───────────────────────────────────── */
(function initScrollReveal() {
  const cards = document.querySelectorAll('.wish-card');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.dataset.delay) || 0;
        setTimeout(() => e.target.classList.add('visible'), delay);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  cards.forEach(c => obs.observe(c));
})();


/* ─────────────────────────────────────
   5. interactive candfles :p u better work hmpf
───────────────────────────────────── */
(function initCake() {
  const cakeSvg       = document.getElementById('cakeSvg');
  const countText     = document.getElementById('candleCountText');
  const counterEl     = document.getElementById('candleCounter');
  const wishPrompt    = document.getElementById('wishPrompt');
  const confettiCanvas = document.getElementById('confettiCanvas');
  const cCtx          = confettiCanvas.getContext('2d');

  let lit = 5;  // candles still burning

  // resize confetti canvas
  function resizeConfetti() {
    confettiCanvas.width  = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  resizeConfetti();
  window.addEventListener('resize', resizeConfetti);

  // hook each candle group
  for (let i = 0; i < 5; i++) {
    const group = document.getElementById(`candleGroup${i}`);
    const flame = document.getElementById(`flame${i}`);
    if (!group || !flame) continue;

    group.addEventListener('click', () => {
      if (flame.classList.contains('extinguished')) return; // already out

      // 1. extinguish the flame
      flame.classList.add('extinguished');
      lit--;

      // 2. spawn smoke puff over the flame
      spawnSmoke(group, i);

      // 3. update counter text
      if (lit > 0) {
        countText.textContent = `${lit} candle${lit === 1 ? '' : 's'} left to blow out`;
      } else {
        // all done!
        counterEl.style.opacity = '0';
        wishPrompt.classList.add('visible');
        cakeSvg.classList.add('brightened');
        setTimeout(() => launchConfetti(), 400);
      }
    });
  }

  // smoke puff helper or whtvr
  function spawnSmoke(candleGroup, index) {
    // flame svg positions etc
    const positions = [
      { x: 123, y: 39 },
      { x: 145, y: 35 },
      { x: 169, y: 27 },
      { x: 193, y: 35 },
      { x: 215, y: 39 },
    ];
    const svgEl    = cakeSvg;
    const svgRect  = svgEl.getBoundingClientRect();
    const vbWidth  = 340; const vbHeight = 300;
    const scaleX   = svgRect.width  / vbWidth;
    const scaleY   = svgRect.height / vbHeight;
    const pos      = positions[index];

    const puffX = svgRect.left + pos.x * scaleX;
    const puffY = svgRect.top  + pos.y * scaleY;

    for (let p = 0; p < 5; p++) {
      const puff = document.createElement('div');
      puff.className = 'smoke-puff';
      puff.style.cssText = `
        left:${puffX + (Math.random()-0.5)*8}px;
        top:${puffY}px;
        --sx:${(Math.random()-0.5)*20}px;
        animation-delay:${p*0.12}s;
        position:fixed;
        z-index:300;
      `;
      document.body.appendChild(puff);
      setTimeout(() => puff.remove(), 1400);
    }
  }

  // ── confetti yippieeee ──
  let confettiPieces = [];
  let confettiRunning = false;

  function launchConfetti() {
    confettiPieces = [];
    const colours = [
      '#f0d884', '#7de8f0', '#e878a8', '#a080f0', '#80e8a8', '#f8a060', '#c8d8ff'
    ];
    for (let i = 0; i < 180; i++) {
      confettiPieces.push({
        x:   Math.random() * confettiCanvas.width,
        y:   -10 - Math.random() * 200,
        w:   Math.random() * 10 + 4,
        h:   Math.random() * 5 + 3,
        r:   Math.random() * Math.PI * 2,
        vx:  (Math.random() - 0.5) * 3.5,
        vy:  Math.random() * 3 + 1.5,
        vr:  (Math.random() - 0.5) * 0.18,
        col: colours[Math.floor(Math.random() * colours.length)],
        alpha: 1,
      });
    }
    confettiRunning = true;
    drawConfetti();
  }

  function drawConfetti() {
    if (!confettiRunning) return;
    cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    let alive = 0;
    confettiPieces.forEach(p => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += 0.04;  // gravity
      p.r  += p.vr;
      if (p.y > confettiCanvas.height * 0.7) p.alpha -= 0.015;
      if (p.alpha <= 0) return;
      alive++;
      cCtx.save();
      cCtx.globalAlpha = p.alpha;
      cCtx.translate(p.x, p.y);
      cCtx.rotate(p.r);
      cCtx.fillStyle = p.col;
      cCtx.shadowColor = p.col;
      cCtx.shadowBlur  = 4;
      cCtx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      cCtx.restore();
    });
    if (alive > 0) {
      requestAnimationFrame(drawConfetti);
    } else {
      cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      confettiRunning = false;
    }
  }
})();


/* ─────────────────────────────────────
   6. floating stars
───────────────────────────────────── */
(function initFloatingStars() {
  const container = document.getElementById('floatingStars');
  const popup     = document.getElementById('starPopup');
  const msgEl     = document.getElementById('popupMessage');
  const closeBtn  = document.getElementById('popupClose');

  const messages = [
    // compliments
    "You have the most contagious laugh in any galaxy I've ever explored.",
    "You are so intelligent in ways that don't need proving. Your brain is full of constellations; it shows in how you listen, how you notice, how you understand people.",
    "There is something beautifully infinite about you. Like no matter how many years pass, there will always be more of you left to adore.",
    "And after all these years, I still look at you the same way people look at the night sky — overwhelmed that something so beautiful exists at all.",
    "There is something so attractive about the way you get passionate when explaining something you love. Your whole soul lights up like a collapsing star being born again.",
    // inside jokes 
    "Breaking news: local boy remains devastatingly charming despite the passage of time.",
    "You still make the butterflies in my stomach flutter, do you know that? Hmpf.",
    "The stars are getting jealous again. Please tone it down a little, thanks.",
    "You're lucky you're cute because honestly the nonsense you say sometimes is unbelievable.",
    "The universe gave you big beautiful eyes and then made you unbearably cheeky just to balance things out.",
    // achievements
    "Rare Achievement — 'Chosen One': selected by the cosmos to be inexplicably amazing.",
    "Secret Trophy — 'The Warmth': awarded to the person who makes others feel safe just by being nearby.",
    "Achievement — 'Light Year': your presence alone travels far. People feel it long after you've left a room.",
    "Gold Star — 'The One': as in, the one I'd search every universe for.",
    // emotional
    "You are every proof I've ever needed that soulmates are real.",
    "I think a part of me will always belong to the sound of your voice reading Alice in Wonderland to me in the dark. I don't even know how to explain what that meant to my heart.",
    "Being with you feels like coming home to a place I didn't know I was missing.",
    "You have loved me so gently that sometimes I forget the world can be cruel at all.",
    "I don't know what I did to get to be the person who knows you. But I'm so glad I did it.",
  ];

  const shuffled = [...messages].sort(() => Math.random() - 0.5);

  // star shapes etcc
  function makeStarSVG(i) {
    const size = 28 + Math.random() * 22;
    const isAlt = i % 3 === 0;
    const colour = i % 4 === 0 ? '#7de8f0' : '#f0d884';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 32 32');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('fill', colour);
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    if (isAlt) {
      poly.setAttribute('points', '16,2 19,11 29,11 21,17 24,27 16,21 8,27 11,17 3,11 13,11');
    } else {
      poly.setAttribute('points', '16,3 18,11 27,11 20,16 22,25 16,19 10,25 12,16 5,11 14,11');
    }
    svg.appendChild(poly);
    return svg;
  }

  const count = Math.min(shuffled.length, 20);

  for (let i = 0; i < count; i++) {
    const btn = document.createElement('button');
    btn.className   = 'float-star';
    btn.setAttribute('aria-label', 'Reveal a hidden message');

    const left  = 4 + Math.random() * 87;
    const top   = 4 + Math.random() * 82;
    const fdur  = (Math.random() * 4 + 3).toFixed(1) + 's';
    const fdel  = '-' + (Math.random() * 5).toFixed(1) + 's';

    btn.style.cssText = `left:${left}%;top:${top}%;--fdur:${fdur};--fdel:${fdel};`;
    btn.appendChild(makeStarSVG(i));
    btn.dataset.msg = shuffled[i];

    btn.addEventListener('click', () => openPopup(shuffled[i], btn));
    container.appendChild(btn);
  }

  function openPopup(msg, starEl) {
    msgEl.textContent = msg;
    popup.classList.add('open');
    starEl.classList.add('clicked');
    setTimeout(() => {
      starEl.classList.remove('clicked');
      starEl.style.opacity = '0.25';
      setTimeout(() => { starEl.style.opacity = ''; }, 2200);
    }, 560);
  }

  function closePopup() { popup.classList.remove('open'); }
  closeBtn.addEventListener('click', closePopup);
  popup.addEventListener('click', e => { if (e.target === popup) closePopup(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopup(); });
})();


/* ─────────────────────────────────────
   7. gathering srars
───────────────────────────────────── */
(function initFinalSection() {
  const section = document.getElementById('finalSection');
  const canvas  = document.getElementById('gatherCanvas');
  const ctx     = canvas.getContext('2d');
  let particles = [], triggered = false;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function spawn() {
    particles = [];
    for (let i = 0; i < 140; i++) {
      particles.push({
        x:    Math.random() * canvas.width,
        y:    Math.random() * canvas.height,
        tx:   canvas.width  * 0.5 + (Math.random() - 0.5) * 80,
        ty:   canvas.height * 0.44 + (Math.random() - 0.5) * 40,
        size: Math.random() * 2.5 + 0.8,
        a:    Math.random() * 0.4 + 0.15,
        spd:  Math.random() * 0.02 + 0.006,
        tw:   Math.random() * Math.PI * 2,
        tws:  Math.random() * 0.04 + 0.018,
        cyan: Math.random() > 0.65,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      if (triggered) {
        p.x += (p.tx - p.x) * p.spd;
        p.y += (p.ty - p.y) * p.spd;
      }
      p.tw += p.tws;
      const ta = p.a + Math.sin(p.tw) * 0.22;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle   = p.cyan ? `rgba(125,232,240,${ta})` : `rgba(240,216,132,${ta})`;
      ctx.shadowColor = p.cyan ? '#7de8f0' : '#f0d884';
      ctx.shadowBlur  = 9;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !triggered) {
        triggered = true;
        section.classList.add('visible');
        obs.unobserve(section);
      }
    });
  }, { threshold: 0.28 });

  obs.observe(section);
  resize(); spawn(); draw();
  window.addEventListener('resize', () => { resize(); spawn(); });
})();


/* ─────────────────────────────────────
   8. music :pp
───────────────────────────────────── */
(function initMusic() {
  const btn   = document.getElementById('musicToggle');
  const audio = document.getElementById('bgMusic');
  let playing = false;

  btn.addEventListener('click', () => {
    const hasSrc = audio.querySelector('source');
    if (!hasSrc) {
      btn.title = 'Add a music.mp3 file to enable music';
      btn.style.borderColor = 'rgba(240,216,132,0.5)';
      setTimeout(() => { btn.style.borderColor = ''; btn.title = ''; }, 2200);
      return;
    }
    if (playing) {
      audio.pause();
      btn.classList.remove('playing');
      playing = false;
    } else {
      audio.volume = 0.32;
      audio.play().then(() => {
        btn.classList.add('playing');
        playing = true;
      }).catch(() => {});
    }
  });
})();


/* ─────────────────────────────────────
   9. smooth scroll wow
───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
