import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  currentUser: any;
  isAlive: boolean = true;

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      setTimeout(() => {
        if (this.isAlive) {
          this.getCurrentUser();
        }
      }, 1000);
    } else {
      // delete empty keys
      Object.keys(this.currentUser).forEach((key) => (this.currentUser[key] === null || this.currentUser[key] === '' || key == 'permissions' || key == 'id') && delete this.currentUser[key]);
      if (this.currentUser.dob) {
        this.currentUser.Age = new Date().getFullYear() - new Date(this.currentUser.dob).getFullYear();
        delete this.currentUser.dob;
      }
      delete this.currentUser.role;
      // replace keys with _ to space and capitalize
      this.currentUser = Object.keys(this.currentUser).reduce((acc: { [key: string]: any }, key) => {
        acc[key.replace(/_/g, ' ').replace(/\b\w/g, (l: any) => l.toUpperCase())] = this.currentUser[key];
        return acc;
      }, {} as { [key: string]: any });
    }
  }

  getInitials() {
    return this.currentUser?.name?.split(' ').map((n: any) => n[0]).join('');
  }

  getKeys() {
    return Object.keys(this.currentUser);
  }

  addProfile() {
    // const profilesCreated = this.currentUser.profiles.length;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    // return;
    const profilesCreated = user.profiles.length;
    if (profilesCreated == 4) {
      alert('You can create only 4 profiles');
      return;
    }
    const newProfile = {
      name: `Profile ${profilesCreated + 1}`,
    }
    this.apiService.put('user/'+user.id, {
      profiles: [...user.profiles, newProfile]
    }).subscribe((res: any) => {
      this.getCurrentUser();
    });
  }

}
