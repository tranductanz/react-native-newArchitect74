//
//  GetPayloadDataModule.m
//  newXfone
//
//  Created by Trần Tân on 25/4/24.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface GetPayloadDataModule : NSObject <RCTBridgeModule>
@end

@implementation GetPayloadDataModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getStoredPayloadData:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSDictionary *storedPayloadData = [defaults objectForKey:@"storedPayloadData"];

    if (storedPayloadData != nil) {
        resolve(storedPayloadData);
    } else {
        reject(@"NO_DATA", @"No stored payload data found.", nil);
    }
}

@end

