//
//  TSGeofenceEvent.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2017-03-27.
//  Copyright © 2017 Transistor Software. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "TSLocation.h"
#import "TSGeofence.h"

/**
 The event object provided to `-[TSLocationManager onGeofence:]`
 
 ```obj-c
 TSLocationManager *bgGeo = [TSLocationManager sharedInstance];
 [bgGeo onGeofence:^(TSGeofenceEvent *event) {
     NSLog(@"[onGeofence]: %@", event);
 }];
 ```
    
 */
@interface TSGeofenceEvent : NSObject
{
    
}

/// The location associated with this geofence event.
@property (nonatomic, readonly) TSLocation* location;
/// The triggered geofence
@property (nonatomic, readonly) TSGeofence* geofence;
/// The region instance.
@property (nonatomic, readonly) CLCircularRegion* region;
/// The geofence transition (eg: "ENTER", "EXIT", "DWELL"
@property (nonatomic, readonly) NSString* action;
/// :nodoc:
@property (nonatomic, readonly) BOOL isLoitering;

/// :nodoc:
@property (nonatomic, readonly) BOOL isFinishedLoitering;

/// :nodoc:
-(instancetype)initWithGeofence:(TSGeofence*)geofence region:(CLCircularRegion*)circularRegion action:(NSString*)actionName;

/// :nodoc:
-(void) startLoiteringAt:(CLLocation*)location callback:(void (^)(void))callback;
/// :nodoc:
-(BOOL) isLoiteringAt:(CLLocation*)location;
/// :nodoc:
-(void) setTriggerLocation:(CLLocation*)location;
/// :nodoc:
-(void) cancel;

/// Returns an `NSDictionary` representaton.
-(NSDictionary*)toDictionary;


@end

