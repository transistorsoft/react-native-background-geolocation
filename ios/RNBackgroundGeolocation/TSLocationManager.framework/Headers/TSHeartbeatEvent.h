//
//  TSHeartbeat.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2017-07-28.
//  Copyright © 2017 Transistor Software. All rights reserved.
//

#import "TSLocation.h"

@interface TSHeartbeatEvent : NSObject

@property (nonatomic, readonly) TSLocation* location;

-(id) initWithLocation:(CLLocation*)location;
-(NSDictionary*) toDictionary;
@end

