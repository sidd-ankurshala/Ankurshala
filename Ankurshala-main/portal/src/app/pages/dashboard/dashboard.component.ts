import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MapComponent } from '../../components/map/map.component';
import {  NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';
import { HttpClient } from '@angular/common/http';

import { ZoomMtg } from '@zoom/meetingsdk';


ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  currentDate = new Date();
  currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  scheduleRequests: any[] = [];
  page: number = 1;
  limit: number = 10;
  total: number = 0;
  data: any[] = [];
  join_url: string = '';



    authEndpoint = 'http://localhost:4042/signature'
    sdkKey = 'F5M1K_UQQSPODjGAgatZQ'
    meetingNumber = '4274126291'
    passWord = '4Ln8pm'
    role = 1
    userName = 'Teacher'
    userEmail = 'Teacher@gmail.com'
    registrantToken = ''
    zakToken = ''
    leaveUrl = 'http://localhost:4042/dashboard'


    client = ZoomMtgEmbedded.createClient();

  constructor(private apiService: ApiService, private router: Router ,   private ngZone: NgZone,
    private httpClient: HttpClient) {
    if (this.currentUser.role_name === 'Teacher') {
      this.getScheduleRequestsByTeacherId();
    }
  }

  ngOnInit(): void {

      ZoomMtg.setZoomJSLib('http://source.zoom.us/3.12.0/lib', '/av');
      this.loadZoomStyles()


        const zoomElement = document.getElementById('zmmtg-root');
        if (zoomElement) {
          console.log("++++++++++++++++++++++++++++++++")
          zoomElement.style.position = 'static';
          zoomElement.style.backgroundColor = 'transparent';
        }
    }





   loadZoomStyles() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'node_modules/@zoomus/websdk/dist/css/bootstrap.css';
    document.head.appendChild(link);
  }


  getScheduleRequestsByTeacherId(): void {
    this.apiService
      .get(`schedule/teacher/${this.currentUser.id}`, {
        params: {
          page: this.page,
          limit: this.limit,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.scheduleRequests = res.data;
          this.total = res.total;
          console.log('Schedule requests ========>:', this.scheduleRequests);

          console.log('Schedule requests fetched:', this.scheduleRequests);
        },
        error: (err: any) => {
          console.error('Error fetching schedule requests:', err);
        },
      });
  }

  acceptRequest(requestId: string): void {
    this.apiService
      .put(`schedule/response/accept/${requestId}/${this.currentUser.id}`, {})
      .subscribe({
        next: (res: any) => {
          console.log('Request accepted:', res);
          this.getScheduleRequestsByTeacherId();
        },
        error: (err: any) => {
          console.error('Error accepting request:', err);
        },
      });
  }

  rejectRequest(requestId: string, data: any, price: number): void {
    this.apiService
      .put(
        `schedule/response/reject/${requestId}/${this.currentUser.id}/${price}`,
        { topicData: data }
      )
      .subscribe({
        next: (res: any) => {
          console.log('Request rejected:', res);
          this.getScheduleRequestsByTeacherId();
        },
        error: (err: any) => {
          console.error('Error rejecting request:', err);
        },
      });
  }

  // joinMeetingRoom(meetingId: string): void {
  //   this.router.navigate(['/meeting-room', meetingId]);
  // }
  // joinMeetingRoom(scheduledClass: any): void {
  //   if (scheduledClass.start_url) {
  //     window.open(scheduledClass.start_url, '');
  //   } else {
  //     alert('Meeting URL is not available yet.');
  //   }
  // }

    joinMeetingRoom(scheduledClass: any): void  {
      this.httpClient.post(this.authEndpoint, {
        meetingNumber: scheduledClass.meeting_id,
        role: this.role
      }).toPromise().then((data: any) => {
        console.log("=================>",data)
        if(data.signature) {

          console.log(data.signature)
          this.startMeeting(data.signature, scheduledClass,this.role) ;
        } else {
          console.log(data)
        }
      }).catch((error) => {
        console.log(error)
      })
    }


   async startMeeting(signature: string, scheduledClass: any, role: number) {


      ZoomMtg.init({
         leaveUrl: this.leaveUrl,
         success: () => {
            ZoomMtg.join({
               signature: signature,
               sdkKey: this.sdkKey,
               meetingNumber: scheduledClass.meeting_id,
               passWord: scheduledClass.meeting_passcode,
               userName: this.userName,
               userEmail: this.userEmail,
               zak: this.zakToken, // Only needed for host
               success: (success: any) => {
                  console.log(success);
               },
               error: (error: any) => {
                  console.log(error);
               }
            });
         },
         error: (error: any) => {
            console.log(error);
         }
      });
   }


  //   startMeeting(signature: any , scheduledClass: any): void {

  //     let meetingSDKElement = document.getElementById('meetingSDKElement')!;
  //  console.log("@##########################",signature)
  //     this.ngZone.runOutsideAngular(() => {
  //       ZoomMtg.init({
  //         leaveUrl: this.leaveUrl,
  //         patchJsMedia: true,
  //         leaveOnPageUnload: true,
  //         success: (success: any) => {
  //           console.log(success)
  //           ZoomMtg.join({
  //             signature: signature,
  //             sdkKey: this.sdkKey,
  //             meetingNumber:scheduledClass.meeting_id,
  //             passWord: scheduledClass.meeting_passcode ,
  //             userName: this.userName,
  //             userEmail: this.userEmail,
  //             tk: this.registrantToken,
  //             zak: this.zakToken,
  //             success: (success: any) => {
  //               console.log(success)
  //             },
  //             error: (error: any) => {
  //               console.log(error)
  //             }
  //           })
  //         },
  //         error: (error: any) => {
  //           console.log(error)
  //         }
  //       })
  //     })
  //   }


}
