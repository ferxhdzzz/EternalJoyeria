import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

const ReviewsScreen = ({ navigation, route }) => {
  const { product } = route.params;
  const { user } = useAuth();
  const BACKEND_URL = 'http://192.168.56.1.200:4000';
  const [reviewText, setReviewText] = useState('');
  const [selectedRating, setSelectedRating] = useState(5);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Derivar imagen del producto desde backend si existe
  const productImageUri = Array.isArray(product?.images) && product.images.length
    ? product.images[0]
    : (typeof product?.image === 'string' ? product.image : null);

  // Cargar reseñas reales
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        console.log(`[Reviews] Fetching reviews for product:`, product?._id || product?.id);
        const productId = product?._id || product?.id;
        if (!productId) {
          console.error('[Reviews] No product ID provided');
          return;
        }
        
        const url = `${BACKEND_URL}/api/reviews/product/${productId}`;
        console.log('[Reviews] Fetching from URL:', url);
        
        const res = await fetch(url);
        console.log('[Reviews] Response status:', res.status);
        
        if (!res.ok) {
          // Handle 404 as no reviews instead of error
          if (res.status === 404) {
            console.log('[Reviews] No reviews found for this product');
            setReviews([]);
            return;
          }
          const errorData = await res.json().catch(() => ({}));
          console.error('[Reviews] Error response:', errorData);
          throw new Error(errorData.message || 'No se pudieron cargar las reseñas');
        }
        
        const data = await res.json();
        console.log('[Reviews] Received reviews data:', data);
        
        if (!Array.isArray(data)) {
          console.warn('[Reviews] Expected array but received:', data);
          setReviews([]);
        } else {
          setReviews(data);
        }
      } catch (e) {
        console.error('[Reviews] Error fetching reviews:', e);
        Alert.alert('Error', 'No se pudieron cargar las reseñas. Por favor, intenta de nuevo más tarde.');
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [product?._id, product?.id, BACKEND_URL]);

  // helpers para mapear datos del backend a UI
  const getUserName = (r) => {
    const c = r?.id_customer;
    if (c && typeof c === 'object') {
      return c.name || c.fullName || c.email || 'Usuario';
    }
    return 'Usuario';
  };
  const getAvatarSource = (r) => {
    const c = r?.id_customer;
    const uri = c && typeof c === 'object' && typeof c.profileImage === 'string' ? c.profileImage : null;
    return uri ? { uri } : require('../../assets/Usuarionuevo.jpg');
  };

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={16}
            color="#FFD700"
          />
        ))}
      </View>
    );
  };

  const handleAddReview = async () => {
    try {
      if (!reviewText.trim()) {
        Alert.alert('Comentario requerido', 'Por favor escribe un comentario.');
        return;
      }
      setSubmitting(true);

      const token = await AsyncStorage.getItem('authToken');
      const customerId = user?._id || user?.id;
      const productId = product?._id || product?.id;

      const formData = new FormData();
      formData.append('id_customer', String(customerId || ''));
      formData.append('id_product', String(productId || ''));
      formData.append('rank', String(selectedRating));
      formData.append('comment', reviewText.trim());
      if (selectedImage) {
        formData.append('images', {
          uri: selectedImage,
          name: 'review.jpg',
          type: 'image/jpeg',
        });
      }

      const res = await fetch(`${BACKEND_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'No se pudo crear la reseña');
      }

      // Agregar reseña creada a la lista
      setReviews((prev) => [data, ...prev]);
      setReviewText('');
      setSelectedImage(null);
      setSelectedRating(5);
      setShowForm(false);
      Alert.alert('Éxito', 'Reseña añadida exitosamente');
    } catch (e) {
      Alert.alert('Error', e.message || 'No se pudo crear la reseña');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleForm = () => {
    // Validación: requiere sesión para abrir el formulario
    const isLoggedIn = !!(user?._id || user?.id);
    if (!isLoggedIn) {
      Alert.alert(
        'Inicia sesión',
        'Debes iniciar sesión para escribir una reseña.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Ir al perfil',
            onPress: () => navigation.navigate('MainTabs', { screen: 'Perfil' }),
          },
        ]
      );
      return;
    }
    setShowForm(!showForm);
    if (!showForm) {
      // Si se va a mostrar el formulario, resetear los campos
      setReviewText('');
      setSelectedImage(null);
      setSelectedRating(5);
    }
  };

  const pickImage = async (source) => {
    try {
      let result;
      
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permisos requeridos',
            'Necesitamos acceso a tu cámara para tomar una foto.',
            [
              { text: 'Cancelar', style: 'cancel' },
              { 
                text: 'Ir a Configuración', 
                onPress: () => {
                  Alert.alert(
                    'Instrucciones',
                    '1. Ve a Configuración\n2. Busca "Eternal Joyería" o "Expo Go"\n3. Activa "Cámara"\n4. Regresa a la app',
                    [{ text: 'Entendido' }]
                  );
                }
              }
            ]
          );
          return;
        }
        
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permisos requeridos',
            'Necesitamos acceso a tu galería para seleccionar una foto.',
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
        
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo seleccionar la imagen. Inténtalo de nuevo.',
        [{ text: 'OK' }]
      );
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Seleccionar foto',
      '¿De dónde quieres tomar la foto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cámara', onPress: () => pickImage('camera') },
        { text: 'Galería', onPress: () => pickImage('gallery') },
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{String(product?.name || '')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Info Section */}
        <View style={styles.productInfoSection}>
          {productImageUri ? (
            <Image
              source={{ uri: productImageUri }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.productImage, { backgroundColor: '#EEE' }]} />
          )}
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{String(product?.name || '')}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.ratingText}>
                {reviews.length
                  ? (
                      (
                        reviews.reduce((acc, r) => acc + Number(r?.rank || 0), 0) /
                        reviews.length
                      ).toFixed(1)
                    )
                  : '0.0'}
              </Text>
            </View>
            <Text style={styles.reviewCount}>{reviews.length} reseñas</Text>
          </View>
        </View>

        {/* Reviews List */}
        <View style={styles.reviewsSection}>
          {loading ? (
            <Text style={{ textAlign: 'center', color: '#666' }}>Cargando reseñas...</Text>
          ) : (
            reviews.map((review) => (
              <View key={review._id || `${review.id_customer}-${review.createdAt}`} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Image source={getAvatarSource(review)} style={styles.userAvatar} />
                  <View style={styles.reviewInfo}>
                    <Text style={styles.userName}>{getUserName(review)}</Text>
                    <Text style={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString()}</Text>
                  </View>
                </View>
                {renderStars(Number(review.rank) || 0)}
                <Text style={styles.reviewText}>{String(review.comment || '')}</Text>
              </View>
            ))
          )}
        </View>

        {/* Add Review Form - Solo se muestra cuando showForm es true */}
        {showForm && (
          <View style={styles.addReviewForm}>
            <Text style={styles.formTitle}>Añadir nueva reseña</Text>
            
            {/* Foto Input */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Foto</Text>
              <TouchableOpacity 
                style={styles.photoInput}
                onPress={showImagePickerOptions}
              >
                {selectedImage ? (
                  <Image source={{ uri: selectedImage }} style={styles.selectedPhoto} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Ionicons name="camera" size={30} color="#8E8E93" />
                    <Text style={styles.photoPlaceholderText}>Toca para añadir foto</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Calificación Input */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Calificación</Text>
              <View style={styles.ratingStarsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setSelectedRating(star)}
                    style={styles.starButton}
                  >
                    <Ionicons
                      name={star <= selectedRating ? 'star' : 'star-outline'}
                      size={24}
                      color="#FFD700"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Comentario Input */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Comentario</Text>
              <TextInput
                style={styles.commentInput}
                placeholder="Escribe tu comentario aquí..."
                placeholderTextColor="#8E8E93"
                value={reviewText}
                onChangeText={setReviewText}
                multiline
                textAlignVertical="top"
                numberOfLines={4}
              />
            </View>
          </View>
        )}

        {/* Extra space for keyboard */}
        <View style={styles.keyboardSpace} />
      </ScrollView>

      {/* Add Review Button */}
      <TouchableOpacity 
        style={styles.addReviewButton}
        onPress={showForm ? handleAddReview : toggleForm}
      >
        <Text style={styles.addReviewText}>
          {showForm
            ? (submitting ? 'Enviando...' : 'Enviar reseña')
            : (user?._id || user?.id ? 'Agregar reseña' : 'Inicia sesión para reseñar')}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  productInfoSection: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 5,
  },
  reviewCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  reviewsSection: {
    marginBottom: 100, // Space for the button
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  keyboardSpace: {
    height: 50,
  },
  addReviewButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#000',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addReviewText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Form styles
  addReviewForm: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  photoInput: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  photoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 5,
    textAlign: 'center',
  },
  selectedPhoto: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  ratingStarsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  starButton: {
    padding: 5,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    padding: 15,
    minHeight: 100,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#F8F8F8',
  },
});

export default ReviewsScreen; 