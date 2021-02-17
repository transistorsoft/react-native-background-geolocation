//
//  TSConfig.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2018-02-05.
//  Copyright © 2018 Transistor Software. All rights reserved.
//
@import CoreLocation;
#import <objc/runtime.h>
#import "TSAuthorization.h"

/**
 * Create TSSettingType
 */
typedef enum TSSettingType : NSInteger {
    tsSettingTypeString = 0,
    tsSettingTypeInteger,
    tsSettingTypeUInteger,
    tsSettingTypeBoolean,
    tsSettingTypeDouble,
    tsSettingTypeFloat,
    tsSettingTypeLong,
    tsSettingTypeDictionary,
    tsSettingTypeArray,
    tsSettingTypeModule
} TSSettingType;

typedef enum TSTrackingMode : NSInteger {
    tsTrackingModeGeofence = 0,
    tsTrackingModeLocation
} TSTrackingMode;

typedef enum TSLogLevel : NSInteger {
    tsLogLevelOff = 0,
    tsLogLevelError,
    tsLogLevelWarning,
    tsLogLevelInfo,
    tsLogLevelDebug,
    tsLogLevelVerbose
} TSLogLevel;

typedef enum TSPersistMode : NSInteger {
    tsPersistModeNone = 0,
    tsPersistModeAll = 2,
    tsPersistModeLocation = 1,
    tsPersistModeGeofence = -1
} TSPersistMode;

/**
 * TSConfigBuilder
 */
@interface TSConfigBuilder : NSObject

/// @name Properties

// Geolocation
/**
 * desired accuracy in meterssss
 */
@property (nonatomic) CLLocationAccuracy desiredAccuracy;
/**
 * distance filter in meters
 */
@property (nonatomic) CLLocationDistance distanceFilter;
@property (nonatomic) CLLocationDistance stationaryRadius;
@property (nonatomic) NSTimeInterval locationTimeout;
@property (nonatomic) BOOL useSignificantChangesOnly;
@property (nonatomic) BOOL pausesLocationUpdatesAutomatically;
@property (nonatomic) BOOL disableElasticity;
@property (nonatomic) double elasticityMultiplier;
@property (nonatomic) NSTimeInterval stopAfterElapsedMinutes;
@property (nonatomic) NSString* locationAuthorizationRequest;
@property (nonatomic) NSDictionary* locationAuthorizationAlert;
@property (nonatomic) BOOL disableLocationAuthorizationAlert;
@property (nonatomic) CLLocationDistance geofenceProximityRadius;
@property (nonatomic) BOOL geofenceInitialTriggerEntry;
@property (nonatomic) CLLocationAccuracy desiredOdometerAccuracy;
@property (nonatomic) BOOL enableTimestampMeta;
@property (nonatomic) BOOL showsBackgroundLocationIndicator;

/// ActivityRecognition
@property (nonatomic) BOOL isMoving;
@property (nonatomic) CLActivityType activityType;
@property (nonatomic) NSTimeInterval stopDetectionDelay;
@property (nonatomic) NSTimeInterval stopTimeout;
@property (nonatomic) NSTimeInterval activityRecognitionInterval;
@property (nonatomic) NSInteger minimumActivityRecognitionConfidence;
@property (nonatomic) BOOL disableMotionActivityUpdates;
@property (nonatomic) BOOL disableStopDetection;
@property (nonatomic) BOOL stopOnStationary;

/// HTTP & Persistence
@property (nonatomic) NSString* url;
@property (nonatomic) NSString* method;
@property (nonatomic) NSString* httpRootProperty;
@property (nonatomic) NSDictionary* params;
@property (nonatomic) NSDictionary* headers;
@property (nonatomic) NSDictionary* extras;
@property (nonatomic) BOOL autoSync;
@property (nonatomic) NSInteger autoSyncThreshold;
@property (nonatomic) BOOL batchSync;
@property (nonatomic) NSInteger maxBatchSize;
@property (nonatomic) NSString *locationTemplate;
@property (nonatomic) NSString *geofenceTemplate;
@property (nonatomic) NSInteger maxDaysToPersist;
@property (nonatomic) NSInteger maxRecordsToPersist;
@property (nonatomic) NSString* locationsOrderDirection;
@property (nonatomic) NSInteger httpTimeout;
@property (nonatomic) TSPersistMode persistMode;
@property (nonatomic) BOOL disableAutoSyncOnCellular;
@property (nonatomic) TSAuthorization* authorization;

