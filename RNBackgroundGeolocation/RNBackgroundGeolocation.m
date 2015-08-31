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
        
        // Capture #location & #stationary events from TSLocationManager
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onLocationChanged:) name:@"TSLocationManager.location" object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onMotionChange:) name:@"TSLocationManager.motionchange" object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onEnterGeofence:) name:@"TSLocationManager.geofence" object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onSyncComplete:) name:@"TSLocationManager.sync" object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onLocationManagerError:) name:@"TSLocationManager.error" object:nil];
        
    }
    return self;
}

/**
 * configure plugin
 */
RCT_EXPORT_METHOD(configure:(NSDictionary*)config)
{
    RCTLogInfo(@"- RCTBackgroundGeolocation #configure");
    [locationManager configure:config];
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

/**
 * Turn on background geolocation
 */
RCT_EXPORT_METHOD(start:(RCTResponseSenderBlock)callback)
{
    RCTLogInfo(@"- RCTBackgroundGeoLocation start");
    [locationManager start];
    callback(@[]);
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

RCT_EXPORT_METHOD(getCurrentPosition:(RCTResponseSenderBlock)callback)
{
    if (currentPositionListeners == nil) {
        currentPositionListeners = [[NSMutableArray alloc] init];
    }
    [currentPositionListeners addObject:callback];
    [locationManager updateCurrentPosition];
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
- (void)onLocationChanged:(NSNotification*)notification {
    RCTLogInfo(@"- RCTBackgroundGeoLocation onLocationChanged");
    
    CLLocation *location = [notification.userInfo objectForKey:@"location"];
    
    NSDictionary *locationData = [locationManager locationToDictionary:location];
    
    if ([currentPositionListeners count]) {
        for (RCTResponseSenderBlock callback in self.currentPositionListeners) {
            callback(@[locationData]);
        }
        [self.currentPositionListeners removeAllObjects];
    }
    [_bridge.eventDispatcher sendDeviceEventWithName:@"location" body:locationData];
}

- (void) onMotionChange:(NSNotification*)notification
{
    CLLocation *location        = [notification.userInfo objectForKey:@"location"];
    NSDictionary *locationData  = [locationManager locationToDictionary:location];
    
    RCTLogInfo(@"- onMotionChanage: %@",locationData);
    [_bridge.eventDispatcher sendDeviceEventWithName:@"motionchange" body:locationData];
}

- (void) onEnterGeofence:(NSNotification*)notification
{
    CLCircularRegion *region = [notification.userInfo objectForKey:@"geofence"];
    
    NSDictionary *params = @{
        @"identifier": region.identifier,
        @"action": [notification.userInfo objectForKey:@"action"]
    };
    
    [_bridge.eventDispatcher sendDeviceEventWithName:@"geofence" body:params];
    RCTLogInfo(@"- onEnterGeofence: %@", params);
}

- (void) onSyncComplete:(NSNotification*)notification
{
    RCTLogInfo(@"- onSyncComplete");
    [_bridge.eventDispatcher sendDeviceEventWithName:@"sync" body:@[[notification.userInfo objectForKey:@"locations"]]];
}

- (void) onLocationManagerError:(NSNotification*)notification
{
    RCTLogInfo(@" - onLocationManagerError: %@", notification.userInfo);
    
    NSString *errorType = [notification.userInfo objectForKey:@"type"];
    if ([errorType isEqualToString:@"location"]) {
        
    }
}

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

@end
