//
//  RNBackgroundGeolocation.m
//  RNBackgroundGeolocation
//
//  Created by Christopher Scott on 2015-04-19.
//  Copyright (c) 2015 Transistor Software. All rights reserved.
//
#import "RNBackgroundGeolocation.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

@implementation RNBackgroundGeolocation {
    TSLocationManager *locationManager;
}

@synthesize bridge = _bridge;

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
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onStationaryLocation:) name:@"TSLocationManager.stationary" object:nil];
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

RCT_EXPORT_METHOD(setConfig:(NSDictionary*)config)
{
    RCTLogInfo(@"- RCTBackgroundGeoLocation setConfig");
    [locationManager setConfig:config];
}

/**
 * Turn on background geolocation
 */
RCT_EXPORT_METHOD(start)
{
    RCTLogInfo(@"- RCTBackgroundGeoLocation start");
    [locationManager start];
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
    [locationManager onPaceChange:moving];
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
RCT_EXPORT_METHOD(finish)
{
    NSLog(@"- RCTBackgroundGeoLocation finish");
    [locationManager finish];
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
    CLLocation *location = notification.object;
    NSDictionary *locationData = [locationManager locationToDictionary:location];
    
    [_bridge.eventDispatcher sendDeviceEventWithName:@"locationchanged" body:locationData];
}

- (void) onStationaryLocation:(NSNotification*)notification
{
    RCTLogInfo(@"- RCTBackgroundGeoLocation onStationaryLocation");
    CLLocation *location = notification.object;
    NSDictionary *locationData = [locationManager locationToDictionary:location];
    
    [_bridge.eventDispatcher sendDeviceEventWithName:@"stationary" body:locationData];
    
    [locationManager stopBackgroundTask];
}

- (void)dealloc
{
    
}

@end
