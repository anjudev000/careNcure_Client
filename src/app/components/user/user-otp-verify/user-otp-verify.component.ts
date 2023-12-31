import { Component } from '@angular/core';
import { Otp } from 'src/app/shared/otp.model';
import { OtpService } from 'src/app/shared/otp.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-user-otp-verify',
  templateUrl: './user-otp-verify.component.html',
  styleUrls: ['./user-otp-verify.component.css']
})
export class UserOtpVerifyComponent {
  errorMessages!:string;
  otpSub : Subscription | undefined;
  resendOtpSub : Subscription | undefined;
constructor(private otpService:OtpService,
  private _snackBar: MatSnackBar,
  private router:Router,
  private userService:UserService
){}
  handleOtpSubmit(formData:Otp){
    this.otpSub = this.otpService.verifyOTP(formData).subscribe({
      next:(res)=>{
        this._snackBar.open('OTP Verification Successfull','Close',{duration:3000});
        this.router.navigate(['/user-login']);
      },
      error:(err)=>{
        if(err.status === 400){
          this.errorMessages = 'Invalid OTP';
        }
        else if(err.status === 404){
          this.errorMessages = 'User Not Found';
        }
        else{
          this.errorMessages = 'An error occured! Please try again later!'
        }
        this._snackBar.open(this.errorMessages,'Close',{duration:3000});
      }
  })
  }

  handleOtpResend(email:string){
    console.log(40,email);
    // const userId = this.userService.getUserId();
    this.resendOtpSub = this.userService.postResendOtp(email).subscribe({
      next:(res)=>{
        this._snackBar.open('OTP RESEND TO YOUR MAIL','Close',{duration:3000});

      },
      error:(err)=>{
        this._snackBar.open(err.message,'Close',{duration:3000});

      }
    })
  }
  ngOnDestroy(){
    if(this.otpSub){
      this.otpSub.unsubscribe();
    }
    if(this.resendOtpSub){
      this.resendOtpSub.unsubscribe();
    }
  }
  
}
