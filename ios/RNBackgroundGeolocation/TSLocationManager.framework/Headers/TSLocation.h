//
//  TSLocation.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2017-02-11.
//  Copyright © 2017 Transistor Software. All rights reserved.
//

#import "LocationManager.h"

@interface TSLocation : NSObject

@property (nonatomic, readonly) CLLocation* location;
@property (nonatomic, readonly) NSString *uuid;
@property (nonatomic, readonly) enum tsLocationType type;
@property (nonatomic, readonly) BOOL isMoving;

-(id) initWithLocation:(CLLocation*)location;
-(id) initWithLocation:(CLLocation*)location type:(enum tsLocationType)type extras:(NSDictionary*)extras;
-(id) initWithLocation:(CLLocation*)location geofence:(NSDictionary*)geofenceData;
- (NSString*)toJson:(NSError**)error;
- (NSDictionary*)toDictionary;

@end
