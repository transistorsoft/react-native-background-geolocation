//
//  Settings.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2015-11-12.
//  Copyright © 2015 Transistor Software. All rights reserved.
//
#import <CoreLocation/CoreLocation.h>
@class Settings;
@interface Settings : NSObject

#pragma mark - Singleton
+ (Settings *)sharedInstance;

#pragma mark - Properties
@property (nonatomic, readonly) NSMutableDictionary *config;

// State
@property (nonatomic, readonly) BOOL enabled;
@property (nonatomic, readonly) BOOL schedulerEnabled;
@property (nonatomic, readonly) BOOL isMoving;
@property (nonatomic) CLLocationDistance odometer;
// Application
@property (nonatomic, readonly) BOOL debug;
@property (nonatomic, readonly) BOOL stopOnTerminate;
@property (nonatomic, readonly) BOOL startOnBoot;
@property (nonatomic, readonly) BOOL preventSuspend;
@property (nonatomic, readonly) NSTimeInterval heartbeatInterval;
@property (nonatomic, readonly) NSArray *schedule;
// Geolocation
@property (nonatomic, readonly) CLLocationAccuracy desiredAccuracy;
@property (nonatomic, readonly) CLLocationDistance distanceFilter;
@property (nonatomic, readonly) CLLocationDistance stationaryRadius;
@property (nonatomic, readonly) NSTimeInterval locationTimeout;
@property (nonatomic, readonly) BOOL useSignificantChangesOnly;
@property (nonatomic, readonly) BOOL pausesLocationUpdatesAutomatically;
@property (nonatomic, readonly) BOOL disableElasticity;
@property (nonatomic, readonly) NSTimeInterval stopAfterElapsedMinutes;
@property (nonatomic, readonly) NSString* locationAuthorizationRequest;

// ActivityRecognition
@property (nonatomic, readonly) CLActivityType activityType;
@property (nonatomic, readonly) NSTimeInterval stopDetectionDelay;
@property (nonatomic, readonly) NSTimeInterval stopTimeout;
@property (nonatomic, readonly) NSTimeInterval activityRecognitionInterval;
@property (nonatomic, readonly) BOOL disableMotionActivityUpdates;
@property (nonatomic, readonly) BOOL disableStopDetection;
// HTTP
@property (nonatomic, readonly) NSString* url;
@property (nonatomic, readonly) NSString* httpMethod;
@property (nonatomic, readonly) NSMutableDictionary* params;
@property (nonatomic, readonly) NSMutableDictionary* headers;
@property (nonatomic, readonly) NSDictionary* extras;
@property (nonatomic, readonly) BOOL autoSync;
@property (nonatomic, readonly) BOOL batchSync;
@property (nonatomic, readonly) NSInteger maxBatchSize;
// Persistence
@property (nonatomic, readonly) NSInteger maxDaysToPersist;
@property (nonatomic, readonly) NSInteger maxRecordsToPersist;

#pragma mark - Methods
-(void)load:(NSDictionary*)cfg;
-(NSArray*)items;
-(id)get:(NSString*)key;
-(NSMutableDictionary*)getState;
-(void)incrementOdometer:(CLLocationDistance)distance;
-(void)resetOdometer;

#pragma mark - Config param getters
-(void)setIsMoving:(BOOL)value;
-(void)setEnabled:(BOOL)value;
-(void)setSchedulerEnabled:(BOOL)value;
-(void)setDisableStopDetection:(BOOL)value;
-(void)setStationaryRadius:(CLLocationDistance)radius;
-(void)setPreventSuspend:(BOOL)value;
-(BOOL)hasValidUrl;
-(NSDictionary*)getGeofences;
@end



