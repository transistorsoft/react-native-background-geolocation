//
//  TSGeofence.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2016-12-21.
//  Copyright © 2016 Transistor Software. All rights reserved.
//
#import <Foundation/Foundation.h>

@interface TSGeofence : NSObject
{
    
}
@property (nonatomic) NSString* identifier;
@property (nonatomic) CLLocationDistance radius;

@property (nonatomic) CLLocationDegrees latitude;
@property (nonatomic) CLLocationDegrees longitude;
@property (nonatomic) BOOL notifyOnEntry;
@property (nonatomic) BOOL notifyOnExit;
@property (nonatomic) BOOL notifyOnDwell;
@property (nonatomic) double loiteringDelay;
/**
 * Arbitrary extra data attached to the geofence
 */
@property (nonatomic) NSDictionary *extras;

-(instancetype) initWithIdentifier:(NSString*)identifier
                            radius:(CLLocationDistance)radius
                          latitude:(CLLocationDegrees)latitude
                         longitude:(CLLocationDegrees)lontitude
                     notifyOnEntry:(BOOL)notifyOnEntry
                      notifyOnExit:(BOOL)notifyOnExit
                     notifyOnDwell:(BOOL)notifyOnDwell
                    loiteringDelay:(double)loiteringDelay;

-(instancetype) initWithIdentifier:(NSString*)identifier
                            radius:(CLLocationDistance)radius
                          latitude:(CLLocationDegrees)latitude
                         longitude:(CLLocationDegrees)longitude
                     notifyOnEntry:(BOOL)notifyOnEntry
                      notifyOnExit:(BOOL)notifyOnExit
                     notifyOnDwell:(BOOL)notifyOnDwell
                    loiteringDelay:(double)loiteringDelay
                            extras:(NSDictionary*)extras;

- (NSDictionary*) toDictionary;
    
@end

