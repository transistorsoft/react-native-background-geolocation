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
#import "RCTBridgeModule.h"
#import "RCTLog.h"
#import <AudioToolbox/AudioToolbox.h>

@interface RNBackgroundGeoLocation : NSObject <RCTBridgeModule, CLLocationManagerDelegate>

@property (nonatomic, strong) NSString* syncCallbackId;
@property (nonatomic, strong) NSMutableArray* stationaryRegionListeners;

- (void) onSuspend:(NSNotification *)notification;
- (void) onResume:(NSNotification *)notification;
- (void) onAppTerminate;

@end

