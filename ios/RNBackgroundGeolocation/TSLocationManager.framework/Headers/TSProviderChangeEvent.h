//
//  TSProviderChange.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2017-07-28.
//  Copyright © 2017 Transistor Software. All rights reserved.
//

@interface TSProviderChangeEvent : NSObject

@property (nonatomic, readonly) CLAuthorizationStatus status;
@property (nonatomic, readonly) BOOL gps;
@property (nonatomic, readonly) BOOL network;
@property (nonatomic, readonly) BOOL enabled;

-(id) initWithStatus:(CLAuthorizationStatus)status authorizationRequest:(NSString*)authorizationRequest;
-(NSDictionary*) toDictionary;
@end
