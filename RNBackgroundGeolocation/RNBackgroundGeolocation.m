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

static NSString *const TS_LOCATION_MANAGER_TAG = @"TSLocationManager";

@implementation RNBackgroundGeolocation {
    //TSLocationManager *locationManager;
}

@synthesize bridge = _bridge;
@synthesize currentPositionListeners, syncCallback, locationManager;

RCT_EXPORT_MODULE();

/**
 * Create TSLocationManager instance
 */
-(instancetype)init
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
RCT_EXPORT_METHOD(configure:(NSDictionary*)config callback:(RCTResponseSenderBlock)callback)
{
    RCTLogInfo(@"- RCTBackgroundGeolocation #configure");
    dispatch_async(dispatch_get_main_queue(), ^{
        [locationManager configure:config];
        [self getState:callback];
    });
}

RCT_EXPORT_METHOD(setConfig:(NSDictionary*)config)
{
    RCTLogInfo(@"- RCTBackgroundGeoLocation #setConfig");
    [locationManager setConfig:config];
}

RCT_EXPORT_METHOD(getState:(RCTResponseSenderBlock)callback)
{
    RCTLogInfo(@"- RCTBackgroundGeoLocation #getState");
    NSDictionary *state = [locationManager getState];
    callback(@[state]);
}

/**
 * Turn on background geolocation
 */
RCT_EXPORT_METHOD(start:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    RCTLogInfo(@"- RCTBackgroundGeoLocation #start");
    dispatch_async(dispatch_get_main_queue(), ^{
        [locationManager start];
        success(@[]);
    });
}
/**
 * Turn it off
 */
RCT_EXPORT_METHOD(stop)
{
    RCTLogInfo(@"- RCTBackgroundGeoLocation #stop");
    [locationManager stop];
}

/**
 * Change pace to moving/stopped
 * @param {Boolean} isMoving
 */
RCT_EXPORT_METHOD(changePace:(BOOL)moving success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    RCTLogInfo(@"- RCTBackgroundGeoLocation #onPaceChange");
    [locationManager changePace:moving];
    success(@[]);
}

RCT_EXPORT_METHOD(beginBackgroundTask:(RCTResponseSenderBlock)callback)
{
    RCTLogInfo(@"- RCTBackgroundGeolocation #beginBackgroundTask");
    callback(@[@([locationManager createBackgroundTask])]);
}
/**
 * Called by js to signify the end of a background-geolocation event
 */
RCT_EXPORT_METHOD(finish:(int)taskId)
{
    NSLog(@"- RCTBackgroundGeoLocation #finish");
    [locationManager stopBackgroundTask:taskId];
}

RCT_EXPORT_METHOD(getCurrentPosition:(NSDictionary*)options success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    if (currentPositionListeners == nil) {
        currentPositionListeners = [[NSMutableArray alloc] init];
    }
    NSDictionary *callbacks = @{@"success":success, @"failure":failure};
    [currentPositionListeners addObject:callbacks];
    [locationManager updateCurrentPosition:options];
}

RCT_EXPORT_METHOD(getLocations:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    NSArray *rs = [locationManager getLocations];
    success(@[rs]);
}

RCT_EXPORT_METHOD(sync:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    if (syncCallback != nil) {
        failure(@[@"A sync action is already in progress."]);
        return;
    }
    
    NSArray* locations = [locationManager sync];
    if (locations) {
        // Important to set these before we execute #sync since this fires a *very fast* async NSNotification event!
        syncCallback    = @{@"success":success, @"failure":failure};
    } else {
        syncCallback    = nil;
        failure(@[@"Sync failed.  Is there a network connection?"]);
    }
}

RCT_EXPORT_METHOD(getGeofences:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    NSArray *geofences = [locationManager getGeofences];
    NSMutableArray *rs = [NSMutableArray arrayWithCapacity:[geofences count]];
    
    for(CLCircularRegion *geofence in geofences) {
        NSDictionary *geofenceDictionary = @{
            @"identifier": geofence.identifier,
            @"radius":     [NSNumber numberWithDouble:geofence.radius],
            @"latitude":   [NSNumber numberWithDouble:geofence.center.latitude],
            @"longitude":  [NSNumber numberWithDouble:geofence.center.longitude]
        };
        [rs addObject:geofenceDictionary];
    }
    success(@[rs]);
}

