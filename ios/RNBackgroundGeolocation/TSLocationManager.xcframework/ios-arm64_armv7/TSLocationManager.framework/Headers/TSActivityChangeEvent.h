//
//  TSActivityChange.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2017-07-28.
//  Copyright © 2017 Transistor Software. All rights reserved.
//

@interface TSActivityChangeEvent : NSObject

@property (nonatomic, readonly) NSInteger confidence;
@property (nonatomic, readonly) NSString *activity;

-(id) initWithActivityName:(NSString*)activityName confidence:(NSInteger)confidence;
-(NSDictionary*) toDictionary;
@end
