//
//  AtomicBoolean.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2018-11-14.
//  Copyright © 2018 Transistor Software. All rights reserved.
//

@import Foundation;

/// :nodoc:
@interface AtomicBoolean : NSObject
- (instancetype)initWithValue:(BOOL)value;
- (BOOL)getValue;
- (void)setValue:(BOOL)value;
- (BOOL)compareTo:(BOOL)expected andSetValue:(BOOL)value;
- (BOOL)getAndSetValue:(BOOL)value;
@end
