import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = ({ navigation, route }) => {
  const userData = route.params?.userData;
  const stackNavigation = route.params?.navigation;
  const updateUserProfileImage = route.params?.updateUserProfileImage;
  const [profileData, setProfileData] = useState({
    name: 'Jennifer Teos',
    email: 't22jenn@gmail.com',
    phone: '71042228',
    password: '**********',
    language: 'Español',
    currency: 'USD',
    notifications: true,
  });

  const [editingField, setEditingField] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleEditField = (field) => {
    setEditingField(field);
  };

  const handleSaveField = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setEditingField(null);
  };

  const pickImage = async () => {
    try {
      // Verificar permisos existentes primero
      let { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      
      // Si no hay permisos, solicitarlos
      if (status !== 'granted') {
        const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        status = newStatus;
        
        if (status !== 'granted') {
          Alert.alert(
            'Permisos requeridos',
            'Necesitamos acceso a tu galería para cambiar la foto de perfil.',
            [
              { text: 'Cancelar', style: 'cancel' },
              { 
                text: 'Ir a Configuración', 
                onPress: () => {
                  Alert.alert(
                    'Instrucciones',
                    '1. Ve a Configuración\n2. Busca "Eternal Joyería" o "Expo Go"\n3. Activa "Fotos"\n4. Regresa a la app',
                    [{ text: 'Entendido' }]
                  );
                }
              }
            ]
          );
          return;
        }
      }

      // Abrir selector de imagen
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

             if (!result.canceled && result.assets[0]) {
         const imageUri = result.assets[0].uri;
         setSelectedImage(imageUri);
         
         // Actualizar la imagen en el estado global para que se refleje en ProductScreen
         if (updateUserProfileImage) {
           updateUserProfileImage(imageUri);
         }
         
         // Aquí podrías guardar la imagen en el backend
         Alert.alert(
           'Éxito',
           'Foto de perfil actualizada correctamente',
           [{ text: 'OK' }]
         );
       }
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo seleccionar la imagen. Inténtalo de nuevo.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderEditableField = (label, field, value, isPassword = false) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          value={editingField === field ? value : profileData[field]}
          onChangeText={(text) => handleSaveField(field, text)}
          onFocus={() => setEditingField(field)}
          onBlur={() => setEditingField(null)}
          secureTextEntry={isPassword && editingField !== field}
          editable={editingField === field}
        />
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditField(field)}
        >
          <Ionicons name="pencil" size={16} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSelectionField = (label, field, value) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity style={styles.selectionContainer}>
        <Text style={styles.selectionText}>{value}</Text>
        <Ionicons name="chevron-forward" size={20} color="#000" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Datos del perfil</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Picture */}
        <View style={styles.profilePictureContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.profilePictureTouchable}>
            <Image
              source={selectedImage ? { uri: selectedImage } : (userData?.profileImage ? { uri: userData.profileImage } : require('../../assets/Usuarionuevo.jpg'))}
              style={styles.profilePicture}
            />
            <View style={styles.cameraIconOverlay}>
              <Ionicons name="camera" size={24} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.profilePictureHint}>Toca para cambiar la foto</Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          {renderEditableField('Tu nombre', 'name', profileData.name)}
          {renderEditableField('Tu correo', 'email', profileData.email)}
          {renderEditableField('Tu teléfono', 'phone', profileData.phone)}
          {renderEditableField('Tu contraseña', 'password', profileData.password, true)}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuraciones</Text>
          {renderSelectionField('Idioma', 'language', profileData.language)}
          {renderSelectionField('Moneda', 'currency', profileData.currency)}
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <View style={styles.notificationRow}>
            <Text style={styles.fieldLabel}>Notificaciones</Text>
            <Switch
              value={profileData.notifications}
              onValueChange={(value) => setProfileData(prev => ({ ...prev, notifications: value }))}
              trackColor={{ false: '#E5E5EA', true: '#FFB6C1' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Action Links */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => stackNavigation?.navigate('PrivacyPolicy')}
          >
            <Text style={styles.actionText}>Política de privacidad</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => stackNavigation?.navigate('TermsConditions')}
          >
            <Text style={styles.actionText}>Términos y condiciones</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={[styles.actionText, styles.logoutText]}>Desconectarse</Text>
          </TouchableOpacity>
        </View>
        
        {/* Espacio extra para evitar que el menú tape el contenido */}
        <View style={styles.extraSpace} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  profilePicture: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#FFB6C1',
  },
  profilePictureTouchable: {
    position: 'relative',
  },
  cameraIconOverlay: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#FFB6C1',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profilePictureHint: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 10,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 8,
  },
  editButton: {
    padding: 8,
  },
  selectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  selectionText: {
    fontSize: 16,
    color: '#000',
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    color: '#000',
    textDecorationLine: 'underline',
  },
  logoutText: {
    color: '#FF0000',
  },
  extraSpace: {
    height: 120,
    backgroundColor: 'transparent',
  },
});

export default ProfileScreen; 