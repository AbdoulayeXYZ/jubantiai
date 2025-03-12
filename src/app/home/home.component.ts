import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importer Router

@Component({
  selector: 'app-home',
  template: `
    <div class="container">
      <h1>Bienvenue dans <span class="highlight">EvalDeep</span>!</h1>
      <p class="subtitle">Votre plateforme pour l'évaluation intelligente et performante.</p>
      <div class="button-container">
        <button class="styled-button" (click)="onSignUpClick()">Inscription</button>
        <button class="styled-button" (click)="onLoginClick()">Connexion</button>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background: linear-gradient(135deg, #1e3c72, #2a5298);
        color: #fff;
        font-family: 'Arial', sans-serif;
        text-align: center;
      }

      h1 {
        font-size: 3rem;
        margin-bottom: 10px;
      }

      .highlight {
        color: #ffd700;
        font-weight: bold;
      }

      .subtitle {
        font-size: 1.5rem;
        margin-bottom: 30px;
        color: #f0f0f0;
      }

      .button-container {
        display: flex;
        gap: 20px;
      }

      .styled-button {
        background: #ff5722;
        color: white;
        border: none;
        padding: 15px 30px;
        border-radius: 25px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      }

      .styled-button:hover {
        background: #e64a19;
        transform: translateY(-3px);
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
      }

      .styled-button:active {
        transform: translateY(0);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      }

      @media (max-width: 768px) {
        h1 {
          font-size: 2.5rem;
        }

        .subtitle {
          font-size: 1.2rem;
        }

        .styled-button {
          padding: 10px 20px;
          font-size: 0.9rem;
        }
      }
    `
  ]
})
export class HomeComponent {
  constructor(private router: Router) {}

  // Fonction de redirection pour l'inscription
  onSignUpClick() {
    this.router.navigate(['/auth/register']); // Rediriger vers la page d'inscription
  }

  // Fonction de redirection pour la connexion
  onLoginClick() {
    this.router.navigate(['/auth/login']); // Rediriger vers la page de connexion
  }
}
