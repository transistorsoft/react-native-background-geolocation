//
//  TSSchedule.h
//  BG Geo
//
//  Created by Christopher Scott on 2016-04-25.
//
//
#import "TSConfig.h"

@interface TSSchedule : NSObject
{
    
}
@property (nonatomic) NSDateComponents* onTime;
@property (nonatomic) NSDate* onDate;

@property (nonatomic) NSDateComponents* offTime;
@property (nonatomic) NSDate* offDate;
@property (nonatomic) BOOL triggered;
@property (nonatomic) TSTrackingMode trackingMode;

@property (copy) void (^handlerBlock) (TSSchedule *schedule);

-(instancetype)initWithRecord:(NSString*)data andHandler:(void (^)(TSSchedule*))handler;

-(void)make:(NSDateComponents*)NSDateComponents;
-(BOOL)isNext:(NSDate*)now;
-(BOOL)isLiteralDate;
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
