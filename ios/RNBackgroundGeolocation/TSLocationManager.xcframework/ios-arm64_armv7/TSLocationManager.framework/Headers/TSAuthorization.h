//
//  Authorization.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2019-11-21.
//  Copyright © 2019 Christopher Scott. All rights reserved.
//
#import <Foundation/Foundation.h>
#import "ConfigModule.h"
#import "TransistorAuthorizationToken.h"
#import "TSAuthorizationEvent.h"

extern NSString * const TS_AUTHORIZATION_STRATEGY;
extern NSString * const TS_ACCESS_TOKEN;
extern NSString * const TS_REFRESH_TOKEN;
extern NSString * const TS_REFRESH_PAYLOAD;
extern NSString * const TS_EXPIRES;
extern NSString * const TS_REFRESH_URL;

@interface TSAuthorization:ConfigModule

@property(nonatomic) NSString* strategy;
@property(nonatomic) NSString* accessToken;
@property(nonatomic) NSString* refreshToken;
@property(nonatomic) NSDictionary* refreshPayload;
@property(nonatomic) NSString* refreshUrl;
@property(nonatomic) NSTimeInterval expires;

- (instancetype) initWithDictionary:(NSDictionary*)values;

- (void) apply:(NSMutableURLRequest*)request;
- (NSString*) toString;
- (void) resolve:(NSInteger)status success:(void(^)(TSAuthorizationEvent*))success failure:(void(^)(TSAuthorizationEvent*))failure;

@end


