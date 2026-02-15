export class loginDto {
  email!: string;
  password!: string;
}

export class registerDto {
  email!: string;
  password!: string;
  mobileNumber!: string;
  role?: string;
}
