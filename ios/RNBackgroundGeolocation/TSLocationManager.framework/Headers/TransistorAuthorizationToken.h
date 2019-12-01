//
//  TransistorAuthorizationToken.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2019-11-21.
//  Copyright © 2019 Christopher Scott. All rights reserved.
//
#import <Foundation/Foundation.h>

/**
 * TransistorAuthorizationToken for demo server tracker.transistorsoft.com
 */
@interface TransistorAuthorizationToken:NSObject

@property (nonatomic) NSString* accessToken;
@property (nonatomic) NSString* refreshToken;
@property (nonatomic) long expires;

+ (void) findOrCreateWithOrg:(NSString*)orgname username:(NSString*)username url:(NSString*)apiUrl framework:(NSString*)framework success:(void(^)(TransistorAuthorizationToken*))success failure:(void(^)(NSError*))error;
+ (void) destroyWithUrl:(NSString*)url;
+ (BOOL) hasTokenForHost:(NSString*)host;

- (instancetype) initWithAccessToken:(NSString*)accessToken refreshToken:(NSString*)refreshToken expires:(long)expires;
- (instancetype) initWithDictionary:(NSDictionary*)data;

-(NSDictionary*) toDictionary;
    
@end



