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

@interface TSGeofenceEvent : NSObject
{
    
}

@property (nonatomic, readonly) TSLocation* location;
@property (nonatomic, readonly) TSGeofence* geofence;
@property (nonatomic, readonly) CLCircularRegion* region;
@property (nonatomic, readonly) NSString* action;
@property (nonatomic, readonly) BOOL isLoitering;
@property (nonatomic, readonly) BOOL isFinishedLoitering;

-(instancetype)initWithGeofence:(TSGeofence*)geofence region:(CLCircularRegion*)circularRegion action:(NSString*)actionName;
-(void) startLoiteringAt:(CLLocation*)location callback:(void (^)(void))callback;
-(BOOL) isLoiteringAt:(CLLocation*)location;
-(void) setTriggerLocation:(CLLocation*)location;
-(void) cancel;
-(NSDictionary*)toDictionary;


@end

