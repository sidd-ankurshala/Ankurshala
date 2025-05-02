import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TwilioService {
  private baseUrl = 'http://localhost:4043';

  constructor(private http: HttpClient) {}

  getToken(identity: string, roomName: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/get-token`, { identity, roomName });
  }
}
