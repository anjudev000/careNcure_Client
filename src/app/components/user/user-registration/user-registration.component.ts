import { Component } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { User } from 'src/app/shared/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent {
  signUpForm!: FormGroup;
  showerrorMessages!: string;
  showSuccessMessage!: boolean;
  subData: Subscription | undefined;

  constructor(private userService: UserService, private _snackBar: MatSnackBar,private router:Router) { }

  handleRegistrationSubmit(formData: User) {
    this.showerrorMessages = '';
   this.subData =  this.userService.postUser(formData).subscribe({
      next:(res) => {
        this.showSuccessMessage = true;
        this._snackBar.open('User Registered. Verify to Activate your account ', 'close', {
          duration: 3000
        });
        this.router.navigate(['/user-otp-verify'],{
          state:{email:formData.email}
        })
      },
      error:(err) => {
        console.log(err, 29);
        if (err.status === 422) {
          this.showerrorMessages = err.error[0];
        }
        else {
          this.showerrorMessages = 'Something went wrong'   // errors in the server side other than validation errors
        }

      }
     } )
  }

  ngOnDestroy(){
    if(this.subData){
      this.subData.unsubscribe();
    }
  }
}
