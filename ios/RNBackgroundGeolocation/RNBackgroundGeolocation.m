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
    [locationManager onLocation:^(TSLocation *location) {
        [me sendEvent:EVENT_LOCATION body:[location toDictionary]];
    } failure:^(NSError *error) {
        [me sendEvent:EVENT_LOCATION body: @{@"error":@(error.code)}];
    }];
    [locationManager onMotionChange:^(TSLocation *location) {
        [me sendEvent:EVENT_MOTIONCHANGE body:@{@"isMoving":@(location.isMoving), @"location":[location toDictionary]}];
    }];
    [locationManager onActivityChange:^(TSActivityChangeEvent *event) {
        NSDictionary *params = @{@"activity": event.activity, @"confidence": @(event.confidence)};
        [me sendEvent:EVENT_ACTIVITYCHANGE body:params];
    }];
    [locationManager onHeartbeat:^(TSHeartbeatEvent *event) {
        [me sendEvent:EVENT_HEARTBEAT body:@{@"location":[event.location toDictionary]}];
    }];
    [locationManager onGeofence:^(TSGeofenceEvent *event) {
        NSMutableDictionary *params = [[event toDictionary] mutableCopy];
        [params setObject:[event.location toDictionary] forKey:@"location"];
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

RCT_EXPORT_METHOD(reset:(NSDictionary*)params success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    TSConfig *config = [TSConfig sharedInstance];
    if ([[params allKeys] count] > 0) {
        [config reset:YES];
        [config updateWithDictionary:params];
    } else {
        [config reset];
    }
    success(@[[config toDictionary]]);
}

/**
 * configure plugin
 */
RCT_EXPORT_METHOD(ready:(NSDictionary*)params success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    BOOL reset = (params[@"reset"]) ? [params[@"reset"] boolValue] : YES;
    if (ready) {
        TSConfig *config = [TSConfig sharedInstance];
        if (reset) {
            [locationManager log:@"warn" message:@"#ready already called.  Redirecting to #setConfig"];
            [config updateWithDictionary:params];
        } else {
            [locationManager log:@"warn" message:@"#ready already called.  Ignored Config since reset: false"];
        }
        success(@[[config toDictionary]]);
        return;
    }
    ready = YES;
    [self registerEventListeners];

    dispatch_async(dispatch_get_main_queue(), ^{
        TSConfig *config = [TSConfig sharedInstance];
        if (config.isFirstBoot) {
            [config updateWithDictionary:params];
        } else {
            if (reset) {
                [config reset:YES];
                [config updateWithDictionary:params];
            } else if ([params objectForKey:@"authorization"]) {
                [config updateWithBlock:^(TSConfigBuilder *builder) {
                    builder.authorization = [TSAuthorization createWithDictionary:[params objectForKey:@"authorization"]];
                }];
            }
        }
        [self.locationManager ready];
        success(@[[config toDictionary]]);
    });
}

/**
 * configure plugin
 * @deprecated in favour of #ready
 */
RCT_EXPORT_METHOD(configure:(NSDictionary*)params success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        TSConfig *config = [TSConfig sharedInstance];
        [self.locationManager configure:params];
        success(@[[config toDictionary]]);
    });
}



RCT_EXPORT_METHOD(removeAllListeners:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    [locationManager removeListeners];
    success(@[]);
}


RCT_EXPORT_METHOD(setConfig:(NSDictionary*)params success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    TSConfig *config = [TSConfig sharedInstance];
    [config updateWithDictionary:params];
    success(@[[config toDictionary]]);
}

-(NSDictionary*)getState
{
    return [locationManager getState];
}

RCT_EXPORT_METHOD(getState:(RCTResponseSenderBlock)callback failure:(RCTResponseSenderBlock)failure)
{
    NSDictionary *state = [locationManager getState];
    callback(@[state]);
}

/**
 * Turn on background geolocation
 */
