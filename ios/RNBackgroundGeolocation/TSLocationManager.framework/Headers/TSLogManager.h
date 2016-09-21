//
//  LogManager.h
//  TSLocationManager
//
//  Created by Christopher Scott on 2016-02-29.
//  Copyright © 2016 Transistor Software. All rights reserved.
//


#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <MessageUI/MessageUI.h>

@interface TSLogManager : NSObject <MFMailComposeViewControllerDelegate>

-(TSLogManager*)initWithViewController:(UIViewController*)viewController;
-(NSString*)getLog;
-(void)emailLog:(NSString*)to body:(NSString*)body;

@end

