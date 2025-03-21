import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { ChatMessage } from '../../../models/chat.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-deepchat',
  standalone: false,
  templateUrl: './deepchat.component.html',
  styleUrl: './deepchat.component.css'
})
export class DeepchatComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  messages: ChatMessage[] = [];
  newMessage: string = '';
  isTyping: boolean = false;
  userId: number = 0;

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userId = currentUser.id;
      this.loadChatHistory();
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }

  async loadChatHistory() {
    try {
      const history = await this.chatService.getChatHistory().toPromise();
      if (history && history.length > 0) {
        this.messages = history[0].messages;
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }

  async sendMessage() {
    if (!this.newMessage.trim() || this.isTyping) return;

    const userMessage: ChatMessage = {
      userId: this.userId,
      content: this.newMessage,
      role: 'user',
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    this.isTyping = true;
    const messageToSend = this.newMessage;
    this.newMessage = '';

    try {
      const response = await this.chatService.sendMessage(messageToSend).toPromise();
      if (response) {
        this.messages.push(response);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      this.isTyping = false;
    }
  }
}
