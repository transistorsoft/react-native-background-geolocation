#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>
#import <CoreLocation/CoreLocation.h>
#import <AudioToolbox/AudioToolbox.h>

@interface TSLocationManager : NSObject <CLLocationManagerDelegate>

@property (nonatomic) CLLocationDistance odometer;
@property (nonatomic, strong) CLLocationManager* locationManager;

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
- (NSDictionary*) getStationaryLocation;
- (void) onSuspend:(NSNotification *)notification;
- (void) onResume:(NSNotification *)notification;
- (void) onAppTerminate;
- (BOOL) isEnabled;
- (NSDictionary*) locationToDictionary:(CLLocation*)location;
- (void) addGeofence:(NSString*)identifier radius:(CLLocationDistance)radius latitude:(CLLocationDegrees)latitude longitude:(CLLocationDegrees)longitude notifyOnEntry:(BOOL)notifyOnEntry notifyOnExit:(BOOL)notifyOnExit;
- (BOOL) removeGeofence:(NSString*)identifier;
- (NSArray*) getGeofences;
- (void) updateCurrentPosition;
- (void) playSound:(SystemSoundID)soundId;
@end

