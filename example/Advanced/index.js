import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import BackgroundGeolocation from 'react-native-background-geolocation';


const AppWrapper = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <BottomSheetModalProvider>
        <App />
      </BottomSheetModalProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
);


AppRegistry.registerComponent(appName, () => AppWrapper);

////
// Define your Headless task -- simply a javascript async function to receive 
// events from BackgroundGeolocation:
//
const BGHeadlessTask = async (event) => {
  const params = event.params;
  console.log('[BackgroundGeolocation HeadlessTask] -', event.name, params);
  
  switch (event.name) {
    case 'terminate':
      await doCustomWork();
      break;
    case 'heartbeat':
      // Use await for async tasks
      const location = await getCurrentPosition({
        samples: 1,
        extras: {
          headless: true
        },
        persist: true
      });
      console.log('[BackgroundGeolocation HeadlessTask] - getCurrentPosition:', location);
      break;
  }  
}

////
// You're free to execute any kind of work within your headless-task (eg: HTTP requests), just be sure to wrap in a Promise
// and await the result (
//
const doCustomWork =  () => {
  return new Promise(async (resolve) => {     
    // Simulate a long-running task, such as an HTTP request.
    console.log('[doWork] START');

    const location = await BackgroundGeolocation.getCurrentPosition({
      samples: 1,
      extras: {
        headless: true
      },
      persist: true
    });
    console.log('[BackgroundGeolocation HeadlessTask] - getCurrentPosition:', location);

    setTimeout(() => {
      console.log('[doWork] FINISH');
      resolve();
    }, 10000);
  });
};

////
// Register your HeadlessTask with BackgroundGeolocation plugin.
//
BackgroundGeolocation.registerHeadlessTask(BGHeadlessTask);
