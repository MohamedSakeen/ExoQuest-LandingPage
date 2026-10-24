/**
 * Curly404 - Interactive Curly Bracket 404 Component
 * Vanilla JS logic, zero external dependencies.
 * Converted to TypeScript module for use in Next.js apps.
 */

interface Curly404Options {
  target?: HTMLElement | string | null;
  title?: string;
  headline?: string;
  homeUrl?: string;
  homeText?: string;
  docsUrl?: string;
  docsText?: string;
  onAction?: (payload: { type: string; [key: string]: unknown }) => void;
}

export class Curly404 {
  private options: Required<Curly404Options>;
  private container: HTMLElement | null = null;
  private isEmbedded: boolean;
  private _eventListeners: Array<{ target: EventTarget; type: string; handler: EventListenerOrEventListenerObject }> = [];
  private _intervals: ReturnType<typeof setInterval>[] = [];
  private _timeouts: ReturnType<typeof setTimeout>[] = [];
  private isAngry = false;
  private _clickTimes: number[] = [];
  private _angryTimer: ReturnType<typeof setTimeout> | null = null;
  private _rumbleTimer: ReturnType<typeof setTimeout> | null = null;

  private faceContainer: HTMLElement | null = null;
  private characterWrapper: HTMLElement | null = null;
  private pupilLeft: HTMLElement | null = null;
  private pupilRight: HTMLElement | null = null;
  private mouth: HTMLElement | null = null;

  constructor(options: Curly404Options = {}) {
    this.options = Object.assign(
      {
        target: null,
        title: '404',
        headline: 'Looks like you reached an unhandled exception.',
        homeUrl: '/',
        homeText: 'Go Back',
        docsUrl: '#',
        docsText: '',
        onAction: null,
      },
      options
    ) as Required<Curly404Options>;

    this.isEmbedded = Boolean(this.options.target);
    this._init();
  }

  private _init() {
    if (this.isEmbedded) {
      if (typeof this.options.target === 'string') {
        this.container = document.querySelector(this.options.target);
      } else if (this.options.target instanceof HTMLElement) {
        this.container = this.options.target;
      }
    }

    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'curly-404-root-wrapper';
      document.body.appendChild(this.container);
    }

    this.container.classList.add('curly-404-host');
    this.container.innerHTML = this._getTemplate();

    this.faceContainer = this.container.querySelector('.c404-face-container');
    this.characterWrapper = this.container.querySelector('.c404-character-wrapper');
    this.pupilLeft = this.container.querySelector('#c404-pupil-left');
    this.pupilRight = this.container.querySelector('#c404-pupil-right');
    this.mouth = this.container.querySelector('#c404-mouth');

