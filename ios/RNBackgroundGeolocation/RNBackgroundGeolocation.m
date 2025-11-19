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
#import <TSLocationManager/TSLocationManager.h>

static NSString *const TS_LOCATION_MANAGER_TAG = @"TSLocationManager";

static NSString *const EVENT_LOCATION           = @"location";
static NSString *const EVENT_WATCHPOSITION      = @"watchposition";
static NSString *const EVENT_PROVIDERCHANGE     = @"providerchange";
static NSString *const EVENT_MOTIONCHANGE       = @"motionchange";
static NSString *const EVENT_ACTIVITYCHANGE     = @"activitychange";
static NSString *const EVENT_GEOFENCESCHANGE    = @"geofenceschange";
static NSString *const EVENT_HTTP               = @"http";
static NSString *const EVENT_SCHEDULE           = @"schedule";
static NSString *const EVENT_GEOFENCE           = @"geofence";
static NSString *const EVENT_HEARTBEAT          = @"heartbeat";
static NSString *const EVENT_POWERSAVECHANGE    = @"powersavechange";
static NSString *const EVENT_CONNECTIVITYCHANGE = @"connectivitychange";
static NSString *const EVENT_ENABLEDCHANGE      = @"enabledchange";
static NSString *const EVENT_NOTIFICATIONACTION = @"notificationaction";
static NSString *const EVENT_AUTHORIZATION      = @"authorization";

@implementation RNBackgroundGeolocation {
    BOOL ready;
}

@synthesize locationManager;

RCT_EXPORT_MODULE();

+(BOOL)requiresMainQueueSetup
{
    return YES;
}

/**
 * Create TSLocationManager instance
 */
-(instancetype)init
{
    self = [super init];
    if (self) {
        ready = NO;

        // Build event-listener blocks
        // TSLocationManager instance
        locationManager = [TSLocationManager sharedInstance];

        // Provide reference to rootViewController for #emailLog method.
        UIViewController *root = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
        locationManager.viewController = root;
    }
    return self;
}

-(void) registerEventListeners {
    __typeof(self) __weak me = self;
    
    [locationManager onLocation:^(TSLocationEvent *event) {
        [me sendEvent:EVENT_LOCATION body:[event toDictionary]];
    } failure:^(NSError *error) {
        [me sendEvent:EVENT_LOCATION body: @{@"error":@(error.code)}];
    }];
    [locationManager onMotionChange:^(TSLocationEvent *event) {
        [me sendEvent:EVENT_MOTIONCHANGE body:@{@"isMoving":@(event.isMoving), @"location":[event toDictionary]}];
    }];
    [locationManager onActivityChange:^(TSActivityChangeEvent *event) {
        NSDictionary *params = @{@"activity": event.activity, @"confidence": @(event.confidence)};
        [me sendEvent:EVENT_ACTIVITYCHANGE body:params];
    }];
    [locationManager onHeartbeat:^(TSHeartbeatEvent *event) {
        [me sendEvent:EVENT_HEARTBEAT body:[event toDictionary]];
    }];
    [locationManager onGeofence:^(TSGeofenceEvent *event) {
        NSMutableDictionary *params = [[event toDictionary] mutableCopy];
        //[params setObject:[event.location toDictionary] forKey:@"location"];
        [me sendEvent:EVENT_GEOFENCE body:params];
    }];
    [locationManager onGeofencesChange:^(TSGeofencesChangeEvent *event) {
        [me sendEvent:EVENT_GEOFENCESCHANGE body:[event toDictionary]];
    }];
    [locationManager onHttp:^(TSHttpEvent *response) {
        NSDictionary *params = @{@"success": @(response.isSuccess), @"status": @(response.statusCode), @"responseText":response.responseText};
        [me sendEvent:EVENT_HTTP body:params];
    }];
    [locationManager onProviderChange:^(TSProviderChangeEvent *event) {
        [me sendEvent:EVENT_PROVIDERCHANGE body:[event toDictionary]];
    }];
    [locationManager onSchedule:^(TSScheduleEvent *event) {
        [me sendEvent:EVENT_SCHEDULE body:event.state];
    }];
    [locationManager onPowerSaveChange:^(TSPowerSaveChangeEvent *event) {
        [me sendEvent:EVENT_POWERSAVECHANGE body:@(event.isPowerSaveMode)];
    }];
    [locationManager onConnectivityChange:^(TSConnectivityChangeEvent *event) {
        NSDictionary *params = @{@"connected":@(event.hasConnection)};
        [me sendEvent:EVENT_CONNECTIVITYCHANGE body:params];
    }];
    [locationManager onEnabledChange:^(TSEnabledChangeEvent *event) {
        [me sendEvent:EVENT_ENABLEDCHANGE body:@(event.enabled)];
    }];
    [locationManager onAuthorization:^(TSAuthorizationEvent *event) {
        [me sendEvent:EVENT_AUTHORIZATION body:[event toDictionary]];
    }];
}

