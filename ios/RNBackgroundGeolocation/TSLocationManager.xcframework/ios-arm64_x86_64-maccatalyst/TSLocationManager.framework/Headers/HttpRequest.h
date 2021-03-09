//
//  HttpRequest.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2019-10-31.
//  Copyright © 2019 Christopher Scott. All rights reserved.
//
#import <Foundation/Foundation.h>
#import "HttpResponse.h"

@interface HttpRequest : NSObject

@property(nonatomic) id requestData;
@property(nonatomic) NSURL *url;

+(void) execute:(NSArray*)records callback:(void(^)(HttpRequest*, HttpResponse*))callback;

-(instancetype) initWithRecords:(NSArray*)records callback:(void(^)(HttpRequest*, HttpResponse*))callback;

@end

