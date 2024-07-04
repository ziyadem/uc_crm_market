import { Payment } from '../enum'

export declare interface Sale {
  product_id: string
  count: number
}
export declare interface SaleCreateRequest {
  pricePlastic: number
  employee_id?: string
  company_id?: string
  payment: Payment
  priceAll: number
  priceCash: number
  sales: Array<Sale>
}
