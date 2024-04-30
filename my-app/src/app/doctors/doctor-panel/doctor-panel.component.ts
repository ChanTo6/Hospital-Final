import { Component, OnInit } from '@angular/core';
import { MyServiceService } from '../../Services/my-service.service';
import { Doctor } from '../../models/doctor.Model';
import { LanguageService } from '../../Language/language-selector/language';
import { DatePipe } from '@angular/common';
import { TimeData } from '../../models/TimeData.Model';

@Component({
  selector: 'app-doctor-panel',
  templateUrl: './doctor-panel.component.html',
  styleUrl: './doctor-panel.component.css'
})
export class DoctorPanelComponent  implements OnInit{
  user: any;
  month : any;
  constructor(private service :MyServiceService,private languageService: LanguageService, private datePipe: DatePipe){}
  ngOnInit(): void {
    this.takeprofile();
    this.fetchDoctorsData()
    this.TakeTableDataFromApi();


  }

  selectedDates:any;
  TakeTableDataFromApi(){
    this.service.TakeTableDataFromApiService().subscribe(
      (data :any)=>{
        this.selectedDates=data;
        console.log(data);
      }
    )
  }

  sendDataToApi() {
    const doctorId = sessionStorage.getItem('doctorID') || '';
    const personalID = localStorage.getItem('userId');
  
    if (!personalID) {
      console.error('User ID not found in local storage');
      return;
    }
  
    this.service.getOnlyUsers(personalID).subscribe(
      (userData: any) => {
        let personalID = userData.personalID;
  
        if (!personalID) {
          console.error('Personal ID not found for the user');
          return;
        }
  
        personalID = parseInt(personalID);
  
        const timeDataArray: TimeData[] = this.selectedCells.map(cell => {
          const formattedDate = cell.day.toISOString().split('T')[0]; 
          return {
            personalID: personalID,
            doctorId: doctorId, 
            day: formattedDate,
            time: cell.time
          };
        });
  
        timeDataArray.forEach(timeData => {
          console.log(typeof(timeData.personalID))
          console.log(typeof(doctorId))
          console.log("day:", typeof(timeData.day));
          console.log("time:", typeof(timeData.time));

          // const dayDate = new Date(timeData.day);
          this.service.sendTimeData(timeData.personalID, timeData.doctorId, timeData.day, timeData.time).subscribe(
            (response) => {
              console.log('Time data sent successfully:', response);
            },
            (error) => {
              console.error('Error sending time data:', error);
            }
          );
        });
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }
  


  

  
  selectedCells: { time: string, day: Date }[] = [];

  onCellClick(hour: string, day: Date) {
    const cell = { time: hour, day: day };
    if (!this.isCellSelected(cell.time, cell.day)) {
      this.selectedCells.push(cell);
    } else {
      this.selectedCells = this.selectedCells.filter(
        c => !(c.time === cell.time && c.day.getTime() === cell.day.getTime())
      );
    }
  }



  isCellSelected(time: string, day: Date): boolean {
    return this.selectedCells.some(cell => cell.time === time && cell.day.getTime() === day.getTime());
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
    this.month=this.currentDate.toLocaleString('default',);
  }

  nextWeek() {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.generateCurrentWeek();
  }


  previousWeek() {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.generateCurrentWeek();
  }





  uniqueDoctors: { bio: string, count: number }[] = [];
  uniqueDoctors2: { bio: string, count: number }[] = [];
  doctors: Doctor[] = [];
  doctors2: Doctor[] = [];



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

  changeLanguage(lang: string) {
    this.languageService.setLanguage(lang);
  }
  
  getTranslation(key: string): string {
    return this.languageService.getTranslation(key);
  }

 



takeprofile(){
  const userId = sessionStorage.getItem('doctorID');
  if (userId) {
    this.service.getDoctorById(userId).pipe(
     // tap((userData: any) => console.log(userData))
    ).subscribe(
      (userData: any) => {  
        this.user = userData;
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
    
  }
  this.updateDisplayedMonth();
}
   }

