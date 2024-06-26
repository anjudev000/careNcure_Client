import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorDataService } from 'src/app/shared/doctor-data.service';
import { DatePipe } from '@angular/common';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent {

  datePipe = new DatePipe('en-US');
  minDate!:string;
  maxDate!:string;
  bookingForm!:FormGroup;
  selectedDate:Date | null =null;
  displayedSlots:string[] = [];
   
  constructor(
    private doctorData:DoctorDataService,
    private router:Router
    ){}
  ngOnInit(){
    const currentDate = new Date();
    const maxDate = new Date();
    maxDate.setDate(currentDate.getDate()+30);
    this.minDate = this.datePipe.transform(currentDate,'yyy-MM-dd') || '';
    this.maxDate = this.datePipe.transform(maxDate,'yyyy-MM-dd') || '';
   
  }

  availableTimeSlots(){ 
    if(this.selectedDate){
      const formattedDate = this.datePipe.transform(this.selectedDate, 'dd MMM yyyy');
      const selectedDoctor = this.doctorData.getDoc();
      const availableSlots = selectedDoctor.slots.find((slot)=>slot.date === formattedDate);
     

    if (availableSlots && availableSlots.timeslots.length > 0) {
      console.log("line 42 testinggg")
      // Filter out past time slots if the selected date is today
      if (this.isToday(this.selectedDate)) {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert current time to minutes
        this.displayedSlots = availableSlots.timeslots.filter((slot) => {
          const [hours, minutes] = slot.split(':').map(Number);
          const slotTime = hours * 60 + minutes; // Convert slot time to minutes
          return slotTime >= currentTime;
        });
      } else {
        this.displayedSlots = availableSlots.timeslots;
        for(let sl of this.displayedSlots){
          console.log("inside date selection: slots for the date is",sl);
        }
      }
         // Sort the displayedSlots array in ascending order
           this.displayedSlots.sort((a, b) => {
          const date = new Date('1970-01-01 ' + a);
          const dateB = new Date('1970-01-01 ' + b);
        
          // Compare the Date objects
          return date.getTime() - dateB.getTime();
        });
    } else {
      this.displayedSlots = [];
    }
  } else {

    this.displayedSlots = [];

  } }

  isToday(selectedDate: Date): boolean {
    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
    }

    onSlotSelection(selectedSlot:string){
      const selectedDoctor = this.doctorData.getDoc();
      
      const queryParams:any = {
        doctorId: selectedDoctor._id,
        selectedDate: this.datePipe.transform(this.selectedDate, 'MMM dd, yyyy'),
        selectedSlot:selectedSlot,
        doctorName:selectedDoctor.fullName,
        dept:selectedDoctor.specialization,
        degree:selectedDoctor.education[0].degree,
        image:selectedDoctor.profilePic,
        fee:selectedDoctor.fee

      }
      
      this.router.navigate(['/booking-details'],{queryParams:queryParams});
    }
}
