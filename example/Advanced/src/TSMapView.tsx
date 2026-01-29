import React, { useRef } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageSource
} from 'react-native';

import MapView, { 
  Marker, 
  Polyline, 
  Circle, 
  Polygon,
  PROVIDER_GOOGLE } from 'react-native-maps';

import {trigger as hapticFeedback} from "react-native-haptic-feedback";

import {
  toRad,
  toDeg,
  getBearing,
  computeOffsetCoordinate
} from "./util/GeoMath"

import * as MarkerImages from '../images/markers';
import AddGeofenceTypeSheet, { AddGeofenceType } from './AddGeofenceTypeSheet';
import AddGeofenceSheet from './AddGeofenceSheet';
import {COLORS} from './util/Colors';

import BackgroundGeolocation, {
  Location,
  MotionChangeEvent,
  GeofencesChangeEvent,
  GeofenceEvent,
  Geofence
} from 'react-native-background-geolocation';

/// A default empty location object for the MapView.
const UNDEFINED_LOCATION = {
  timestamp: '',
  latitude:0,
  longitude:0
}

/// Zoom values for the MapView
const LATITUDE_DELTA = 0.00922;
const LONGITUDE_DELTA = 0.00421;

/// Color consts for MapView markers.
const STATIONARY_REGION_FILL_COLOR = "rgba(200,0,0,0.2)"
const STATIONARY_REGION_STROKE_COLOR = "rgba(200,0,0,0.2)"
const GEOFENCE_STROKE_COLOR = "rgba(17,183,0,0.8)"
const GEOFENCE_FILL_COLOR   ="rgba(17,183,0, 0.2)"
const POLYGON_GEOFENCE_FILL_COLOR = "rgba(38, 118, 255, 0.3)";
const GEOFENCE_STROKE_COLOR_ACTIVATED = "rgba(127,127,127,0.5)";
const GEOFENCE_FILL_COLOR_ACTIVATED = "rgba(127,127,127, 0.2)";
const POLYGON_FILL_COLOR = "rgba(33,150,243, 0.4)";
const POLYGON_STROKE_COLOR = "rgba(33,150,243, 1.0)";

interface TSMapViewProps {
  hideAddGeofencePrompt?: boolean;
}

