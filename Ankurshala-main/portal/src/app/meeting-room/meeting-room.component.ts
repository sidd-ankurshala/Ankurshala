import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WhiteboardComponent } from '../pages/whiteboard/whiteboard.component';
import { ChatService } from '../services/chat.service';
import { VideoCallComponent } from '../pages/video-call/video-call.component';

@Component({
  selector: 'app-meeting-room',
  standalone: true,
  imports: [FormsModule, CommonModule, WhiteboardComponent, VideoCallComponent],
  templateUrl: './meeting-room.component.html',
  styleUrl: './meeting-room.component.css',
})
export class MeetingRoomComponent implements AfterViewInit {
  @ViewChild('drawingCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  messages: { username: string; message: string }[] = [];
  message: string = '';
  username: any;
  usernameSet: boolean = false;

  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private tool: 'draw' | 'erase' | 'text' = 'draw';
  private startX = 0;
  private startY = 0;

  constructor(private chatService: ChatService) {
    const userInfo = localStorage.getItem('user'); // Get user data from localStorage
    const parsedUser = userInfo ? JSON.parse(userInfo) : null; // Parse the data if it exists

    if (parsedUser) {
      this.username = parsedUser.name; // Access the 'name' property
    } else {
      this.username = null; // Handle cases where user info is not available
    }
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.lineWidth = 2; // Set default line width
    this.ctx.strokeStyle = '#000000'; // Default color
  }

  ngOnInit() {
    this.chatService.receiveMessages((data) => {
      console.log('recevied messgae', data);

      this.messages.push(data);
    });
  }

  setUsername() {
    if (this.username.trim()) {
      this.usernameSet = true;
    }
  }

  sendMessage() {
    if (this.message.trim()) {
      console.log('user name11', this.username);
      // console.log('user name', this.username.name);

      this.chatService.sendMessage(this.username, this.message);
      this.message = '';
    }
  }

  ngOnDestroy() {
    this.chatService.disconnect();
  }
  setTool(tool: 'draw' | 'erase' | 'text'): void {
    this.tool = tool;
    if (tool === 'erase') {
      this.ctx.globalCompositeOperation = 'destination-out'; // Enables erasing
      this.ctx.lineWidth = 10; // Eraser width
    } else {
      this.ctx.globalCompositeOperation = 'source-over'; // Resumes normal drawing
      this.ctx.lineWidth = 2; // Default line width for drawing
    }
  }

  onMouseDown(event: MouseEvent): void {
    this.isDrawing = true;
    const { offsetX, offsetY } = event;
    this.startX = offsetX;
    this.startY = offsetY;
    this.ctx.beginPath();
    this.ctx.moveTo(offsetX, offsetY);
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDrawing) return;

    const { offsetX, offsetY } = event;
    if (this.tool === 'draw' || this.tool === 'erase') {
      this.ctx.lineTo(offsetX, offsetY);
      this.ctx.stroke();
    }
  }

  onMouseUp(): void {
    this.isDrawing = false;
    this.ctx.closePath();
  }

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const img = new Image();
    img.onload = () => {
      this.ctx.drawImage(img, 100, 100, 200, 150); // Position and size
    };
    img.src = URL.createObjectURL(file);
  }
}
