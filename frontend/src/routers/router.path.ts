const paths = {
  readerHomePage: () => '/',
  readerStoryInfoPage: (storyId: string = ':storyId') => `/story/${storyId}`,
  readerRankPage: () => `/rank`,
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
  storyFilterPage: () => '/story-filter',
  readerFollowManagementPage: () => '/reader/follow-management',
  readerPersonalProfilePage: () => '/reader/setting/personal-profile',
  readerChangePasswordPage: () => '/reader/setting/change-password',
  readerHistoryPage: () => '/reader/reading-history',
  readerNotificationPage: () => '/reader/notification',
  managerDashboardPage: () => '/manager',
  authorStoryManagementPage: () => '/author',
  authorPersonalProfilePage: () => '/author/setting/personal-profile',
  authorChangePasswordPage: () => '/author/setting/change-password',
  authorUpdateStoryPage: (storyId: string | number = ':storyId') =>
    `/author/story-management/${storyId}`,
  authorNotificationPage: () => '/author/notification',
  moderatorModerationRequestManagementPage: () => '/moderator',
};

export default paths;