const TSMapView: React.FC<TSMapViewProps> = ({ hideAddGeofencePrompt = false }) => {

  const [markers, setMarkers] = React.useState<any[]>([]);
  const [tracksViewChanges, setTracksViewChanges] = React.useState(false);
  const [followsUserLocation, setFollowUserLocation] = React.useState(true);
  const [showsUserLocation, setShowsUserLocation] = React.useState(false);
  const [mapScrollEnabled, setMapScrollEnabled] = React.useState(false);
  const [mapCenter, setMapCenter] = React.useState({
    latitude: 45.518853,
    longitude: -73.60055,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  });
  const [autoCenterEnabled, setAutoCenterEnabled] = React.useState(true);
  const autoCenterEnabledRef = React.useRef(true);

  const [stationaryLocation, setStationaryLocation] = React.useState(UNDEFINED_LOCATION);
  // Keep latest stationaryLocation in a ref for event callbacks (avoid stale closures).
  const stationaryLocationRef = React.useRef(UNDEFINED_LOCATION);
  const [stationaryRadius, setStationaryRadius] = React.useState(0);
  const [stopZones, setStopZones] = React.useState<any[]>([]);
  const [motionChangePolylines, setMotionChangePolylines] = React.useState<any[]>([]);
  const [geofences, setGeofences] = React.useState<any[]>([]);  
  const [polygonGeofences, setPolygonGeofences] = React.useState<any[]>([]);
  // Keep the latest geofence collections in refs so BackgroundGeolocation event callbacks
  // (registered once on mount) can always access current state without stale closures.
  const geofencesRef = React.useRef<any[]>([]);
  const polygonGeofencesRef = React.useRef<any[]>([]);
  const [geofencesHit, setGeofencesHit] = React.useState<any[]>([]);
  const [geofencesHitEvents, setGeofencesHitEvents] = React.useState<any[]>([]);
  // Epoch used to force react-native-maps to fully discard geofence-hit overlays (Polyline can stick on Android).
  const [geofenceHitEpoch, setGeofenceHitEpoch] = React.useState(0);
  const [coordinates, setCoordinates] = React.useState<any[]>([]);
  
  const [isAddGeofenceTypeSheetVisible, setIsAddGeofenceTypeSheetVisible] = React.useState(false);
  const [isAddGeofenceSheetVisible, setIsAddGeofenceSheetVisible] = React.useState(false);
  const [pendingGeofenceCoordinate, setPendingGeofenceCoordinate] = React.useState<{ latitude: number; longitude: number } | null>(null);

  const [isCreatingPolygon, setIsCreatingPolygon] = React.useState(false);
  const [createPolygonGeofenceCoordinates, setCreatePolygonGeofenceCoordinates] = React.useState<any[]>([]);
  const [pendingPolygonVertices, setPendingPolygonVertices] = React.useState<{ latitude: number; longitude: number }[]>([]);
  const [createPolygonEpoch, setCreatePolygonEpoch] = React.useState(0);

  // Workaround (Android): react-native-maps Polyline overlays can sometimes remain stuck after unmount.
  // Bumping this key forces MapView to remount and guarantees all native overlays are removed.
  const [mapEpoch, setMapEpoch] = React.useState(0);

  React.useEffect(() => {        
    // Clear any stale state on mount (dev refresh)
    clearMarkers();
    // Ensure refs start empty on mount.
    geofencesRef.current = [];
    polygonGeofencesRef.current = [];

    const onLocation = BackgroundGeolocation.onLocation((location) => {       
      if ((location.event && location.event == 'motionchange') || (location.extras && location.extras['getCurrentPosition'])) {      
        setAutoCenter(true);          // re-enable follow .getCurrentPosition
      }       
      addMarker(location);
      
      setCenter(location);
    }, error => {
      console.warn('[TSMapView] [location] ERROR -', error);
    });

    const onEnabledChangeListener = BackgroundGeolocation.onEnabledChange((enabled: boolean) => {
      console.log('[TSMapView] [enabledchange] -', enabled);
      setShowsUserLocation(enabled);  
      if (!enabled) {
        clearMarkers();
      }
    });

    const onMotionChangeListener = BackgroundGeolocation.onMotionChange(onMotionChange)
    const onGeofenceChangeListener = BackgroundGeolocation.onGeofencesChange(onGeofencesChange);
    const onGeofenceListener = BackgroundGeolocation.onGeofence(onGeofence);

    return () => {
      onLocation.remove();
      onMotionChangeListener.remove();
      onGeofenceChangeListener.remove();
      onGeofenceListener.remove();
      onEnabledChangeListener.remove();
    };
  }, []);

  const setAutoCenter = React.useCallback((enabled: boolean) => {
    autoCenterEnabledRef.current = enabled;
    setAutoCenterEnabled(enabled);
    setFollowUserLocation(enabled);
  }, []);

  // Update both state + ref so BackgroundGeolocation callbacks always see latest stationaryLocation.
  const setStationaryLocationSafe = React.useCallback((value: typeof UNDEFINED_LOCATION) => {
    stationaryLocationRef.current = value;
    setStationaryLocation(value);
  }, []);

  /// onMotionChangeEvent effect-handler.
  /// show/hide the red stationary-geofence according isMoving
  ///
  const onMotionChange = async (event: MotionChangeEvent) => {
    const location = event.location;

    console.log('[onMotionChange]', event.isMoving, location);

    if (event.isMoving) {
      // 🚗 EXIT stationary → MOVING
      // Create stop-zone marker from the LAST stationary location.
      const lastStationary = stationaryLocationRef.current;
      if (lastStationary.timestamp) {
        // ✅ Add small red circle marker at last stationary location
        setStopZones((prev) => [
          ...prev,
          {
            coordinate: {
              latitude: lastStationary.latitude,
              longitude: lastStationary.longitude,
            },
            key: `stopzone:${lastStationary.timestamp}`,
          },
        ]);
        // ✅ Add green polyline from last stationary -> current motionchange:true location
        setMotionChangePolylines(prev => [
          ...prev,
          {
            key: `motionchange:${lastStationary.timestamp}:${location.timestamp}`,
            coordinates: [
              { latitude: lastStationary.latitude, longitude: lastStationary.longitude },
              { latitude: location.coords.latitude, longitude: location.coords.longitude },
            ],
          },
        ]);
      } else {
        console.log('[onMotionChange] No stationaryLocation recorded yet (stopZone skipped)');
      }

      // Clear stationary visuals/state
      setStationaryRadius(0);
      setStationaryLocationSafe(UNDEFINED_LOCATION);
    } else {
      // 🧍 ENTER stationary
      const state = await BackgroundGeolocation.getState();
      const geofenceProximityRadius = state.geolocation?.geofenceProximityRadius ?? 1000;

      const radius = state.trackingMode === 1 ? 200 : geofenceProximityRadius / 2;

      setStationaryRadius(radius);

      setStationaryLocationSafe({
        timestamp: location.timestamp,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  };
  

  /// Center the map.
  const setCenter = (location: Location) => {
    if (!autoCenterEnabledRef.current) return;

    setMapCenter({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    });
  };

  /// GeofenceEvent effect-handler
  /// Renders geofence event markers to MapView.
  ///
  const onGeofence = (event: GeofenceEvent) => {
    const location: Location = event.location;

    // Push our geofence event coordinate onto the Polyline -- BGGeo deosn't fire onLocation for geofence events.
    setCoordinates(previous => [
      ...previous,
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    ]);

    const currentGeofences = geofencesRef.current;
    const currentPolygonGeofences = polygonGeofencesRef.current;

    // Try to resolve the firing geofence from our in-memory collections.
    // NOTE: Polygon geofences live in `polygonGeofencesRef` and include MEC {center,radius}.
    let marker: any = currentGeofences.find((m: any) => m.identifier === event.identifier);

    if (!marker) {
      marker = currentPolygonGeofences.find((m: any) => m.identifier === event.identifier);
    }

    // Fallback: use MEC fields directly from the geofence event payload.
    // For polygon geofences, the event.geofence should still include MEC latitude/longitude/radius.
    if (!marker) {
      const eg: any = (event as any).geofence;
      if (
        eg &&
        Number.isFinite(eg.radius) &&
        eg.radius > 0 &&
        Number.isFinite(eg.latitude) &&
        Number.isFinite(eg.longitude)
      ) {
        marker = {
          identifier: event.identifier,
          radius: eg.radius,
          center: { latitude: eg.latitude, longitude: eg.longitude },
        };
      }
    }

    console.log('[onGeofence] marker:', event.identifier, marker, {
      circular: currentGeofences.length,
      polygon: currentPolygonGeofences.length,
    });

    if (!marker) {
      console.warn('[onGeofence] No geofence found for event (ignored):', event.identifier);
      return;
    }

    // Guard against missing MEC data (polygon MEC can be 0 if not computed / not licensed).
    if (!marker.center || !Number.isFinite(marker.radius) || marker.radius <= 0) {
      console.warn('[onGeofence] Geofence missing MEC center/radius (ignored):', event.identifier, marker);
      return;
    }

    //marker.fillColor = GEOFENCE_STROKE_COLOR_ACTIVATED;
    //marker.strokeColor = GEOFENCE_STROKE_COLOR_ACTIVATED;

    const coords = location.coords;

    setGeofencesHit(previous => {
      const exists = previous.some((h: any) => h.identifier === event.identifier);
      if (exists) {
        return previous;
      }
      const newHit = {
        identifier: event.identifier,
        radius: marker.radius,
        center: {
          latitude: marker.center.latitude,
          longitude: marker.center.longitude,
        },
        events: [],
      };
      return [...previous, newHit];
    });
    // Get bearing of location relative to geofence center.
    const bearing = getBearing(marker.center, location.coords);
    const edgeCoordinate = computeOffsetCoordinate(marker.center, marker.radius, bearing);
    const record = {
      coordinates: [
        edgeCoordinate,
        { latitude: coords.latitude, longitude: coords.longitude },
      ],
      heading: location.coords.heading,
      action: event.action,
      key: event.identifier + ':' + event.action + ':' + location.timestamp,
    };
    setGeofencesHitEvents(previous => [...previous, record]);
  }

  /// GeofencesChangeEvent effect-handler
  /// Renders/removes geofence markers to/from MapView
  ///
  const onGeofencesChange = (event: GeofencesChangeEvent) => {
    console.log('[onGeofencesChange] -', event);

    const on = event.on || [];
    const off = event.off || [];

    // ✅ Signal: remove ALL geofence overlays
    if (on.length === 0 && off.length === 0) {
      console.log('[onGeofencesChange] clear-all');
      geofencesRef.current = [];
      polygonGeofencesRef.current = [];
      setGeofences([]);
      setPolygonGeofences([]);
      return;
    }

    // ✅ Start from latest collections (refs), NOT stale state
    let geofencesOn = geofencesRef.current.filter((g: any) => off.indexOf(g.identifier) < 0);
    let polygonsOn  = polygonGeofencesRef.current.filter((g: any) => off.indexOf(g.identifier) < 0);

    // Add new "on" geofences.
    on.forEach((geofence: Geofence) => {
      const isPolygon = (geofence.vertices && geofence.vertices.length > 0);

      if (isPolygon) {
        if (!polygonsOn.some((p: any) => p.identifier === geofence.identifier)) {
          polygonsOn.push(createPolygonGeofenceMarker(geofence));
        }
      } else {
        if (!geofencesOn.some((c: any) => c.identifier === geofence.identifier)) {
          geofencesOn.push(createGeofenceMarker(geofence));
        }
      }
    });

    // Update refs first (so onGeofence can resolve immediately)
    geofencesRef.current = geofencesOn;
    polygonGeofencesRef.current = polygonsOn;

    // Update state for rendering
    setGeofences(geofencesOn);
    setPolygonGeofences(polygonsOn);
  };

  /// Add a location Marker to map.
  const addMarker = (location:Location) => {
    let iconIndex = (location.coords.heading! >= 0) ? Math.round(location.coords.heading! / 10) : 0;
    if (iconIndex > 36) iconIndex = 0;

    const timestamp = new Date();
    const marker = {
      key: `${location.uuid}:${timestamp.getTime()}`,
      title: location.timestamp,
      heading: location.coords.heading,
      coordinate: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }
    };

    setMarkers(previous => [...previous, marker]);
    setCoordinates(previous => [...previous, {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    }]);
  }

  /// Returns a geofence marker for MapView
  const createGeofenceMarker = (geofence:Geofence) => {
    return {
      radius: geofence.radius,
      center: {
        latitude: geofence.latitude,
        longitude: geofence.longitude
      },
      identifier: geofence.identifier,
      vertices: geofence.vertices      
    }
  }

  const createPolygonGeofenceMarker = (geofence: Geofence) => {
    return {
      identifier: geofence.identifier,

      // MEC circle (computed natively via MiniBall)
      radius: (geofence as any).radius,
      center: {
        latitude: (geofence as any).latitude,
        longitude: (geofence as any).longitude,
      },

      // Polygon vertices
      coordinates: geofence.vertices!.map((vertex) => ({
        latitude: vertex[0],
        longitude: vertex[1],
      })),
    };
  };

  /// MapView Location marker-renderer.
  /// <Image source={MarkerImages.locationArrowBlue} style={[styles.markerIcon, {transform: [{rotate: `${heading}deg`}]}]}/>
  const renderLocationMarkers = () => {
    let rs:any = [];
    markers.map((marker:any) => {
      const heading = (marker.heading >= 0) ? Math.round(marker.heading) : 0;      
      rs.push((
        <Marker
          key={marker.key}
          flat={true}
          zIndex={10}
          image={(Platform.OS === 'android') ? MarkerImages.locationArrowBlue : undefined}
          rotation={heading}
          tracksViewChanges={tracksViewChanges}
          coordinate={marker.coordinate}
          anchor={{x:0.5, y:0.5}}
          title={marker.title}>
          {Platform.OS === 'ios' ? <Image source={MarkerImages.locationArrowBlue} style={{transform: [{rotate: `${heading}deg`}] }}/> : null}
        </Marker>
      ));
    });
    return rs;
  }

  // Render green, motionChange polylines.
  const renderMotionChangePolylines = () => {
    return motionChangePolylines.map((line: any) => (
      <Polyline
        key={line.key}
        coordinates={line.coordinates}
        geodesic={true}
        strokeColor={COLORS.green} // same vibe as flutter
        strokeWidth={10}
        zIndex={8}
        lineCap="round"
      />
    ));
  };

  /// Render stop-zone markers -- small red circles where the plugin previously entered
  /// the stationary state.
  const renderStopZoneMarkers = () => {
    return stopZones.map((stopZone:any) => (
      <Marker
        key={stopZone.key}      
        //tracksViewChanges={tracksViewChanges}
        coordinate={stopZone.coordinate}
        anchor={{x:0.5, y:0.5}}>
        <View style={[styles.stopZoneMarker]}></View>
      </Marker>
    ));
  }

  /// Render the list of current active geofences that BackgroundGeolocation is monitoring.
  const renderActiveGeofences = () => {
    return geofences.map((geofence:any) => {
      return (
        <Circle
          zIndex={1}
          key={geofence.identifier}          
          radius={geofence.radius}
          center={geofence.center}
          strokeWidth={1}
          strokeColor={GEOFENCE_STROKE_COLOR}          
          fillColor={GEOFENCE_FILL_COLOR}          
        />
      )
    });
  }

  const renderActivePolygonGeofences = () => {
    return polygonGeofences.map((polygon: any) => {
      const baseKey = `polygon-${polygon.identifier}`;
      const hasMEC = Number.isFinite(polygon.radius) && polygon.radius > 0 && polygon.center;

      return (
        <React.Fragment key={baseKey}>
          {hasMEC ? (
            <Circle
              key={`${baseKey}:mec`}
              zIndex={1}
              radius={polygon.radius}
              center={polygon.center}
              strokeWidth={1}
              strokeColor={GEOFENCE_STROKE_COLOR}
              fillColor={GEOFENCE_FILL_COLOR}

            />
          ) : null}

          <Polygon
            key={`${baseKey}:poly`}
            zIndex={2}
            coordinates={polygon.coordinates}
            strokeWidth={2}
            lineDashPhase={0}
            lineDashPattern={[2]}
            strokeColor={POLYGON_STROKE_COLOR}
            fillColor={POLYGON_FILL_COLOR}
            tappable={true}
            geodesic={true}
          />
        </React.Fragment>
      );
    });
  };

  /// Render the list of geofences which have fired.
  const renderGeofencesHit = () => {
    let rs = [];
    return geofencesHit.map((hit:any) => {
      return (
        <Circle
          key={"hit:" + hit.identifier}
          zIndex={100}
          radius={hit.radius+1}
          center={hit.center}
          strokeWidth={1}
          strokeColor={COLORS.black}>
        </Circle>
      );
    });
  }

  /// Render the series of markers showing where a geofence hit event occurred.
  const renderGeofencesHitEvents = () => {
    return geofencesHitEvents.map((event:any) => {      
      let color, edgeMarkerImage, locationMarkerImage;
      const heading = (event.heading >= 0) ? Math.round(event.heading) : 0;
      switch(event.action) {
        case 'ENTER':
          color = COLORS.green;
          edgeMarkerImage = MarkerImages.geofenceEventEdgeCircleEnter;
          locationMarkerImage = MarkerImages.locationArrowGreen;
          break;
        case 'EXIT':
          color = COLORS.red;
          edgeMarkerImage = MarkerImages.geofenceEventEdgeCircleExit;
          locationMarkerImage = MarkerImages.locationArrowRed;
          break;
        case 'DWELL':
          color = COLORS.gold;
          edgeMarkerImage = MarkerImages.geofenceEventEdgeCircleDwell;
          locationMarkerImage = MarkerImages.locationArrowAmber;
          break;
      }
      // markerStyle is unused, removing.

      return (
        <React.Fragment key={event.key}>
          <Polyline
            key={`geofence-hit-polyline:${geofenceHitEpoch}:${event.key}`}            
            coordinates={event.coordinates}
            geodesic={true}            
            strokeColor={COLORS.black}
            strokeWidth={2}
            zIndex={99}
            lineCap="square" />
          <Marker
            key={`geofence-hit-edge-marker:${event.key}`}
            zIndex={100}
            coordinate={event.coordinates[0]}
            tracksViewChanges={tracksViewChanges}
            image={(Platform.OS === 'ios') ? null : edgeMarkerImage}
            anchor={{x:0.5, y:0.5}}>
              {Platform.OS === 'ios' ? <Image source={edgeMarkerImage} /> : null}
          </Marker>
          <Marker
            key={`geofence-hit-location-marker:${event.key}`}
            coordinate={event.coordinates[1]}
            zIndex={100}
            tracksViewChanges={tracksViewChanges}
            image={(Platform.OS === 'ios') ? null : locationMarkerImage}
            rotation={heading}
            flat={true}
            anchor={{x:0.5, y:0.5}}>
              {Platform.OS === 'ios' ? <Image source={locationMarkerImage} style={{transform: [{rotate: `${heading}deg`}] }}/> : null}
          </Marker>
        </React.Fragment>
      );
    });
  }

  const renderCreatePolygonGeofenceVertices = () => {
    let index = 0;
    return createPolygonGeofenceCoordinates.map((coordinate: any) => {
      index += 1;
      return (
        <Marker
          key={`create-polygon-vertex:${createPolygonEpoch}:${index}`}
          flat={true}
          title={"" + index}
          anchor={{ x: 0.5, y: 0.5 }}
          coordinate={coordinate}
        >
          <View style={styles.polygonGeofenceCursorVertex}>
            <Text style={{ color: COLORS.white, fontSize: 12 }}>{index}</Text>
          </View>
        </Marker>
      );
    });
  };

  const renderCreatePolygonGeofence = () => {
    return createPolygonGeofenceCoordinates.length > 0 ? (
      <Polygon
        key={`create-polygon:${createPolygonEpoch}`}
        coordinates={createPolygonGeofenceCoordinates}
        strokeWidth={2}
        zIndex={50}
        lineDashPhase={0}
        lineDashPattern={[2]}        
        strokeColor={POLYGON_STROKE_COLOR}
        fillColor={POLYGON_FILL_COLOR}
        geodesic={true}
      />
    ) : null;
  };

  /// Map long-press handler for adding a geofence.
  const onLongPress = (params:any) => {
    const coordinate = params.nativeEvent.coordinate;

    hapticFeedback('impactHeavy', {});

    // Store coordinate for geofence creation.
    setPendingGeofenceCoordinate({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });

    console.log('[TSMapView] showing AddGeofenceSheet');
    setIsAddGeofenceTypeSheetVisible(true);
  }

  /// Map pan/drag handler.
  const onMapPanDrag = () => {
    setAutoCenter(false);    
    setMapScrollEnabled(true);
  };

  /// Map click handler (polygon vertex creation).
  const onMapClick = (params: any) => {
    if (!isCreatingPolygon) return;

    const coordinate = params.nativeEvent.coordinate;

    hapticFeedback("impactHeavy", {});
    setCreatePolygonGeofenceCoordinates(previous => [
      ...previous,
      {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      }
    ]);
  };

  const closeAddGeofenceTypeSheet = React.useCallback(() => {
    setIsAddGeofenceTypeSheetVisible(false);
  }, []);


  const onSelectAddGeofenceType = React.useCallback((type: AddGeofenceType) => {
    switch (type) {
      case 'circular':
        // Require a long-press coordinate first.
        if (!pendingGeofenceCoordinate) {
          console.log('[TSMapView] No pendingGeofenceCoordinate yet. Long-press the map first.');
          closeAddGeofenceTypeSheet();
          return;
        }
        closeAddGeofenceTypeSheet();
        setIsAddGeofenceSheetVisible(true);
        
        break;
      case 'polygon':
        setIsCreatingPolygon(true);
        setCreatePolygonGeofenceCoordinates([]);
        setPendingPolygonVertices([]);
        setCreatePolygonEpoch(e => e + 1);
        closeAddGeofenceTypeSheet();
        break;
      case 'cancel':
      default:
        setIsCreatingPolygon(false);
        setCreatePolygonGeofenceCoordinates([]);
        setPendingPolygonVertices([]);
        closeAddGeofenceTypeSheet();
        break;
    }
  }, [closeAddGeofenceTypeSheet, pendingGeofenceCoordinate]);

  const onUndoPolygonVertex = React.useCallback(() => {
    setCreatePolygonGeofenceCoordinates((previous) => {
      if (previous.length === 0) return previous;
      return previous.slice(0, previous.length - 1);
    });
  }, []);

  const onCancelPolygonCreation = React.useCallback(() => {
    setIsCreatingPolygon(false);
    setCreatePolygonGeofenceCoordinates([]);
    setPendingPolygonVertices([]);
    setPendingGeofenceCoordinate(null);    
    setCreatePolygonEpoch(e => e + 1);

  }, []);

  const onNextPolygonCreation = React.useCallback(() => {
    if (createPolygonGeofenceCoordinates.length < 3) {
      console.log('[TSMapView] [polygon] next ignored (need >= 3 vertices)');
      return;
    }

    // Pass vertices to AddGeofenceSheet
    setPendingPolygonVertices(createPolygonGeofenceCoordinates);

    // Exit polygon mode + show AddGeofenceSheet
    setIsCreatingPolygon(false);
    setIsAddGeofenceSheetVisible(true);
  }, [createPolygonGeofenceCoordinates]);

  /// Clear all markers from the map when plugin is toggled off.
  const clearMarkers = () => {
    setCoordinates([]);
    setMarkers([]);
    setStopZones([]);
    setMotionChangePolylines([]);
    setGeofences([]);
    setPolygonGeofences([]);
    setGeofencesHit([]);
    setGeofencesHitEvents([]);
    setGeofenceHitEpoch((e) => e + 1);
    //setMapEpoch((e) => e + 1);
    setStationaryRadius(0);
    setStationaryLocationSafe(UNDEFINED_LOCATION);
    setPendingGeofenceCoordinate(null);
    geofencesRef.current = [];
    polygonGeofencesRef.current = [];
  }

  return (
    <View style={{ flex: 1 }}>     
      
      <MapView
        googleRenderer={'LATEST' as any}
        style={StyleSheet.absoluteFill}
        region={mapCenter}
        onLongPress={onLongPress}
        onPress={onMapClick}
        onPanDrag={onMapPanDrag}
        initialRegion={mapCenter}
        showsUserLocation={showsUserLocation}
        showsMyLocationButton={false}
        followsUserLocation={followsUserLocation}
        scrollEnabled={mapScrollEnabled}
        showsCompass={false}        
        showsScale={false}
        showsTraffic={false}
        userInterfaceStyle={"light"}>          
          <Circle
            key={"stationary-location:" + stationaryLocation.timestamp}
            zIndex={3}
            radius={stationaryRadius}
            fillColor={STATIONARY_REGION_FILL_COLOR}
            strokeColor={STATIONARY_REGION_STROKE_COLOR}
            strokeWidth={1}
            center={{
              latitude: stationaryLocation.latitude,
              longitude: stationaryLocation.longitude
            }}
          />
          <Polyline
            key="track-polyline"
            coordinates={coordinates}
            geodesic={true}                    
            strokeColor={'rgba(0,179,253, 0.6)'}
            strokeWidth={10}
            zIndex={9}
          />
          {/* Create-polygon mode overlays */}
          {isCreatingPolygon ? renderCreatePolygonGeofence() : null}
          {isCreatingPolygon ? renderCreatePolygonGeofenceVertices() : null}
          {renderLocationMarkers()}
          {renderStopZoneMarkers()}
          {renderMotionChangePolylines()}
          {renderActiveGeofences()}
          {renderActivePolygonGeofences()}
          {renderGeofencesHit()}
          {renderGeofencesHitEvents()}
      </MapView>
      {/* Overlay prompt (hide while polygon mode active) */}
      {!isCreatingPolygon && !hideAddGeofencePrompt ? (
        <View pointerEvents="none" style={styles.addGeofencePromptContainer}>
          <View style={styles.addGeofencePrompt}>
            <Text style={{ color: '#000', fontWeight: '600' }}>
              Long-press map to add geofence
            </Text>
          </View>
        </View>
      ) : null}

      {/* Add Polygon menu */}
      {isCreatingPolygon ? (
        <View style={styles.addPolygonMenu}>
          <View style={styles.addPolygonMenuRow}>
            <TouchableOpacity
              onPress={onUndoPolygonVertex}
              disabled={createPolygonGeofenceCoordinates.length === 0}
              style={[
                styles.addPolygonMenuButton,
                { opacity: createPolygonGeofenceCoordinates.length === 0 ? 0.5 : 1 }
              ]}
            >
              <Text style={styles.addPolygonMenuButtonText}>Undo</Text>
            </TouchableOpacity>

            <View style={styles.addPolygonMenuTitle}>
              <Text style={styles.addPolygonMenuTitleText}>
                Click Map to add polygon vertices
              </Text>
            </View>

            <TouchableOpacity
              onPress={onCancelPolygonCreation}
              style={styles.addPolygonMenuButton}
            >
              <Text style={styles.addPolygonMenuButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onNextPolygonCreation}
              disabled={createPolygonGeofenceCoordinates.length < 3}
              style={[
                styles.addPolygonMenuButton,
                { opacity: createPolygonGeofenceCoordinates.length < 3 ? 0.5 : 1 }
              ]}
            >
              <Text style={[styles.addPolygonMenuButtonText, { fontWeight: '800' }]}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
      <AddGeofenceTypeSheet
        visible={isAddGeofenceTypeSheetVisible}
        onClose={closeAddGeofenceTypeSheet}
        onSelect={onSelectAddGeofenceType}
      />
      <AddGeofenceSheet
        visible={isAddGeofenceSheetVisible}
        coordinate={pendingGeofenceCoordinate}
        vertices={pendingPolygonVertices.length ? pendingPolygonVertices : undefined}
        onClose={() => {
          setIsAddGeofenceSheetVisible(false);
          setPendingGeofenceCoordinate(null);
          setPendingPolygonVertices([]);
          setCreatePolygonGeofenceCoordinates([]);
        }}
        onAdded={() => {
          setIsAddGeofenceSheetVisible(false);
          setPendingGeofenceCoordinate(null);
          setPendingPolygonVertices([]);
          setCreatePolygonGeofenceCoordinates([]);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  addGeofencePromptContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    zIndex: 3,
    elevation: 3, // Android
    alignItems: 'center',
  },
  addGeofencePrompt: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 241, 165, 0.9)',
  },
  stopZoneMarker: {
    borderWidth:1,
    borderColor: 'red',
    backgroundColor: COLORS.red,
    opacity: 0.2,
    borderRadius: 15,
    zIndex: 0,
    width: 30,
    height: 30
  },
  geofenceHitMarker: {
    borderWidth: 1,
    borderColor:'black',
    borderRadius: 6,
    zIndex: 10,
    width: 12,
    height:12
  },
  markerIcon: {          
    width: 16,
    height: 16
  },
  polygonGeofenceMenu: {
    flexDirection: 'column',
    backgroundColor: '#fff1a5',
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderTopColor: COLORS.black,
    borderBottomColor: '#aaa'
  },
  polygonGeofenceCursorVertex: {
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    backgroundColor: '#000000', 
    flexDirection: 'column', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  polygonGeofenceMenuRow: {
    height: 50, 
    flexDirection: 'row', 
    paddingLeft:5, 
    paddingRight:5
  },  
  longPressMapPrompt: {
    backgroundColor: '#fff1a5',    
    color: COLORS.black,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    opacity: 0.8,
    width: '100%',
    textAlign: 'center',
    
  },
  longPressMapPromptText: {
    color: COLORS.black,
    textAlign: 'center'
  },
  addPolygonMenu: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    zIndex: 9999,
    elevation: 9999,
    backgroundColor: 'rgba(255, 241, 165, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
  },
  addPolygonMenuRow: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  addPolygonMenuButton: {
    paddingHorizontal: 10,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPolygonMenuButtonText: {
    color: COLORS.black,
    fontWeight: '700',
  },
  addPolygonMenuTitle: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  addPolygonMenuTitleText: {
    color: COLORS.black,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default TSMapView;

