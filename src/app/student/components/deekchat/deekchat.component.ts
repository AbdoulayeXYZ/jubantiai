// deekchat.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-deekchat',
  templateUrl: './deekchat.component.html',
  styleUrls: ['./deekchat.component.css']
})
export class DeekchatComponent implements OnInit {
  topics = ['Mathématiques', 'Physique', 'Histoire', 'Programmation'];
  selectedTopic: string = '';
  messages: { sender: string, text: string }[] = [];
  newMessage: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  selectTopic(topic: string): void {
    this.selectedTopic = topic;
    this.messages = [{ sender: 'bot', text: `Vous avez choisi de discuter de ${topic}. Comment puis-je vous aider ?` }];
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.messages.push({ sender: 'user', text: this.newMessage });
      this.newMessage = '';
      // Simuler une réponse du bot
      setTimeout(() => {
        this.messages.push({ sender: 'bot', text: 'Je vais réfléchir à cela.' });
      }, 1000);
    }
  }
}