- (NSArray<NSString *> *)supportedEvents {
    return @[
        EVENT_LOCATION,
        EVENT_PROVIDERCHANGE,
        EVENT_MOTIONCHANGE,
        EVENT_ACTIVITYCHANGE,
        EVENT_GEOFENCESCHANGE,
        EVENT_POWERSAVECHANGE,
        EVENT_HTTP,
        EVENT_SCHEDULE,
        EVENT_GEOFENCE,
        EVENT_HEARTBEAT,
        EVENT_WATCHPOSITION,
        EVENT_CONNECTIVITYCHANGE,
        EVENT_ENABLEDCHANGE,
        EVENT_NOTIFICATIONACTION,
        EVENT_AUTHORIZATION
    ];
}

RCT_EXPORT_METHOD(registerPlugin:(NSString*)pluginName)
{
    TSConfig *config = [TSConfig sharedInstance];
    [config registerPlugin:pluginName];
}

RCT_EXPORT_METHOD(reset:(NSDictionary*)params
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    TSConfig *config = [TSConfig sharedInstance];
    @try {
        if ([[params allKeys] count] > 0) {
            [config resetConfig:YES];
            [config updateWithDictionary:params];
        } else {
            [config reset];
        }
        resolve([config toDictionary]);
    }
    @catch (NSException *exception) {
        // Mirror old behaviour: there was no explicit failure path before, so reject with a generic error.
        reject(@"reset_error", exception.reason, nil);
    }
}

/**
 * configure plugin
 */
RCT_EXPORT_METHOD(ready:(NSDictionary*)params
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    BOOL resetFlag = (params[@"reset"]) ? [params[@"reset"] boolValue] : YES;

    // If already ready, behave like before but resolve the promise.
    if (ready) {
        TSConfig *config = [TSConfig sharedInstance];
        if (resetFlag) {
            [locationManager log:@"warn" message:@"#ready already called.  Redirecting to #setConfig"];
            [config updateWithDictionary:params];
        } else {
            [locationManager log:@"warn" message:@"#ready already called.  Ignored Config since reset: false"];
        }
        resolve([config toDictionary]);
        return;
    }

    ready = YES;
    [self registerEventListeners];

    dispatch_async(dispatch_get_main_queue(), ^{
        TSConfig *config = [TSConfig sharedInstance];
        @try {
            if (config.isFirstBoot) {
                [config updateWithDictionary:params];
            } else {
                if (resetFlag) {
                    [config resetConfig:YES];
                    [config updateWithDictionary:params];
                } else if ([params objectForKey:@"authorization"]) {
                    [config batchUpdate:^(TSConfig * _Nonnull cfg) {
                        [cfg.authorization updateWithDictionary:[params objectForKey:@"authorization"]];
                    }];
                }
            }
            [self.locationManager ready];
            resolve([config toDictionary]);
        }
        @catch (NSException *exception) {
            reject(@"ready_error", exception.reason, nil);
        }
    });
}



RCT_EXPORT_METHOD(removeAllListeners:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [locationManager removeListeners];
    resolve(@(YES));
}


RCT_EXPORT_METHOD(setConfig:(NSDictionary*)params resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    TSConfig *config = [TSConfig sharedInstance];
    [config updateWithDictionary:params];
    resolve([config toDictionary]);
}

-(NSDictionary*)getState
{
    return [locationManager getState];
}

RCT_EXPORT_METHOD(getState:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    NSDictionary *state = [locationManager getState];
    resolve(state);
}

/**
 * Turn on background geolocation
 */
RCT_EXPORT_METHOD(start:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.locationManager start];
        resolve([self.locationManager getState]);
    });
}
/**
 * Turn it off
 */
RCT_EXPORT_METHOD(stop:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [locationManager stop];
    resolve([locationManager getState]);
}

/**
 * Start schedule
 */
RCT_EXPORT_METHOD(startSchedule:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.locationManager startSchedule];
        resolve([self.locationManager getState]);
    });
}

/**
 * Stop schedule
 */
RCT_EXPORT_METHOD(stopSchedule:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.locationManager stopSchedule];
        resolve([self.locationManager getState]);
    });
}

