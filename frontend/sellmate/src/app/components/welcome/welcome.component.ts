import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router'; 
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatCardModule, MatInputModule, MatFormFieldModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

  loginData = {
    username: '',
    password: ''
  };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router){}
  
  
  onLogin(): void {
    this.authService.login(this.loginData).subscribe((res: any) => {
      if(res) {
        localStorage.setItem('token', res);
        this.router.navigate(['/home']);
      }
    },
      error  => {
        this.errorMessage = 'Giriş başarısız. Bilgilerinizi kontrol edin';
      });
  }



}
