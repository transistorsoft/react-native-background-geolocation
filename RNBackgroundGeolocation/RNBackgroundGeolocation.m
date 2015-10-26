//
//  RNBackgroundGeolocation.m
//  RNBackgroundGeolocation
//
//  Created by Christopher Scott on 2015-04-19.
//  Copyright (c) 2015 Transistor Software. All rights reserved.
//
#import "RNBackgroundGeolocation.h"
#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>
#import <UIKit/UIKit.h>

#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

@implementation RNBackgroundGeolocation {
    TSLocationManager *locationManager;
}

@synthesize bridge = _bridge;
@synthesize currentPositionListeners;

RCT_EXPORT_MODULE();

/**
 * Create TSLocationManager instance
 */
-(id)init
{
    self = [super init];
    if (self) {
        locationManager = [[TSLocationManager alloc] init];
                
        locationManager.locationChangedBlock  = [self createLocationChangedHandler];
        locationManager.motionChangedBlock    = [self createMotionChangedHandler];
        locationManager.geofenceBlock         = [self createGeofenceHandler];
        locationManager.syncCompleteBlock     = [self createSyncCompleteHandler];
        locationManager.httpResponseBlock     = [self createHttpResponseHandler];
        locationManager.errorBlock            = [self createErrorHandler];
    }
    return self;
}

/**
 * configure plugin
 */
RCT_EXPORT_METHOD(configure:(NSDictionary*)config)
{
    RCTLogInfo(@"- RCTBackgroundGeolocation #configure");
    dispatch_async(dispatch_get_main_queue(), ^{
        [locationManager configure:config];
    });
}

RCT_EXPORT_METHOD(onStationary)
{
    
}
/*
RCT_EXPORT_METHOD(addListener:(NSString*)name callback:(RCTResponseSenderBlock)callback)
{
    RCTLogInfo(@"- addListener %@", name);
    
}
 */
RCT_EXPORT_METHOD(setConfig:(NSDictionary*)config)
{
    RCTLogInfo(@"- RCTBackgroundGeoLocation setConfig");
    [locationManager setConfig:config];
}

RCT_EXPORT_METHOD(getState:(RCTResponseSenderBlock)callback)
{
    RCTLogInfo(@"- getState");
    NSDictionary *state = [locationManager getState];
    callback(@[state]);
    
}

/**
 * Turn on background geolocation
 */
RCT_EXPORT_METHOD(start:(RCTResponseSenderBlock)callback)
{
    RCTLogInfo(@"- RCTBackgroundGeoLocation start");
    dispatch_async(dispatch_get_main_queue(), ^{
        [locationManager start];
        callback(@[]);
    });
}
/**
 * Turn it off
 */
RCT_EXPORT_METHOD(stop)
{
    RCTLogInfo(@"- RCTBackgroundGeoLocation stop");
    [locationManager stop];
}

/**
 * Change pace to moving/stopped
 * @param {Boolean} isMoving
 */
RCT_EXPORT_METHOD(changePace:(BOOL)moving)
{
    RCTLogInfo(@"- RCTBackgroundGeoLocation onPaceChange");
    [locationManager changePace:moving];
}

/**
 * Fetches current stationaryLocation
 * TODO
 */
RCT_EXPORT_METHOD(getStationaryLocation)
{
    NSLog(@"- RCTBackgroundGeoLocation getStationaryLocation");
}

/**
 * Called by js to signify the end of a background-geolocation event
 */
RCT_EXPORT_METHOD(finish:(int)taskId)
{
    NSLog(@"- RCTBackgroundGeoLocation finish");
    [locationManager stopBackgroundTask:taskId];
}

RCT_EXPORT_METHOD(getCurrentPosition:(NSDictionary*)options callback:(RCTResponseSenderBlock)callback failure:(RCTResponseSenderBlock)failure)
{
    if (currentPositionListeners == nil) {
        currentPositionListeners = [[NSMutableArray alloc] init];
    }
    NSDictionary *callbacks = @{@"success":callback, @"failure":failure};
    [currentPositionListeners addObject:callbacks];
    [locationManager updateCurrentPosition:options];
}

RCT_EXPORT_METHOD(getOdometer:(RCTResponseSenderBlock)callback)
{
    NSNumber *distance = @(locationManager.odometer);
    callback(@[distance]);
}

RCT_EXPORT_METHOD(getGeofences:(RCTResponseSenderBlock)callback)
{
    NSArray *geofences = [locationManager getGeofences];
    NSMutableArray *geofencesForReact = [NSMutableArray arrayWithCapacity:[geofences count]];

    for(CLCircularRegion *geofence in geofences) {
        NSDictionary *geofenceDictionary = @{
          @"identifier": geofence.identifier,
          @"radius":     [NSNumber numberWithDouble:geofence.radius],
          @"latitude":   [NSNumber numberWithDouble:geofence.center.latitude],
          @"longitude":  [NSNumber numberWithDouble:geofence.center.longitude]
        };
        [geofencesForReact addObject:geofenceDictionary];
    }
    callback(geofencesForReact);
}