/// Application
@property (nonatomic) BOOL stopOnTerminate;
@property (nonatomic) BOOL startOnBoot;
@property (nonatomic) BOOL preventSuspend;
@property (nonatomic) NSTimeInterval heartbeatInterval;
@property (nonatomic) NSArray *schedule;
/// Logging & Debug
@property (nonatomic) BOOL debug;
@property (nonatomic) TSLogLevel logLevel;
@property (nonatomic) NSInteger logMaxDays;

/// :nodoc:
+ (void)eachProperty:(Class)mClass callback:(void(^)(NSString*, TSSettingType))block;
/// :nodoc:
+ (TSSettingType) getPropertyType:(objc_property_t)property;
/// :nodoc:
+ (CLLocationAccuracy) decodeDesiredAccuracy:(NSNumber*)accuracy;

- (NSDictionary*) toDictionary;

@end

# pragma mark TSConfig

/**
The SDK's Configuration API.
 */
@interface TSConfig : NSObject <NSCoding>

#pragma mark - Singleton

/// Returns the singleton instance.
+ (TSConfig *)sharedInstance;
/// :nodoc:
+ (Class) classForPropertyName:(NSString*)name fromObject:(id)object;

/**
 `YES` when the SDK is in the *location + geofence* tracking mode, where `-[TSLocationManager start]` was called.
 `NO` when the SDK is in *geofences-only* tracking mode, where `-[TSLocationMangager startGeofences]` was called.
 */
-(BOOL)isLocationTrackingMode;
/**
 `YES` when this is the first launch after initial installation of you application.
 */
-(BOOL)isFirstBoot;
/**
 `YES` when the application was launched in the background.
 */
-(BOOL)didLaunchInBackground;

# pragma mark Initializers

/**
 Update the SDK with new configuration options.
 */
- (void)updateWithBlock:(void(^)(TSConfigBuilder*))block;
/// :nodoc:
- (void)updateWithDictionary:(NSDictionary*)config;

/**
 Resets the SDK's configuration to default values.
 */
- (void)reset;
/// :nodoc:
- (void)reset:(BOOL)silent;

# pragma mark Geolocation methods
/// :nodoc:
- (BOOL) getPausesLocationUpdates;

# pragma mark Events
/// :nodoc:
- (void)onChange:(NSString*)property callback:(void(^)(id))block;
/// :nodoc:
- (void) removeListeners;

# pragma mark State methods
/// :nodoc:
-(void)incrementOdometer:(CLLocationDistance)distance;
/// :nodoc:
-(BOOL)hasValidUrl;
/// :nodoc:
-(BOOL)hasSchedule;
/// :nodoc:
-(NSDictionary*)getLocationAuthorizationAlertStrings;

- (BOOL)didDeviceReboot;
    
# pragma mark Utility methods
/**
 Returns an `NSDictionary` representation of the configuration options.
 */
- (NSDictionary*) toDictionary;
/// :nodoc:
- (NSDictionary*) toDictionary:(BOOL)redact;
/// :nodoc:
- (NSString*) toJson;
/// :nodoc:
- (void) registerPlugin:(NSString*)pluginName;
/// :nodoc:
- (BOOL) hasPluginForEvent:(NSString*)eventName;

/// @name State Properties
 
/**
 enabled is tracking enabled?
 */
@property (nonatomic) BOOL enabled;
/**
 State of plugin, moving or stationary.
 */
@property (nonatomic) BOOL isMoving;
/**
 True when scheduler is enabled
 */
@property (nonatomic) BOOL schedulerEnabled;

@property (nonatomic) CLLocationDistance odometer;
@property (nonatomic) TSTrackingMode trackingMode;
@property (nonatomic) CLAuthorizationStatus lastLocationAuthorizationStatus;
@property (nonatomic) BOOL iOSHasWarnedLocationServicesOff;
@property (nonatomic) BOOL didRequestUpgradeLocationAuthorization;
@property (nonatomic) BOOL didLaunchInBackground;

