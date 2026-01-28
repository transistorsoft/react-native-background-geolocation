///
/// Map geometry methods for calculating Geofence hit-markers on MapView
//
export const toRad = (n) => {
  return n * (Math.PI / 180);
}
export const toDeg = (n) => {
  return n * (180 / Math.PI);
}

export const getBearing = (start:any, end:any) => {
  let startLat = toRad(start.latitude);
  let startLong = toRad(start.longitude);
  let endLat = toRad(end.latitude);
  let endLong = toRad(end.longitude);

  let dLong = endLong - startLong;

  let dPhi = Math.log(
  	Math.tan(
  		endLat / 2.0 + Math.PI / 4.0
  	) / Math.tan(
  		startLat / 2.0 + Math.PI / 4.0
  	)
  );

  if (Math.abs(dLong) > Math.PI){
    if (dLong > 0.0)
       dLong = -(2.0 * Math.PI - dLong);
    else
       dLong = (2.0 * Math.PI + dLong);
  }
  return (toDeg(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
}

export const computeOffsetCoordinate = (coordinate:any, distance:number, heading:number) => {
  distance = distance / (6371*1000);
  heading = toRad(heading);

  let lat1 = toRad(coordinate.latitude);
  let lon1 = toRad(coordinate.longitude);
  let lat2 = Math.asin(
  	Math.sin(lat1) * Math.cos(distance) + Math.cos(lat1) * Math.sin(distance) * Math.cos(heading)
  );
  let lon2 = lon1 + Math.atan2(
  	Math.sin(heading) * Math.sin(distance) * Math.cos(lat1),
    Math.cos(distance) - Math.sin(lat1) * Math.sin(lat2)
  );

  if (isNaN(lat2) || isNaN(lon2)) return null;

  return {
    latitude: toDeg(lat2),
    longitude: toDeg(lon2)
  };
}