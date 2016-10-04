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

static NSString *const EVENT_LOCATIONCHANGE = @"location";
static NSString *const EVENT_WATCHPOSITION = @"watchposition";
static NSString *const EVENT_PROVIDERCHANGE = @"providerchange";
static NSString *const EVENT_MOTIONCHANGE = @"motionchange";
static NSString *const EVENT_ACTIVITYCHANGE = @"activitychange";
static NSString *const EVENT_ERROR = @"error";
static NSString *const EVENT_HTTP = @"http";
static NSString *const EVENT_SCHEDULE = @"schedule";
static NSString *const EVENT_GEOFENCE = @"geofence";
static NSString *const EVENT_SYNC = @"sync";
static NSString *const EVENT_HEARTBEAT = @"heartbeat";


@implementation RNBackgroundGeolocation {
    NSMutableArray *currentPositionListeners;
}

@synthesize syncCallback, locationManager;
@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

/**
 * Create TSLocationManager instance
 */
-(instancetype)init
{
    self = [super init];
    if (self) {
        locationManager = [TSLocationManager sharedInstance];
        locationManager.locationChangedBlock  = [self createLocationChangedHandler];
        locationManager.motionChangedBlock    = [self createMotionChangedHandler];
        locationManager.activityChangedBlock  = [self createActivityChangedHandler];
        locationManager.heartbeatBlock        = [self createHeartbeatHandler];
        locationManager.geofenceBlock         = [self createGeofenceHandler];
        locationManager.syncCompleteBlock     = [self createSyncCompleteHandler];
        locationManager.httpResponseBlock     = [self createHttpResponseHandler];
        locationManager.errorBlock            = [self createErrorHandler];
        locationManager.scheduleBlock         = [self createScheduleHandler];
        locationManager.authorizationChangedBlock = [self createAuthorizationChangedHandler];

        // Provide reference to rootViewController for #emailLog method.
        UIViewController *root = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
        locationManager.viewController = root;
    }

    return self;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[
        [self eventName:EVENT_LOCATIONCHANGE],
        [self eventName:EVENT_PROVIDERCHANGE],
        [self eventName:EVENT_MOTIONCHANGE],
        [self eventName:EVENT_ACTIVITYCHANGE],
        [self eventName:EVENT_ERROR],
        [self eventName:EVENT_HTTP],
        [self eventName:EVENT_SCHEDULE],
        [self eventName:EVENT_GEOFENCE],
        [self eventName:EVENT_SYNC],
        [self eventName:EVENT_HEARTBEAT]
    ];
}

/**
 * configure plugin
 */
RCT_EXPORT_METHOD(configure:(NSDictionary*)config success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    RCTLogInfo(@"- RCTBackgroundGeolocation #configure");
    dispatch_async(dispatch_get_main_queue(), ^{
        NSDictionary *state = [locationManager configure:config];
        success(@[state]);
    });
}

RCT_EXPORT_METHOD(setConfig:(NSDictionary*)config success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    RCTLogInfo(@"- RCTBackgroundGeoLocation #setConfig");
    [locationManager setConfig:config];
    success(@[[self getState]]);
}

-(NSDictionary*)getState
{
    return [locationManager getState];
}

RCT_EXPORT_METHOD(getState:(RCTResponseSenderBlock)callback failure:(RCTResponseSenderBlock)failure)
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
RCT_EXPORT_METHOD(stop:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    RCTLogInfo(@"- RCTBackgroundGeoLocation #stop");
    [locationManager stop];
    success(@[]);
}

/**
 * Start schedule
 */
RCT_EXPORT_METHOD(startSchedule:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    RCTLogInfo(@"- RCTBackgroundGeoLocation #startSchedule");
    dispatch_async(dispatch_get_main_queue(), ^{
        [locationManager startSchedule];
        success(@[@(YES)]);
    });
}

/**
 * Stop schedule
 */
