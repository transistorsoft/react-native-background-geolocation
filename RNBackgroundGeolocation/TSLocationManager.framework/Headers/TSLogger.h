//
//  TSLog.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2015-11-05.
//  Copyright © 2015 Transistor Software. All rights reserved.
//
@interface TSLogger : NSObject
{
}

+(void) log:(NSString*)format, ...;
+(void)setDebug:(BOOL)debug;

@end