RCT_EXPORT_METHOD(addGeofence:(NSDictionary*) config success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    NSString *identifier        = [config objectForKey:@"identifier"];
    CLLocationDegrees latitude  = [[config objectForKey:@"latitude"] doubleValue];
    CLLocationDegrees longitude = [[config objectForKey:@"longitude"] doubleValue];
    CLLocationDistance radius   = [[config objectForKey:@"radius"] doubleValue];
    BOOL notifyOnEntry          = [[config objectForKey:@"notifyOnEntry"] boolValue];
    BOOL notifyOnExit           = [[config objectForKey:@"notifyOnExit"] boolValue];
    
    [locationManager addGeofence:identifier radius:radius latitude:latitude longitude:longitude notifyOnEntry:notifyOnEntry notifyOnExit:notifyOnExit];
    RCTLogInfo(@"addGeofence %@", config);
    success(@[]);
}

RCT_EXPORT_METHOD(removeGeofence:(NSString*)identifier success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    [locationManager removeGeofence:identifier];
    RCTLogInfo(@"removeGeofence");
    success(@[]);
}

RCT_EXPORT_METHOD(getOdometer:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    NSNumber *distance = @(locationManager.odometer);
    success(@[distance]);
}

RCT_EXPORT_METHOD(resetOdometer:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    [locationManager resetOdometer];
    success(@[]);
}

RCT_EXPORT_METHOD(clearDatabase:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    RCTLogInfo(@"clearDatabase");
    BOOL result = [locationManager clearDatabase];
    if (result) {
        success(@[]);
    } else {
        failure(@[]);
    }
}
RCT_EXPORT_METHOD(playSound:(int)soundId)
{
    [locationManager playSound: soundId];
}

-(void (^)(CLLocation *location, enum tsLocationType, BOOL isMoving)) createLocationChangedHandler {
    return ^(CLLocation *location, enum tsLocationType type, BOOL isMoving) {
        RCTLogInfo(@"- RCTBackgroundGeoLocation onLocationChanged");
        
        NSDictionary *locationData = [locationManager locationToDictionary:location type:type];
        
        if (type != TS_LOCATION_TYPE_SAMPLE && [currentPositionListeners count]) {
            for (NSDictionary *callback in self.currentPositionListeners) {
                RCTResponseSenderBlock success = [callback objectForKey:@"success"];
                success(@[locationData]);
            }
            [self.currentPositionListeners removeAllObjects];
        }
        [self sendEvent:@"location" dictionary:locationData];
    };
}

-(void (^)(CLLocation *location, BOOL moving)) createMotionChangedHandler {
    return ^(CLLocation *location, BOOL moving) {
        NSDictionary *locationData  = [locationManager locationToDictionary:location];
        RCTLogInfo(@"- onMotionChanage: %@",locationData);
        [self sendEvent:@"motionchange" dictionary:locationData];
    };
}

-(void (^)(CLCircularRegion *region, CLLocation *location, NSString *action)) createGeofenceHandler {
    return ^(CLCircularRegion *region, CLLocation *location, NSString *action) {
        NSDictionary *params = @{
            @"identifier": region.identifier,
            @"action": action,
            @"location": [locationManager locationToDictionary:location]
        };
        [self sendEvent:@"geofence" dictionary: params];
        RCTLogInfo(@"- onEnterGeofence: %@", params);
    };
}

-(void (^)(NSArray *locations)) createSyncCompleteHandler {
    return ^(NSArray *locations) {
        RCTLogInfo(@"- onSyncComplete");
        [self sendEvent:@"sync" array:@[locations]];
        
        if (syncCallback) {
            RCTResponseSenderBlock success = [syncCallback objectForKey:@"success"];
            success(@[locations]);
            syncCallback = nil;
        }
    };
}

-(void (^)(NSInteger statusCode, NSDictionary *requestData, NSData *responseData, NSError *error)) createHttpResponseHandler {
    return ^(NSInteger statusCode, NSDictionary *requestData, NSData *responseData, NSError *error) {
        NSDictionary *response  = @{@"status":@(statusCode), @"responseText":[[NSString alloc]initWithData:responseData encoding:NSUTF8StringEncoding]};
        RCTLogInfo(@"- onHttpResponse");
        [self sendEvent:@"http" dictionary:response];
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
        [self sendEvent:@"error" dictionary:@{@"type":type, @"code":@(error.code)}];
    };
}

-(void) sendEvent:(NSString*)name dictionary:(NSDictionary*)dictionary
{
    NSString *event = [NSString stringWithFormat:@"%@:%@", TS_LOCATION_MANAGER_TAG, name];
    [_bridge.eventDispatcher sendDeviceEventWithName:event body:dictionary];
}
-(void) sendEvent:(NSString*)name array:(NSArray*)array
{
    NSString *event = [NSString stringWithFormat:@"%@:%@", TS_LOCATION_MANAGER_TAG, name];
    [_bridge.eventDispatcher sendDeviceEventWithName:event body:array];
}


- (void)dealloc
{
    NSLog(@"- RNBackgroundGeolocation dealloc");
}

@end
