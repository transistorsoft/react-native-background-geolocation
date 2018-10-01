//
//  TSConnectivityChangeEvent.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2018-02-22.
//  Copyright © 2018 Transistor Software. All rights reserved.
//

@interface TSConnectivityChangeEvent : NSObject

@property (nonatomic, readonly) BOOL hasConnection;

-(instancetype) initWithHasConnection:(BOOL)hasConnection;
-(NSDictionary*) toDictionary;
@end


