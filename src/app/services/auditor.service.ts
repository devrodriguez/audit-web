import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuditorService {

  headers = new HttpHeaders().set("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODcwODQxNzcsIm5iZiI6MTU4NzA4MjM3NywiaWF0IjoxNTg3MDgyMzc3fQ.Z4Xc3ogUf5hVKc6bk9QQFDSzxjGQPHbofhUdh57zijI");

  constructor(private http: HttpClient) { }

  public GetAuditors() {
    return this.http.get(`http://localhost:3001/api/auth/auditors`, {
      headers: this.headers
    });
  }
}
