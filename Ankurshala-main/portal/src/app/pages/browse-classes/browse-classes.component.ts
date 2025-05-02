
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import {  NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';

import { ZoomMtg } from '@zoom/meetingsdk';


ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
@Component({
  selector: 'app-browse-classes',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './browse-classes.component.html',
  styleUrl: './browse-classes.component.css',
})
export class BrowseClassesComponent {
  @Input() topicId: string | null = null;
  chapterId: string = '';
  subjectId: string = '';
  classId: string = '';
  p: number = 1;
  limit: number = 10;
  total: number = 0;
  data: any[] = [];
  topic: any = null;
  subject: any = {};
  class: any = {};
  subjectList: any[] = [];
  chapterList: any[] = [];
  topicList: any[] = [];
  topicName: string = '';
  studentId: string | null = null; // Optional student ID if available
  chapterName: string = '';
  searchForm = {
    classes: '',
    subject: '',
    start_time: '',
    duration: '',
    scheduleDate: new Date(),
  };
  // minDate today
  minDate: any;
  topicprice: any;


  authEndpoint = 'http://localhost:4042/signature'
  sdkKey = 'F5M1K_UQQSPODjGAgatZQ'
  meetingNumber = '4274126291'
  passWord = '4Ln8pm'
  role = 0
  userName = 'Ayushi'
  userEmail = 'ayushiyadav.bce@gmail.com'
  registrantToken = ''
  zakToken = ''
  leaveUrl = 'http://localhost:4042/dashboard'


  client = ZoomMtgEmbedded.createClient();


  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private router: Router,
    private ngZone: NgZone,
    private httpClient: HttpClient
  ) {
    this.searchForm.scheduleDate = new Date();
    this.minDate = this.searchForm.scheduleDate.toISOString().split('T')[0];
    this.searchForm.scheduleDate = this.minDate;


  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.topicId = params.get('topicId') ?? '';
      console.log(
        'Navigating to browse class page with topicId:',
        this.topicId
      );

      this.getTopic();
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      this.studentId = currentUser.id;
      this.getSchedules();
      ZoomMtg.setZoomJSLib('http://source.zoom.us/3.12.0/lib', '/av');
      this.loadZoomStyles()


        const zoomElement = document.getElementById('zmmtg-root');
        if (zoomElement) {
          zoomElement.style.position = 'static';
          zoomElement.style.backgroundColor = 'transparent';
        }

      // this.getClass();
      // this.getSubject();
      // this.getChapter();
    });
  }

  getSchedules() {
    this.apiService.get(`schedule/student/${this.studentId}`).subscribe({
      next: (res: any) => {
        this.data = res.data;
        this.total = res.total;
        console.log('Schedules fetched:', this.data);
      },
      error: (err: any) => {
        console.error('Error fetching schedules:', err);
      },
    });
  }

  getTopic() {
    console.log('Current topicId:', this.topicId); // Check if topicId is correctly set
    if (this.topicId) {
      this.apiService.get(`topic/${this.topicId}`).subscribe({
        next: (res: any) => {
          console.log('API response for specific topic:', res);
          this.topic = res;
          this.chapterId = this.topic.chapter;
          this.topicName = this.topic.name; // Set topicName
          this.topicprice = this.topic.price;
          this.getChapter();
          console.log('Specific topic fetched:', this.topic);
        },
        error: (err: any) => {
          console.error('Error fetching specific topic:', err);
        },
      });
    } else {
      // Fetch all topics if no topicId is provided
      this.apiService
        .get('topic', {
          params: { page: 1, limit: 1000 },
        })
        .subscribe({
          next: (res: any) => {
            this.topic = res.data;
            console.log('All topics fetched:', this.topic);
          },
          error: (err: any) => {
            console.error('Error fetching topics:', err);
          },
        });
    }
  }

  getChapter() {
    this.apiService.get(`chapter/${this.chapterId}`).subscribe({
      next: (res: any) => {
        // console.log(res);
        this.chapterId = res._id;
        this.chapterName = res.name; // Set chapterName
        this.subjectId = res.subject._id;
        // this.getSubjectByChapter(this.chapterId);
        console.log('Chapter fetched by topic:', res);
        this.getSubject();
      },
      error: (err: any) => {
        console.error('Error fetching chapter by topic:', err);
      },
    });
  }

  getClass() {
    this.apiService.get(`class/${this.classId}`).subscribe((data: any) => {
      this.class = data;
      this.classId = data._id;
    });
  }

  getSubject() {
    this.apiService.get(`subject/${this.subjectId}`).subscribe({
      next: (res: any) => {
        this.subject = res;
        this.classId = this.subject.class;
        this.getClass();
        console.log('Subjects fetched:', res);
      },
      error: (err: any) => {
        console.error('Error fetching subjects:', err);
      },
    });
  }

  search() {
    const params = {
      classId: this.classId,
      subjectId: this.subjectId,
      chapterId: this.chapterId,
      topicId: this.topicId,
      startTime: this.searchForm.start_time,
      duration: this.searchForm.duration,
      studentId: this.studentId,
      scheduleDate: this.searchForm.scheduleDate,
      price: this.topicprice,
    };
    // console.log(this.chapterId);
    // console.log(params);
    // return;

    this.apiService.post('schedule', params).subscribe({
      next: (response) => {
        console.log('Schedule posted successfully:', response);
        this.getSchedules();
        this.sharedService.addToast({
          header: 'Success',
          body: 'Schedule posted successfully',
          classname: 'bg-success text-light',
          delay: 5000,
        });
      },
      error: (error) => {
        console.error('Failed to post schedule:', error);
      },
    });
  }

  loadZoomStyles() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'node_modules/@zoomus/websdk/dist/css/bootstrap.css';
    document.head.appendChild(link);
  }

  joinMeetingRoom(scheduledClass: any): void  {
    this.httpClient.post(this.authEndpoint, {
	    meetingNumber: scheduledClass.meeting_id,
	    role: this.role
    }).toPromise().then((data: any) => {
      console.log("=================>",data)
      if(data.signature) {

        console.log(data.signature)
        this.startMeeting(data.signature, scheduledClass);
      } else {
        console.log(data)
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  startMeeting(signature: any , scheduledClass: any): void {

    let meetingSDKElement = document.getElementById('meetingSDKElement')!;
 console.log("@##########################",signature)
    this.ngZone.runOutsideAngular(() => {
      ZoomMtg.init({
        leaveUrl: this.leaveUrl,
        patchJsMedia: true,
        leaveOnPageUnload: true,
        success: (success: any) => {
          console.log(success)
          ZoomMtg.join({
            signature: signature,
            sdkKey: this.sdkKey,
            meetingNumber:scheduledClass.meeting_id,
            passWord: scheduledClass.meeting_passcode ,
            userName: this.userName,
            userEmail: this.userEmail,
            tk: this.registrantToken,
            zak: this.zakToken,
            success: (success: any) => {
              console.log(success)
            },
            error: (error: any) => {
              console.log(error)
            }
          })
        },
        error: (error: any) => {
          console.log(error)
        }
      })
    })
  }




}






