package com.transistorsoft.rnbackgroundgeolocation;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;


/**
 * React Native package for RNBackgroundGeolocation.
 * This is used by the old architecture and by autolinking.
 * The new architecture / TurboModule path is driven by codegen + RNBackgroundGeolocationModule.
 * 
 * Created by chris on 2015-10-30.
 */
public class RNBackgroundGeolocation implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new RNBackgroundGeolocationModule(reactContext));
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}