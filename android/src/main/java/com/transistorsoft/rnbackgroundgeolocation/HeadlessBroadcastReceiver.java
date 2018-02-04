package com.transistorsoft.rnbackgroundgeolocation;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

/**
 * Created by chris on 2018-01-23.
 */

public class HeadlessBroadcastReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        WritableMap event = Arguments.fromBundle(intent.getExtras());

        new HeadlessTask(context.getApplicationContext(), event, new HeadlessTask.Callback() {
            @Override
            public void onComplete() {
                // Do nothing.  This is only required for JobService
            }
        });
    }
}
