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

static NSString *const EVENT_LOCATIONCHANGE     = @"location";
static NSString *const EVENT_WATCHPOSITION      = @"watchposition";
static NSString *const EVENT_PROVIDERCHANGE     = @"providerchange";
static NSString *const EVENT_MOTIONCHANGE       = @"motionchange";
static NSString *const EVENT_ACTIVITYCHANGE     = @"activitychange";
static NSString *const EVENT_GEOFENCESCHANGE    = @"geofenceschange";
static NSString *const EVENT_ERROR              = @"error";
static NSString *const EVENT_HTTP               = @"http";
static NSString *const EVENT_SCHEDULE           = @"schedule";
static NSString *const EVENT_GEOFENCE           = @"geofence";
static NSString *const EVENT_HEARTBEAT          = @"heartbeat";


@implementation RNBackgroundGeolocation {
    BOOL isConfigured;
    
    NSMutableDictionary *listeners;

    void(^onLocation)(TSLocation*);
    void(^onLocationError)(NSError*);
    void(^onMotionChange)(TSLocation*);
    void(^onActivityChange)(TSActivityChangeEvent*);
    void(^onHeartbeat)(TSHeartbeatEvent*);
    void(^onGeofence)(TSGeofenceEvent*);
    void(^onGeofencesChange)(TSGeofencesChangeEvent*);
    void(^onHttp)(TSHttpEvent*);
    void(^onProviderChange)(TSProviderChangeEvent*);
    void(^onSchedule)(TSScheduleEvent*);
}

@synthesize locationManager;

RCT_EXPORT_MODULE();

/**
 * Create TSLocationManager instance
 */
-(instancetype)init
{
    self = [super init];
    if (self) {
        isConfigured = NO;
        
        __typeof(self) __weak me = self;

        // Build event-listener blocks
        onLocation = ^void(TSLocation *location) {
            [me sendEvent:EVENT_LOCATIONCHANGE body:[location toDictionary]];
        };
        onLocationError = ^void(NSError *error) {
            [me sendEvent:EVENT_ERROR body: @{@"type":@"location", @"code":@(error.code)}];
        };
        onMotionChange = ^void(TSLocation *location) {
            [me sendEvent:EVENT_MOTIONCHANGE body:@{@"isMoving":@(location.isMoving), @"location":[location toDictionary]}];
        };
        onActivityChange = ^void(TSActivityChangeEvent *event) {
            NSDictionary *params = @{@"activity": event.activity, @"confidence": @(event.confidence)};
            [me sendEvent:EVENT_ACTIVITYCHANGE body:params];
        };
        onHeartbeat = ^void(TSHeartbeatEvent *event) {
            [me sendEvent:EVENT_HEARTBEAT body:@{@"location":[event.location toDictionary]}];
        };
        onGeofence = ^void(TSGeofenceEvent *event) {
            NSMutableDictionary *params = [[event toDictionary] mutableCopy];
            [params setObject:[event.location toDictionary] forKey:@"location"];
            [me sendEvent:EVENT_GEOFENCE body:params];
        };
        onGeofencesChange = ^void(TSGeofencesChangeEvent *event) {
            [me sendEvent:EVENT_GEOFENCESCHANGE body:[event toDictionary]];
        };
        onHttp = ^void(TSHttpEvent *response) {
            NSDictionary *params = @{@"status": @(response.statusCode), @"responseText":response.responseText};
            [me sendEvent:EVENT_HTTP body:params];
        };
        onProviderChange = ^void(TSProviderChangeEvent *event) {
            [me sendEvent:EVENT_PROVIDERCHANGE body:[event toDictionary]];
        };
        onSchedule = ^void(TSScheduleEvent *event) {
            [me sendEvent:EVENT_SCHEDULE body:event.state];
        };
        
        // EventEmitter listener-counts
        listeners = [NSMutableDictionary new];
        
        // TSLocationManager instance
        locationManager = [TSLocationManager sharedInstance];
        
        // Provide reference to rootViewController for #emailLog method.
        UIViewController *root = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
        locationManager.viewController = root;
    }

    return self;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[
        EVENT_LOCATIONCHANGE,
        EVENT_PROVIDERCHANGE,
        EVENT_MOTIONCHANGE,
        EVENT_ACTIVITYCHANGE,
        EVENT_GEOFENCESCHANGE,
        EVENT_ERROR,
        EVENT_HTTP,
        EVENT_SCHEDULE,
        EVENT_GEOFENCE,
        EVENT_HEARTBEAT,
        EVENT_WATCHPOSITION
    ];
}

/**
 * configure plugin
 */
RCT_EXPORT_METHOD(configure:(NSDictionary*)config success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    if (isConfigured) {
        [self setConfig:config success:success failure:failure];
        return;
    }
    isConfigured = YES;
    dispatch_async(dispatch_get_main_queue(), ^{
        NSDictionary *state = [locationManager configure:config];
        if (state != nil) {
            success(@[state]);
        } else {
            failure(@[]);
        }
    });
}

