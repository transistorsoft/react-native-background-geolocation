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

@interface LocationManager : NSObject <CLLocationManagerDelegate>

// Location types
typedef enum tsLocationType : NSInteger {
    TS_LOCATION_TYPE_MOTIONCHANGE   = 0,
    TS_LOCATION_TYPE_TRACKING       = 1,
    TS_LOCATION_TYPE_CURRENT        = 2,
    TS_LOCATION_TYPE_SAMPLE         = 3,
    TS_LOCATION_TYPE_WATCH          = 4,
    TS_LOCATION_TYPE_GEOFENCE       = 5
} tsLocationtype;

// Error codes
typedef enum tsLocationError : NSInteger {
    TS_LOCATION_ERROR_ACCEPTABLE_ACCURACY = 100,
    TS_LOCATION_ERROR_TIMEOUT = 408
} tsLocationError;


@property (strong, nonatomic) CLLocationManager* locationManager;
@property (nonatomic, readonly) UIBackgroundTaskIdentifier preventSuspendTask;
@property (strong, nonatomic) CLLocation* lastLocation;
@property (strong, nonatomic) CLLocation* bestLocation;
@property (nonatomic) NSInteger maxLocationAttempts;
@property (nonatomic) CLLocationDistance distanceFilter;
@property (nonatomic) CLLocationAccuracy desiredAccuracy;
@property (nonatomic) CLActivityType activityType;
@property (readonly) BOOL isUpdating;
@property (readonly) BOOL isWatchingPosition;

@property (copy) void (^locationChangedBlock) (LocationManager* manager, CLLocation* location, BOOL isSample);
@property (copy) void (^errorBlock) (LocationManager* manager, NSError* error);

-(void)watchPosition:(NSDictionary*)options;
-(void)requestLocation;
-(void)stopWatchPosition;
-(void)startUpdatingLocation;
-(void)startUpdatingLocation:(NSInteger)samples;
-(void)startUpdatingLocation:(NSInteger)samples timeout:(NSTimeInterval)timeout;
-(void)startUpdatingLocation:(NSInteger)samples timeout:(NSTimeInterval)timeout desiredAccuracy:(CLLocationAccuracy)desiredAccuracy;
-(void)stopUpdatingLocation;

@end