/**
 * Start schedule
 */
RCT_EXPORT_METHOD(startGeofences:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        TSConfig *config = [TSConfig sharedInstance];
        [self.locationManager startGeofences];
        resolve([config toDictionary]);
    });
}

/**
 * Change pace to moving/stopped
 * @param {Boolean} isMoving
 */
RCT_EXPORT_METHOD(changePace:(BOOL)moving resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [locationManager changePace:moving];
    resolve(@(YES));
}

RCT_EXPORT_METHOD(beginBackgroundTask:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve(@([locationManager createBackgroundTask]));
}
/**
 * Called by js to signify the end of a background-geolocation event
 */
RCT_EXPORT_METHOD(finish:(int)taskId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [locationManager stopBackgroundTask:taskId];
    resolve(@(taskId));
}

RCT_EXPORT_METHOD(getCurrentPosition:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    TSCurrentPositionRequest *request = [TSCurrentPositionRequest requestWithSuccess:^(TSLocationEvent *event) {
        resolve([event toDictionary]);
    } failure:^(NSError *error) {
        reject(@"get_current_position_error", error.localizedDescription, error);
    }];

    if (options[@"timeout"]) {
        request.timeout = [options[@"timeout"] doubleValue];
    }
    if (options[@"maximumAge"]) {
        request.maximumAge = [options[@"maximumAge"] doubleValue];
    }
    if (options[@"persist"]) {
        request.persist = [options[@"persist"] boolValue];
    }
    if (options[@"samples"]) {
        request.samples = [options[@"samples"] intValue];
    }
    if (options[@"desiredAccuracy"]) {
        request.desiredAccuracy = [options[@"desiredAccuracy"] doubleValue];
    }
    if (options[@"extras"]) {
        request.extras = options[@"extras"];
    }
    [locationManager getCurrentPosition:request];
}

RCT_EXPORT_METHOD(watchPosition:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    TSWatchPositionRequest *request = [TSWatchPositionRequest requestWithSuccess:^(TSLocationStreamEvent *event) {
        [self sendEvent:EVENT_WATCHPOSITION body:[event toDictionary]];
    } failure:^(NSError *error) {
        // No reject; stream API
    }];

    if (options[@"interval"])           { request.interval = [options[@"interval"] doubleValue]; }
    if (options[@"desiredAccuracy"])    { request.desiredAccuracy = [options[@"desiredAccuracy"] doubleValue]; }
    if (options[@"persist"])            { request.persist = [options[@"persist"] boolValue]; }
    if (options[@"extras"])             { request.extras = options[@"extras"]; }
    if (options[@"timeout"])            { request.timeout = [options[@"timeout"] doubleValue]; }

    long watchId = [locationManager watchPosition:request];
    resolve(@(watchId));
}

RCT_EXPORT_METHOD(stopWatchPosition:(long)watchId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [locationManager stopWatchPosition:watchId];
    resolve(@(YES));
}

RCT_EXPORT_METHOD(getLocations:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [locationManager getLocations:^(NSArray* records) {
        resolve(records);
    } failure:^(NSString* error) {
        reject(@"get_locations_error", error, nil);
    }];
}

RCT_EXPORT_METHOD(sync:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [locationManager sync:^(NSArray* records) {
        resolve(records);
    } failure:^(NSError* error) {
        reject(@"sync_error", error.localizedDescription, error);
    }];
}

RCT_EXPORT_METHOD(getGeofences:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [locationManager getGeofences:^(NSArray* geofences) {
        NSMutableArray *result = [NSMutableArray new];
        for (TSGeofence *geofence in geofences) { [result addObject:[geofence toDictionary]]; }
        resolve(result);
    } failure:^(NSString* error) {
        reject(@"get_geofences_error", error, nil);
    }];
}

RCT_EXPORT_METHOD(getGeofence:(NSString*)identifier resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [locationManager getGeofence:identifier success:^(TSGeofence* geofence) {
        resolve([geofence toDictionary]);
    } failure:^(NSString* error) {
        reject(@"get_geofence_error", error, nil);
    }];
}

RCT_EXPORT_METHOD(geofenceExists:(NSString*)identifier resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [locationManager geofenceExists:identifier callback:^(BOOL exists) {
        resolve(@(exists));
    }];
}

RCT_EXPORT_METHOD(addGeofence:(NSDictionary*)params resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    TSGeofence *geofence = [self buildGeofence:params];
    if (!geofence) {
        NSString *error = [NSString stringWithFormat:@"Invalid geofence data: %@", params];
        reject(@"add_geofence_error", error, nil);
        return;
    }
    [locationManager addGeofence:geofence success:^{
        resolve(@(YES));
    } failure:^(NSString *error) {
        reject(@"add_geofence_error", error, nil);
    }];
}

