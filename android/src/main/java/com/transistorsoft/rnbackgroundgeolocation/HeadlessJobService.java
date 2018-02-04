package com.transistorsoft.rnbackgroundgeolocation;

import android.annotation.TargetApi;
import android.app.job.JobParameters;
import android.app.job.JobService;
import android.os.Bundle;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

/**
 * Created by chris on 2018-01-23.
 */

@TargetApi(21)
public class HeadlessJobService extends JobService {

    @Override
    public boolean onStartJob(final JobParameters params) {
        WritableMap event = Arguments.fromBundle(new Bundle(params.getExtras()));

        new HeadlessTask(getApplicationContext(), event, new HeadlessTask.Callback() {
            @Override
            public void onComplete() {
                jobFinished(params, false);
            }
        });
        return true;
    }
    @Override
    public boolean onStopJob(JobParameters params) {
        jobFinished(params, false);
        return true;
    }
}