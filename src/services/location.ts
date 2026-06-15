import * as Location from 'expo-location';

/**
 * Interface representing the structure of the coordinates.
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Interface representing the location details payload for emergency alerts.
 */
export interface LocationPayload {
  latitude: number;
  longitude: number;
  mapLink: string;
  timestamp: number;
}

/**
 * Requests location access permission (foreground) from the device.
 * 
 * @returns A promise that resolves to true if permission is granted, otherwise false.
 */
export async function requestLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
}

/**
 * Retrieves the device's current location coordinates.
 * 
 * @returns A promise that resolves to a Coordinates object containing latitude and longitude.
 * @throws An error if location permission is denied or if fetching the position fails.
 */
export async function getCurrentLocation(): Promise<Coordinates> {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      throw new Error('Location permission was not granted.');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    throw error;
  }
}

/**
 * Generates a shareable Google Maps query link for the specified coordinates.
 * 
 * @param latitude - The latitude of the location.
 * @param longitude - The longitude of the location.
 * @returns A string URL pointing to Google Maps with the coordinates.
 */
export function generateGoogleMapsLink(latitude: number, longitude: number): string {
  return `https://maps.google.com/?q=${latitude},${longitude}`;
}

/**
 * Fetches the current location and compiles a complete payload including a Google Maps link.
 * 
 * @returns A promise that resolves to a LocationPayload object.
 * @throws An error if obtaining location details fails.
 */
export async function getLocationPayload(): Promise<LocationPayload> {
  try {
    const { latitude, longitude } = await getCurrentLocation();
    const mapLink = generateGoogleMapsLink(latitude, longitude);
    const timestamp = Date.now();

    return {
      latitude,
      longitude,
      mapLink,
      timestamp,
    };
  } catch (error) {
    console.error('Error gathering location payload:', error);
    throw error;
  }
}
