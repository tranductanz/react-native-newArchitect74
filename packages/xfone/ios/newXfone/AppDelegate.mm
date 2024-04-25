#import "AppDelegate.h"
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
//#import <RCTAppSetupUtils.h>
#import <AVFoundation/AVFoundation.h>
#import <Firebase.h>
#import "React/RCTBridge.h"
#import "React/RCTBridge+Private.h"
#import "React/RCTModuleData.h"
#import "React/RCTModuleMethod.h"
#import "React/RCTEventDispatcher.h"
#import <PushKit/PushKit.h>
#import "RNVoipPushNotificationManager.h"
#import "RNCallKeep.h"
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>
#import <React/RCTLinkingManager.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"newXfone";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  if ([FIRApp defaultApp] == nil) {
   [FIRApp configure];
  }
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