RCT_EXPORT_METHOD(stopSchedule:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    RCTLogInfo(@"- RCTBackgroundGeoLocation #stopSchedule");
    dispatch_async(dispatch_get_main_queue(), ^{
        [locationManager stopSchedule];
        success(@[@(NO)]);
    });
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
    RCTLogInfo(@"- RCTBackgroundGeoLocation #finish");
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

RCT_EXPORT_METHOD(watchPosition:(NSDictionary*)options success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    [locationManager watchPosition:options];
    success(@[]);
}

RCT_EXPORT_METHOD(stopWatchPosition:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    [locationManager stopWatchPosition];
    success(@[]);
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

RCT_EXPORT_METHOD(addGeofences:(NSArray*) geofences success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    [locationManager addGeofences:geofences];
    RCTLogInfo(@"addGeofences");
    success(@[]);
}


RCT_EXPORT_METHOD(removeGeofence:(NSString*)identifier success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    [locationManager removeGeofence:identifier];
    RCTLogInfo(@"removeGeofence");
    success(@[]);
}

RCT_EXPORT_METHOD(removeGeofences:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    [locationManager removeGeofences];
    RCTLogInfo(@"removeGeofences");
    success(@[]);
}

RCT_EXPORT_METHOD(getOdometer:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    NSNumber *distance = @([locationManager getOdometer]);
    success(@[distance]);
}

RCT_EXPORT_METHOD(resetOdometer:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    [locationManager resetOdometer];
    success(@[]);
}

RCT_EXPORT_METHOD(destroyLocations:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    RCTLogInfo(@"destroyLocations");
    BOOL result = [locationManager destroyLocations];
    if (result) {
        success(@[]);
    } else {
        failure(@[]);
    }
}
RCT_EXPORT_METHOD(getCount:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    NSLog(@"- getCount");
    int count = [locationManager getCount];
    if (count >= 0) {
        success(@[@(count)]);
    } else {
        failure(@[]);
    }
}

RCT_EXPORT_METHOD(insertLocation:(NSDictionary*)params success:(RCTResponseSenderBlock)successCallback failure:(RCTResponseSenderBlock)failureCallback)
{
    NSLog(@"- insertLocation %@", params);
    BOOL success = [locationManager insertLocation: params];
    if (success) {
        successCallback(@[]);
    } else {
        failureCallback(@[]);
    }
}

RCT_EXPORT_METHOD(getLog:(RCTResponseSenderBlock)successCallback failure:(RCTResponseSenderBlock)failureCallback)
{
    NSString *log = [locationManager getLog];
    if (log != nil) {
        successCallback(@[log]);
    } else {
        failureCallback(@[@(500)]);
    }
}

RCT_EXPORT_METHOD(destroyLog:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    RCTLogInfo(@"destroyLog");
    BOOL result = [locationManager destroyLog];
    if (result) {
        success(@[]);
    } else {
        failure(@[]);
    }
}

RCT_EXPORT_METHOD(emailLog:(NSString*)email success:(RCTResponseSenderBlock)successCallback failure:(RCTResponseSenderBlock)failureCallback)
{
    [locationManager emailLog:email];
    successCallback(@[]);
}

RCT_EXPORT_METHOD(playSound:(int)soundId)
{
    [locationManager playSound: soundId];
}

-(void (^)(NSDictionary *locationData, enum tsLocationType, BOOL isMoving)) createLocationChangedHandler {
    return ^(NSDictionary *locationData, enum tsLocationType type, BOOL isMoving) {
        RCTLogInfo(@"- RCTBackgroundGeoLocation onLocationChanged");

        if (type == TS_LOCATION_TYPE_WATCH) {
            [self sendEvent:EVENT_WATCHPOSITION body:locationData];
        } else if (type != TS_LOCATION_TYPE_SAMPLE && [currentPositionListeners count]) {
            for (NSDictionary *callback in currentPositionListeners) {
                RCTResponseSenderBlock success = [callback objectForKey:@"success"];
                success(@[locationData]);
            }
            [currentPositionListeners removeAllObjects];
        }
        [self sendEvent:EVENT_LOCATIONCHANGE body:locationData];
    };
}

-(void (^)(NSDictionary *locationData, BOOL moving)) createMotionChangedHandler {
    return ^(NSDictionary *locationData, BOOL moving) {
        NSDictionary *params = @{
            @"isMoving": @(moving),
            @"location": locationData
        };
        RCTLogInfo(@"- onMotionChanage");
        [self sendEvent:EVENT_MOTIONCHANGE body:params];
    };
}
-(void) sendEvent:(NSString*)event body:(id)body
{
    [_bridge.eventDispatcher sendDeviceEventWithName:[self eventName:event] body:body];

    // NEW RCTEventEmitter is buggy.
    //[self sendEventWithName:[self eventName:event] body:body];

}

-(void (^)(NSString* activityName)) createActivityChangedHandler {
    return ^(NSString* activityName) {
        RCTLogInfo(@"- onActivityChange");
        [self sendEvent:EVENT_ACTIVITYCHANGE body:activityName];
    };
}

-(void (^)(NSString* motionType, NSDictionary *locationData)) createHeartbeatHandler {
    return ^(NSString* motionType, NSDictionary *locationData) {
        RCTLogInfo(@"- onHeartbeat");
        NSDictionary *params = @{
            @"motionType": motionType,
            @"location": locationData
        };
        [self sendEvent:EVENT_HEARTBEAT body:params];
    };
}

-(void (^)(CLCircularRegion *region, NSDictionary *locationData, NSString *action)) createGeofenceHandler {
    return ^(CLCircularRegion *region, NSDictionary *locationData, NSString *action) {
        NSDictionary *params = @{
            @"identifier": region.identifier,
            @"action": action,
            @"location": locationData
        };
        [self sendEvent:EVENT_GEOFENCE body:params];
        RCTLogInfo(@"- onEnterGeofence: %@", params);
    };
}

-(void (^)(NSArray *locations)) createSyncCompleteHandler {
    return ^(NSArray *locations) {
        RCTLogInfo(@"- onSyncComplete");
        [self sendEvent:EVENT_SYNC body:locations];
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
        [self sendEvent:EVENT_HTTP body:response];
    };
}

-(void (^)(NSString *type, NSError *error)) createErrorHandler {
    return ^(NSString *type, NSError *error) {
        RCTLogInfo(@" - onLocationManagerError: %@", error);

        if ([type isEqualToString:@"location"]) {
            if ([currentPositionListeners count]) {
                for (NSDictionary *callback in currentPositionListeners) {
                    RCTResponseSenderBlock failure = [callback objectForKey:@"failure"];
                    failure(@[@(error.code)]);
                }
                [currentPositionListeners removeAllObjects];
            }
        }
        [self sendEvent:EVENT_ERROR body: @{@"type":type, @"code":@(error.code)}];
    };
}

-(void (^)(CLAuthorizationStatus status)) createAuthorizationChangedHandler {
    return ^(CLAuthorizationStatus status) {
        RCTLogInfo(@"- providerchange");
        BOOL enabled = (status == kCLAuthorizationStatusAuthorized);
        NSDictionary *provider = @{@"enabled":@(enabled), @"network":@(YES), @"gps":@(YES)};
        [self sendEvent:EVENT_PROVIDERCHANGE body:provider];
    };
}

-(void (^)(TSSchedule *schedule)) createScheduleHandler {
    return ^(TSSchedule *schedule) {
        RCTLogInfo(@" - Schedule event: %@", schedule);
        [self sendEvent:EVENT_SCHEDULE body:[locationManager getState]];
    };
}

-(NSString*) eventName:(NSString*)name
{
    return [NSString stringWithFormat:@"%@:%@", TS_LOCATION_MANAGER_TAG, name];
}

- (void)dealloc
{
    RCTLogInfo(@"- RNBackgroundGeolocation dealloc");
    locationManager = nil;
}

@end
