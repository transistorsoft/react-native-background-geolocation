//
//  ConfigModule.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2019-11-21.
//  Copyright © 2019 Christopher Scott. All rights reserved.
//
#import <Foundation/Foundation.h>

/// :nodoc:
@interface ConfigModule:NSObject

//-(NSDictionary*) toDictionary;
+(instancetype) createWithDictionary:(NSDictionary*)values;

-(NSDictionary*) toDictionary;
-(NSDictionary*) toDictionary:(BOOL)redact;
-(BOOL) isEqual;
- (id) valueFromDictionary:(NSDictionary*)values forKey:(NSString*)key forObject:(id)object defaultValue:(id)defaultValue;

@end
