//
//  LocationAuthorization.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2016-07-27.
//  Copyright © 2016 Transistor Software. All rights reserved.
//

#import <CoreLocation/CoreLocation.h>
#import <UIKit/UIKit.h>

@class LocationAuthorization;
@interface LocationAuthorization : NSObject

+(void) requestLocationAuthorization:(CLLocationManager*) locationManager;

@end

