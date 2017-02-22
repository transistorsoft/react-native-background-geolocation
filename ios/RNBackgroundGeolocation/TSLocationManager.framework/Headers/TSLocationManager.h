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
@property (nonatomic, copy) void (^geofenceBlock) (NSDictionary *geofenceData);
@property (nonatomic, copy) void (^syncCompleteBlock) (NSArray *locations);
@property (nonatomic, copy) void (^errorBlock) (NSString *type, NSError *error);
@property (nonatomic, copy) void (^scheduleBlock) (TSSchedule* schedule);
@property (nonatomic, copy) void (^authorizationChangedBlock) (CLAuthorizationStatus status);

+ (TSLocationManager *)sharedInstance;


// Methods
- (NSDictionary*) configure:(NSDictionary*)config;
- (void) addListener:(NSString*)event callback:(void (^)(NSDictionary*))callback;
- (void) start;
- (void) stop;
- (void) startSchedule;
- (void) stopSchedule;
- (void) startGeofences;
- (NSArray*) sync;
- (NSArray*) getLocations;
- (UIBackgroundTaskIdentifier) createBackgroundTask;
- (void) stopBackgroundTask:(UIBackgroundTaskIdentifier)taskId;
- (void) error:(UIBackgroundTaskIdentifier)taskId message:(NSString*)message;
- (void) changePace:(BOOL)value;
- (NSDictionary*) setConfig:(NSDictionary*)command;
- (NSMutableDictionary*) getState;
- (NSDictionary*) getStationaryLocation;
- (void) onSuspend:(NSNotification *)notification;
- (void) onResume:(NSNotification *)notification;
- (void) onAppTerminate;
- (void) addGeofence:(NSDictionary*)params success:(void (^)(NSString*))success error:(void (^)(NSString*))error;
- (void) addGeofences:(NSArray*)geofences success:(void (^)(NSString*))success error:(void (^)(NSString*))error;
- (void) removeGeofence:(NSString*)identifier success:(void (^)(NSString*))success error:(void (^)(NSString*))error;
- (void) removeGeofences:(NSArray*)identifiers success:(void (^)(NSString*))success error:(void (^)(NSString*))error;;
- (NSArray*) getGeofences;
- (void) getCurrentPosition:(NSDictionary*)options success:(void (^)(NSDictionary*))success failure:(void (^)(NSError*))failure;
- (void) watchPosition:(NSDictionary*)options success:(void (^)(NSDictionary*))success failure:(void (^)(NSError*))failure;
- (void) stopWatchPosition;
- (void) playSound:(SystemSoundID)soundId;
- (BOOL) clearDatabase;
- (BOOL) destroyLocations;
- (BOOL) insertLocation:(NSDictionary*)params;
- (int) getCount;
- (NSString*) getLog;
- (BOOL) destroyLog;
- (void) emailLog:(NSString*)to;
- (void) setLogLevel:(NSInteger)level;
- (CLLocationDistance)getOdometer;
- (void) setOdometer:(CLLocationDistance)odometer success:(void (^)(NSDictionary*))success failure:(void (^)(NSError*))failure;

@end

