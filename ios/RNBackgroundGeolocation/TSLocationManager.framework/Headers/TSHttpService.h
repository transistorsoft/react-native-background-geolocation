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
#import "TSConnectivityChangeEvent.h"
#import "TSAuthorizationEvent.h"
#import "AtomicBoolean.h"
#import "HttpRequest.h"

@class TSHttpService;

@interface TSHttpService : NSObject

#pragma mark - Singleton
+ (TSHttpService *)sharedInstance;

#pragma mark - Properties

@property (copy) void (^httpResponseBlock) (HttpRequest *request, HttpResponse *response);

@property (nonatomic, readonly) BOOL hasNetworkConnection;

#pragma mark - Methods
-(void)flush;
-(void)flush:(BOOL)overrideSyncThreshold;
-(void)flush:(void(^)(NSArray*))success failure:(void(^)(NSError*))failure;
-(void)startMonitoring;
-(void)stopMonitoring;
-(BOOL)hasNetworkConnection;
-(void)onConnectivityChange:(void (^)(TSConnectivityChangeEvent*))success;
-(void)onAuthorization:(void(^)(TSAuthorizationEvent*))callback;
-(void)un:(NSString*)event callback:(void(^)(id))callback;
-(void)removeListeners;
-(void)removeListeners:(NSString*)event;
-(BOOL)isBusy;
@end
