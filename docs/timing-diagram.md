
	                       ________________________________
	App awake?                                             |___ <-- iOS has suspended the app when stop-detection expires
						   __________                      .
	GPS ON?                          |_____________________.___
	                                 .                     .
                                  	 .<-- GPS OFF when stop-detection engages (to conserve battery)
	                       ___       .                     .
	motion-state moving?      |____________________________.___
	                          .      .                     .
	                          .      .                     .
	                          ........                     .
	stopDetectionDelay:    ___|      |_____________________.___
	                                 .                     .
	                                 .                     .
          	 begin stop-detection -->.                     .<-- end stop-detection
	                                 ._____________________.
	stop-detection engage: __________|                     |___
                                  	 .                     .
	                                 .start                .expire
                                	 .                     .
	                                 .......................      
	stopTimeout:           __________|                     |___











