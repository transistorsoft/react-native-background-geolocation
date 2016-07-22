//
//  TSScheduler.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2016-04-26.
//  Copyright © 2016 Transistor Software. All rights reserved.
//
//
// TSScheduler
// TODO This should be decoupled into some sort of plugin
//
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@class TSHttpService;

@interface TSHttpService : NSObject

#pragma mark - Singleton
+ (TSHttpService *)sharedInstance;

#pragma mark - Properties

@property (copy) void (^callbackBlock) (NSArray *records);
@property (copy) void (^httpResponseBlock) (NSInteger statusCode, NSDictionary *requestData, NSData *responseData, NSError *error);
@property (nonatomic, readonly) BOOL isBusy;
@property (nonatomic, readonly) BOOL hasNetworkConnection;

#pragma mark - Methods
- (BOOL)flush;
-(void)startMonitoring;
-(void)stopMonitoring;
-(BOOL)hasNetworkConnection;

@end
