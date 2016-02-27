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

@property (strong, nonatomic) CLLocationManager* locationManager;
@property (strong, nonatomic) CLLocation* lastLocation;
@property (strong, nonatomic) CLLocation* bestLocation;
@property (nonatomic) NSInteger maxLocationAttempts;
@property (nonatomic) CLLocationDistance distanceFilter;
@property (nonatomic) CLLocationAccuracy desiredAccuracy;
@property (nonatomic) CLActivityType activityType;
@property (readonly) BOOL isUpdating;

@property (copy) void (^locationChangedBlock) (LocationManager* manager, CLLocation* location, BOOL isSample);
@property (copy) void (^errorBlock) (LocationManager* manager, NSError* error);

-(void)startUpdatingLocation;
-(void)startUpdatingLocation:(int)samples;
-(void)startUpdatingLocation:(int)samples timeout:(NSTimeInterval)timeout;
-(void)stopUpdatingLocation;
@end