RCT_EXPORT_METHOD(addGeofences:(NSArray*) data resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    NSMutableArray *geofences = [NSMutableArray new];
    for (NSDictionary *params in data) {
        TSGeofence *geofence = [self buildGeofence:params];
        if (geofence != nil) {
            [geofences addObject:geofence];
        } else {
            NSString *error = [NSString stringWithFormat:@"Invalid geofence data: %@", params];
            reject(@"add_geofences_error", error, nil);
            return;
        }
    }
    [locationManager addGeofences:geofences success:^{
        resolve(@(YES));
    } failure:^(NSString *error) {
        reject(@"add_geofences_error", error, nil);
    }];
}

-(TSGeofence*) buildGeofence:(NSDictionary*)params {

    if (!params[@"identifier"] || (!params[@"vertices"] && (!params[@"radius"] || !params[@"latitude"] || !params[@"longitude"]))) {
        return nil;
    }

    return [[TSGeofence alloc] initWithIdentifier: params[@"identifier"]
                                           radius: [params[@"radius"] doubleValue]
                                         latitude: [params[@"latitude"] doubleValue]
                                        longitude: [params[@"longitude"] doubleValue]
                                    notifyOnEntry: (params[@"notifyOnEntry"]) ? [params[@"notifyOnEntry"] boolValue]  : NO
                                     notifyOnExit: (params[@"notifyOnExit"])  ? [params[@"notifyOnExit"] boolValue] : NO
                                    notifyOnDwell: (params[@"notifyOnDwell"]) ? [params[@"notifyOnDwell"] boolValue] : NO
                                   loiteringDelay: (params[@"loiteringDelay"]) ? [params[@"loiteringDelay"] doubleValue] : 0
                                           extras: params[@"extras"]
                                         vertices: params[@"vertices"]];
}

RCT_EXPORT_METHOD(removeGeofence:(NSString*)identifier resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [locationManager removeGeofence:identifier success:^{
        resolve(@(YES));
    } failure:^(NSString* error) {
        reject(@"remove_geofence_error", error, nil);
    }];
}

RCT_EXPORT_METHOD(removeGeofences:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    NSArray *geofences = @[];
    [locationManager removeGeofences:geofences success:^{
        resolve(@(YES));
    } failure:^(NSString* error) {
        reject(@"remove_geofences_error", error, nil);
    }];
}

RCT_EXPORT_METHOD(getOdometer:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    NSNumber *distance = @([locationManager getOdometer]);
    resolve(distance);
}

RCT_EXPORT_METHOD(setOdometer:(double)value resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    TSCurrentPositionRequest *request = [TSCurrentPositionRequest requestWithSuccess:^(TSLocationEvent *event) {
        resolve([event toDictionary]);
    } failure:^(NSError *error) {
        reject(@"set_odometer_error", error.localizedDescription, error);
    }];
    [locationManager setOdometer:value request:request];
}

RCT_EXPORT_METHOD(destroyLocations:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    BOOL result = [locationManager destroyLocations];
    if (result) {
        resolve(@(YES));
    } else {
        reject(@"destroy_locations_error", @"Failed to destroy locations", nil);
    }
}

RCT_EXPORT_METHOD(destroyLocation:(NSString*)uuid resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [locationManager destroyLocation:uuid success:^{
        resolve(@(YES));
    } failure:^(NSString* error) {
        reject(@"destroy_location_error", error, nil);
    }];
}

RCT_EXPORT_METHOD(getCount:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    int count = [locationManager getCount];
    if (count >= 0) {
        resolve(@(count));
    } else {
        reject(@"get_count_error", @"Unknown count error", nil);
    }
}

RCT_EXPORT_METHOD(insertLocation:(NSDictionary*)params resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [locationManager insertLocation: params success:^(NSString* uuid) {
        resolve(uuid);
    } failure:^(NSString* error) {
        reject(@"insert_location_error", error, nil);
    }];
}

RCT_EXPORT_METHOD(getLog:(NSDictionary*)params resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    LogQuery *query = [[LogQuery alloc] initWithDictionary:params];
    [locationManager getLog:query success:^(NSString* log) {
        resolve(log);
    } failure:^(NSString* error) {
        reject(@"get_log_error", error, nil);
    }];
}

