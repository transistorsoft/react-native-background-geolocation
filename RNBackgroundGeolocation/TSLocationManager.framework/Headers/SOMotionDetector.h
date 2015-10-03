//
//  MotionDetecter.h
//  MotionDetection
//
// The MIT License (MIT)
//
// Created by : arturdev (With heavy modifications by Chris Scott of Transistor Software <chris@transistorsoft.com>)
// Copyright (c) 2014 SocialObjects Software. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE

#import <Foundation/Foundation.h>
#import <CoreMotion/CoreMotion.h>
#import <UIKit/UIKit.h>

@class SOMotionDetector;
typedef enum
{
    MotionTypeStationary = 1,
    MotionTypeWalking,
    MotionTypeRunning,
    MotionTypeAutomotive,
    MotionTypeCycling,
    MotionTypeUnknown
} SOMotionType;

@interface SOMotionDetector : NSObject

#pragma mark - Singleton
+ (SOMotionDetector *)sharedInstance;

#pragma mark - Properties

@property (copy) void (^motionTypeChangedBlock) (SOMotionType motionType, int shakeCount, double averageVectorSum);
@property (copy) void (^accelerationChangedBlock) (CMAcceleration acceleration);

@property (nonatomic, readonly) SOMotionType motionType;
@property (nonatomic, readonly) CMMotionActivity* motionActivity;

@property (nonatomic) double currentSpeed;
@property (nonatomic, readonly) CMAcceleration acceleration;
@property (nonatomic, readonly) BOOL isShaking;

// For debug/diagnostics mode
@property (nonatomic) BOOL debug;
@property (nonatomic) NSString *statedActivity;

#pragma mark - Methods
- (void)startDetection;
- (void)stopDetection;
- (void)stopShakeDetection;
- (void)startShakeDetection;

#pragma mark - Customization Methods

+ (BOOL) motionHardwareAvailable;

- (void) setMotionDetectionInterval:(int)interval;

/**
 *@param speed  The minimum speed value less than which will be considered as not moving state
 */
- (void)setMinimumSpeed:(CGFloat)speed;

/**
 *@param speed  The maximum speed value more than which will be considered as running state
 */
- (void)setMaximumWalkingSpeed:(CGFloat)speed;

/**
 *@param speed  The maximum speed value more than which will be considered as automotive state
 */
- (void)setMaximumRunningSpeed:(CGFloat)speed;

/**
 *@param acceleration  The minimum acceleration value less than which will be considered as non shaking state
 */
- (void)setMinimumRunningAcceleration:(CGFloat)acceleration;

/**
 *@param Collect diagnostics data when set to YES
 */
- (void)setDebugMode:(BOOL)debug;

- (NSString*) motionActivityName;

- (int) motionActivityConfidence;

/**
 * Return vectorSum, shakes data for testing / analysis
 */
- (NSArray*) getDiagnosticsData;

@end