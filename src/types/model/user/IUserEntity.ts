export interface IUserEntity {
  _id: string
  id?: string // Support backend response
  email: string
  username?: string
  firstName?: string
  lastName?: string
  displayName: string
  avatarUrl?: string
  dateOfBirth?: string
  phone?: string
  bio?: string
  coupleId?: string
  isEmailVerified?: boolean
  createdAt: string
  updatedAt?: string
}