/**
 * Diamond Color Matic (DCM) - 8-Bit Tinting Machine Game
 * 
 * Strict Design Directive:
 * - NO box-shadow, NO text-shadow, NO glow effects
 * - NO translateY on hover (zero hover lifting)
 * - Pure 8-bit retro arcade pixel aesthetic
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.DCM8BitGame = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  // --- 8-BIT CHIPTUNE SOUND SYNTHESIZER (Pure Web Audio API, Zero Audio Files) ---
  class ChiptuneAudio {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }

    playTone(freq, type = 'square', duration = 0.08, startTime = 0) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const now = this.ctx.currentTime + startTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type; // 'square', 'triangle', 'sawtooth'
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.setValueAtTime(0.12, now + duration - 0.01);
        gain.gain.setValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
      } catch (e) {
        // Audio policy or inactive
      }
    }

    click() {
      this.playTone(660, 'square', 0.04);
    }

    select() {
      this.playTone(440, 'square', 0.04);
      this.playTone(880, 'square', 0.06, 0.04);
    }

    coin() {
      this.playTone(987.77, 'square', 0.07);
      this.playTone(1318.51, 'square', 0.28, 0.07);
    }

    bucketEnter() {
      this.playTone(180, 'triangle', 0.06);
      this.playTone(220, 'triangle', 0.08, 0.06);
      this.playTone(120, 'square', 0.12, 0.14);
    }

    pourStream() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      // Sputtering liquid glug sound
      for (let i = 0; i < 6; i++) {
        const freq = 300 + Math.random() * 250;
        this.playTone(freq, 'triangle', 0.06, i * 0.07);
      }
    }

    mixRumble() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      for (let i = 0; i < 8; i++) {
        const freq = 60 + (i % 2 === 0 ? 30 : 0);
        this.playTone(freq, 'sawtooth', 0.07, i * 0.06);
      }
    }

    lidSnap() {
      this.playTone(320, 'triangle', 0.03);
      this.playTone(140, 'square', 0.10, 0.03);
      this.playTone(90, 'sawtooth', 0.15, 0.07);
    }

    fanfare() {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((f, idx) => {
        this.playTone(f, 'square', idx === 3 ? 0.35 : 0.10, idx * 0.11);
      });
    }
  }

  // --- OFFICIAL DIAMOND COLOR MATIC 8-BIT SHADES DATABASE ---
  const DEFAULT_PALETTE = [
    { name: "Fire Princess", code: "QC0321", hex: "#D82036", family: "Red" },
    { name: "Strawberry Ice", code: "QC0322", hex: "#E85D75", family: "Red" },
    { name: "Red Hot", code: "QC0331", hex: "#B51226", family: "Red" },
    { name: "Sunset Gold", code: "QC0219", hex: "#F5A623", family: "Yellow" },
    { name: "Marigold Honey", code: "QC0235", hex: "#FF9F1C", family: "Yellow" },
    { name: "Emerald Peak", code: "QC0512", hex: "#008F4C", family: "Green" },
    { name: "Mint Breeze", code: "QC0540", hex: "#48C78E", family: "Green" },
    { name: "Pistachio Dream", code: "QC0567", hex: "#7BC043", family: "Green" },
    { name: "Royal Sapphire", code: "QC0842", hex: "#194BE6", family: "Blue" },
    { name: "Arabian Sea", code: "QC0810", hex: "#0278AE", family: "Blue" },
    { name: "Sky Horizon", code: "QC0855", hex: "#51A0D5", family: "Blue" },
    { name: "Velvet Violet", code: "QC0915", hex: "#6B38FB", family: "Purple" },
    { name: "Sugar Pink", code: "QC0327", hex: "#EC4899", family: "Pink" },
    { name: "Orchid Fantasy", code: "QC0932", hex: "#A855F7", family: "Purple" },
    { name: "Desert Sand", code: "QC0120", hex: "#D4C5B9", family: "Neutral" },
    { name: "Pearl White", code: "QC0101", hex: "#F3F4F6", family: "Neutral" }
  ];

  const PRODUCTS = [
    { id: "super-emulsion", name: "Super Emulsion", finish: "Matt Interior" },
    { id: "durasilk", name: "Ace Durasilk", finish: "Luxury Silk" },
    { id: "matt-enamel", name: "Ace Matt Enamel", finish: "Smooth Non-Dazzle" },
    { id: "weather-max", name: "Weather Max", finish: "Exterior Shield" }
  ];

  // Helper: Convert HEX to RGB
  function rgbToHex(rgbStr) {
    if (!rgbStr || rgbStr.startsWith('#')) return rgbStr || '#D82036';
    const m = rgbStr.match(/\d+/g);
    if (!m || m.length < 3) return '#D82036';
    return '#' + m.slice(0, 3).map(n => Number(n).toString(16).padStart(2, '0')).join('').toUpperCase();
  }

  function hexToRgb(hex) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  // Helper: Estimate Tint Formulation
  function calculateFormula(hex) {
    const rgb = hexToRgb(hex);
    // Rough CMYK-like colorant estimation
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const k = 1 - Math.max(r, g, b);
    const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

    return {
      cyan: Math.round(c * 60) + 2,
      magenta: Math.round(m * 60) + 2,
      yellow: Math.round(y * 60) + 2,
      black: Math.round(k * 40) + 1,
      baseWhite: 950 - Math.round((c + m + y + k) * 50)
    };
  }

  // --- 8-BIT TINTING MACHINE GAME INSTANCE ---
  class MachineGame {
    constructor(container, options = {}) {
      this.container = typeof container === 'string' ? document.querySelector(container) : container;
      if (!this.container) {
        console.error('DCM 8-Bit Game: Container element not found');
        return;
      }

      this.options = Object.assign({
        imageSrc: 'Diamond-Color-Matic-Kiosk.png',
        pixelImageSrc: 'Diamond-Color-Matic-Kiosk-8bit.png',
        defaultColor: DEFAULT_PALETTE[0],
        simpleMode: false,
        onComplete: null
      }, options);

      this.audio = new ChiptuneAudio();
      if (this.options.simpleMode) {
        this.audio.enabled = false;
      }

      const rawFamilies = (this.options.simpleMode && typeof window !== 'undefined' && Array.isArray(window.DCM_COLOR_FAMILIES))
        ? window.DCM_COLOR_FAMILIES
        : null;

      this.families = rawFamilies
        ? rawFamilies.map(f => ({
            id: f.id,
            name: f.name,
            bg: f.bg,
            shades: f.shades.map(([name, code, rgb]) => ({
              name,
              code,
              hex: rgbToHex(rgb),
              family: f.name
            }))
          }))
        : null;

      this.activeFamilyId = this.families ? this.families[0].id : null;
      this.activeShades = this.families ? this.families[0].shades : DEFAULT_PALETTE;
      this.selectedColor = this.families ? this.families[0].shades[0] : this.options.defaultColor;
      this.selectedProduct = PRODUCTS[0];
      this.isPixelGraphic = false; // toggle between pixel-sprite and high-def kiosk
      this.isBusy = false;
      this.totalMixed = 0;

      this.init();
    }

    init() {
      this.render();
      this.cacheElements();
      this.bindEvents();
      this.updateColorDisplay();
    }

    render() {
      this.container.innerHTML = `
        <div class="dcm8-game-root ${this.options.simpleMode ? 'dcm8-simple-mode' : ''}" id="dcm8Root">
          ${this.options.simpleMode ? '' : `<!-- Header Bar -->
          <div class="dcm8-header">
            <div class="dcm8-header-title">
              <span class="dcm8-gem-icon"></span>
              <span>DCM-8000 COLOR MATIC</span>
            </div>
            <div class="dcm8-header-controls">
              <button class="dcm8-btn-tiny" id="dcm8GraphicToggle" title="Toggle 8-Bit Pixel Mode">GFX: 8-BIT</button>
              <button class="dcm8-btn-tiny" id="dcm8AudioToggle" title="Toggle Sound">SFX: ON</button>
            </div>
          </div>`}

          <!-- Kiosk Visual Stage -->
          <div class="dcm8-stage-wrapper">
            <div class="dcm8-kiosk-container" id="dcm8Kiosk">
              <!-- Main Kiosk Graphic Image -->
              <img 
                src="${this.options.imageSrc}" 
                alt="Diamond Color Matic Kiosk" 
                class="dcm8-kiosk-graphic" 
                id="dcm8KioskImg"
              />

              <!-- Top Screen Overlay (CRT Display) -->
              <div class="dcm8-screen-overlay" id="dcm8Screen">
                <div class="dcm8-screen-scanlines"></div>
                <div class="dcm8-screen-header">
                  <span>DCM OS v8.2</span>
                  <span id="dcm8ScreenStatus">READY</span>
                </div>
                <div class="dcm8-screen-main">
                  <div class="dcm8-screen-color-box" id="dcm8ScreenBox"></div>
                  <div class="dcm8-screen-shade-name" id="dcm8ScreenName">FIRE PRINCESS</div>
                  <div class="dcm8-screen-code" id="dcm8ScreenCode">QC0321 / #D82036</div>
                  <div class="dcm8-screen-status-badge" id="dcm8ScreenBadge">READY TO TINT</div>
                </div>
                <div class="dcm8-screen-footer">
                  <span>C-M-Y-K</span>
                  <div class="dcm8-screen-bars">
                    <div class="dcm8-screen-bar" id="dcm8BarC"></div>
                    <div class="dcm8-screen-bar" id="dcm8BarM"></div>
                    <div class="dcm8-screen-bar" id="dcm8BarY"></div>
                    <div class="dcm8-screen-bar" id="dcm8BarK"></div>
                  </div>
                </div>
              </div>

              <!-- Bottom Cavity Overlay (Dispenser Bay) -->
              <div class="dcm8-cavity-overlay" id="dcm8Cavity">
                <div class="dcm8-cavity-backdrop"></div>

                <!-- Industrial Nozzle Assembly at Ceiling -->
                <div class="dcm8-nozzle-rig" id="dcm8Nozzle">
                  <div class="dcm8-nozzle-mount">
                    <div class="dcm8-nozzle-led" id="dcm8NozzleLed"></div>
                  </div>
                  <div class="dcm8-nozzle-heads">
                    <div class="dcm8-nozzle-tip"></div>
                    <div class="dcm8-nozzle-tip center"></div>
                    <div class="dcm8-nozzle-tip"></div>
                  </div>
                </div>

                <!-- Paint Pouring Stream -->
                <div class="dcm8-pour-stream" id="dcm8PourStream"></div>

                <!-- Splatter Particles -->
                <div class="dcm8-splatter-container" id="dcm8Splatter">
                  <div class="dcm8-drop"></div>
                  <div class="dcm8-drop"></div>
                  <div class="dcm8-drop"></div>
                  <div class="dcm8-drop"></div>
                </div>

                <!-- 8-Bit Paint Bucket Sprite -->
                <div class="dcm8-bucket-assembly entering" id="dcm8Bucket">
                  <!-- Bucket Handle -->
                  <div class="dcm8-bucket-handle"></div>

                  <!-- Sealing Lid -->
                  <div class="dcm8-bucket-lid open" id="dcm8BucketLid"></div>

                  <!-- Bucket Body Can -->
                  <div class="dcm8-bucket-body">
                    <div class="dcm8-bucket-rim"></div>
                    
                    <!-- Paint Level Fluid Fill -->
                    <div class="dcm8-bucket-paint-level" id="dcm8PaintLevel">
                      <div class="dcm8-paint-surface"></div>
                    </div>

                    <!-- Front Label -->
                    <div class="dcm8-bucket-label">
                      <div class="dcm8-label-brand">DIAMOND</div>
                      <div class="dcm8-label-swatch" id="dcm8LabelSwatch"></div>
                      <div class="dcm8-label-name" id="dcm8LabelName">COLOR</div>
                    </div>

                    <div class="dcm8-bucket-base-band"></div>
                  </div>

                  <!-- Sparkles -->
                  <div class="dcm8-sparkle dcm8-sparkle-1" id="dcm8Sparkle1">✦</div>
                  <div class="dcm8-sparkle dcm8-sparkle-2" id="dcm8Sparkle2">✦</div>
                  <div class="dcm8-sparkle dcm8-sparkle-3" id="dcm8Sparkle3">✦</div>
                </div>

                ${this.options.simpleMode ? '' : '<!-- "COLLECT" Floating Tag -->\n                <div class="dcm8-collect-tag" id="dcm8CollectTag">▶ COLLECT CAN</div>'}

                <!-- Base Platform Floor -->
                <div class="dcm8-cavity-floor">
                  <div class="dcm8-floor-plate"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Console Control Deck -->
          <div class="dcm8-control-deck">
            <!-- Swatch Palette Label -->
            <div class="dcm8-section-label">
              <span>SELECT DCM COLOR</span>
              ${this.options.simpleMode ? (this.families ? `<span id="dcm8FamilyCount">${this.activeShades.length} Shades</span>` : '') : '<span id="dcm8MixedCounter">TINTED: 0 CANS</span>'}
            </div>

            ${this.families ? `
            <!-- Color Family Tabs -->
            <div class="dcm8-family-tabs" id="dcm8FamilyTabs" role="tablist" aria-label="Color Families">
              ${this.families.map(f => `
                <button
                  type="button"
                  class="dcm8-family-tab ${f.id === this.activeFamilyId ? 'active' : ''}"
                  data-family-id="${f.id}"
                >
                  <span class="dcm8-family-dot" style="background-color: ${f.bg};"></span>
                  <span>${f.name}</span>
                </button>
              `).join('')}
            </div>` : ''}

            <!-- Swatch Grid -->
            <div class="dcm8-palette-grid" id="dcm8PaletteGrid">
              ${this.activeShades.map((shade, i) => `
                <div 
                  class="dcm8-swatch-cell ${i === 0 ? 'selected' : ''}" 
                  style="background-color: ${shade.hex};" 
                  data-index="${i}" 
                  title="${shade.name} (${shade.code})"
                ></div>
              `).join('')}
            </div>

            <!-- Active Color & Custom Color Picker -->
            <div class="dcm8-active-info-bar">
              <div class="dcm8-active-preview">
                <div class="dcm8-preview-block" id="dcm8ActiveBox" style="background-color: ${this.selectedColor.hex};"></div>
                <div class="dcm8-preview-meta">
                  <div class="dcm8-preview-name" id="dcm8ActiveName">${this.selectedColor.name}</div>
                  <div class="dcm8-preview-code" id="dcm8ActiveCode">${this.selectedColor.code} / ${this.selectedColor.hex}</div>
                </div>
              </div>
              <div class="dcm8-custom-picker-wrap">
                <input 
                  type="color" 
                  id="dcm8CustomColor" 
                  class="dcm8-color-input" 
                  value="${this.selectedColor.hex}" 
                  title="Pick Any Custom Shade"
                />
              </div>
            </div>

            ${this.options.simpleMode ? '' : `<!-- Product Type Selectors -->
            <div class="dcm8-product-row" id="dcm8ProductRow">
              ${PRODUCTS.map((prod, i) => `
                <button 
                  class="dcm8-product-btn ${i === 0 ? 'active' : ''}" 
                  data-product-id="${prod.id}"
                >${prod.name}</button>
              `).join('')}
            </div>`}

            <!-- Big Arcade Action Buttons -->
            <div class="dcm8-action-bar">
              <button class="dcm8-btn-action" id="dcm8BtnTint">
                <span>▶ TINT PAINT NOW</span>
              </button>
              <button class="dcm8-btn-random" id="dcm8BtnRandom" title="Surprise Lucky Shade">🎲 RANDOM</button>
            </div>
          </div>

          <!-- Recipe Spec Modal / Collection Card -->
          <div class="dcm8-recipe-modal" id="dcm8RecipeModal">
            <div class="dcm8-modal-card">
              <div class="dcm8-modal-title">★ CUSTOM COLOR FORMULA ★</div>
              <div class="dcm8-modal-formula-table">
                <div class="dcm8-formula-row highlight">
                  <span>SHADE:</span>
                  <span id="dcm8ModalShade">Fire Princess</span>
                </div>
                <div class="dcm8-formula-row">
                  <span>DCM CODE:</span>
                  <span id="dcm8ModalCode">QC0321</span>
                </div>
                <div class="dcm8-formula-row">
                  <span>HEX / RGB:</span>
                  <span id="dcm8ModalHex">#D82036</span>
                </div>
                <div class="dcm8-formula-row">
                  <span>BASE PRODUCT:</span>
                  <span id="dcm8ModalProduct">Super Emulsion</span>
                </div>
                <div class="dcm8-formula-row">
                  <span>CYAN TINT:</span>
                  <span id="dcm8ModalCyan">12 ml</span>
                </div>
                <div class="dcm8-formula-row">
                  <span>MAGENTA TINT:</span>
                  <span id="dcm8ModalMagenta">54 ml</span>
                </div>
                <div class="dcm8-formula-row">
                  <span>YELLOW TINT:</span>
                  <span id="dcm8ModalYellow">28 ml</span>
                </div>
                <div class="dcm8-formula-row">
                  <span>BLACK TINT:</span>
                  <span id="dcm8ModalBlack">4 ml</span>
                </div>
              </div>
              <div class="dcm8-modal-buttons">
                <button class="dcm8-btn-modal" id="dcm8BtnCopy">COPY CODE</button>
                <button class="dcm8-btn-modal primary" id="dcm8BtnCloseModal">TINT ANOTHER</button>
              </div>
            </div>
          </div>

          <!-- Toast Alert -->
          <div class="dcm8-toast" id="dcm8Toast">COPIED TO CLIPBOARD!</div>
        </div>
      `;
    }

    cacheElements() {
      const q = (sel) => this.container.querySelector(sel);
      this.el = {
        root: q('#dcm8Root'),
        kiosk: q('#dcm8Kiosk'),
        kioskImg: q('#dcm8KioskImg'),
        graphicToggle: q('#dcm8GraphicToggle'),
        audioToggle: q('#dcm8AudioToggle'),
        // Screen
        screenStatus: q('#dcm8ScreenStatus'),
        screenBox: q('#dcm8ScreenBox'),
        screenName: q('#dcm8ScreenName'),
        screenCode: q('#dcm8ScreenCode'),
        screenBadge: q('#dcm8ScreenBadge'),
        barC: q('#dcm8BarC'),
        barM: q('#dcm8BarM'),
        barY: q('#dcm8BarY'),
        barK: q('#dcm8BarK'),
        // Cavity & Dispenser
        nozzle: q('#dcm8Nozzle'),
        nozzleLed: q('#dcm8NozzleLed'),
        pourStream: q('#dcm8PourStream'),
        splatter: q('#dcm8Splatter'),
        // Bucket
        bucket: q('#dcm8Bucket'),
        bucketLid: q('#dcm8BucketLid'),
        paintLevel: q('#dcm8PaintLevel'),
        labelSwatch: q('#dcm8LabelSwatch'),
        labelName: q('#dcm8LabelName'),
        sparkles: [q('#dcm8Sparkle1'), q('#dcm8Sparkle2'), q('#dcm8Sparkle3')],
        collectTag: q('#dcm8CollectTag'),
        // Controls
        familyTabs: q('#dcm8FamilyTabs'),
        familyCount: q('#dcm8FamilyCount'),
        paletteGrid: q('#dcm8PaletteGrid'),
        activeBox: q('#dcm8ActiveBox'),
        activeName: q('#dcm8ActiveName'),
        activeCode: q('#dcm8ActiveCode'),
        customColor: q('#dcm8CustomColor'),
        productBtns: this.container.querySelectorAll('.dcm8-product-btn'),
        btnTint: q('#dcm8BtnTint'),
        btnRandom: q('#dcm8BtnRandom'),
        mixedCounter: q('#dcm8MixedCounter'),
        // Modal
        modal: q('#dcm8RecipeModal'),
        modalShade: q('#dcm8ModalShade'),
        modalCode: q('#dcm8ModalCode'),
        modalHex: q('#dcm8ModalHex'),
        modalProduct: q('#dcm8ModalProduct'),
        modalCyan: q('#dcm8ModalCyan'),
        modalMagenta: q('#dcm8ModalMagenta'),
        modalYellow: q('#dcm8ModalYellow'),
        modalBlack: q('#dcm8ModalBlack'),
        btnCopy: q('#dcm8BtnCopy'),
        btnCloseModal: q('#dcm8BtnCloseModal'),
        toast: q('#dcm8Toast')
      };
    }

    bindEvents() {
      // Toggle Audio
      if (this.el.audioToggle) {
        this.el.audioToggle.addEventListener('click', () => {
          const enabled = this.audio.toggle();
          this.el.audioToggle.textContent = enabled ? 'SFX: ON' : 'SFX: OFF';
          if (enabled) this.audio.click();
        });
      }

      // Toggle Graphic Mode (Crisp 8-Bit Sprite vs Original Kiosk)
      if (this.el.graphicToggle) {
        this.el.graphicToggle.addEventListener('click', () => {
          this.isPixelGraphic = !this.isPixelGraphic;
          this.el.graphicToggle.textContent = this.isPixelGraphic ? 'GFX: HI-FI' : 'GFX: 8-BIT';
          this.el.kioskImg.src = this.isPixelGraphic ? this.options.pixelImageSrc : this.options.imageSrc;
          this.audio.click();
        });
      }

      // Color Family Tabs
      if (this.el.familyTabs && this.families) {
        this.el.familyTabs.addEventListener('click', (e) => {
          const tab = e.target.closest('.dcm8-family-tab');
          if (!tab || this.isBusy) return;
          this.switchFamily(tab.dataset.familyId);
        });
      }

      // Palette Swatch Clicks
      this.el.paletteGrid.addEventListener('click', (e) => {
        const cell = e.target.closest('.dcm8-swatch-cell');
        if (!cell || this.isBusy) return;
        const idx = parseInt(cell.dataset.index, 10);
        const shade = this.activeShades[idx];
        if (shade) {
          this.setColor(shade);
          this.audio.select();
        }
      });

      // Custom Color Picker
      this.el.customColor.addEventListener('input', (e) => {
        if (this.isBusy) return;
        const hex = e.target.value.toUpperCase();
        this.setColor({
          name: "Custom Shade",
          code: "DCM-" + hex.replace('#', ''),
          hex: hex,
          family: "Custom"
        }, false);
      });

      // Product Selection
      this.el.productBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          if (this.isBusy) return;
          this.el.productBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const p = PRODUCTS.find(x => x.id === btn.dataset.productId);
          if (p) this.selectedProduct = p;
          this.audio.click();
        });
      });

      // Big Tint Button
      this.el.btnTint.addEventListener('click', () => {
        if (this.isBusy) return;
        this.startTintingSequence();
      });

      // Random Lucky Color
      this.el.btnRandom.addEventListener('click', () => {
        if (this.isBusy) return;
        if (this.families && this.families.length) {
          const randomFam = this.families[Math.floor(Math.random() * this.families.length)];
          const randomShade = randomFam.shades[Math.floor(Math.random() * randomFam.shades.length)];
          if (this.activeFamilyId !== randomFam.id) {
            this.switchFamily(randomFam.id, false);
          }
          this.setColor(randomShade);
        } else {
          const randomShade = DEFAULT_PALETTE[Math.floor(Math.random() * DEFAULT_PALETTE.length)];
          this.setColor(randomShade);
        }
        this.audio.coin();
      });

      // Bucket click to inspect/collect
      if (this.el.collectTag) {
        this.el.bucket.addEventListener('click', () => {
          if (!this.isBusy && this.el.collectTag.classList.contains('active')) {
            this.openRecipeModal();
          }
        });
        this.el.collectTag.addEventListener('click', () => {
          this.openRecipeModal();
        });
      }

      // Modal buttons
      if (this.el.btnCloseModal) {
        this.el.btnCloseModal.addEventListener('click', () => {
          this.closeRecipeModal();
          this.resetDispenserView();
        });
      }

      if (this.el.btnCopy) {
        this.el.btnCopy.addEventListener('click', () => {
          const text = `Diamond Color Matic Formula:\nColor: ${this.selectedColor.name} (${this.selectedColor.code})\nHEX: ${this.selectedColor.hex}\nProduct: ${this.selectedProduct.name}`;
          navigator.clipboard.writeText(text).then(() => {
            this.showToast('RECIPE COPIED!');
            this.audio.coin();
          }).catch(() => {
            this.showToast('CODE: ' + this.selectedColor.hex);
          });
        });
      }
    }

    switchFamily(familyId, selectFirst = true) {
      if (!this.families) return;
      const fam = this.families.find(f => f.id === familyId);
      if (!fam) return;

      this.activeFamilyId = fam.id;
      this.activeShades = fam.shades;

      if (this.el.familyTabs) {
        this.el.familyTabs.querySelectorAll('.dcm8-family-tab').forEach(tab => {
          tab.classList.toggle('active', tab.dataset.familyId === fam.id);
        });
      }
      if (this.el.familyCount) {
        this.el.familyCount.textContent = `${fam.shades.length} Shades`;
      }

      this.el.paletteGrid.innerHTML = fam.shades.map((shade, i) => `
        <div
          class="dcm8-swatch-cell"
          style="background-color: ${shade.hex};"
          data-index="${i}"
          title="${shade.name} (${shade.code})"
        ></div>
      `).join('');

      this.el.paletteGrid.scrollTop = 0;

      if (selectFirst && fam.shades.length) {
        this.setColor(fam.shades[0]);
      }
    }

    setColor(colorObj, updateGrid = true) {
      this.selectedColor = colorObj;
      this.updateColorDisplay();

      if (updateGrid) {
        const cells = this.el.paletteGrid.querySelectorAll('.dcm8-swatch-cell');
        cells.forEach(c => {
          const idx = parseInt(c.dataset.index, 10);
          const shade = this.activeShades[idx];
          const isMatch = shade &&
            shade.hex.toLowerCase() === colorObj.hex.toLowerCase() &&
            (!colorObj.code || shade.code === colorObj.code);
          c.classList.toggle('selected', Boolean(isMatch));
          if (isMatch && c.scrollIntoView) {
            c.scrollIntoView({ block: 'nearest' });
          }
        });
      }
    }

    updateColorDisplay() {
      const c = this.selectedColor;
      // Screen Overlay
      this.el.screenBox.style.backgroundColor = c.hex;
      this.el.screenName.textContent = c.name.toUpperCase();
      this.el.screenCode.textContent = `${c.code} / ${c.hex}`;

      // Control Deck
      this.el.activeBox.style.backgroundColor = c.hex;
      this.el.activeName.textContent = c.name;
      this.el.activeCode.textContent = `${c.code} / ${c.hex}`;
      this.el.customColor.value = c.hex;

      // Color Stream & Drops
      this.el.pourStream.style.backgroundColor = c.hex;
      this.container.querySelectorAll('.dcm8-drop').forEach(drop => {
        drop.style.backgroundColor = c.hex;
      });

      // Dynamic Tint Bars on CRT Screen
      const formula = calculateFormula(c.hex);
      this.el.barC.style.height = Math.max(2, Math.min(6, Math.round(formula.cyan / 10))) + 'px';
      this.el.barM.style.height = Math.max(2, Math.min(6, Math.round(formula.magenta / 10))) + 'px';
      this.el.barY.style.height = Math.max(2, Math.min(6, Math.round(formula.yellow / 10))) + 'px';
      this.el.barK.style.height = Math.max(2, Math.min(6, Math.round(formula.black / 8))) + 'px';
    }

    // --- FULL 8-BIT TINTING ANIMATION SEQUENCE ---
    startTintingSequence() {
      if (this.isBusy) return;
      this.isBusy = true;
      this.el.btnTint.disabled = true;

      // Step 1: Prep State & Clean Stage
      if (this.el.collectTag) this.el.collectTag.classList.remove('active');
      this.el.sparkles.forEach(s => s.classList.remove('active'));
      this.el.bucketLid.classList.add('open');
      this.el.paintLevel.style.height = '0%';
      this.el.paintLevel.style.backgroundColor = this.selectedColor.hex;
      this.el.labelSwatch.style.backgroundColor = '#cccccc';
      this.el.labelName.textContent = 'EMPTY';

      // Update Screen
      this.el.screenStatus.textContent = 'BUSY';
      this.el.screenBadge.textContent = 'DISPENSING BASE...';

      // Step 2: Empty Bucket Slides In
      this.audio.bucketEnter();
      this.el.bucket.classList.remove('entering');

      // Step 3: Nozzle Extends Down (0.4s)
      setTimeout(() => {
        this.el.nozzle.classList.add('active');
        this.el.nozzleLed.classList.add('dispensing');
        this.el.screenBadge.textContent = 'INJECTING TINT...';

        // Step 4: Machine Rumbles & Paint Stream Dispenses (0.7s)
        setTimeout(() => {
          this.el.kiosk.classList.add('shaking');
          this.el.pourStream.classList.add('pouring');
          this.el.splatter.classList.add('active');
          this.audio.pourStream();

          // Step 5: Liquid Level Rises in Stepped Increments
          let progress = 0;
          const fillTimer = setInterval(() => {
            progress += 25;
            this.el.paintLevel.style.height = progress + '%';
            if (progress >= 100) {
              clearInterval(fillTimer);

              // Step 6: Stream Stops (1.8s)
              setTimeout(() => {
                this.el.pourStream.classList.remove('pouring');
                this.el.splatter.classList.remove('active');
                this.el.nozzleLed.classList.remove('dispensing');
                this.el.nozzleLed.classList.add('ready');
                this.el.nozzle.classList.remove('active');
                this.el.kiosk.classList.remove('shaking');

                // Step 7: Vortex Mixing Vibration
                this.el.screenBadge.textContent = 'SHAKING & MIXING...';
                this.el.bucket.classList.add('mixing-shake');
                this.audio.mixRumble();

                // Step 8: Lid Drops & Snaps On (2.7s)
                setTimeout(() => {
                  this.el.bucket.classList.remove('mixing-shake');
                  this.el.bucketLid.classList.remove('open');
                  this.audio.lidSnap();

                  // Step 9: Can Label Stamps with Custom Color
                  this.el.labelSwatch.style.backgroundColor = this.selectedColor.hex;
                  this.el.labelName.textContent = this.selectedColor.name.substring(0, 10).toUpperCase();

                  // Step 10: Fanfare & Sparkles
                  setTimeout(() => {
                    this.el.screenStatus.textContent = 'DONE';
                    this.el.screenBadge.textContent = 'TINT COMPLETE!';
                    this.el.sparkles.forEach(s => s.classList.add('active'));
                    if (this.el.collectTag) this.el.collectTag.classList.add('active');
                    this.audio.fanfare();

                    this.totalMixed++;
                    if (this.el.mixedCounter) {
                      this.el.mixedCounter.textContent = `TINTED: ${this.totalMixed} CAN${this.totalMixed > 1 ? 'S' : ''}`;
                    }
                    this.isBusy = false;
                    this.el.btnTint.disabled = false;

                    if (typeof this.options.onComplete === 'function') {
                      this.options.onComplete({
                        color: this.selectedColor,
                        product: this.selectedProduct,
                        formula: calculateFormula(this.selectedColor.hex)
                      });
                    }
                  }, 400);

                }, 1000);

              }, 400);
            }
          }, 220);

        }, 400);

      }, 450);
    }

    openRecipeModal() {
      const f = calculateFormula(this.selectedColor.hex);
      this.el.modalShade.textContent = this.selectedColor.name;
      this.el.modalCode.textContent = this.selectedColor.code;
      this.el.modalHex.textContent = `${this.selectedColor.hex}`;
      this.el.modalProduct.textContent = `${this.selectedProduct.name} (${this.selectedProduct.finish})`;
      this.el.modalCyan.textContent = `${f.cyan} ml`;
      this.el.modalMagenta.textContent = `${f.magenta} ml`;
      this.el.modalYellow.textContent = `${f.yellow} ml`;
      this.el.modalBlack.textContent = `${f.black} ml`;

      this.el.modal.classList.add('active');
      this.audio.coin();
    }

    closeRecipeModal() {
      this.el.modal.classList.remove('active');
      this.audio.click();
    }

    resetDispenserView() {
      this.el.collectTag.classList.remove('active');
      this.el.sparkles.forEach(s => s.classList.remove('active'));
      this.el.screenStatus.textContent = 'READY';
      this.el.screenBadge.textContent = 'READY TO TINT';
    }

    showToast(msg) {
      this.el.toast.textContent = msg;
      this.el.toast.classList.add('active');
      setTimeout(() => {
        this.el.toast.classList.remove('active');
      }, 1800);
    }
  }

  return {
    mount: function (container, options) {
      return new MachineGame(container, options);
    },
    PALETTE: DEFAULT_PALETTE,
    PRODUCTS: PRODUCTS
  };
}));
