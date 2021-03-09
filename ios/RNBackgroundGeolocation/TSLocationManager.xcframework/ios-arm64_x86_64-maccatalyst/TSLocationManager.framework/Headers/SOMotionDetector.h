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
#import <CoreLocation/CoreLocation.h>

@class SOMotionDetector;
typedef enum
{
    MotionTypeStationary = 1,
    MotionTypeWalking,
    MotionTypeRunning,
    MotionTypeAutomotive,
    MotionTypeCycling,
    MotionTypeUnknown,
    MotionTypeMoving
} SOMotionType;

@interface SOMotionDetector : NSObject

#pragma mark - Singleton
+ (SOMotionDetector *)sharedInstance;

#pragma mark - Properties

@property (copy) void (^motionActivityChangedBlock) (CMMotionActivity *activity);
@property (copy) void (^motionTypeChangedBlock) (SOMotionType motionType, int shakeCount, double averageVectorSum);
@property (copy) void (^accelerationChangedBlock) (CMAcceleration acceleration);

@property (atomic, readonly) SOMotionType motionType;
@property (atomic) CMMotionActivity* motionActivity;
@property (atomic, readonly) BOOL accelerometerAvailable;
@property (atomic, readonly) BOOL isMoving;

@property (atomic) CLLocation* location;
@property (atomic) double currentSpeed;
@property (atomic) CMAcceleration acceleration;
@property (atomic, readonly) BOOL isShaking;
@property (atomic) NSTimeInterval accelerometerUpdateInterval;

/**
 * Set this parameter to YES if you want to use M7 chip to detect more exact motion type. By default is No.
 * Set this parameter before calling startDetection method.
 * Available only on devices that have M7 chip. At this time only the iPhone 5S, iPhone6/6plus, the iPad Air and iPad mini with retina display have the M7 coprocessor.
 */
@property (atomic) BOOL useM7IfAvailable NS_AVAILABLE_IOS(7_0);
@property (atomic) BOOL M7Authorized;

// For debug/diagnostics mode
@property (atomic) BOOL debug;
@property (atomic) NSString *statedActivity;

#pragma mark - Methods
-(BOOL) isDeviceMotionAvailable;
-(BOOL) isAccelerometerAvailable;
-(BOOL) isGyroAvailable;
-(BOOL) isMagnetometerAvailable;
- (void)startDetection;
- (void)stopDetection;
- (void)stopShakeDetection;
- (void)startShakeDetection:(NSTimeInterval)sampleRate;
- (void)calculate;
- (BOOL)isUsingM7;

#pragma mark - Customization Methods

+ (BOOL) motionHardwareAvailable;

- (void) setMotionDetectionInterval:(NSTimeInterval)interval;
- (void) setAccelerometerUpdateInterval:(double)interval;
- (BOOL) isMoving;

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
 * @param location Set the current location
 */
- (void)setLocation:(CLLocation*)location isMoving:(BOOL)isMoving;

- (BOOL) queryMotionActivityHistory;

/**
 * Return the human-readable activity name
 */
- (NSString*) motionTypeName;
- (NSString*) motionTypeName:(SOMotionType)motionType;
/**
 * Return confidence of current motion activity name
 */
- (int) motionActivityConfidence;

/**
 * Return vectorSum, shakes data for testing / analysis
 */
- (NSArray*) getDiagnosticsData;

@end
