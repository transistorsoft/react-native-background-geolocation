//
//  GeofenceManager.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2016-10-04.
//  Copyright © 2016 Transistor Software. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>
#import "TSGeofenceEvent.h"
#import "TSGeofencesChangeEvent.h"

extern NSString *const STATIONARY_REGION_IDENTIFIER;

@interface TSGeofenceManager : NSObject<CLLocationManagerDelegate>
{
    
}

@property (copy) void (^onGeofence) (TSGeofenceEvent* event);

@property (nonatomic) BOOL isMoving;
@property (nonatomic) BOOL enabled;
@property (nonatomic) BOOL evaluated;
@property (nonatomic) BOOL isRequestingLocation;
@property (nonatomic) BOOL isMonitoringSignificantChanges;
@property (nonatomic) BOOL willEvaluateProximity;
@property (nonatomic) CLLocation *lastLocation;

@property (nonatomic, readonly) NSMutableArray *geofencesChangeListeners;
@property (nonatomic, readonly) NSMutableArray *geofenceListeners;


// Event listeners
-(void) onGeofencesChange:(void (^)(TSGeofencesChangeEvent*))success;
-(void) onGeofence:(void (^)(TSGeofenceEvent*))success;
-(void) un:(NSString*)event callback:(void(^)(id))callback;
-(void) removeListeners;
-(void) start;
-(void) stop;
-(void) ready;
-(void) setLocation:(CLLocation*)location isMoving:(BOOL)isMoving;
-(void) setProximityRadius:(CLLocationDistance)radius;
-(BOOL) isMonitoringRegion:(CLCircularRegion*)region;
-(void) didBecomeStationary:(CLLocation*)locaiton;
-(NSString*) identifierFor:(CLCircularRegion*)region;
-(void) create:(NSArray*)geofences success:(void (^)(void))success failure:(void (^)(NSString*))failure;
-(void) destroy:(NSArray*)identifiers success:(void (^)(void))success failure:(void (^)(NSString*))failure;
@end
