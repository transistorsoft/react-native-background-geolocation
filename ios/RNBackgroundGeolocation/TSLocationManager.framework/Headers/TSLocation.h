//
//  TSLocation.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2017-02-11.
//  Copyright © 2017 Transistor Software. All rights reserved.
//

@interface TSLocation : NSObject

// Location types
typedef enum tsLocationType : NSInteger {
    TS_LOCATION_TYPE_MOTIONCHANGE   = 0,
    TS_LOCATION_TYPE_TRACKING       = 1,
    TS_LOCATION_TYPE_CURRENT        = 2,
    TS_LOCATION_TYPE_SAMPLE         = 3,
    TS_LOCATION_TYPE_WATCH          = 4,
    TS_LOCATION_TYPE_GEOFENCE       = 5,
    TS_LOCATION_TYPE_HEARTBEAT      = 6
} tsLocationtype;

@property (nonatomic, readonly) CLLocation* location;
@property (nonatomic, readonly) NSString *uuid;
@property (nonatomic, readonly) NSString *timestamp;
@property (nonatomic, readonly) enum tsLocationType type;
@property (nonatomic, readonly) BOOL isMoving;
@property (nonatomic, readonly) NSDictionary* extras;
@property (nonatomic, readonly) NSDictionary* geofence;
// Battery
@property (nonatomic, readonly) BOOL batteryIsCharging;
@property (nonatomic, readonly) NSNumber *batteryLevel;
// Activity
@property (nonatomic, readonly) NSString *activityType;
@property (nonatomic, readonly) NSNumber *activityConfidence;
// State
@property (nonatomic, readonly) BOOL isSample;
@property (nonatomic, readonly) BOOL isHeartbeat;
@property (nonatomic, readonly) NSNumber *odometer;
@property (nonatomic, readonly) NSString *event;

-(id) initWithLocation:(CLLocation*)location;
-(id) initWithLocation:(CLLocation*)location type:(enum tsLocationType)type extras:(NSDictionary*)extras;
-(id) initWithLocation:(CLLocation*)location geofence:(NSDictionary*)geofenceData;
- (NSString*)toJson:(NSError**)error;
- (NSDictionary*)toDictionary;

@end
