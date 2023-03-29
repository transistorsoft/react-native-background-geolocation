//
//  TSGeofencesChangeEvent.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2017-07-29.
//  Copyright © 2017 Transistor Software. All rights reserved.
//
#import "TSSchedule.h"

@interface TSGeofencesChangeEvent : NSObject

@property (nonatomic, readonly) NSArray* on;
@property (nonatomic, readonly) NSArray* off;

-(id) initWithOn:(NSArray*)on off:(NSArray*)off;
-(NSDictionary*) toDictionary;
@end
