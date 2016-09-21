//
//  BackgroundTaskManager.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2016-09-13.
//  Copyright © 2016 Transistor Software. All rights reserved.
//
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>

@interface BackgroundTaskManager : NSObject <CLLocationManagerDelegate>

#pragma mark - Singleton
+ (BackgroundTaskManager *)sharedInstance;

#pragma mark - Properties
@property (strong, nonatomic) CLLocationManager* locationManager;

#pragma mark - Methods

-(UIBackgroundTaskIdentifier)createBackgroundTask;
-(void)stopBackgroundTask:(UIBackgroundTaskIdentifier)taskId;
-(UIBackgroundTaskIdentifier)startPreventSuspend:(UIBackgroundTaskIdentifier)taskId;
-(UIBackgroundTaskIdentifier)stopPreventSuspend:(UIBackgroundTaskIdentifier)taskId;
-(void) stopPreventSuspendTimer;
-(void)pleaseStayAwake;
@end



