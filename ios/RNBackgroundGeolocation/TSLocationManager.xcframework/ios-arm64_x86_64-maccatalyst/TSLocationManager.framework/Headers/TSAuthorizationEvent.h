//
//  TSAuthorizationEvent.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2019-11-26.
//  Copyright © 2019 Christopher Scott. All rights reserved.
//

@interface TSAuthorizationEvent : NSObject

@property (nonatomic, readonly) NSInteger status;
@property (nonatomic, readonly) NSError* error;
@property (nonatomic, readonly) NSDictionary *response;

-(instancetype) initWithResponse:(NSDictionary*)response status:(NSInteger)status;
-(instancetype) initWithError:(NSError*)error status:(NSInteger)status;
-(NSDictionary*) toDictionary;
@end
