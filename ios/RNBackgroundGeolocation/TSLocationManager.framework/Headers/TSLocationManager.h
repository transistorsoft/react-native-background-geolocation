#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>
#import <CoreLocation/CoreLocation.h>
#import <AudioToolbox/AudioToolbox.h>
#import "TSSchedule.h"
#import "LocationManager.h"

@interface TSLocationManager : NSObject <CLLocationManagerDelegate>

@property (nonatomic) UIViewController* viewController;
@property (nonatomic, strong) CLLocationManager* locationManager;
@property (nonatomic) NSDate *stoppedAt;
@property (nonatomic) UIBackgroundTaskIdentifier preventSuspendTask;

// Blocks
@property (nonatomic, copy) void (^httpResponseBlock) (NSInteger statusCode, NSDictionary *requestData, NSData *responseData, NSError *error);
@property (nonatomic, copy) void (^locationChangedBlock) (NSDictionary *locationData, enum tsLocationType, BOOL isMoving);
@property (nonatomic, copy) void (^motionChangedBlock) (NSDictionary *locationData, BOOL isMoving);
@property (nonatomic, copy) void (^activityChangedBlock) (NSString *activityName);
@property (nonatomic, copy) void (^heartbeatBlock) (NSString* motionType, NSDictionary *locationData);
@property (nonatomic, copy) void (^geofenceBlock) (CLCircularRegion *region, NSDictionary *locationData, NSString *action);
@property (nonatomic, copy) void (^syncCompleteBlock) (NSArray *locations);
@property (nonatomic, copy) void (^errorBlock) (NSString *type, NSError *error);
@property (nonatomic, copy) void (^scheduleBlock) (TSSchedule* schedule);
@property (nonatomic, copy) void (^authorizationChangedBlock) (CLAuthorizationStatus status);

+ (TSLocationManager *)sharedInstance;

// Methods
- (NSDictionary*) configure:(NSDictionary*)config;
- (void) start;
- (void) stop;
- (void) startSchedule;
- (void) stopSchedule;
- (NSArray*) sync;
- (NSArray*) getLocations;
- (UIBackgroundTaskIdentifier) createBackgroundTask;
- (void) stopBackgroundTask:(UIBackgroundTaskIdentifier)taskId;
- (void) error:(UIBackgroundTaskIdentifier)taskId message:(NSString*)message;
- (void) changePace:(BOOL)value;
- (void) setConfig:(NSDictionary*)command;
- (NSMutableDictionary*) getState;
- (NSDictionary*) getStationaryLocation;
- (void) onSuspend:(NSNotification *)notification;
- (void) onResume:(NSNotification *)notification;
- (void) onAppTerminate;
- (NSMutableDictionary*) locationToDictionary:(CLLocation*)location;
- (NSMutableDictionary*) locationToDictionary:(CLLocation*)location type:(tsLocationtype)type extras:(NSDictionary*)extras;
- (void) addGeofence:(NSString*)identifier radius:(CLLocationDistance)radius latitude:(CLLocationDegrees)latitude longitude:(CLLocationDegrees)longitude notifyOnEntry:(BOOL)notifyOnEntry notifyOnExit:(BOOL)notifyOnExit;
- (void) addGeofences:(NSArray*)geofences;
- (BOOL) removeGeofence:(NSString*)identifier;
- (BOOL) removeGeofences;
- (NSArray*) getGeofences;
- (void) updateCurrentPosition:(NSDictionary*)options;
- (void) watchPosition:(NSDictionary*)options;
- (void) stopWatchPosition;
- (void) playSound:(SystemSoundID)soundId;
- (void) notify:(NSString*)message;
- (BOOL) clearDatabase;
- (BOOL) destroyLocations;
- (BOOL) insertLocation:(NSDictionary*)params;
- (int) getCount;
- (NSString*) getLog;
- (BOOL) destroyLog;
- (void) emailLog:(NSString*)to;
- (void) setLogLevel:(NSInteger)level;
- (CLLocationDistance)getOdometer;
- (void) resetOdometer;

@end

