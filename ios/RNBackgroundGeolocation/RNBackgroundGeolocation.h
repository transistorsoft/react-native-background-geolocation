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
#import <React/RCTEventEmitter.h>
#import <React/RCTInvalidating.h>

@interface RNBackgroundGeolocation : RCTEventEmitter <RCTInvalidating>

@property (nonatomic, strong) TSLocationManager* locationManager;

@end

