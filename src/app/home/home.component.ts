import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-full-container">
      <div class="particles-bg" #particlesContainer></div>
      
      <div class="content" [@fadeIn]="animationState">
        <h1 class="title">WELCOME TO <span class="highlight">Deep<span style="color: #666;">Eval</span></span> !</h1>
        <p class="subtitle">
          <span class="typing-text">{{ displayText }}</span><span class="cursor">|</span>
        </p>
        
        <div class="features">
          <div class="feature-item" *ngFor="let feature of features; let i = index" 
               [@slideIn]="{value: '', params: {delay: i * 200}}"
               (mouseenter)="onFeatureHover(i)" 
               [class.active]="activeFeature === i">
            <div class="feature-icon">{{ feature.icon }}</div>
            <div class="feature-text">{{ feature.text }}</div>
            <div class="feature-description" *ngIf="activeFeature === i">
              {{ feature.description }}
            </div>
          </div>
        </div>
        
        <div class="button-container">
          <button class="styled-button signup" (click)="onSignUpClick()" [@pulse]="pulseAnimation">
            Inscription
            <span class="button-arrow">→</span>
          </button>
          <button class="styled-button login" (click)="onLoginClick()">
            Connexion
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Réinitialisation pour s'assurer que tout le style global ne s'applique plus */
    :host, :host ::ng-deep * {
      box-sizing: border-box;
    }
    
    :host {
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: 0;
      padding: 0;
    }
    
    .home-full-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      background-color: #121212;
      font-family: 'Arial', sans-serif;
      text-align: center;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .particles-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }
    
    .content {
      max-width: 900px;
      width: 90%;
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .title {
      font-size: 4rem;
      margin-bottom: 10px;
      color: #fff;
      position: relative;
      letter-spacing: -1px;
      text-shadow: 0 0 10px rgba(20, 184, 166, 0.3);
      width: 100%;
    }
    
    .highlight {
      color: #14b8a6;
      font-weight: bold;
      position: relative;
    }
    
    .highlight::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 100%;
      height: 3px;
      background-color: #14b8a6;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.5s ease;
    }
    
    .title:hover .highlight::after {
      transform: scaleX(1);
    }
    
    .subtitle {
      font-size: 1.5rem;
      margin-bottom: 40px;
      color: #f0f0f0;
      font-weight: 300;
      width: 100%;
      height: 40px; /* Fixed height for the typing effect */
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .typing-text {
      display: inline-block;
    }
    
    .cursor {
      display: inline-block;
      color: #14b8a6;
      font-weight: bold;
      animation: blink 0.7s infinite;
    }
    
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    
    .features {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 30px;
      margin-bottom: 40px;
      width: 100%;
    }
    
    .feature-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 180px;
      padding: 20px;
      border-radius: 10px;
      background-color: rgba(30, 30, 30, 0.7);
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
    }
    
    .feature-item:hover {
      transform: translateY(-10px);
      background-color: rgba(40, 40, 40, 0.9);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(20, 184, 166, 0.3);
    }
    
    .feature-item.active {
      transform: translateY(-10px) scale(1.05);
      background-color: rgba(40, 40, 40, 0.9);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(20, 184, 166, 0.3);
    }
    
    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 15px;
      color: #14b8a6;
    }
    
    .feature-text {
      font-size: 1.2rem;
      color: #fff;
      font-weight: 500;
    }
    
    .feature-description {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      width: 250px;
      background-color: rgba(30, 30, 30, 0.95);
      color: #fff;
      padding: 15px;
      border-radius: 5px;
      font-size: 0.95rem;
      margin-top: 15px;
      z-index: 10;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      text-align: center;
      border-left: 3px solid #14b8a6;
    }
    
    .button-container {
      display: flex;
      gap: 30px;
      margin-top: 30px;
      width: 100%;
      justify-content: center;
    }
    
    .styled-button {
      background: transparent;
      color: #14b8a6;
      border: 2px solid #14b8a6;
      padding: 12px 25px; /* Reduced padding */
      border-radius: 30px;
      font-size: 1.1rem; /* Reduced font size */
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      z-index: 1;
      min-width: 150px; /* Reduced min-width */
    }
    
    .styled-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 100%;
      background-color: #14b8a6;
      transition: width 0.3s ease;
      z-index: -1;
    }
    
    .styled-button:hover {
      color: white;
      box-shadow: 0 0 15px rgba(20, 184, 166, 0.5);
    }
    
    .styled-button:hover::before {
      width: 100%;
    }
    
    .signup {
      background-color: #14b8a6;
      color: white;
    }
    
    .signup::before {
      background-color: #0d9488;
    }
    
    .button-arrow {
      display: inline-block;
      margin-left: 8px;
      transition: transform 0.3s ease;
    }
    
    .styled-button:hover .button-arrow {
      transform: translateX(5px);
    }
    
    @media (max-width: 768px) {
      .title {
        font-size: 2.8rem;
      }
      
      .subtitle {
        font-size: 1.3rem;
      }
      
      .features {
        gap: 15px;
      }
      
      .feature-item {
        width: 130px;
        padding: 15px;
      }
      
      .styled-button {
        padding: 10px 20px; /* Further reduced for mobile */
        font-size: 1rem;
        min-width: 130px;
      }
    }
    
    @media (max-height: 700px) {
      .title {
        font-size: 3rem;
        margin-bottom: 5px;
      }
      
      .subtitle {
        font-size: 1.2rem;
        margin-bottom: 20px;
      }
      
      .features {
        gap: 15px;
        margin-bottom: 20px;
      }
      
      .feature-item {
        padding: 12px;
      }
    }
  `],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void => *', animate('1000ms ease-out'))
    ]),
    trigger('slideIn', [
      state('void', style({ transform: 'translateY(50px)', opacity: 0 })),
      transition('void => *', animate('500ms {{delay}}ms ease-out'), {
        params: { delay: 0 }
      })
    ]),
    trigger('pulse', [
      state('pulse', style({ transform: 'scale(1.05)' })),
      state('normal', style({ transform: 'scale(1)' })),
      transition('normal <=> pulse', animate('300ms ease-in-out'))
    ])
  ]
})
export class HomeComponent implements OnInit {
  features = [
    { 
      icon: '🚀', 
      text: 'High Performance',
      description: 'Get ultra-fast evaluation results with our optimized algorithms and infrastructure.'
    },
    { 
      icon: '🧠', 
      text: 'AI Powered',
      description: 'Leverage advanced AI models based on deepseek technology for intelligent analysis.'
    },
    { 
      icon: '📊', 
      text: 'Deep Analytics',
      description: 'Gain insights through comprehensive data analysis and visualization tools.'
    },
    { 
      icon: '🔒', 
      text: 'Secure Platform',
      description: 'Your data is protected with enterprise-grade security and encryption.'
    }
  ];
  
  animationState = 'in';
  pulseAnimation = 'normal';
  activeFeature: number | null = null;
  
  // Text typing effect variables
  fullText = 'Our platform for intelligent and high-performance evaluation using deepseek.';
  displayText = '';
  typingForward = true;
  typingIndex = 0;
  typingSpeed = 100; // Speed in milliseconds
  deletingSpeed = 30; // Speed for deleting text
  pauseBeforeDelete = 2000; // Pause time before deleting text
  pauseBeforeType = 1000; // Pause time before typing again
  
  constructor(
    private router: Router, 
    private el: ElementRef,
    private renderer: Renderer2
  ) {}
  
  ngOnInit() {
    // Appliquer les styles globaux pour s'assurer que tout l'écran est couvert
    this.applyGlobalStyles();
    
    // Démarrer l'animation pulsante toutes les 3 secondes
    setInterval(() => {
      this.pulseAnimation = this.pulseAnimation === 'normal' ? 'pulse' : 'normal';
    }, 3000);
    
    // Initialiser l'animation des particules
    this.initParticles();
    
    // Ajuster les particules lors du redimensionnement de la fenêtre
    window.addEventListener('resize', this.reinitParticles.bind(this));
    
    // Start typing animation
    this.startTypingAnimation();
  }
  
  applyGlobalStyles() {
    // Créer un style global pour s'assurer que tout l'écran est couvert
    const styleElement = this.renderer.createElement('style');
    const styleContent = `
      html, body { 
        margin: 0; 
        padding: 0; 
        width: 100%; 
        height: 100%; 
        overflow: hidden;
        background-color: #121212;
      }
      
      app-root {
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
    `;
    
    this.renderer.appendChild(styleElement, this.renderer.createText(styleContent));
    this.renderer.appendChild(document.head, styleElement);
  }
  
  startTypingAnimation() {
    const animateTyping = () => {
      if (this.typingForward) {
        // Typing forward
        if (this.typingIndex < this.fullText.length) {
          this.displayText = this.fullText.substring(0, this.typingIndex + 1);
          this.typingIndex++;
          setTimeout(animateTyping, this.typingSpeed);
        } else {
          // Reached the end, pause before deleting
          this.typingForward = false;
          setTimeout(animateTyping, this.pauseBeforeDelete);
        }
      } else {
        // Deleting text
        if (this.typingIndex > 0) {
          this.typingIndex--;
          this.displayText = this.fullText.substring(0, this.typingIndex);
          setTimeout(animateTyping, this.deletingSpeed);
        } else {
          // Finished deleting, pause before typing again
          this.typingForward = true;
          setTimeout(animateTyping, this.pauseBeforeType);
        }
      }
    };
    
    // Start the animation
    animateTyping();
  }
  
  onFeatureHover(index: number) {
    this.activeFeature = index;
  }

  // Fonction de redirection pour l'inscription
  onSignUpClick() {
    this.router.navigate(['/auth/register']);
  }

  // Fonction de redirection pour la connexion
  onLoginClick() {
    this.router.navigate(['/auth/login']);
  }
  
  initParticles() {
    const container = this.el.nativeElement.querySelector('.particles-bg');
    if (!container) return;
    
    // Vider le container au cas où
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    // Calculer le nombre de particules en fonction de la taille de l'écran
    const screenArea = window.innerWidth * window.innerHeight;
    const particleCount = Math.max(50, Math.min(120, Math.floor(screenArea / 10000)));
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = Math.random() * 4 + 1 + 'px';
      particle.style.height = particle.style.width;
      particle.style.backgroundColor = 'rgba(20, 184, 166, ' + (Math.random() * 0.5 + 0.1) + ')';
      particle.style.borderRadius = '50%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.transform = 'translate(-50%, -50%)';
      particle.style.animation = `float-${i} ${Math.random() * 15 + 10}s linear infinite`;
      particle.style.zIndex = '0';
      
      // Ajouter une animation de flottement unique
      const keyframes = `
        @keyframes float-${i} {
          0% {
            transform: translate(-50%, -50%);
          }
          25% {
            transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) scale(${Math.random() * 0.5 + 0.7});
          }
          50% {
            transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) scale(${Math.random() * 0.5 + 1});
          }
          75% {
            transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) scale(${Math.random() * 0.5 + 0.7});
          }
          100% {
            transform: translate(-50%, -50%);
          }
        }
      `;
      
      const style = document.createElement('style');
      style.innerHTML = keyframes;
      document.head.appendChild(style);
      
      container.appendChild(particle);
    }
  }
  
  reinitParticles() {
    this.initParticles();
  }
  
  ngOnDestroy() {
    // Supprimer l'écouteur d'événement
    window.removeEventListener('resize', this.reinitParticles.bind(this));
  }
}