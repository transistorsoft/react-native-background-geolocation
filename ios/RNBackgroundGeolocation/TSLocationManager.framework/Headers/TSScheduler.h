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
#import "TSSchedule.h"
@class TSScheduler;

@interface TSScheduler : NSObject

#pragma mark - Singleton
+ (TSScheduler *)sharedInstance;

#pragma mark - Properties

@property (copy) void (^handlerBlock) (TSSchedule *schedule);

@property (nonatomic, readonly) TSSchedule *currentSchedule;
@property (nonatomic, readonly) BOOL loaded;
@property (nonatomic, readonly) BOOL triggered;
@property (nonatomic, readonly) BOOL enabled;

// For debug/diagnostics mode
@property (nonatomic) BOOL debug;

#pragma mark - Methods
- (void)parse:(NSArray*)data;
- (void)stop;
- (void)start;
- (void)evaluate;
- (void)handleEvent:(TSSchedule*)schedule;

@end
