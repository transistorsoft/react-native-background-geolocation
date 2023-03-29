//
//  SQLQuery.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2019-10-22.
//  Copyright © 2019 Transistor Software. All rights reserved.
//

typedef enum SQLQueryOrder : NSInteger {
    tsSQLQueryOrderDESC = -1,
    tsSQLQueryOrderASC = 1
} SQLQueryOrder;

@interface SQLQuery : NSObject
{
    @protected
    NSString *_tableName;
    NSString *_orderColumn;
    NSString *_timestampColumn;
}

@property (nonatomic) double start;
@property (nonatomic) double end;
@property (nonatomic) int limit;
@property (nonatomic) SQLQueryOrder order;

- (instancetype) initWithDictionary:(NSDictionary*)params;

- (NSString*) render;
- (NSArray*) arguments;
- (NSString*) toString;
    
@end

