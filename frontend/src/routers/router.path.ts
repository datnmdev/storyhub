const paths = {
  readerHomePage: () => '/',
  readerStoryInfoPage: (storyId: string = ':storyId') => `/story/${storyId}`,
  signInPage: () => '/sign-in',
  authRedirectPage: () => '/auth/redirect',
  signUpPage: () => '/sign-up',
  otpVerificationPage: () => '/otp-verification',
  forgotPasswordPage: () => '/forgot-password',
  resetPasswordPage: () => '/reset-password',
  readerWalletPage: () => '/reader/wallet',
  readerDepositeTransHistoryPage: () =>
    '/reader/wallet/deposite-transaction-history',
  readerInvoiceHistoryPage: () => '/reader/wallet/invoice-history',
  readerChapterContentPage: (
    storyId: string | number = ':storyId',
    chapterId: string | number = ':chapterId',
    chapterTransId: string | number = ':chapterTransId'
  ) => `/story/${storyId}/chapter/${chapterId}/${chapterTransId}`,
  managerDashboardPage: () => '/manager',
  authorHomePage: () => '/author',
  moderatorHomePage: () => '/moderator',
};

export default paths;
