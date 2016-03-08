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
+(void) warn:(NSString*)format, ...;
+(void) info:(NSString*)format, ...;
+(void) notice:(NSString*)format, ...;
+(void) ok:(NSString*)format, ...;
+(void) error:(NSString*)format, ...;
+(void) debug:(NSString*)format, ...;
+(void) header:(NSString*)format, ...;
+(void) row:(NSString*)format, ...;
+(void) setDebug:(BOOL)debug;


@end