RCT_EXPORT_METHOD(start:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.locationManager start];
        success(@[[self.locationManager getState]]);
    });
}
/**
 * Turn it off
 */
RCT_EXPORT_METHOD(stop:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    [locationManager stop];
    success(@[[locationManager getState]]);
}

/**
 * Start schedule
 */
RCT_EXPORT_METHOD(startSchedule:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.locationManager startSchedule];
        success(@[[self.locationManager getState]]);
    });
}

/**
 * Stop schedule
 */
RCT_EXPORT_METHOD(stopSchedule:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.locationManager stopSchedule];
        success(@[[self.locationManager getState]]);
    });
}

/**
 * Start schedule
 */
RCT_EXPORT_METHOD(startGeofences:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        TSConfig *config = [TSConfig sharedInstance];
        [self.locationManager startGeofences];
        success(@[[config toDictionary]]);
    });
}

/**
 * Change pace to moving/stopped
 * @param {Boolean} isMoving
 */
RCT_EXPORT_METHOD(changePace:(BOOL)moving success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    [locationManager changePace:moving];
    success(@[]);
}

RCT_EXPORT_METHOD(beginBackgroundTask:(RCTResponseSenderBlock)callback failure:(RCTResponseSenderBlock)failure)
{
    callback(@[@([locationManager createBackgroundTask])]);
}
/**
 * Called by js to signify the end of a background-geolocation event
 */
RCT_EXPORT_METHOD(finish:(int)taskId success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    [locationManager stopBackgroundTask:taskId];
    success(@[@(taskId)]);
}

