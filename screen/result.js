
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';



const firebaseConfig = {
  apiKey: "AIzaSyC0EchAUDKPULXZE4Ri7eH9PnBo1S302Sg",
  authDomain: "testlocation-8c657.firebaseapp.com",
  projectId: "testlocation-8c657",
  storageBucket: "testlocation-8c657.appspot.com",
  messagingSenderId: "285258022333",
  appId: "1:285258022333:web:b1b673f2b8bbb48e9166d4",
  measurementId: "G-64YESENHWN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const Result = ({ route }) => {
  const { inputText } = route.params;
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [heading, setHeading] = useState(null);

  useEffect(() => {
    getLocationPermission();
    refreshLocation(); // Appel initial
  }, []);

  const getLocationPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status === 'granted') {
      setPermissionStatus('granted');
      getLocation();
      
    } else {
      setPermissionStatus('denied');
    }
  };
  const refreshLocation = async () => {
    await getLocation();
    setTimeout(refreshLocation, 1000); // Appel toutes les secondes
  };

  const getLocation = async () => {
    const location = await Location.getCurrentPositionAsync({});
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
    setSpeed(location.coords.speed);
    setAccuracy(location.coords.accuracy);
  setTimestamp(location.timestamp);
  setHeading(location.coords.heading);
 

    // Enregistrer les données de localisation dans Firebase
    try {
      const docRef = doc(db, 'locations', inputText); // Remplacez 'monDocument' par le nom souhaité
      await setDoc(docRef, {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        speed: location.coords.speed,
        Accuracy:location.coords.accuracy,
        Heading:location.coords.heading,
        time:location.timestamp
        
      });
    } catch (error) {
      console.error('Error setting document: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Latitude: {latitude}</Text>
      <Text style={styles.text}>Longitude: {longitude}</Text>
      <Text style={styles.text}>Speed: {speed}</Text>
      <Text style={styles.text}>heading: {heading}</Text>
      
      <Text style={styles.text}>Accuracy: {accuracy}</Text>
      

      <Text style={styles.text}>Permission status: {permissionStatus}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Result;