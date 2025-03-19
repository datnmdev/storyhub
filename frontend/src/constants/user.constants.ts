export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  ORTHER = 'other',
}

export enum Role {
  ADMIN = 'admin',
  AUTHOR = 'author',
  MODERATOR = 'moderator',
  TRANSLATOR = 'translator',
  READER = 'reader',
}

export enum UserStatus {
  UNACTIVATED = 'unactivated',
  ACTIVATED = 'activated',
  LOCKED = 'locked',
  DELETED = 'deleted',
}

export const AUTH_KEY = 'user';
