// src/screens/ReviewsScreen.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  SafeAreaView,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BACKEND_URL,
  API_ENDPOINTS,
  buildApiUrl,
  buildAuthHeaders,
} from '../config/api';
import { useAuth } from '../context/AuthContext';
import CustomAlert from '../components/CustomAlert';
import useCustomAlert from '../hooks/useCustomAlert';

const ReviewsScreen = ({ navigation, route }) => {
  const { product } = route.params;
  const { user } = useAuth();

  const [reviewText, setReviewText] = useState('');
  const [selectedRating, setSelectedRating] = useState(5);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [hasPurchased, setHasPurchased] = useState(null);
  const [checkingPurchase, setCheckingPurchase] = useState(false);

  const [selectedImageModal, setSelectedImageModal] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const {
    alertConfig,
    hideAlert,
    showError,
    showReviewSuccess,
    showReviewError,
    showImagePickerOptions,
    showAlert,
  } = useCustomAlert();

  const productId = product?._id || product?.id || null;

  const productImageUri =
    Array.isArray(product?.images) && product.images.length
      ? product.images[0]
      : typeof product?.image === 'string'
      ? product.image
      : null;

  const fetchWithTimeout = async (url, options = {}, timeoutMs = 10000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      return res;
    } finally {
      clearTimeout(id);
    }
  };

  const parseJsonSafe = async (res) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.log('[CHECK_PURCHASE] JSON parse error:', e?.message);
      console.log('[CHECK_PURCHASE] Raw body:', text);
      return null;
    }
  };

  const computeHasPurchasedFromOrders = (orders, uid, pid) => {
    if (!Array.isArray(orders) || !uid || !pid) return false;
    const okStatuses = new Set(['pagado', 'paid', 'completed']);
    for (const o of orders) {
      const sameUser =
        String(o?.idCustomer?._id || o?.idCustomer) === String(uid);
      if (!sameUser) continue;
      const status = String(o?.status || '').trim().toLowerCase();
      if (!okStatuses.has(status)) continue;
      const prods = Array.isArray(o?.products) ? o.products : [];
      const contains = prods.some((p) => {
        const pId = p?.productId?._id || p?.productId;
        return String(pId) === String(pid);
      });
      if (contains) return true;
    }
    return false;
  };

  const checkUserPurchase = async () => {
    if (!user || !productId) {
      setHasPurchased(false);
      return;
    }
    setCheckingPurchase(true);
    try {
      const headers = await buildAuthHeaders({ 'Content-Type': 'application/json' });

      const url = buildApiUrl(`${API_ENDPOINTS.PRODUCTS_CHECK_PURCHASE}/${productId}`);
      console.log('[CHECK_PURCHASE] URL:', url);

      const res = await fetchWithTimeout(url, { method: 'GET', headers }, 10000);
      console.log('[CHECK_PURCHASE] status:', res.status);

      let ok = false;
      if (res.ok) {
        const data = await parseJsonSafe(res);
        if (data && typeof data.hasPurchased === 'boolean') {
          setHasPurchased(data.hasPurchased);
          console.log('[CHECK_PURCHASE] hasPurchased (direct):', data.hasPurchased);
          ok = true;
        } else {
          console.log('[CHECK_PURCHASE] Unexpected body, will fallback to /orders');
        }
      }

      if (!ok) {
        const ordersUrl = buildApiUrl(API_ENDPOINTS.ORDERS);
        console.log('[CHECK_PURCHASE] Fallback -> GET', ordersUrl);
        const r2 = await fetchWithTimeout(ordersUrl, { method: 'GET', headers }, 10000);
        console.log('[CHECK_PURCHASE] /orders status:', r2.status);
        if (!r2.ok) throw new Error(`orders HTTP ${r2.status}`);
        const body2 = await parseJsonSafe(r2);
        const has = computeHasPurchasedFromOrders(body2, user._id || user.id, productId);
        setHasPurchased(has);
        console.log('[CHECK_PURCHASE] hasPurchased (fallback):', has);
      }
    } catch (e) {
      console.log('[CHECK_PURCHASE] error:', e?.message);
      setHasPurchased(false);
    } finally {
      setCheckingPurchase(false);
    }
  };

  const openImageModal = (imageUri) => {
    setSelectedImageModal(imageUri);
    setImageModalVisible(true);
  };

  const closeImageModal = () => {
    setImageModalVisible(false);
    setSelectedImageModal(null);
  };

  useEffect(() => {
    if (user && productId) checkUserPurchase();
  }, [user, productId]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        if (!productId) return;
        const url = `${BACKEND_URL}/api/reviews/product/${productId}`;
        const res = await fetch(url);
        if (!res.ok) {
          if (res.status === 404) {
            setReviews([]);
            return;
          }
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Error al cargar reseñas');
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setReviews(data);
        } else if (Array.isArray(data?.reviews)) {
          setReviews(data.reviews);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.log('[Reviews] fetch error:', error?.message);
        showError('Error al cargar las reseñas');
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredReviews(reviews);
      return;
    }
    const n = parseInt(selectedFilter, 10);
    setFilteredReviews(reviews.filter((r) => (r.rank || 0) === n));
  }, [reviews, selectedFilter]);

  const stats = useMemo(() => {
    if (reviews.length === 0) {
      return {
        average: 0,
        total: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }
    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + (r.rank || 0), 0);
    const average = sum / total;
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const k = r.rank || 0;
      if (k >= 1 && k <= 5) distribution[k]++;
    });
    return { average, total, distribution };
  }, [reviews]);

  const getUserName = (review) => {
    const c = review?.id_customer;
    if (c && typeof c === 'object') {
      const fn = c.firstName || c.first_name || '';
      const ln = c.lastName || c.surname || '';
      if (fn && ln) return `${fn} ${ln}`;
      if (fn) return fn;
      if (c.fullName) return c.fullName;
      const email = c.email || '';
      if (email) return (email.split('@')[0] || 'Usuario');
    }
    return 'Usuario';
  };

  const getAvatarSource = (r) => {
    const c = r?.id_customer;
    let uri =
      c?.profileImage ||
      c?.avatar ||
      c?.image ||
      c?.photo ||
      c?.profilePicture ||
      c?.picture;
    if (uri && typeof uri === 'string' && uri.trim() !== '') {
      uri = uri.trim();
      if (!uri.startsWith('http')) {
        uri = uri.startsWith('/') ? `${BACKEND_URL}${uri}` : `${BACKEND_URL}/${uri}`;
      }
      return { uri };
    }
    return require('../../assets/Usuarionuevo.jpg');
  };

  const pickFromCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        showError('Se necesitan permisos de cámara para tomar una foto');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch {
      showError('Error al tomar la foto');
    }
  };

  const pickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showError('Se necesitan permisos de galería para seleccionar una foto');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch {
      showError('Error al seleccionar la foto');
    }
  };

  const handleImagePickerOptions = () => {
    showImagePickerOptions(
      () => pickFromCamera(),
      () => pickFromGallery(),
      () => {}
    );
  };

  const handleSubmitReview = async () => {
    if (!user) {
      showError('Debes iniciar sesión para dejar una reseña');
      return;
    }
    if (!reviewText.trim()) {
      showReviewError('Por favor escribe un comentario.');
      return;
    }
    try {
      setSubmitting(true);
      const token = await AsyncStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('rank', String(selectedRating));
      formData.append('comment', reviewText.trim());
      formData.append('id_product', productId);
      formData.append('id_customer', user._id || user.id);
      if (selectedImage) {
        formData.append('images', {
          uri: selectedImage,
          type: 'image/jpeg',
          name: 'review-image.jpg',
        });
      }
      const res = await fetch(`${BACKEND_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Error al enviar la reseña');

      const newReview = {
        ...data,
        id_customer: {
          ...data.id_customer,
          firstName: user?.firstName || data.id_customer?.firstName,
          lastName: user?.lastName || data.id_customer?.lastName,
          profileImage: user?.profileImage || data.id_customer?.profileImage,
          avatar: user?.avatar || data.id_customer?.avatar,
          image: user?.image || data.id_customer?.image,
          email: user?.email || data.id_customer?.email,
        },
      };
      setReviews((prev) => [newReview, ...prev]);
      setReviewText('');
      setSelectedRating(5);
      setSelectedImage(null);
      setShowForm(false);
      showReviewSuccess('Reseña enviada exitosamente');
    } catch (e) {
      showReviewError(e?.message || 'Error al enviar la reseña');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2d2d2d" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Reseñas del Producto</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.productInfo}>
          <View style={styles.productHeader}>
            {productImageUri && (
              <Image source={{ uri: productImageUri }} style={styles.productImage} resizeMode="cover" />
            )}
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{product?.name || 'Producto'}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>⭐ {stats.average.toFixed(1)} ({stats.total} reseñas)</Text>
              </View>
            </View>
          </View>

          {!showForm && (
            <TouchableOpacity
              style={styles.addReviewButton}
              onPress={() => {
                if (!user) {
                  showError('Debes iniciar sesión para dejar una reseña');
                  return;
                }
                if (checkingPurchase || hasPurchased === null) {
                  showError('Verificando tu historial de compras...');
                  return;
                }
                if (!hasPurchased) {
                  showAlert({
                    type: 'warning',
                    title: 'Compra Requerida',
                    message:
                      'Solo puedes escribir reseñas de productos que hayas comprado. Compra este producto para poder compartir tu experiencia.',
                    buttons: [
                      { text: 'Entendido', style: 'cancel', onPress: () => hideAlert() },
                      {
                        text: 'Ver producto',
                        style: 'confirm',
                        onPress: () => {
                          hideAlert();
                          navigation.goBack();
                        },
                      },
                    ],
                  });
                  return;
                }
                setShowForm(true);
              }}
            >
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.addReviewText}>Escribir reseña</Text>
            </TouchableOpacity>
          )}

          {checkingPurchase && (
            <View style={{ marginTop: 10, padding: 10, backgroundColor: '#f3f4f6', borderRadius: 8 }}>
              <Text style={{ color: '#374151' }}>Verificando compras…</Text>
            </View>
          )}
        </View>

        {reviews.length > 0 && (
          <View style={styles.filtersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['all', '5', '4', '3', '2', '1'].map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterButton, selectedFilter === filter && styles.filterButtonActive]}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>
                    {filter === 'all' ? 'Todas' : `${filter} ⭐`}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {showForm && (
          <View style={styles.reviewForm}>
            <Text style={styles.formTitle}>Añadir Reseña</Text>

            <View style={styles.ratingSection}>
              <Text style={styles.formLabel}>Calificación:</Text>
              <View style={styles.starsInput}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setSelectedRating(star)}>
                    <Text style={styles.starInput}>{star <= selectedRating ? '⭐' : '☆'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.photoSection}>
              <Text style={styles.formLabel}>Foto (opcional):</Text>
              <TouchableOpacity style={styles.photoButton} onPress={handleImagePickerOptions}>
                {selectedImage ? (
                  <Image source={{ uri: selectedImage }} style={styles.selectedPhoto} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Ionicons name="camera-outline" size={30} color="#666" />
                    <Text style={styles.photoPlaceholderText}>Toca para añadir foto</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.commentSection}>
              <Text style={styles.formLabel}>Comentario:</Text>
              <TextInput
                style={styles.commentInput}
                value={reviewText}
                onChangeText={setReviewText}
                placeholder="Escribe tu reseña aquí..."
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowForm(false);
                  setReviewText('');
                  setSelectedRating(5);
                  setSelectedImage(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                onPress={handleSubmitReview}
                disabled={submitting}
              >
                <Text style={styles.submitButtonText}>{submitting ? 'Enviando...' : 'Enviar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.reviewsList}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Cargando reseñas...</Text>
            </View>
          ) : filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <View key={review._id || Math.random()} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Image
                    source={getAvatarSource(review)}
                    style={styles.userAvatar}
                    onError={(e) => console.log('[ReviewsScreen] avatar error:', e.nativeEvent.error)}
                  />
                  <View style={styles.reviewInfo}>
                    <Text style={styles.userName}>{getUserName(review)}</Text>
                    <Text style={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString()}</Text>
                  </View>
                  <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Text key={star} style={styles.star}>
                        {star <= (review.rank || 0) ? '⭐' : '☆'}
                      </Text>
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewText}>{review.comment || ''}</Text>

                {Array.isArray(review.images) && review.images.length > 0 && (
                  <View style={styles.reviewImagesContainer}>
                    {review.images.map((imageUri, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.reviewImageContainer}
                        onPress={() => openImageModal(imageUri)}
                        activeOpacity={0.8}
                      >
                        <Image
                          source={{ uri: imageUri }}
                          style={styles.reviewImageThumbnail}
                          resizeMode="cover"
                        />
                        <View style={styles.imageOverlay}>
                          <Ionicons name="expand" size={20} color="#fff" />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {(!review.images || review.images.length === 0) && !!review.image && (
                  <TouchableOpacity
                    style={styles.reviewImageContainer}
                    onPress={() => openImageModal(review.image)}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: review.image }}
                      style={styles.reviewImageThumbnail}
                      resizeMode="cover"
                    />
                    <View style={styles.imageOverlay}>
                      <Ionicons name="expand" size={20} color="#fff" />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            <View style={styles.noReviewsContainer}>
              <Text style={styles.noReviewsText}>
                {selectedFilter === 'all' ? 'No hay reseñas aún' : 'No hay reseñas con este filtro'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={imageModalVisible} transparent animationType="fade" onRequestClose={closeImageModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalBackground} onPress={closeImageModal} activeOpacity={1}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={closeImageModal}>
                <Ionicons name="close" size={30} color="#fff" />
              </TouchableOpacity>
              {selectedImageModal && (
                <Image source={{ uri: selectedImageModal }} style={styles.modalImage} resizeMode="contain" />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onClose={hideAlert}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(255, 221, 221, 0.37)' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerButton: { padding: 8 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#2d2d2d' },
  headerSpacer: { width: 40 },
  scrollView: { flex: 1, paddingHorizontal: 16 },
  productInfo: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  productImage: { width: 80, height: 80, borderRadius: 8, marginRight: 16 },
  productDetails: { flex: 1 },
  productName: { fontSize: 18, fontWeight: 'bold', color: '#2d2d2d', marginBottom: 8 },
  addReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2d2d2d',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  addReviewText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 16, color: '#666' },
  filtersContainer: { marginVertical: 8 },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: { backgroundColor: '#f8bbd9', borderColor: '#f8bbd9' },
  filterText: { fontSize: 14, color: '#2d2d2d' },
  filterTextActive: { color: '#2d2d2d' },
  reviewsList: { marginVertical: 8 },
  loadingContainer: { padding: 32, alignItems: 'center' },
  loadingText: { fontSize: 16, color: '#666' },
  reviewCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  userAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  reviewInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#2d2d2d' },
  reviewDate: { fontSize: 12, color: '#999' },
  starsContainer: { flexDirection: 'row' },
  star: { fontSize: 16, marginLeft: 2 },
  reviewText: { fontSize: 14, color: '#444', lineHeight: 20 },
  noReviewsContainer: { padding: 32, alignItems: 'center' },
  noReviewsText: { fontSize: 16, color: '#666', textAlign: 'center' },
  reviewForm: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: { fontSize: 18, fontWeight: 'bold', color: '#2d2d2d', marginBottom: 16 },
  ratingSection: { marginBottom: 16 },
  formLabel: { fontSize: 16, fontWeight: '600', color: '#2d2d2d', marginBottom: 8 },
  starsInput: { flexDirection: 'row' },
  starInput: { fontSize: 24, marginRight: 8 },
  photoSection: { marginBottom: 16 },
  photoButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  selectedPhoto: { width: 100, height: 100, borderRadius: 8 },
  photoPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  photoPlaceholderText: { fontSize: 14, color: '#666', marginTop: 8 },
  commentSection: { marginBottom: 16 },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  formButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: {
    flex: 1,
    padding: 12,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: { fontSize: 16, color: '#666' },
  submitButton: {
    flex: 1,
    padding: 12,
    marginLeft: 8,
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: { backgroundColor: '#ccc' },
  submitButtonText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  reviewImagesContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 8 },
  reviewImageContainer: { marginTop: 10, position: 'relative', alignSelf: 'flex-start' },
  reviewImageThumbnail: { width: 120, height: 120, borderRadius: 8, backgroundColor: '#f0f0f0' },
  imageOverlay: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center' },
  modalBackground: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', height: '80%', position: 'relative' },
  modalImage: { width: '100%', height: '100%' },
  closeButton: {
    position: 'absolute',
    top: -50,
    right: 0,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReviewsScreen;
