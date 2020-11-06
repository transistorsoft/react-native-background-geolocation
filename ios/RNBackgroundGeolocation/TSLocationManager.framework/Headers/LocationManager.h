//
//  CurrentPositionManager.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2015-12-07.
//  Copyright © 2015 Transistor Software. All rights reserved.
//
#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>
#import <CoreLocation/CoreLocation.h>
#import "TSWatchPositionRequest.h"
#import "TSCurrentPositionRequest.h"

/// :nodoc:
@interface LocationManager : NSObject <CLLocationManagerDelegate>

// Error codes
typedef enum tsLocationError : NSInteger {
    TS_LOCATION_ERROR_ACCEPTABLE_ACCURACY = 100,
    TS_LOCATION_ERROR_TIMEOUT = 408
} tsLocationError;

@property (readonly) NSInteger currentAttempts;
@property (atomic) NSTimer *timeoutTimer;
@property (atomic) NSTimer *watchPositionTimer;
@property (atomic, readonly) NSTimeInterval locationTimeout;

@property (atomic, readonly) BOOL isAcquiringBackgroundTime;
@property (atomic, readonly) NSTimer *preventSuspendTimer;

@property (strong, atomic, readonly) CLLocationManager* locationManager;
@property (atomic, readonly) UIBackgroundTaskIdentifier preventSuspendTask;
@property (strong, atomic, readonly) CLLocation* lastLocation;
@property (strong, atomic, readonly) CLLocation* bestLocation;
@property (atomic) NSInteger maxLocationAttempts;
@property (atomic) CLLocationDistance distanceFilter;
@property (atomic) CLLocationAccuracy desiredAccuracy;
@property (atomic) CLActivityType activityType;
@property (readonly) BOOL isUpdating;
@property (readonly) BOOL isWatchingPosition;

@property (copy) void (^locationChangedBlock) (LocationManager* manager, CLLocation* location, BOOL isSample);
@property (copy) void (^errorBlock) (LocationManager* manager, NSError* error);

-(void)watchPosition:(TSWatchPositionRequest*)request;
-(void)requestLocation;
-(void)stopWatchPosition;
-(void)startUpdatingLocation;
-(void)startUpdatingLocation:(NSInteger)samples;
-(void)startUpdatingLocation:(NSInteger)samples timeout:(NSTimeInterval)timeout;
-(void)startUpdatingLocation:(NSInteger)samples timeout:(NSTimeInterval)timeout desiredAccuracy:(CLLocationAccuracy)desiredAccuracy;
-(void)stopUpdatingLocation;

@end
