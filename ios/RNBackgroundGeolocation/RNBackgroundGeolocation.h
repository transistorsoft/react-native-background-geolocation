//
//  RNBackgroundGeolocation.h
//  RNBackgroundGeolocation
//
//  Created by Christopher Scott on 2015-04-19.
//  Copyright (c) 2015 Transistor Software. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>
#import <UIKit/UIKit.h>
#import <AudioToolbox/AudioToolbox.h>
#import <TSLocationManager/TSLocationManager.h>

#if __has_include("RCTEventEmitter.h")
#import "RCTEventEmitter.h"
#else
#import <React/RCTEventEmitter.h>
#endif

#if __has_include("RCTInvalidating.h")
#import "RCTInvalidating.h"
#else
#import <React/RCTInvalidating.h>
#endif

@interface RNBackgroundGeolocation : RCTEventEmitter <RCTInvalidating>

@property (nonatomic, strong) TSLocationManager* locationManager;
@property (nonatomic, strong) NSDictionary* syncCallback;

@end

