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

// ActivityRecognition
@property (nonatomic) BOOL isMoving;
@property (nonatomic) CLActivityType activityType;
@property (nonatomic) NSTimeInterval stopDetectionDelay;
@property (nonatomic) NSTimeInterval stopTimeout;
@property (nonatomic) NSTimeInterval activityRecognitionInterval;
@property (nonatomic) NSInteger minimumActivityRecognitionConfidence;
@property (nonatomic) BOOL disableMotionActivityUpdates;
@property (nonatomic) BOOL disableStopDetection;
@property (nonatomic) BOOL stopOnStationary;

// HTTP & Persistence
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
@property (nonatomic) BOOL encrypt;
@property (nonatomic) TSAuthorization* authorization;

// Application
@property (nonatomic) BOOL stopOnTerminate;
@property (nonatomic) BOOL startOnBoot;
@property (nonatomic) BOOL preventSuspend;
@property (nonatomic) NSTimeInterval heartbeatInterval;
@property (nonatomic) NSArray *schedule;
// Logging & Debug
@property (nonatomic) BOOL debug;
@property (nonatomic) TSLogLevel logLevel;
@property (nonatomic) NSInteger logMaxDays;

+ (void)eachProperty:(Class)mClass callback:(void(^)(NSString*, TSSettingType))block;
+ (TSSettingType) getPropertyType:(objc_property_t)property;
+ (CLLocationAccuracy) decodeDesiredAccuracy:(NSNumber*)accuracy;
- (NSDictionary*) toDictionary;

@end

# pragma mark TSConfig

/**
TSConfig
 */
@interface TSConfig : NSObject <NSCoding>
#pragma mark - Singleton
+ (TSConfig *)sharedInstance;
+ (Class) classForPropertyName:(NSString*)name fromObject:(id)object;
    
# pragma mark Initializers

/**
 * Update with Block doc
 * @param block This is the block
 * @see TSConfigBuilder
 */

- (void)updateWithBlock:(void(^)(TSConfigBuilder*))block;
- (void)updateWithDictionary:(NSDictionary*)config;

- (void)reset;
- (void)reset:(BOOL)silent;

# pragma mark Events
- (void)onChange:(NSString*)property callback:(void(^)(id))block;
- (void) removeListeners;

# pragma mark State methods
-(void)incrementOdometer:(CLLocationDistance)distance;
-(BOOL)isLocationTrackingMode;
-(BOOL)hasValidUrl;
-(BOOL)hasSchedule;
-(NSDictionary*)getLocationAuthorizationAlertStrings;
-(BOOL)isFirstBoot;
-(BOOL)didLaunchInBackground;

# pragma mark Utility methods
- (NSDictionary*) toDictionary;
- (NSDictionary*) toDictionary:(BOOL)redact;

// Logs a safe version of toDictionary with sensitive information redacted
- (NSString*) toJson;
- (void) registerPlugin:(NSString*)pluginName;
- (BOOL) hasPluginForEvent:(NSString*)eventName;
// Returns the configured BACKGROUND_GEOLOCATION_ENCRYPTION_PASSWORD from application's Info.plist
- (NSString*) encryptionPassword;
/// @name State Properties
/**
 * enabled is tracking enabled?
 */
@property (nonatomic) BOOL enabled;
/**
 * State of plugin, moving or stationary.
 */
@property (nonatomic) BOOL isMoving;
/**
 * True when scheduler is enabled
 */
@property (nonatomic) BOOL schedulerEnabled;
@property (nonatomic) CLLocationDistance odometer;
@property (nonatomic) TSTrackingMode trackingMode;
@property (nonatomic) CLAuthorizationStatus lastLocationAuthorizationStatus;
@property (nonatomic) BOOL iOSHasWarnedLocationServicesOff;
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
@property (nonatomic) BOOL encrypt;
@property (nonatomic) TSAuthorization* authorization;

/// @name Application Properties
@property (nonatomic, readonly) BOOL stopOnTerminate;
@property (nonatomic, readonly) BOOL startOnBoot;
@property (nonatomic, readonly) BOOL preventSuspend;
@property (nonatomic, readonly) NSTimeInterval heartbeatInterval;
@property (nonatomic, readonly) NSArray *schedule;
// @name Logging & Debug Properties
@property (nonatomic, readonly) BOOL debug;
@property (nonatomic, readonly) TSLogLevel logLevel;
@property (nonatomic, readonly) NSInteger logMaxDays;

@end