RCT_EXPORT_METHOD(resetOdometer:(RCTResponseSenderBlock)callback)
{
    locationManager.odometer = 0;
    callback(@[]);
}

RCT_EXPORT_METHOD(addGeofence:(NSString*)identifier radius:(CLLocationDistance)radius latitude:(CLLocationDegrees)latitude longitude:(CLLocationDegrees)longitude notifyOnEntry:(BOOL)notifyOnEntry notifyOnExit:(BOOL)notifyOnExit){
    [locationManager addGeofence:identifier radius:radius latitude:latitude longitude:longitude notifyOnEntry:notifyOnEntry notifyOnExit:notifyOnExit];
    RCTLogInfo(@"addGeofence");
}

RCT_EXPORT_METHOD(removeGeofence:(NSString*)identifier)
{
    [locationManager removeGeofence:identifier];
    RCTLogInfo(@"removeGeofence");
}

/**@
 * Resume.  Turn background off
 */
-(void) onResume:(NSNotification *) notification
{
    NSLog(@"- RCTBackgroundGeoLocation resume");
}

/**@
 * Termination. Checks to see if it should turn off
 */
-(void) onAppTerminate
{
    NSLog(@"- RCTBackgroundGeoLocation appTerminate");
}

/**
 * location handler from BackgroundGeolocation
 */
-(void (^)(CLLocation *location, BOOL moving)) createLocationChangedHandler {
    return ^(CLLocation *location, BOOL moving) {
        RCTLogInfo(@"- RCTBackgroundGeoLocation onLocationChanged");
        
        NSDictionary *locationData = [locationManager locationToDictionary:location];
        
        if ([currentPositionListeners count]) {
            for (NSDictionary *callback in self.currentPositionListeners) {
                RCTResponseSenderBlock success = [callback objectForKey:@"success"];
                success(@[locationData]);
            }
            [self.currentPositionListeners removeAllObjects];
        }
        [_bridge.eventDispatcher sendDeviceEventWithName:@"location" body:locationData];
    };
}

-(void (^)(CLLocation *location, BOOL moving)) createMotionChangedHandler {
    return ^(CLLocation *location, BOOL moving) {
        NSDictionary *locationData  = [locationManager locationToDictionary:location];
        
        RCTLogInfo(@"- onMotionChanage: %@",locationData);
        [_bridge.eventDispatcher sendDeviceEventWithName:@"motionchange" body:locationData];
    };
}

-(void (^)(CLCircularRegion *region, CLLocation *location, NSString *action)) createGeofenceHandler {
    return ^(CLCircularRegion *region, CLLocation *location, NSString *action) {
        NSDictionary *params = @{
            @"identifier": region.identifier,
            @"action": action,
            @"location": [locationManager locationToDictionary:location]
        };
        [_bridge.eventDispatcher sendDeviceEventWithName:@"geofence" body:params];
        RCTLogInfo(@"- onEnterGeofence: %@", params);
    };
}

-(void (^)(NSArray *locations)) createSyncCompleteHandler {
    return ^(NSArray *locations) {
        RCTLogInfo(@"- onSyncComplete");
        [_bridge.eventDispatcher sendDeviceEventWithName:@"sync" body:@[locations]];
    };
}

-(void (^)(NSInteger statusCode, NSDictionary *requestData, NSData *responseData, NSError *error)) createHttpResponseHandler {
    return ^(NSInteger statusCode, NSDictionary *requestData, NSData *responseData, NSError *error) {
        BOOL success = (statusCode >= 200 && statusCode <= 204);
        NSDictionary *response  = @{@"status":@(statusCode), @"responseText":[[NSString alloc]initWithData:responseData encoding:NSUTF8StringEncoding]};
        RCTLogInfo(@"- onHttpResponse");
        [_bridge.eventDispatcher sendDeviceEventWithName:@"sync" body:response];
    };
}

-(void (^)(NSString *type, NSError *error)) createErrorHandler {
    return ^(NSString *type, NSError *error) {
        RCTLogInfo(@" - onLocationManagerError: %@", error);

        if ([type isEqualToString:@"location"]) {
            if ([currentPositionListeners count]) {
                for (NSDictionary *callback in self.currentPositionListeners) {
                    RCTResponseSenderBlock failure = [callback objectForKey:@"failure"];
                    failure(@[@(error.code)]);
                }
                [self.currentPositionListeners removeAllObjects];
            }
        }
        [_bridge.eventDispatcher sendDeviceEventWithName:@"error" body:@[type, @(error.code)]];
    };
}

- (void)dealloc
{
    
}

@end
