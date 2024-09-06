import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image, Modal, Switch, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import { Camera, useCameraDevices, useCameraPermission } from 'react-native-vision-camera';
import SplashScreen from './SplashScreen'; 

const ProjectScreen = () => {
  const dummyData = [
    { id: '1', uri: 'https://media.istockphoto.com/id/1311423416/photo/home-interior-background-with-green-sofa-table-and-decor-in-living-room.jpg?s=612x612&w=0&k=20&c=UhKDMvu4AxuoHkg2DcZSiy0ULIOnQhANfbtYkRTXvho=' },
    { id: '2', uri: 'https://i.pinimg.com/originals/27/93/c8/2793c84bfb6c7334179c4eebca661e40.jpg' },
    { id: '3', uri: 'https://www.shutterstock.com/image-illustration/peach-fuzz-room-minimal-interior-260nw-2401650529.jpg' },
    { id: '4', uri: 'https://jumanji.livspace-cdn.com/magazine/wp-content/uploads/sites/2/2023/03/15151859/turquoise-and-grey-wall-colour-1.jpg' },
    { id: '5', uri: 'https://www.squareyards.com/blog/wp-content/uploads/2023/05/grey_and_blue_two_colour_combination_for_living_room_walls.jpg' },
    { id: '6', uri: 'https://housing.com/news/wp-content/uploads/2022/12/Paints-for-Living-Room-Walls-1.png' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.imageWrapper}>
      <Image source={{ uri: item.uri }} style={styles.projectImage} />
    </View>
  );

  return (
    <SafeAreaView style={styles.projectContainer}>
      <Text style={styles.projectHeader}>Saved projects</Text>
      <FlatList
        data={dummyData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />
    </SafeAreaView>
  );
};

const CameraScreen = () => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const { hasPermission, requestPermission } = useCameraPermission();
  const cameraRef = useRef<Camera | null>(null);

  const devices = useCameraDevices();
  const [device, setDevice] = useState<any>(null);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  useEffect(() => {
    if (devices && Array.isArray(devices) && devices.length > 0) {
      const backDevice = devices.find((d) => d.position === 'back');
      const frontDevice = devices.find((d) => d.position === 'front');

      if (backDevice) {
        setDevice(backDevice);
      } else if (frontDevice) {
        setDevice(frontDevice);
      }
    }
  }, [devices]);

  const takePicture = async () => {
    if (cameraRef.current && device) {
      try {
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'balanced',
        });

        setPhotoUri(`file://${photo.path}`);
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const handleDiscardPicture = () => {
    setPhotoUri(null);
    setSelectedColor(null);
  };

  const colorOptions = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Camera permission not granted</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.captureButton}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!device) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Loading Camera...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.center}>
      {!photoUri ? (
        <>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            device={device}
            isActive={true}
            photo={true}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
              <Text style={styles.buttonText}>Take Picture</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.center}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: photoUri }} style={styles.image} resizeMode="contain" />
            {selectedColor && (
              <View
                style={[
                  styles.overlay,
                  { backgroundColor: hexToRgba(selectedColor, 0.4) }, // Semi-transparent color overlay
                ]}
              />
            )}
          </View>
          <View style={styles.colorOptions}>
            {colorOptions.map((color) => (
              <TouchableOpacity
                key={color}
                style={[styles.colorButton, { backgroundColor: color }]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
          <TouchableOpacity onPress={handleDiscardPicture} style={styles.discardButton}>
            <Text style={styles.buttonText}>Discard Picture</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const MenuScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [rating, setRating] = useState<number>(0);

  const handleOptionPress = (option) => {
    setSelectedOption(option);
    setModalVisible(true);
  };

  const toggleSwitch = () => setNotificationsEnabled((previousState) => !previousState);

  const renderModalContent = () => {
    switch (selectedOption) {
      case 'Rate the app':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How do you like our app so far?</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Icon
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={32}
                    color="orange"
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.confirmButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        );
      case 'Contact and support':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Hi, how can I help you?</Text>
            {['I paid for the premium version but the app didn\'t unlock', 'I want to cancel my subscription', 'The app keeps crashing and can\'t be used', 'I would like a new specific functionality', 'I want to discuss a potential business partnership'].map((item, index) => (
              <Text key={index} style={styles.modalText}>{item}</Text>
            ))}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        );
      case 'Restore purchased version':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Have you purchased the full version of this app in the past?</Text>
            <TouchableOpacity style={styles.restoreButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.restoreButtonText}>Restore purchased version</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>More Options</Text>
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => handleOptionPress('Rate the app')}>
          <Icon name="star-outline" size={24} color="black" />
          <Text style={styles.menuText}>Rate the app</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => handleOptionPress('Contact and support')}>
          <Icon name="mail-outline" size={24} color="black" />
          <Text style={styles.menuText}>Contact and support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="warning-outline" size={24} color="black" />
          <Text style={styles.menuText}>Warning - color difference</Text>
        </TouchableOpacity>
        <View style={styles.menuItem}>
          <Icon name="notifications-outline" size={24} color="black" />
          <Text style={styles.menuText}>Notifications</Text>
          <Switch
            style={styles.toggleContainer}
            value={notificationsEnabled}
            onValueChange={toggleSwitch}
          />
        </View>
        <TouchableOpacity style={styles.menuItem} onPress={() => handleOptionPress('Restore purchased version')}>
          <Icon name="refresh-outline" size={24} color="black" />
          <Text style={styles.menuText}>Restore purchased version</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="pricetag-outline" size={24} color="orange" />
          <Text style={[styles.menuText, { color: 'orange' }]}>Unlock premium version</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for displaying the selected option */}
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          {renderModalContent()}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const Tab = createBottomTabNavigator();
// const Stack = createStackNavigator(); 
const App = (): React.JSX.Element => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Splash"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: string;
            if (route.name === 'Project') {
              iconName = 'albums-outline';
            } else if (route.name === 'Camera') {
              iconName = 'camera-outline';
            } else if (route.name === 'Menu') {
              iconName = 'menu-outline';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          headerTitle: route.name,
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Splash" component={SplashScreen} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="Project" component={ProjectScreen} />
        <Tab.Screen name="Camera" component={CameraScreen} />
        <Tab.Screen name="Menu" component={MenuScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  projectContainer: {
    flex: 1,
    padding: 10,
  },
  projectHeader: {
    fontSize: 20,
    color:"orange",
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  grid: {
    justifyContent: 'space-between',
  },
  imageWrapper: {
    flex: 1,
    margin: 5,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    overflow: 'hidden',
  },
  projectImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 80,
    width: '100%',
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: 'black',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discardButton: {
    marginTop: 20,
    backgroundColor: 'red',
    borderRadius: 25,
    padding: 10,
  },
  buttonText: {
    fontSize: 14,
    color: 'white',
  },
  imageContainer: {
    width: 300,
    height: 300,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Makes the overlay cover the entire image
    opacity: 0.4, // Adjusts transparency level
    borderRadius: 10, // Matches the border radius of the image
  },
  colorOptions: {
    flexDirection: 'row',
    marginTop: 20,
  },
  colorButton: {
    width: 40,
    height: 40,
    margin: 5,
  },
  header: {
    fontSize: 20,
    color: "orange",
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  menuContainer: {
    width: '100%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingHorizontal: 10,
  },
  menuText: {
    fontSize: 16,
    color: 'black',
    marginLeft: 10,
    flex: 1,
  },
  toggleContainer: {
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    color: "orange",
    marginBottom: 20,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    marginVertical: 5,
    color: "black",
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'red',
    fontSize: 16,
  },
  restoreButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  restoreButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default App;
