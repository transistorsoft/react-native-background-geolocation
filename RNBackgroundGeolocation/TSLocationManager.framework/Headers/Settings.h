//
//  Settings.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2015-11-12.
//  Copyright © 2015 Transistor Software. All rights reserved.
//
@interface Settings : NSObject

+(void)load:(NSDictionary*)cfg;
+(NSArray*)items;
+(id)get:(NSString*)key;
@end