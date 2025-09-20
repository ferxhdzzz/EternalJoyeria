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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { BACKEND_URL, API_ENDPOINTS, buildApiUrl } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import CustomAlert from '../components/CustomAlert';
import useCustomAlert from '../hooks/useCustomAlert';

const { width, height } = Dimensions.get('window');

const ReviewsScreen = ({ navigation, route }) => {
  const { product } = route.params;
  const { user } = useAuth();
  const [reviewText, setReviewText] = useState('');
  const [selectedRating, setSelectedRating] = useState(5);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Hook para alertas personalizadas
  const {
    alertConfig,
    hideAlert,
    showError,
    showReviewSuccess,
    showReviewError,
    showLoginRequired,
    showPermissionRequired,
    showImagePickerOptions,
  } = useCustomAlert();

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
        showError('Error', 'No se pudieron cargar las reseñas. Por favor, intenta de nuevo más tarde.');
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
        showReviewError('Por favor escribe un comentario.');
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
      showReviewSuccess();
    } catch (e) {
      showReviewError(e.message || 'No se pudo crear la reseña');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleForm = () => {
    // Validación: requiere sesión para abrir el formulario
    const isLoggedIn = !!(user?._id || user?.id);
    if (!isLoggedIn) {
      showLoginRequired(
        () => navigation.navigate('Login'),
        () => {}
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
          showPermissionRequired(
            'Permisos requeridos',
            'Necesitamos acceso a tu cámara para tomar una foto.',
            () => {
              showError('Instrucciones', '1. Ve a Configuración\n2. Busca "Eternal Joyería" o "Expo Go"\n3. Activa "Cámara"\n4. Regresa a la app');
            },
            () => {}
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
          showPermissionRequired(
            'Permisos requeridos',
            'Necesitamos acceso a tu galería para seleccionar una foto.',
            () => {
              showError('Instrucciones', '1. Ve a Configuración\n2. Busca "Eternal Joyería" o "Expo Go"\n3. Activa "Fotos"\n4. Regresa a la app');
            },
            () => {}
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
      showError('Error', 'No se pudo seleccionar la imagen. Inténtalo de nuevo.');
    }
  };

  const handleImagePickerOptions = () => {
    showImagePickerOptions(
      () => pickImage('camera'),
      () => pickImage('gallery'),
      () => {}
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <LinearGradient
        colors={['#e1bee7', '#ce93d8', '#ba68c8']}
        style={styles.background}
      >
        {/* Header elegante */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#4a148c" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Ionicons name="chatbubbles" size={28} color="#6a1b9a" />
            <Text style={styles.headerTitle}>Reseñas</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Product Info Section elegante */}
          <View style={styles.productInfoSection}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.95)', 'rgba(225, 190, 231, 0.8)']}
              style={styles.productInfoGradient}
            >
              <View style={styles.productImageContainer}>
                {productImageUri ? (
                  <Image
                    source={{ uri: productImageUri }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.productImage, { backgroundColor: '#f3e5f5' }]}>
                    <Ionicons name="diamond" size={30} color="#8e24aa" />
                  </View>
                )}
                <View style={styles.imageOverlay} />
              </View>
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{String(product?.name || '')}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={22} color="#ffc107" />
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
                <View style={styles.reviewCountContainer}>
                  <Ionicons name="chatbubble-ellipses" size={16} color="#8e24aa" />
                  <Text style={styles.reviewCount}>{reviews.length} reseñas</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Reviews List elegante */}
          <View style={styles.reviewsSection}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Ionicons name="diamond-outline" size={40} color="#8e24aa" />
                <Text style={styles.loadingText}>Cargando reseñas...</Text>
              </View>
            ) : (
              reviews.map((review) => (
                <View key={review._id || `${review.id_customer}-${review.createdAt}`} style={styles.reviewCard}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.95)', 'rgba(240, 230, 255, 0.8)']}
                    style={styles.reviewGradient}
                  >
                    <View style={styles.reviewHeader}>
                      <View style={styles.avatarContainer}>
                        <Image source={getAvatarSource(review)} style={styles.userAvatar} />
                        <View style={styles.avatarBorder} />
                      </View>
                      <View style={styles.reviewInfo}>
                        <Text style={styles.userName}>{getUserName(review)}</Text>
                        <Text style={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString()}</Text>
                      </View>
                    </View>
                    <View style={styles.starsRow}>
                      {renderStars(Number(review.rank) || 0)}
                    </View>
                    <Text style={styles.reviewText}>{String(review.comment || '')}</Text>
                  </LinearGradient>
                </View>
              ))
            )}
          </View>

          {/* Add Review Form elegante */}
          {showForm && (
            <View style={styles.addReviewForm}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.95)', 'rgba(225, 190, 231, 0.8)']}
                style={styles.formGradient}
              >
                <View style={styles.formHeader}>
                  <Ionicons name="create" size={24} color="#6a1b9a" />
                  <Text style={styles.formTitle}>Añadir nueva reseña</Text>
                </View>
            
                {/* Foto Input elegante */}
                <View style={styles.formSection}>
                  <View style={styles.labelContainer}>
                    <Ionicons name="camera" size={18} color="#6a1b9a" />
                    <Text style={styles.formLabel}>Foto</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.photoInput}
                    onPress={handleImagePickerOptions}
                  >
                    {selectedImage ? (
                      <Image source={{ uri: selectedImage }} style={styles.selectedPhoto} />
                    ) : (
                      <View style={styles.photoPlaceholder}>
                        <Ionicons name="camera-outline" size={35} color="#8e24aa" />
                        <Text style={styles.photoPlaceholderText}>Toca para añadir foto</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Calificación Input elegante */}
                <View style={styles.formSection}>
                  <View style={styles.labelContainer}>
                    <Ionicons name="star" size={18} color="#6a1b9a" />
                    <Text style={styles.formLabel}>Calificación</Text>
                  </View>
                  <View style={styles.ratingStarsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity
                        key={star}
                        onPress={() => setSelectedRating(star)}
                        style={styles.starButton}
                      >
                        <Ionicons
                          name={star <= selectedRating ? 'star' : 'star-outline'}
                          size={28}
                          color="#ffc107"
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Comentario Input elegante */}
                <View style={styles.formSection}>
                  <View style={styles.labelContainer}>
                    <Ionicons name="chatbox" size={18} color="#6a1b9a" />
                    <Text style={styles.formLabel}>Comentario</Text>
                  </View>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Escribe tu comentario aquí..."
                    placeholderTextColor="#ab47bc"
                    value={reviewText}
                    onChangeText={setReviewText}
                    multiline
                    textAlignVertical="top"
                    numberOfLines={4}
                  />
                </View>
              </LinearGradient>
            </View>
          )}

          {/* Extra space for keyboard */}
          <View style={styles.keyboardSpace} />
        </ScrollView>

        {/* Add Review Button elegante */}
        <View style={styles.buttonContainer}>
          <LinearGradient
            colors={['#e91e63', '#ad1457']}
            style={styles.addReviewButton}
          >
            <TouchableOpacity 
              style={styles.addReviewTouchable}
              onPress={showForm ? handleAddReview : toggleForm}
            >
              <Ionicons 
                name={showForm ? "send" : "add-circle"} 
                size={20} 
                color="#fff" 
                style={styles.buttonIcon}
              />
              <Text style={styles.addReviewText}>
                {showForm
                  ? (submitting ? 'Enviando...' : 'Enviar reseña')
                  : (user?._id || user?.id ? 'Agregar reseña' : 'Inicia sesión para reseñar')}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </LinearGradient>
      
      {/* Alerta personalizada */}
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onClose={hideAlert}
        autoClose={alertConfig.autoClose}
        autoCloseDelay={alertConfig.autoCloseDelay}
        showIcon={alertConfig.showIcon}
        animationType={alertConfig.animationType}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1bee7',
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 25,
    backgroundColor: 'transparent',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6a1b9a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4a148c',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  productInfoSection: {
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#6a1b9a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  productInfoGradient: {
    flexDirection: 'row',
    padding: 20,
  },
  productImageContainer: {
    position: 'relative',
    marginRight: 15,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ab47bc',
  },
  productImage: {
    width: 85,
    height: 85,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a148c',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  ratingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a148c',
    marginLeft: 6,
  },
  reviewCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reviewCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6a1b9a',
  },
  reviewsSection: {
    marginBottom: 100,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 15,
  },
  loadingText: {
    fontSize: 16,
    color: '#6a1b9a',
    fontWeight: '500',
  },
  reviewCard: {
    marginBottom: 15,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#6a1b9a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  reviewGradient: {
    padding: 20,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatarBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#ab47bc',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a148c',
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: '#8e24aa',
    fontWeight: '500',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  starsRow: {
    marginBottom: 12,
  },
  reviewText: {
    fontSize: 15,
    color: '#4a148c',
    lineHeight: 22,
    textAlign: 'justify',
  },
  keyboardSpace: {
    height: 50,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  addReviewButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  addReviewTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  buttonIcon: {
    marginRight: 5,
  },
  addReviewText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  // Form styles
  addReviewForm: {
    marginBottom: 20,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#6a1b9a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  formGradient: {
    padding: 25,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 25,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a148c',
  },
  formSection: {
    marginBottom: 25,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a148c',
  },
  photoInput: {
    width: 120,
    height: 120,
    borderWidth: 2,
    borderColor: '#ab47bc',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderStyle: 'dashed',
  },
  photoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    fontSize: 12,
    color: '#8e24aa',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedPhoto: {
    width: 120,
    height: 120,
    borderRadius: 15,
  },
  ratingStarsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    paddingVertical: 15,
    borderRadius: 15,
  },
  starButton: {
    padding: 8,
  },
  commentInput: {
    borderWidth: 2,
    borderColor: '#ab47bc',
    borderRadius: 15,
    padding: 18,
    minHeight: 120,
    fontSize: 15,
    color: '#4a148c',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    textAlignVertical: 'top',
  },
});

export default ReviewsScreen;