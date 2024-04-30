import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Register } from '../models/register.model';
import {  Observable,catchError, finalize, tap, throwError} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MyServiceService {


  baseAPi : string = "https://localhost:7049";
  baseAPI2: string = "https://localhost:7049/api/Hospital";

  constructor(private http: HttpClient) { }

  sendTimeData(id: number, doctorId: string, day: string, timeRange: string): Observable<any> {
    console.log(id, doctorId, day, timeRange);
    return this.http.post<any>(`${this.baseAPi}/api/Hospital/timedata`, { id, doctorId, day, timeRange })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error sending time data:', error);
          return throwError('An error occurred while sending time data.');
        })
      );
  }
  
  TakeTableDataFromApiService():Observable<any>{
    return this.http.get<any>(this.baseAPi + '/api/Hospital/timedata');
  }


  deletePerson(personalId: string) {
    return this.http.delete<any>(this.baseAPi + '/api/Hospital/' + personalId, { responseType: 'text' as 'json' })
      .pipe(
        catchError(error => {
          let errorMessage = 'An error occurred while deleting the account.';
          if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = error.error.message;
          } else {
            // Server-side error
            errorMessage = error.error || 'Unknown error occurred.';
          }
          console.error(errorMessage);
          return throwError(errorMessage);
        })
      );
  }
  
  updateUser(user: any): Observable<Register> {
    return this.http.put<any>(`${this.baseAPi}/api/hospital/${user.id}`, user);
  }
  
  registerUser(newRegister : Register): Observable<Register> {
    newRegister.id ="00000000-0000-0000-0000-000000000000";
    
     return this.http.post<Register>(this.baseAPi + '/api/Hospital', newRegister)
   }
   login(email: string, password:string, verificationCode:string): Observable<any> {
    console.log(email,password,verificationCode + 'ssssss' )
    return this.http.post<any>(`${this.baseAPi}/api/Hospital/login`, { email,password,verificationCode, })
    
    
  }


  getUsers(): Observable<Register[]> {
    return this.http.get<Register[]>(this.baseAPi + '/api/Hospital');
  }

  passwordChange(email:string, verificationCode:string, password:string): Observable<any> {
    return this.http.post<any>(`${this.baseAPi}/api/Hospital/email/passwordRecovery`, {email,verificationCode,password})
}
  sendVerificationCode(emailData:any) {
    return this.http.post<any>(`${this.baseAPi}/api/Hospital/email/send`, emailData);
  }


  

  getDoctors(): Observable<any> {
    return this.http.get<any>(`${this.baseAPi}/api/Hospital/doctors`).pipe(
      catchError(error => {
        console.error('Error fetching doctors:', error);
        throw error;
      })
    );

  }


  getOnlyUsers(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseAPi}/api/Hospital/user/${userId}`);
  }

  getDoctorById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseAPi}/api/Hospital/doctors/${id}`);
  }
  

  updatePassword(passwordData: any) {
    return this.http.post<any>(`${this.baseAPi}/api/Hospital/password/change`, passwordData);
  }

  createUser(user: Register): Observable<Register> {
    return this.http.post<Register>(this.baseAPi, user);
  }

 


  }

