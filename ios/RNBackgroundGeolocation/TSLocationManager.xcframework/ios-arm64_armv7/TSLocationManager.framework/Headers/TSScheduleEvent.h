//
//  TSScheduleEvent.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2017-07-29.
//  Copyright © 2017 Transistor Software. All rights reserved.
//
#import "TSSchedule.h"

@interface TSScheduleEvent : NSObject

@property (nonatomic, readonly) TSSchedule* schedule;
@property (nonatomic, readonly) NSDictionary* state;

-(id) initWithSchedule:(TSSchedule*)schedule state:(NSDictionary*)state;

@end

