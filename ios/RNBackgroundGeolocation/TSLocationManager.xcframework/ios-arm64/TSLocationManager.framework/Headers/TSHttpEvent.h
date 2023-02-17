//
//  TSHttpResponse.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2017-07-28.
//  Copyright © 2017 Transistor Software. All rights reserved.
//

@interface TSHttpEvent : NSObject

@property (nonatomic, readonly) BOOL isSuccess;
@property (nonatomic, readonly) NSInteger statusCode;
@property (nonatomic, readonly) NSDictionary *requestData;
@property (nonatomic, readonly) NSString *responseText;
@property (nonatomic, readonly) NSError *error;

-(id) initWithStatusCode:(NSInteger)statusCode requestData:(NSDictionary*)requestData responseData:(NSData*)responseData error:(NSError*)error;
-(NSDictionary*) toDictionary;
@end
