// SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const SplashScreen = () => {
    const navigation=useNavigation();
  useEffect(() => {
    const timer = setTimeout(() => {
        navigation.navigate('Project');
    
    }, 3000); // Show splash screen for 3 seconds

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://img.freepik.com/free-photo/paint-concept-with-woman-ladder_23-2147703584.jpg?t=st=1725611572~exp=1725615172~hmac=02ebe118814061015b44d44b003b229491ada8b56818b2f9ba0c04650bfc7399&w=996' }} // Replace with your image URL
        style={styles.logo}
      />
      <Text style={styles.appName}>Paint my Room</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100, // Adjust size as needed
    height: 100, // Adjust size as needed
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default SplashScreen;
