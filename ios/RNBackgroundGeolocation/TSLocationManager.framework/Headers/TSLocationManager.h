#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>
#import <CoreLocation/CoreLocation.h>
#import <AudioToolbox/AudioToolbox.h>
#import "TSSchedule.h"
#import "TSLocation.h"
#import "TSActivityChangeEvent.h"
#import "TSProviderChangeEvent.h"
#import "TSHttpEvent.h"
#import "TSHeartbeatEvent.h"
#import "TSScheduleEvent.h"
#import "TSGeofencesChangeEvent.h"
#import "TSPowerSaveChangeEvent.h"
#import "TSConnectivityChangeEvent.h"
#import "TSEnabledChangeEvent.h"
#import "TSGeofenceEvent.h"
#import "TSGeofence.h"
#import "LocationManager.h"
#import "TSConfig.h"
#import "TSCurrentPositionRequest.h"
#import "TSWatchPositionRequest.h"

@interface TSLocationManager : NSObject <CLLocationManagerDelegate>

#pragma mark - Properties

@property (nonatomic) UIViewController* viewController;
@property (nonatomic, strong) CLLocationManager* locationManager;
@property (nonatomic) NSDate *stoppedAt;
@property (nonatomic) UIBackgroundTaskIdentifier preventSuspendTask;
@property (nonatomic, readonly) BOOL clientReady;

+ (TSLocationManager *)sharedInstance;

#pragma mark - Event Listener Methods

- (void) onLocation:(void(^)(TSLocation* location))success failure:(void(^)(NSError*))failure;
- (void) onHttp:(void(^)(TSHttpEvent* event))success;
- (void) onGeofence:(void(^)(TSGeofenceEvent* event))success;
- (void) onHeartbeat:(void(^)(TSHeartbeatEvent* event))success;
- (void) onMotionChange:(void(^)(TSLocation* event))success;
- (void) onActivityChange:(void(^)(TSActivityChangeEvent* event))success;
- (void) onProviderChange:(void(^)(TSProviderChangeEvent* event))success;
- (void) onGeofencesChange:(void(^)(TSGeofencesChangeEvent* event))success;
- (void) onSchedule:(void(^)(TSScheduleEvent* event))success;
- (void) onPowerSaveChange:(void(^)(TSPowerSaveChangeEvent* event))success;
- (void) onConnectivityChange:(void(^)(TSConnectivityChangeEvent* event))succes;
- (void) onEnabledChange:(void(^)(TSEnabledChangeEvent* event))success;

- (void) removeListener:(NSString*)event callback:(void(^)(id))callback;
- (void) un:(NSString*)event callback:(void(^)(id))callback;
- (void) removeListeners:(NSString*)event;
- (void) removeListenersForEvent:(NSString*)event;
- (void) removeListeners;

#pragma mark - Core API Methods

- (void) configure:(NSDictionary*)params;
- (void) ready;
- (void) start;
- (void) stop;
- (void) startSchedule;
- (void) stopSchedule;
- (void) startGeofences;
- (NSMutableDictionary*) getState;

#pragma mark - Geolocation Methods

- (void) changePace:(BOOL)value;
- (void) getCurrentPosition:(TSCurrentPositionRequest*)request;
- (void) setOdometer:(CLLocationDistance)odometer request:(TSCurrentPositionRequest*)request;
- (CLLocationDistance)getOdometer;
- (void) watchPosition:(TSWatchPositionRequest*)request;
- (void) stopWatchPosition;
- (NSDictionary*) getStationaryLocation;
- (TSProviderChangeEvent*) getProviderState;
- (void) requestPermission:(void(^)(NSNumber *status))success failure:(void(^)(NSNumber *status))failure;

#pragma mark - HTTP & Persistence Methods

- (void) sync:(void(^)(NSArray* locations))success failure:(void(^)(NSError* error))failure;
- (void) getLocations:(void(^)(NSArray* locations))success failure:(void(^)(NSString* error))failure;
- (BOOL) clearDatabase;
- (BOOL) destroyLocations;
- (void) destroyLocations:(void(^)(void))success failure:(void(^)(NSString* error))failure;
- (void) insertLocation:(NSDictionary*)params success:(void(^)(NSString* uuid))success failure:(void(^)(NSString* error))failure;
- (int) getCount;

#pragma mark - Application Methods

- (UIBackgroundTaskIdentifier) createBackgroundTask;
- (void) stopBackgroundTask:(UIBackgroundTaskIdentifier)taskId;
- (BOOL) isPowerSaveMode;

#pragma mark - Logging & Debug Methods

- (void) getLog:(void(^)(NSString* log))success failure:(void(^)(NSString* error))failure;
- (void) emailLog:(NSString*)email success:(void(^)(void))success failure:(void(^)(NSString* error))failure;
- (BOOL) destroyLog;
- (void) setLogLevel:(TSLogLevel)level;
- (void) playSound:(SystemSoundID)soundId;
- (void) error:(UIBackgroundTaskIdentifier)taskId message:(NSString*)message;
- (void) log:(NSString*)level message:(NSString*)message;
#pragma mark - Geofencing Methods

- (void) addGeofence:(TSGeofence*)geofence success:(void (^)(void))success failure:(void (^)(NSString* error))failure;
- (void) addGeofences:(NSArray*)geofences success:(void (^)(void))success failure:(void (^)(NSString* error))failure;
- (void) removeGeofence:(NSString*)identifier success:(void (^)(void))success failure:(void (^)(NSString* error))failure;
- (void) removeGeofences:(NSArray*)identifiers success:(void (^)(void))success failure:(void (^)(NSString* error))failure;;
- (void) removeGeofences;

- (NSArray*) getGeofences;
- (void) getGeofences:(void (^)(NSArray*))success failure:(void (^)(NSString*))failure;
- (void) geofenceExists:(NSString*)identifier callback:(void (^)(BOOL))callback;

#pragma mark - Sensor Methods

-(BOOL) isMotionHardwareAvailable;
-(BOOL) isDeviceMotionAvailable;
-(BOOL) isAccelerometerAvailable;
-(BOOL) isGyroAvailable;
-(BOOL) isMagnetometerAvailable;

#pragma mark - Application life-cycle callbacks

- (void) onSuspend:(NSNotification *)notification;
- (void) onResume:(NSNotification *)notification;
- (void) onAppTerminate;

@end

