//
//  TSCallback.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2017-07-31.
//  Copyright © 2017 Transistor Software. All rights reserved.
//

@interface TSCallback : NSObject

@property (nonatomic, copy) void (^success)(id);
@property (nonatomic, copy) void (^failure)(id);
@property (nonatomic, readonly) NSDictionary *options;

-(id) initWithSuccess:(void(^)(id))success failure:(void(^)(id))failure;
-(id) initWithSuccess:(void(^)(id))success failure:(void(^)(id))failure options:(NSDictionary*)options;

@end
