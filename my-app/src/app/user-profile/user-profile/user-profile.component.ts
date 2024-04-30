import { Component, OnInit } from '@angular/core';
import { Register } from '../../models/register.model';
import { MyServiceService } from '../../Services/my-service.service';
import { tap } from 'rxjs';
import { Doctor } from '../../models/doctor.Model';
import { LanguageService } from '../../Language/language-selector/language';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent  implements OnInit {
  user: any;
  uniqueDoctors: { bio: string, count: number }[] = [];
  uniqueDoctors2: { bio: string, count: number }[] = [];
  doctors: Doctor[] = [];
  doctors2: Doctor[] = [];
  selectedTime: string | null = null;
  selectedDay: Date | null = null;

  month : any;
  constructor(private service :MyServiceService,private languageService: LanguageService){
    this.generateCurrentWeek();
  }

  ngOnInit(): void {
   this.takeprofile();
   this.fetchDoctorsData();
  }
  
  takeprofile(){
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.service.getOnlyUsers(userId).pipe(
   //     tap((userData: any) => console.log(userData))
      ).subscribe(
        (userData: any) => {
          this.user = userData;
      //    console.log(this.user);
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );

  
    }
    this.updateDisplayedMonth();
    this.getdoctors();
  }
  fetchDoctorsData(): void {
    this.service.getDoctors().subscribe(
      (data: Doctor[]) => {
        this.doctors = data;
        this.uniqueDoctors = this.getUniqueDoctors(this.doctors);
      },
      (error: any) => console.error('Error fetching doctors:', error)
    );

    this.service.getUsers().subscribe(
      (data: any) => {
        this.doctors2 = data.filter((doctor: any) => doctor.registerByAdmin && !doctor.email.endsWith('@admin.com'));
        this.uniqueDoctors2 = this.getUniqueDoctors(this.doctors2);
      },
      (error: any) => console.error('Error fetching users:', error)
    );
  }

  private getUniqueDoctors(doctors: Doctor[]): { bio: string, count: number }[] {
    const bioCounts: { [key: string]: number } = {};
    doctors.forEach(doctor => {
      const bio = doctor.bio;
      bioCounts[bio] = (bioCounts[bio] || 0) + 1;
    });

    return Object.keys(bioCounts).map(bio => ({ bio, count: bioCounts[bio] }));
  }
  currentDate: Date = new Date();
  daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  currentWeek: Date[] = []; 
  hours: string[] = [
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
  ];


  generateCurrentWeek() {
    const startOfWeek = new Date(this.currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); 

    this.currentWeek = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      this.currentWeek.push(date);
    }
    this.updateDisplayedMonth();
  }
  updateDisplayedMonth() {
    this.month = this.currentDate.toLocaleString('default', { month: 'long' });
  }

  nextWeek() {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.generateCurrentWeek();
  }

  previousWeek() {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.generateCurrentWeek();
  }
  getdoctors(){
    this.service.getDoctors().subscribe(
      (data: any[]) => {
        this.doctors = data;
      },
      (error: any) => {
        console.error('Error fetching doctors:', error);
      }
    );
  }

  changeLanguage(lang: string) {
    this.languageService.setLanguage(lang);
  }
  
  getTranslation(key: string): string {
    return this.languageService.getTranslation(key);
  }

  selectedCells: { time: string, day: Date }[] = [];
  onCellClick(time: string, day: Date) {
    const index = this.selectedCells.findIndex(cell => cell.time === time && cell.day.getTime() === day.getTime());
    if (index !== -1) {
      this.selectedCells.splice(index, 1);
    } else {
      this.selectedCells.push({ time, day });
    }
  }

  isCellSelected(time: string, day: Date): boolean {
 //   console.log(this.selectedCells.some(cell => cell.time === time && cell.day.getTime() === day.getTime()))
    return this.selectedCells.some(cell => cell.time === time && cell.day.getTime() === day.getTime());
  }
}
