//
//  TSSchedule.h
//  BG Geo
//
//  Created by Christopher Scott on 2016-04-25.
//
//
@interface TSSchedule : NSObject
{
    
}
@property (nonatomic) NSDateComponents* onTime;
@property (nonatomic) NSDate* onDate;

@property (nonatomic) NSDateComponents* offTime;
@property (nonatomic) NSDate* offDate;
@property (nonatomic) BOOL triggered;
@property (copy) void (^handlerBlock) (TSSchedule *schedule);


-(TSSchedule*)initWithRecord:(NSString*)data andHandler:(void (^)(TSSchedule*))handler;

-(void)make:(NSDateComponents*)NSDateComponents;
-(BOOL)hasDay:(NSInteger)day;
-(BOOL)startsBefore:(NSDate*)now;
-(BOOL)startsAfter:(NSDate*)now;
-(BOOL)endsBefore:(NSDate*)now;
-(BOOL)endsAfter:(NSDate*)now;
-(BOOL)expired;
-(void)trigger:(BOOL)enabled;
-(void)reset;
-(void)evaluate;


@end
