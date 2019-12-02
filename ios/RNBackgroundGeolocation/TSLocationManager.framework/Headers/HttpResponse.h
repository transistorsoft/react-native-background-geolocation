//
//  HttpResponse.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2019-10-31.
//  Copyright © 2019 Christopher Scott. All rights reserved.
//
#import <Foundation/Foundation.h>

// Location types
typedef enum TSHttpServiceError : NSInteger {
    TSHttpServiveErrorInvalidUrl        = 1,
    TSHttpServiceErrorNetworkConnection = 2,
    TSHttpServiceErrorSyncInProgress    = 3,
    TSHttpServiceErrorResponse          = 4,
    TSHttpServiceRedirectError          = 5
} TSHttpServiceError;

@interface HttpResponse : NSObject

-(instancetype) initWithData:(NSData*)data response:(NSURLResponse*)response error:(NSError*)error;

@property(nonatomic) NSError* error;
@property(nonatomic) NSData *data;
@property(nonatomic) NSHTTPURLResponse *response;
@property(nonatomic) NSInteger status;

@end

