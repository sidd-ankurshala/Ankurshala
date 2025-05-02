import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
// import { ApiService } from '../../services/api.service';

// interface Wallet {
//   userId: string;
//   balance: number;
//   userName?: string; // Optional
// }

@Component({
  selector: 'app-wallet-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './wallet-home.component.html',
  styleUrl: './wallet-home.component.css',
})
export class WalletHomeComponent {
  amount: number = 0;
  transactions = [
    {
      _id: '',
      createdAt: '',
      amount: 500.0,
      status: 'Completed',
    },
  ];
  user: any;
  walletData: any;
  metaData: any;

  constructor(private apiService: ApiService) {
    // this.getData();
    this.getWallet();
    this.getTrans();
    this.user = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')!)
      : null;
  }

  // Function to add amount
  addAmount(value: number): void {
    this.amount += value;
  }

  getTrans() {
    this.apiService
      .get('wallet_student/transaction/primary')
      .subscribe((res: any) => {
        this.transactions = res;
        console.log('data', res);
      });
  }

  getWallet() {
    this.apiService
      .get('wallet_student/getWalletSummary')
      .subscribe((res: any) => {
        console.log('data', res);

        this.walletData = res.wallets[0];
        this.metaData = res.metaData;
      });
  }

  // Function to handle ADD FUND button click
  addFund(): void {
    const data = {
      user: this.user.id,
      amount: this.amount,
    };
    this.apiService.post('wallet_student', data).subscribe({
      next: () => {
        this.getWallet();
        console.log('Amount added:', this.amount);
      },
      error: (err: any) => {
        console.error('Error adding topic:', err);
      },
    });
    // Add your logic here, e.g., send `this.amount` to a service or backend
  }
}
