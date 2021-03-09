//
//  TSCurrentPositionRequest.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2018-02-11.
//  Copyright © 2018 Transistor Software. All rights reserved.
//
#import "TSLocation.h"

@interface TSCurrentPositionRequest : NSObject

@property (atomic) NSTimeInterval timeout;
@property (atomic) double maximumAge;
@property (atomic) BOOL persist;
@property (atomic) int samples;
@property (atomic) CLLocationAccuracy desiredAccuracy;
@property (atomic) NSDictionary* extras;
@property (atomic, copy) void (^success)(TSLocation*);
@property (atomic, copy) void (^failure)(NSError*);

-(instancetype) init;
-(instancetype) initWithSuccess:(void (^)(TSLocation*))success failure:(void (^)(NSError*))failure;

-(instancetype) initWithPersist:(BOOL)persist
                        success:(void (^)(TSLocation*))success
                        failure:(void (^)(NSError*))failure;

-(instancetype) initWithPersist:(BOOL)persist
                        samples:(int)samples
                        success:(void (^)(TSLocation*))success
                        failure:(void (^)(NSError*))failure;

-(instancetype) initWithTimeout:(int)timeout
           maximumAge:(double)maximumAge
              persist:(BOOL)persist
              samples:(int)samples
      desiredAccuracy:(CLLocationAccuracy)desiredAccuracy
               extras:(NSDictionary*)extras
              success:(void (^)(TSLocation*))success
              failure:(void (^)(NSError*))failure;

@end