/// @name Geolocation Properties
/**
 * GPS is only used when kCLDesiredAccuracyBest or kCLDesiredAccuracyBestForNavigation.
 */
@property (nonatomic, readonly) CLLocationAccuracy desiredAccuracy;
/**
 * A location will be recorded each distanceFilter meters
 */
@property (nonatomic, readonly) CLLocationDistance distanceFilter;
@property (nonatomic, readonly) CLLocationDistance stationaryRadius;
@property (nonatomic, readonly) NSTimeInterval locationTimeout;
@property (nonatomic, readonly) BOOL useSignificantChangesOnly;
@property (nonatomic, readonly) BOOL pausesLocationUpdatesAutomatically;
@property (nonatomic, readonly) BOOL disableElasticity;
@property (nonatomic, readonly) double elasticityMultiplier;
@property (nonatomic, readonly) NSTimeInterval stopAfterElapsedMinutes;
@property (nonatomic, readonly) NSString* locationAuthorizationRequest;
@property (nonatomic, readonly) BOOL disableLocationAuthorizationAlert;
@property (nonatomic, readonly) NSDictionary* locationAuthorizationAlert;
@property (nonatomic, readonly) CLLocationDistance geofenceProximityRadius;
@property (nonatomic, readonly) BOOL geofenceInitialTriggerEntry;
@property (nonatomic, readonly) CLLocationAccuracy desiredOdometerAccuracy;
@property (nonatomic) BOOL enableTimestampMeta;
@property (nonatomic) BOOL showsBackgroundLocationIndicator;

/// @name ActivityRecognition Properties
@property (nonatomic, readonly) CLActivityType activityType;
@property (nonatomic, readonly) NSTimeInterval stopDetectionDelay;
@property (nonatomic, readonly) NSTimeInterval stopTimeout;
@property (nonatomic, readonly) NSTimeInterval activityRecognitionInterval;
@property (nonatomic, readonly) NSInteger minimumActivityRecognitionConfidence;
@property (nonatomic, readonly) BOOL disableMotionActivityUpdates;
@property (nonatomic, readonly) BOOL disableStopDetection;
@property (nonatomic, readonly) BOOL stopOnStationary;

/// @name HTTP & Persistence Properties
@property (nonatomic, readonly) NSString* url;
@property (nonatomic, readonly) NSString* method;
@property (nonatomic, readonly) NSString* httpRootProperty;
@property (nonatomic, readonly) NSDictionary* params;
@property (nonatomic, readonly) NSDictionary* headers;
@property (nonatomic, readonly) NSDictionary* extras;
@property (nonatomic, readonly) BOOL autoSync;
@property (nonatomic, readonly) NSInteger autoSyncThreshold;
@property (nonatomic, readonly) BOOL batchSync;
@property (nonatomic, readonly) NSInteger maxBatchSize;
@property (nonatomic, readonly) NSString *locationTemplate;
@property (nonatomic, readonly) NSString *geofenceTemplate;
@property (nonatomic, readonly) NSInteger maxDaysToPersist;
@property (nonatomic, readonly) NSInteger maxRecordsToPersist;
@property (nonatomic, readonly) NSString* locationsOrderDirection;
@property (nonatomic, readonly) NSInteger httpTimeout;
@property (nonatomic) TSPersistMode persistMode;
@property (nonatomic) BOOL disableAutoSyncOnCellular;
@property (nonatomic) TSAuthorization* authorization;

/// @name Application Properties
@property (nonatomic, readonly) BOOL stopOnTerminate;
@property (nonatomic, readonly) BOOL startOnBoot;
@property (nonatomic, readonly) BOOL preventSuspend;
@property (nonatomic, readonly) NSTimeInterval heartbeatInterval;
@property (nonatomic, readonly) NSArray *schedule;
/// @name Logging & Debug Properties
@property (nonatomic, readonly) BOOL debug;
@property (nonatomic, readonly) TSLogLevel logLevel;
@property (nonatomic, readonly) NSInteger logMaxDays;

@end
