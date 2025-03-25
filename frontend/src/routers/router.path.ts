const paths = {
  readerHomePage: () => '/',
  readerStoryInfoPage: (storyId: string = ':storyId') => `/story/${storyId}`,
  signInPage: () => '/sign-in',
  authRedirectPage: () => '/auth/redirect',
  signUpPage: () => '/sign-up',
  otpVerificationPage: () => '/otp-verification',
  forgotPasswordPage: () => '/forgot-password',
  resetPasswordPage: () => '/reset-password',
  readerWalletPage: () => '/wallet',
  readerDepositeTransHistoryPage: () => '/wallet/deposite-transaction-history',
  readerChapterContentPage: (
    storyId: string | number = ':storyId',
    chapterId: string | number = ':chapterId'
  ) => `/story/${storyId}/chapter/${chapterId}`,
  managerDashboardPage: () => '/manager',
  authorHomePage: () => '/author',
  moderatorHomePage: () => '/moderator',
};

export default paths;
