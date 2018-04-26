export interface Customer {
  id?: string,
  email: string,
  password: string,
  name: string,
  address: string,
  mobile: string,
  gender: string,
  birthDate: string
}

export interface CustomerLogin {
  email: string,
  password: string,
}
