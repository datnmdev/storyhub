export enum QueueName {
  MAIL = 'mail',
  NOTIFICATION = 'notification',
}

export enum JobName {
  SEND_OTP_TO_VERIFY_ACCOUNT = 'send-otp-to-verify-account',
  SEND_OTP_TO_RESET_PASSWORD = 'send-otp-to-reset-password',
  SEND_OTP_TO_VERIFY_CHANGE_PASSWORD = 'send-otp-to-verify-change-password',
  SEND_DEPOSITE_TRANSACTION_NOTIFICATION = 'send-deposite-transaction-notification',
  SEND_COMMENT_NOTIFICATION = 'send-comment-notification',
  SEND_STORY_NOTIFICATION = 'send-moderation-request-notification',
}
