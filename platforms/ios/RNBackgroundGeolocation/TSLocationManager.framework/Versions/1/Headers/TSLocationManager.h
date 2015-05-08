#import <CoreLocation/CoreLocation.h>
#import <AudioToolbox/AudioToolbox.h>
#import <sqlite3.h>

@interface TSLocationManager : NSObject <CLLocationManagerDelegate>

@property (strong, nonatomic) NSString *databasePath;
@property (nonatomic) sqlite3 *db;

- (void) configure:(NSDictionary*)config;
- (void) start;
- (void) stop;
- (void) finish;
- (void) stopBackgroundTask;
- (void) onPaceChange:(BOOL)value;
- (void) setConfig:(NSDictionary*)command;
- (NSDictionary*) getStationaryLocation;
- (void) onSuspend:(NSNotification *)notification;
- (void) onResume:(NSNotification *)notification;
- (void) onAppTerminate;
- (BOOL) isEnabled;
- (NSMutableDictionary*) locationToDictionary:(CLLocation*)location;

@end

