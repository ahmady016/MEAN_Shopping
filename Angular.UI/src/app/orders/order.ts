export interface Order {
  id?:string,
  createdAt?: string,
  customer?: string,
  items: OrderItem[],
  total?: number
}

export interface OrderItem {
  id?: string,
  name?: string,
  description?: string,
  price: number,
  quantity: number,
  subTotal?: number
}
