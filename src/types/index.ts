export interface User {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  ssn: string;
  username: string;
  password: string;
}

export interface Account {
  accountId: string;
  accountNumber: string;
  type: 'CHECKING' | 'SAVINGS';
  balance: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  type: string;
  amount: number;
  accountId: string;
}

export interface BillPayment {
  payeeName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  accountNumber: string;
  verifyAccountNumber: string;
  amount: number;
  fromAccountId: string;
}