RCT_EXPORT_METHOD(destroyLog:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    BOOL result = [locationManager destroyLog];
    if (result) {
        resolve(@(result));
    } else {
        reject(@"destroy_log_error", @"Failed to destroy log", nil);
    }
}

RCT_EXPORT_METHOD(emailLog:(NSString*)email query:(NSDictionary*)params resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    LogQuery *query = [[LogQuery alloc] initWithDictionary:params];
    [locationManager emailLog:email query:query success:^{
        resolve(@(YES));
    } failure:^(NSString* error) {
        reject(@"email_log_error", error, nil);
    }];
}

RCT_EXPORT_METHOD(uploadLog:(NSString*)url query:(NSDictionary*)params resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    LogQuery *query = [[LogQuery alloc] initWithDictionary:params];
    [locationManager uploadLog:url query:query success:^{
        resolve(@(YES));
    } failure:^(NSString* error) {
        reject(@"upload_log_error", error, nil);
    }];
}


RCT_EXPORT_METHOD(log:(NSString*)level message:(NSString*)message)
{
    [locationManager log:level message:message];
}

RCT_EXPORT_METHOD(getSensors:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    NSDictionary *sensors = @{
        @"platform": @"ios",
        @"accelerometer": @([locationManager isAccelerometerAvailable]),
        @"gyroscope": @([locationManager isGyroAvailable]),
        @"magnetometer": @([locationManager isMagnetometerAvailable]),
        @"motion_hardware": @([locationManager isMotionHardwareAvailable])
    };
    resolve(sensors);
}

RCT_EXPORT_METHOD(getDeviceInfo:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    TSDeviceInfo *deviceInfo = [TSDeviceInfo sharedInstance];
    resolve([deviceInfo toDictionary:@"react-native"]);
}

RCT_EXPORT_METHOD(isPowerSaveMode:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    BOOL isPowerSaveMode = [locationManager isPowerSaveMode];
    resolve(@(isPowerSaveMode));
}

RCT_EXPORT_METHOD(isIgnoringBatteryOptimizations:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve(@(NO));
}

RCT_EXPORT_METHOD(requestSettings:(NSDictionary*)args resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    reject(@"request_settings_error", @"No iOS Implementation", nil);
}

RCT_EXPORT_METHOD(showSettings:(NSDictionary*)args resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    reject(@"show_settings_error", @"No iOS Implementation", nil);
}

RCT_EXPORT_METHOD(getProviderState:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    TSProviderChangeEvent *event = [locationManager getProviderState];
    resolve([event toDictionary]);
}

RCT_EXPORT_METHOD(requestPermission:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [locationManager requestPermission:^(NSNumber *status) {
        resolve(status);
    } failure:^(NSNumber *status) {
        reject(@"request_permission_error", [status stringValue], nil);
    }];
}

RCT_EXPORT_METHOD(requestTemporaryFullAccuracy:(NSString*)purpose resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [locationManager requestTemporaryFullAccuracy:purpose success:^(NSInteger accuracyAuthorization) {
        resolve(@(accuracyAuthorization));
    } failure:^(NSError *error) {
        reject(@"request_full_accuracy_error", error.userInfo[@"NSDebugDescription"], error);
    }];
}

RCT_EXPORT_METHOD(getTransistorToken:(NSString*)orgname username:(NSString*)username url:(NSString*)url resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [TransistorAuthorizationToken findOrCreateWithOrg:orgname
                                             username:username
                                                 url:url
                                            framework:@"react-native"
                                              success:^(TransistorAuthorizationToken *token) {
        resolve([token toDictionary]);
    } failure:^(NSError *error) {
        reject(@"get_transistor_token_error", error.localizedDescription, error);
    }];
}

RCT_EXPORT_METHOD(destroyTransistorToken:(NSString*)url resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [TransistorAuthorizationToken destroyWithUrl:url];
    resolve(@(YES));
}

RCT_EXPORT_METHOD(playSound:(int)soundId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [locationManager playSound: soundId];
    resolve(@(YES));
}

-(void) sendEvent:(NSString*)event body:(id)body
{
    [self sendEventWithName:event body:body];
}

- (void) startObserving {
    // TODO Could possibly execute [self registerEventListeners] here.
    [locationManager log:@"info" message:@"[RNBackgroundGeolocation startObserving]"];
}
- (void) stopObserving {
    // TODO Could possibly execute [locationManager removeListeners] here.
    [locationManager log:@"info" message:@"[RNBackgroundGeolocation stopObserving]"];
}

- (void)dealloc
{
    [locationManager removeListeners];
    locationManager = nil;
}


@end

