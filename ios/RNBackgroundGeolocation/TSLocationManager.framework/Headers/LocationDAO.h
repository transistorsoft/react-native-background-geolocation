//
//  LocationDAO.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2015-05-13.
//  Copyright (c) 2015 Transistor Software. All rights reserved.
//
#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>

typedef struct sqlite3 sqlite3;

@interface LocationDAO : NSObject
{
    sqlite3 *dbh;
    NSString *databasePath;
}

+ (LocationDAO *)getInstance;
- (BOOL) persist:(NSDictionary*)data timestamp:(NSDate*)timestamp maxRecords:(NSInteger)maxRecords;
- (BOOL) shrink:(NSInteger)maxRecordsToPersist;
- (BOOL) clear;
- (BOOL) purge:(NSInteger)maxDaysToPersist;
- (BOOL) destroy:(NSNumber*)id;
- (BOOL) destroyAll:(NSArray*)records;
- (BOOL) unlock:(NSNumber*)id;
- (BOOL) unlockAll:(NSArray*)records;
- (int) getCount;
- (NSArray*) all;
- (NSArray*) allWithLocking:(NSInteger)limit;
- (NSDictionary*) first;

@end