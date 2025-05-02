import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

import {
  connect,
  Room,
  LocalTrack,
  LocalVideoTrack,
  LocalAudioTrack,
  Track,
} from 'twilio-video';
import { TwilioService } from '../../services/twilio.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-video-call',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './video-call.component.html',
  styleUrl: './video-call.component.css',
})
export class VideoCallComponent {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLDivElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLDivElement>;

  identity: string = '';
  roomName: string = '';
  room: Room | null = null;

  constructor(private twilioService: TwilioService) {}

  joinRoom() {
    if (!this.identity || !this.roomName) {
      alert('Please enter your name and room name.');
      return;
    }

    // Get token from backend
    this.twilioService.getToken(this.identity, this.roomName).subscribe({
      next: async (response) => {
        const token = response.token;

        // Connect to Twilio Video Room
        this.room = await connect(token, {
          name: this.roomName,
          audio: true,
          video: true,
        });

        // Attach local video tracks
        this.room.localParticipant.videoTracks.forEach((publication) => {
          if (publication.track) {
            this.attachTrack(publication.track, this.localVideo.nativeElement);
          }
        });

        // Listen for remote participants joining
        this.room.on('participantConnected', (participant) => {
          participant.tracks.forEach((publication) => {
            if (publication.isSubscribed && publication.track) {
              this.attachTrack(
                publication.track,
                this.remoteVideo.nativeElement
              );
            }
          });

          participant.on('trackSubscribed', (track) => {
            this.attachTrack(track, this.remoteVideo.nativeElement);
          });
        });

        // Handle participant disconnect
        this.room.on('participantDisconnected', (participant) => {
          console.log(`Participant ${participant.identity} disconnected`);
        });
      },
      error: (err) => console.error('Error getting token:', err),
    });
  }

  leaveRoom() {
    if (this.room) {
      this.room.disconnect();
      this.room = null;
      console.log('Disconnected from the room');
    }
  }

  attachTrack(track: Track, container: HTMLElement) {
    if (track instanceof LocalVideoTrack || track instanceof LocalAudioTrack) {
      const element = track.attach();
      container.appendChild(element);
    } else {
      console.warn('Track is not attachable:', track);
    }
  }
}