    this._setupEyeTracking();
    this._setupBlinking();
    this._setupMouthOrganicMovement();
    this._setupFaceClickShakeAndAnger();
  }

  private _getTemplate(): string {
    const { title, headline, homeText } = this.options;

    return `
      <div class="c404-layout">
        <div class="c404-bg-grid" aria-hidden="true"></div>
        <div class="c404-bg-vignette" aria-hidden="true"></div>
        <div class="c404-ambient-glow" aria-hidden="true"></div>

        <div class="c404-content">
          <h1 class="c404-hero-number" data-text="${title}">
            4<span class="c404-num-accent">0</span>4
          </h1>

          <div class="c404-text-block">
            <h2 class="c404-headline">${headline}</h2>
          </div>

          <div
            class="c404-face-container"
            role="button"
            tabindex="0"
            aria-label="Interactive bracket face mascot: Click to interact"
            title="Click repeatedly to poke parser!">

            <div class="c404-rage-aura" aria-hidden="true"></div>

            <div class="c404-character-wrapper">
              <div class="c404-steam-element c404-steam-right" id="c404-steam-right" aria-hidden="true">
                <span class="c404-steam-symbol">💢</span>
              </div>
              <div class="c404-steam-element c404-steam-left" id="c404-steam-left" aria-hidden="true">
                <span class="c404-steam-symbol">💢</span>
              </div>

              <div class="c404-eyes-row">
                <div class="c404-eye-unit">
                  <span class="c404-bracket-glyph">{</span>
                  <div class="c404-eye-socket" id="c404-socket-left">
                    <div class="c404-eyelid c404-eyelid-left"></div>
                    <div class="c404-pupil" id="c404-pupil-left"></div>
                  </div>
                  <span class="c404-bracket-glyph">}</span>
                </div>

                <div class="c404-eye-unit">
                  <span class="c404-bracket-glyph">{</span>
                  <div class="c404-eye-socket" id="c404-socket-right">
                    <div class="c404-eyelid c404-eyelid-right"></div>
                    <div class="c404-pupil" id="c404-pupil-right"></div>
                  </div>
                  <span class="c404-bracket-glyph">}</span>
                </div>
              </div>

              <div class="c404-mouth-wrap">
                <div class="c404-mouth-bracket" id="c404-mouth">
                  <svg
                    class="c404-mouth-svg"
                    viewBox="0 0 160 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true">
                    <path
                      class="c404-beak-path"
                      stroke="currentColor"
                      stroke-width="12"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M 14 46 C 14 34, 28 28, 50 28 C 68 28, 73 18, 80 8 C 87 18, 92 28, 110 28 C 132 28, 146 34, 146 46">
                      <animate
                        attributeName="d"
                        dur="3.6s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keyTimes="0;0.25;0.5;0.75;1"
                        keySplines="0.45 0.05 0.55 0.95;0.45 0.05 0.55 0.95;0.45 0.05 0.55 0.95;0.45 0.05 0.55 0.95"
                        values="
                          M 14 46 C 14 34, 28 28, 50 28 C 68 28, 73 18, 80 8 C 87 18, 92 28, 110 28 C 132 28, 146 34, 146 46;
                          M 14 46 C 14 34, 28 28, 50 28 C 68 28, 61 18, 68 8 C 75 18, 92 28, 110 28 C 132 28, 146 34, 146 46;
                          M 14 46 C 14 34, 28 28, 50 28 C 68 28, 73 18, 80 8 C 87 18, 92 28, 110 28 C 132 28, 146 34, 146 46;
                          M 14 46 C 14 34, 28 28, 50 28 C 68 28, 85 18, 92 8 C 99 18, 92 28, 110 28 C 132 28, 146 34, 146 46;
                          M 14 46 C 14 34, 28 28, 50 28 C 68 28, 73 18, 80 8 C 87 18, 92 28, 110 28 C 132 28, 146 34, 146 46
                        "
                      />
                    </path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div class="c404-actions-group">
            <button class="c404-btn c404-btn-primary" data-action="home" type="button">
              <svg class="c404-btn-icon" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span>${homeText}</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private _setupEyeTracking() {
    const MAX_OFFSET_X = 11;
    const MAX_OFFSET_Y = 15;

    const onMouseMove = (e: Event) => {
      const me = e as MouseEvent;
      if (!this.pupilLeft || !this.pupilRight) return;

      [this.pupilLeft, this.pupilRight].forEach((pupil) => {
        if (!pupil || !pupil.parentElement) return;
        const rect = pupil.parentElement.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        const deltaX = me.clientX - eyeCenterX;
        const deltaY = me.clientY - eyeCenterY;

        const distance = Math.hypot(deltaX, deltaY);
        const angle = Math.atan2(deltaY, deltaX);
        const clampedDist = Math.min(distance / 24, 1);

        const offsetX = Math.cos(angle) * (MAX_OFFSET_X * clampedDist);
        const offsetY = Math.sin(angle) * (MAX_OFFSET_Y * clampedDist);

        pupil.style.transform = `translate(${offsetX.toFixed(2)}px, ${offsetY.toFixed(2)}px)`;
      });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    this._eventListeners.push({ target: window, type: 'mousemove', handler: onMouseMove as EventListener });
  }

  private _setupBlinking() {
    const sockets = this.container!.querySelectorAll('.c404-eye-socket');

    const triggerBlink = () => {
      if (!this.isAngry) {
        sockets.forEach((s) => s.classList.add('c404-blink'));
        const t1 = setTimeout(() => {
          sockets.forEach((s) => s.classList.remove('c404-blink'));
        }, 150);
        this._timeouts.push(t1);
      }
      const nextDelay = Math.random() * 3500 + 2500;
      const t2 = setTimeout(triggerBlink, nextDelay);
      this._timeouts.push(t2);
    };

    const init = setTimeout(triggerBlink, 1800);
    this._timeouts.push(init);
  }

  private _setupMouthOrganicMovement() {
    // Beak-only sad sway is handled by SVG SMIL <animate> in the template.
    // No JS transform needed here.
  }

  private _setupFaceClickShakeAndAnger() {
    if (!this.faceContainer || !this.characterWrapper) return;

    const triggerAngryState = () => {
      this.isAngry = true;
      this.faceContainer!.classList.add('is-angry');
      this.characterWrapper!.classList.remove('c404-shake-active');
      this.characterWrapper!.classList.add('c404-angry-rumble');

      if (this._rumbleTimer) clearTimeout(this._rumbleTimer);
      this._rumbleTimer = setTimeout(() => {
        this.characterWrapper?.classList.remove('c404-angry-rumble');
      }, 1200);
      this._timeouts.push(this._rumbleTimer);

      if (this.options.onAction) {
        this.options.onAction({ type: 'angry-state', angry: true });
      }

      if (this._angryTimer) clearTimeout(this._angryTimer);
      this._angryTimer = setTimeout(() => {
        this._coolDownFromAngryState();
      }, 4200);
      this._timeouts.push(this._angryTimer);
    };

    const onFaceClick = () => {
      const now = Date.now();
      this._clickTimes = this._clickTimes.filter((t) => now - t <= 2500);
      this._clickTimes.push(now);

      if (this._clickTimes.length >= 5) {
        this._clickTimes = [];
        triggerAngryState();
        return;
      }

      if (!this.isAngry) {
        this.characterWrapper!.classList.remove('c404-shake-active');
        void (this.characterWrapper as HTMLElement).offsetWidth;
        this.characterWrapper!.classList.add('c404-shake-active');

        if (this.mouth) {
          this.mouth.style.transform = 'scale(1.28, 1.25) translateY(4px) rotate(4deg)';
        }

        if (this.options.onAction) {
          this.options.onAction({ type: 'face-click', clickCount: this._clickTimes.length });
        }

        const t = setTimeout(() => {
          this.characterWrapper?.classList.remove('c404-shake-active');
          if (this.mouth && !this.isAngry) {
            this.mouth.style.transform = 'scale(1) rotate(0deg)';
          }
        }, 420);
        this._timeouts.push(t);
      }
    };

    // Wire primary button to onAction('home')
    const homeBtn = this.container!.querySelector('[data-action="home"]');
    if (homeBtn) {
      const onHome = () => {
        if (this.options.onAction) this.options.onAction({ type: 'home' });
      };
      homeBtn.addEventListener('click', onHome);
      this._eventListeners.push({ target: homeBtn, type: 'click', handler: onHome });
    }

    this.faceContainer.addEventListener('click', onFaceClick);
    this._eventListeners.push({ target: this.faceContainer, type: 'click', handler: onFaceClick });

    const onFaceKey = (e: Event) => {
      const ke = e as KeyboardEvent;
      if (ke.key === 'Enter' || ke.key === ' ') {
        e.preventDefault();
        onFaceClick();
      }
    };
    this.faceContainer.addEventListener('keydown', onFaceKey);
    this._eventListeners.push({ target: this.faceContainer, type: 'keydown', handler: onFaceKey as EventListener });
  }

  private _coolDownFromAngryState() {
    this.isAngry = false;
    this.faceContainer?.classList.remove('is-angry');
    this.characterWrapper?.classList.remove('c404-angry-rumble');

    if (this.mouth) {
      this.mouth.style.transform = ''; // clear inline style; SMIL beak animation continues
    }

    if (this.options.onAction) {
      this.options.onAction({ type: 'angry-state', angry: false });
    }

    const sockets = this.container?.querySelectorAll('.c404-eye-socket');
    sockets?.forEach((s) => s.classList.add('c404-blink'));
    const t = setTimeout(() => {
      sockets?.forEach((s) => s.classList.remove('c404-blink'));
    }, 220);
    this._timeouts.push(t);
  }

  destroy() {
    this._eventListeners.forEach(({ target, type, handler }) => {
      target.removeEventListener(type, handler);
    });
    this._eventListeners = [];
    this._timeouts.forEach(clearTimeout);
    this._timeouts = [];
    this._intervals.forEach(clearInterval);
    this._intervals = [];

    if (this.container) {
      this.container.innerHTML = '';
      if (!this.isEmbedded && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
    }
  }
}
