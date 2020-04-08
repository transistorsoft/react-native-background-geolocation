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

/**
 * The native CLLocation instance
 */
@property (nonatomic, readonly) CLLocation* location;
/**
 * Universally unique identifier.  The uuid is used to locate the record in the database.  It is also posted by default in HTTP requests so your server can determine if a duplicate location has been posted.  It's also helpful to match a location received at your server to entries in the plugin logs.
 */
@property (nonatomic, readonly) NSString *uuid;
/**
 * The rendered timestamp in ISO-8851 UTC format (YYYY-MM-dd HH:mm:sssZ)
 */
@property (nonatomic, readonly) NSString *timestamp;
/**
 * The type of location: MOTIONCHANGE|TRACKING|CURRENT|SAMPLE|WATCH|GEOFENCE|HEARTBEAT
 */
@property (nonatomic, readonly) enum tsLocationType type;
/**
 * YES when location was recorded while device is in motion; NO otherwise.
 */
@property (nonatomic, readonly) BOOL isMoving;
/**
 * Arbitrary extras data attached to the location.
 */
@property (nonatomic, readonly) NSDictionary* extras;
/**
 * For internal use only.  Geofence data rendered to NSDictionary for posting to server.
 */
@property (nonatomic, readonly) NSDictionary* geofence;
// Battery
/**
 * YES when device is plugged into power and charging
 */
@property (nonatomic, readonly) BOOL batteryIsCharging;
/**
 * The battery level between 0 (empty) and 1 (full)
 */
@property (nonatomic, readonly) NSNumber *batteryLevel;
// Activity
/**
 * Activity type rendered as string: still|on_foot|in_vehicle|running|on_bicycle
 */
@property (nonatomic, readonly) NSString *activityType;
/**
 * Confidence of activity-type estimation as % 0-100
 */
@property (nonatomic, readonly) NSNumber *activityConfidence;
// State
/**
 * YES when recorded location is a sample.  The plugin records multiple locations for particular events, such as "motionchange" in order to determine
 * highest accuracy location before persisting that location to the database and POSTing to your configured #url.  Location "samples" are not persisted
 * to the plugin's database, nor are they posted to your configured #url
 */
@property (nonatomic, readonly) BOOL isSample;
/**
 * YES when this location was provided to a heartbeat event
 */
@property (nonatomic, readonly) BOOL isHeartbeat;
/**
 * The current value of the odometer in meters
 */
@property (nonatomic, readonly) NSNumber *odometer;
/**
 * The event associated with this location: location|motionchange|heartbeat|providerchange
 */
@property (nonatomic, readonly) NSString *event;

-(instancetype) initWithLocation:(CLLocation*)location;
-(instancetype) initWithLocation:(CLLocation*)location type:(enum tsLocationType)type extras:(NSDictionary*)extras;
-(instancetype) initWithLocation:(CLLocation*)location geofence:(NSDictionary*)geofenceData;

/**
 * Render location-data as JSON string
 */
- (NSData*)toJson:(NSError**)error;
/**
 * Render location-data as NSDictionary
 */
- (NSDictionary*)toDictionary;

@end
