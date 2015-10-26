#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>
#import <CoreLocation/CoreLocation.h>
#import <AudioToolbox/AudioToolbox.h>
#import "SOMotionDetector.h"

@interface TSLocationManager : NSObject <CLLocationManagerDelegate>

@property (nonatomic) CLLocationDistance odometer;
@property (nonatomic, strong) CLLocationManager* locationManager;
@property (nonatomic) NSDate *stoppedAt;
@property (nonatomic) UIBackgroundTaskIdentifier motionDetectionTask;
@property (nonatomic) SOMotionType motionType;

// Blocks
@property (copy) void (^httpResponseBlock) (NSInteger statusCode, NSDictionary *requestData, NSData *responseData, NSError *error);
@property (copy) void (^locationChangedBlock) (CLLocation *location, BOOL isMoving);
@property (copy) void (^motionChangedBlock) (CLLocation *location, BOOL isMoving);
@property (copy) void (^geofenceBlock) (CLCircularRegion *region, CLLocation *location, NSString *action);
@property (copy) void (^syncCompleteBlock) (NSArray *locations);
@property (copy) void (^errorBlock) (NSString *type, NSError *error);

- (void) configure:(NSDictionary*)config;
- (void) start;
- (void) stop;
- (NSArray*) sync;
- (NSArray*) getLocations;
- (UIBackgroundTaskIdentifier) createBackgroundTask;
- (void) stopBackgroundTask:(UIBackgroundTaskIdentifier)taskId;
- (void) error:(UIBackgroundTaskIdentifier)taskId message:(NSString*)message;
- (void) changePace:(BOOL)value;
- (void) setConfig:(NSDictionary*)command;
- (NSDictionary*) getState;
- (NSDictionary*) getStationaryLocation;
- (void) onSuspend:(NSNotification *)notification;
- (void) onResume:(NSNotification *)notification;
- (void) onAppTerminate;
- (BOOL) isEnabled;
- (NSMutableDictionary*) locationToDictionary:(CLLocation*)location;
- (void) addGeofence:(NSString*)identifier radius:(CLLocationDistance)radius latitude:(CLLocationDegrees)latitude longitude:(CLLocationDegrees)longitude notifyOnEntry:(BOOL)notifyOnEntry notifyOnExit:(BOOL)notifyOnExit;
- (BOOL) removeGeofence:(NSString*)identifier;
- (NSArray*) getGeofences;
- (void) updateCurrentPosition:(NSDictionary*)options;
- (void) playSound:(SystemSoundID)soundId;
- (void) notify:(NSString*)message;
- (BOOL) clearDatabase;
@end

