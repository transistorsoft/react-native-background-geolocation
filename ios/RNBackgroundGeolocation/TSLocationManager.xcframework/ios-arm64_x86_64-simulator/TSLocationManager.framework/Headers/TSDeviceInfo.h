//
//  DeviceInfo.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2019-11-21.
//  Copyright © 2019 Christopher Scott. All rights reserved.
//
#import <objc/runtime.h>
#import <sys/utsname.h>

@interface TSDeviceInfo:NSObject

+ (TSDeviceInfo *)sharedInstance;

@property(nonatomic) NSString* model;
@property(nonatomic) NSString* manufacturer;
@property(nonatomic) NSString* platform;
@property(nonatomic) NSString* version;

-(NSDictionary*) toDictionary;
-(NSDictionary*) toDictionary:(NSString*)framework;

@end