RCT_EXPORT_METHOD(getCurrentPosition:(NSDictionary*)options success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    TSCurrentPositionRequest *request = [[TSCurrentPositionRequest alloc] initWithSuccess:^(TSLocation *location) {
        success(@[[location toDictionary]]);
    } failure:^(NSError *error) {
        failure(@[@(error.code)]);
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

RCT_EXPORT_METHOD(watchPosition:(NSDictionary*)options success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    TSWatchPositionRequest *request = [[TSWatchPositionRequest alloc] initWithSuccess:^(TSLocation *location) {
        [self sendEvent:EVENT_WATCHPOSITION body:[location toDictionary]];
    } failure:^(NSError *error) {

    }];

    if (options[@"interval"])           { request.interval = [options[@"interval"] doubleValue]; }
    if (options[@"desiredAccuracy"])    { request.desiredAccuracy = [options[@"desiredAccuracy"] doubleValue]; }
    if (options[@"persist"])            { request.persist = [options[@"persist"] boolValue]; }
    if (options[@"extras"])             { request.extras = options[@"extras"]; }
    if (options[@"timeout"])            { request.timeout = [options[@"timeout"] doubleValue]; }

    [locationManager watchPosition:request];
    success(@[]);
}

RCT_EXPORT_METHOD(stopWatchPosition:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    [locationManager stopWatchPosition];
    success(@[]);
}

RCT_EXPORT_METHOD(getLocations:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    [locationManager getLocations:^(NSArray* records) {
        success(@[records]);
    } failure:^(NSString* error) {
        failure(@[error]);
    }];
}

RCT_EXPORT_METHOD(sync:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    [locationManager sync:^(NSArray* records) {
        success(@[records]);
    } failure:^(NSError* error) {
        failure(@[@(error.code)]);
    }];
}

RCT_EXPORT_METHOD(getGeofences:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    [locationManager getGeofences:^(NSArray* geofences) {
        NSMutableArray *result = [NSMutableArray new];
        for (TSGeofence *geofence in geofences) { [result addObject:[geofence toDictionary]]; }
        success(@[result]);
    } failure:^(NSString* error) {
        failure(@[error]);
    }];
}

RCT_EXPORT_METHOD(getGeofence:(NSString*)identifier success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    [locationManager getGeofence:identifier success:^(TSGeofence* geofence) {
        success(@[[geofence toDictionary]]);
    } failure:^(NSString* error) {
        failure(@[error]);
    }];
}

RCT_EXPORT_METHOD(geofenceExists:(NSString*)identifier callback:(RCTResponseSenderBlock)callback)
{
    [locationManager geofenceExists:identifier callback:^(BOOL exists) {
        callback(@[@(exists)]);
    }];
}

RCT_EXPORT_METHOD(addGeofence:(NSDictionary*)params success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    TSGeofence *geofence = [self buildGeofence:params];
    if (!geofence) {
        NSString *error = [NSString stringWithFormat:@"Invalid geofence data: %@", params];
        failure(@[error]);
        return;
    }
    [locationManager addGeofence:geofence success:^{
        success(@[]);
    } failure:^(NSString *error) {
        failure(@[error]);
    }];
}

RCT_EXPORT_METHOD(addGeofences:(NSArray*) data success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    NSMutableArray *geofences = [NSMutableArray new];
    for (NSDictionary *params in data) {
        TSGeofence *geofence = [self buildGeofence:params];
        if (geofence != nil) {
            [geofences addObject:geofence];
        } else {
            NSString *error = [NSString stringWithFormat:@"Invalid geofence data: %@", params];
            failure(@[error]);
            return;
        }
    }
    [locationManager addGeofences:geofences success:^{
        success(@[]);
    } failure:^(NSString *error) {
        failure(@[error]);
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

RCT_EXPORT_METHOD(removeGeofence:(NSString*)identifier success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    [locationManager removeGeofence:identifier success:^{
        success(@[]);
    } failure:^(NSString* error) {
        failure(@[error]);
    }];
}

RCT_EXPORT_METHOD(removeGeofences:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    NSArray *geofences = @[];
    [locationManager removeGeofences:geofences success:^{
        success(@[]);
    } failure:^(NSString* error) {
        failure(@[error]);
    }];
}

RCT_EXPORT_METHOD(getOdometer:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    NSNumber *distance = @([locationManager getOdometer]);
    success(@[distance]);
}

RCT_EXPORT_METHOD(setOdometer:(double)value success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    TSCurrentPositionRequest *request = [[TSCurrentPositionRequest alloc] initWithSuccess:^(TSLocation *location) {
        success(@[[location toDictionary]]);
    } failure:^(NSError *error) {
        failure(@[@(error.code)]);
    }];
    [locationManager setOdometer:value request:request];
}

RCT_EXPORT_METHOD(destroyLocations:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    BOOL result = [locationManager destroyLocations];
    if (result) {
        success(@[]);
    } else {
        failure(@[]);
    }
}

RCT_EXPORT_METHOD(destroyLocation:(NSString*)uuid success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    [locationManager destroyLocation:uuid success:^{
        success(@[]);
    } failure:^(NSString* error) {
        failure(@[error]);
    }];
}

RCT_EXPORT_METHOD(getCount:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    int count = [locationManager getCount];
    if (count >= 0) {
        success(@[@(count)]);
    } else {
        failure(@[]);
    }
}

RCT_EXPORT_METHOD(insertLocation:(NSDictionary*)params success:(RCTResponseSenderBlock)successCallback failure:(RCTResponseSenderBlock)failureCallback)
{
    [locationManager insertLocation: params success:^(NSString* uuid) {
        successCallback(@[uuid]);
    } failure:^(NSString* error) {
        failureCallback(@[error]);
    }];
}

RCT_EXPORT_METHOD(getLog:(NSDictionary*)params success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    LogQuery *query = [[LogQuery alloc] initWithDictionary:params];
    [locationManager getLog:query success:^(NSString* log) {
        success(@[log]);
    } failure:^(NSString* error) {
        failure(@[error]);
    }];
}

RCT_EXPORT_METHOD(destroyLog:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    BOOL result = [locationManager destroyLog];
    if (result) {
        success(@[@(result)]);
    } else {
        failure(@[@(result)]);
    }
}

RCT_EXPORT_METHOD(emailLog:(NSString*)email query:(NSDictionary*)params success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    LogQuery *query = [[LogQuery alloc] initWithDictionary:params];
    [locationManager emailLog:email query:query success:^{
        success(@[@(YES)]);
    } failure:^(NSString* error) {
        failure(@[error]);
    }];
}

RCT_EXPORT_METHOD(uploadLog:(NSString*)url query:(NSDictionary*)params success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    LogQuery *query = [[LogQuery alloc] initWithDictionary:params];
    [locationManager uploadLog:url query:query success:^{
        success(@[@(YES)]);
    } failure:^(NSString* error) {
        failure(@[error]);
    }];
}


RCT_EXPORT_METHOD(log:(NSString*)level message:(NSString*)message)
{
    [locationManager log:level message:message];
}

RCT_EXPORT_METHOD(getSensors:(RCTResponseSenderBlock)successCallback failure:(RCTResponseSenderBlock)failureCallback)
{
    NSDictionary *sensors = @{
        @"platform": @"ios",
        @"accelerometer": @([locationManager isAccelerometerAvailable]),
        @"gyroscope": @([locationManager isGyroAvailable]),
        @"magnetometer": @([locationManager isMagnetometerAvailable]),
        @"motion_hardware": @([locationManager isMotionHardwareAvailable])
    };
    successCallback(@[sensors]);
}

RCT_EXPORT_METHOD(getDeviceInfo:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure) {
    TSDeviceInfo *deviceInfo = [TSDeviceInfo sharedInstance];
    success(@[[deviceInfo toDictionary:@"react-native"]]);
}

RCT_EXPORT_METHOD(isPowerSaveMode:(RCTResponseSenderBlock)successCallback failure:(RCTResponseSenderBlock)failure)
{
    BOOL isPowerSaveMode = [locationManager isPowerSaveMode];
    successCallback(@[@(isPowerSaveMode)]);
}

RCT_EXPORT_METHOD(isIgnoringBatteryOptimizations:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    success(@[@(NO)]);
}

RCT_EXPORT_METHOD(requestSettings:(NSDictionary*)args success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    failure(@[@"No iOS Implementation"]);
}

RCT_EXPORT_METHOD(showSettings:(NSDictionary*)args success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    failure(@[@"No iOS Implementation"]);
}

RCT_EXPORT_METHOD(getProviderState:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure) {
    TSProviderChangeEvent *event = [locationManager getProviderState];
    success(@[[event toDictionary]]);
}

RCT_EXPORT_METHOD(requestPermission:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure) {
    [locationManager requestPermission:^(NSNumber *status) {
        success(@[status]);
    } failure:^(NSNumber *status) {
        failure(@[status]);
    }];
}

RCT_EXPORT_METHOD(requestTemporaryFullAccuracy:(NSString*)purpose success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure) {
    [locationManager requestTemporaryFullAccuracy:purpose success:^(NSInteger accuracyAuthorization) {
        success(@[@(accuracyAuthorization)]);
    } failure:^(NSError *error) {
        failure(error.userInfo[@"NSDebugDescription"]);
    }];
}

RCT_EXPORT_METHOD(getTransistorToken:(NSString*)orgname username:(NSString*)username url:(NSString*)url success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure) {

    [TransistorAuthorizationToken findOrCreateWithOrg:orgname
                                             username:username
                                                 url:url
                                            framework:@"react-native"
                                              success:^(TransistorAuthorizationToken *token) {
        success(@[[token toDictionary]]);
    } failure:^(NSError *error) {
        failure(@[@{@"status":@(error.code), @"message":error.localizedDescription}]);
    }];
}

RCT_EXPORT_METHOD(destroyTransistorToken:(NSString*)url success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure) {
    [TransistorAuthorizationToken destroyWithUrl:url];
    success(@[@(YES)]);
}

RCT_EXPORT_METHOD(playSound:(int)soundId)
{
    [locationManager playSound: soundId];
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