RCT_EXPORT_METHOD(addListener:(NSString*)event)
{
    // Careful:  we're overrideing a RCTEventEmitter method here.
    [super addListener:event];
    
    @synchronized(listeners) {
        if ([listeners objectForKey:event]) {
            // Increment listener-count for this event
            NSInteger count = [[listeners objectForKey:event] integerValue];
            count++;
            [listeners setObject:@(count) forKey:event];
        } else {
            // First listener for this event
            [listeners setObject:@(1) forKey:event];
            
            if ([event isEqualToString:EVENT_LOCATIONCHANGE]) {
                [locationManager onLocation:onLocation failure:onLocationError];
            } else if ([event isEqualToString:EVENT_MOTIONCHANGE]) {
                [locationManager onMotionChange:onMotionChange];
            } else if ([event isEqualToString:EVENT_ACTIVITYCHANGE]) {
                [locationManager onActivityChange:onActivityChange];
            } else if ([event isEqualToString:EVENT_HEARTBEAT]) {
                [locationManager onHeartbeat:onHeartbeat];
            } else if ([event isEqualToString:EVENT_GEOFENCE]) {
                [locationManager onGeofence:onGeofence];
            } else if ([event isEqualToString:EVENT_GEOFENCESCHANGE]) {
                [locationManager onGeofencesChange:onGeofencesChange];
            } else if ([event isEqualToString:EVENT_HTTP]) {
                [locationManager onHttp:onHttp];
            } else if ([event isEqualToString:EVENT_PROVIDERCHANGE]) {
                [locationManager onProviderChange:onProviderChange];
            } else if ([event isEqualToString:EVENT_SCHEDULE]) {
                [locationManager onSchedule:onSchedule];
            }
        }
    }
}

RCT_EXPORT_METHOD(removeListener:(NSString*)event)
{
    @synchronized(listeners) {
        if ([listeners objectForKey:event]) {
            // Decrement listener-count for this event.
            NSInteger count = [[listeners objectForKey:event] integerValue];
            count--;
            if (count > 0) {
                [listeners setObject:@(count) forKey:event];
            } else {
                // No more listeners: tell TSLocationManager to removeListeners for this event.
                [locationManager removeListeners];
                [listeners removeObjectForKey:event];
            }
        }
    }
}

RCT_EXPORT_METHOD(removeAllListeners)
{
    @synchronized(listeners) { [listeners removeAllObjects]; }
    [locationManager removeListeners];
}


RCT_EXPORT_METHOD(setConfig:(NSDictionary*)config success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    NSDictionary *state = [locationManager setConfig:config];
    success(@[state]);
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
        [locationManager start];
        success(@[[locationManager getState]]);
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
        [locationManager startSchedule];
        success(@[[locationManager getState]]);
    });
}

/**
 * Stop schedule
 */
RCT_EXPORT_METHOD(stopSchedule:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [locationManager stopSchedule];
        success(@[[locationManager getState]]);
    });
}

/**
 * Start schedule
 */
RCT_EXPORT_METHOD(startGeofences:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [locationManager startGeofences];
        success(@[[locationManager getState]]);
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

RCT_EXPORT_METHOD(beginBackgroundTask:(RCTResponseSenderBlock)callback)
{
    callback(@[@([locationManager createBackgroundTask])]);
}
/**
 * Called by js to signify the end of a background-geolocation event
 */
RCT_EXPORT_METHOD(finish:(int)taskId)
{
    [locationManager stopBackgroundTask:taskId];
}

RCT_EXPORT_METHOD(getCurrentPosition:(NSDictionary*)options success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    [locationManager getCurrentPosition:options success:^(TSLocation* location) {
        success(@[[location toDictionary]]);
    } failure:^(NSError* error) {
        failure(@[@(error.code)]);
    }];
}

RCT_EXPORT_METHOD(watchPosition:(NSDictionary*)options success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    [locationManager watchPosition:options success:^(TSLocation* location) {
        [self sendEvent:EVENT_WATCHPOSITION body:[location toDictionary]];
    } failure:^(NSError* error) {
        [self sendEvent:EVENT_ERROR body:@{@"type":@"location", @"code":@(error.code)}];
    }];
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
        success(@[geofences]);
    } failure:^(NSString* error) {
        failure(@[error]);
    }];
}


RCT_EXPORT_METHOD(addGeofence:(NSDictionary*) config success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    [locationManager addGeofence:config success:^{
        success(@[]);
    } failure:^(NSString* error) {
        failure(@[error]);
    }];
}

RCT_EXPORT_METHOD(addGeofences:(NSArray*) geofences success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    [locationManager addGeofences:geofences success:^{
        success(@[]);
    } failure:^(NSString* error) {
        failure(@[error]);
    }];
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
    [locationManager setOdometer:value success:^(TSLocation* location) {
        success(@[[location toDictionary]]);
    } failure:^(NSError* error) {
        failure(@[@(error.code)]);
    }];
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

RCT_EXPORT_METHOD(getLog:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    [locationManager getLog:^(NSString* log) {
        success(@[log]);
    } failure:^(NSString* error) {
        failure(@[error]);
    }];
}

RCT_EXPORT_METHOD(destroyLog:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    BOOL result = [locationManager destroyLog];
    if (result) {
        success(@[]);
    } else {
        failure(@[]);
    }
}

RCT_EXPORT_METHOD(emailLog:(NSString*)email success:(RCTResponseSenderBlock)success failure:(RCTResponseSenderBlock)failure)
{
    [locationManager emailLog:email success:^{
        success(@[]);
    } failure:^(NSString* error) {
        failure(@[error]);
    }];
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

RCT_EXPORT_METHOD(playSound:(int)soundId)
{
    [locationManager playSound: soundId];
}

-(void) sendEvent:(NSString*)event body:(id)body
{
    [self sendEventWithName:event body:body];
}

- (void)invalidate
{
    [self removeAllListeners];
    dispatch_async(dispatch_get_main_queue(), ^{
        [locationManager stopWatchPosition];
    });
}

- (void)dealloc
{
    [self removeAllListeners];
    locationManager = nil;
}


@end
