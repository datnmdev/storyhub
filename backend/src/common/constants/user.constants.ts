export enum UserStatus {
  UNACTIVATED = 'unactivated',
  ACTIVATED = 'activated',
  LOCKED = 'locked',
  DELETED = 'deleted',
}

export enum AuthType {
  EMAIL_PASSWORD = 'email_password',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

export enum Role {
  ADMIN = 'admin',
  READER = 'reader',
  AUTHOR = 'author',
  MODERATOR = 'moderator',
  TRANSLATOR = 'translator',
  GUEST = 'guest',
}

export enum OtpVerificationType {
  SIGN_IN = 0,
  SIGN_UP = 1,
  FORGOT_PASSWORD = 2,
  CHANGE_PASSWORD = 3,
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  ORTHER = 'orther',
}
