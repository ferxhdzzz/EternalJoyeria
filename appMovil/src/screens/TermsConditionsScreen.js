import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const TermsConditionsScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#fce4ec', '#f8bbd9', '#f48fb1']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Encabezado */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#ad1457" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Ionicons name="document-text" size={28} color="#e91e63" />
            <Text style={styles.headerTitle}>Términos y Condiciones</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(252, 228, 236, 0.8)']}
            style={styles.contentGradient}
          >
            <View style={styles.updateContainer}>
              <Ionicons name="time" size={16} color="#e91e63" />
              <Text style={styles.lastUpdated}>Última actualización: Diciembre 2024</Text>
            </View>
            
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="checkmark-circle" size={20} color="#e91e63" />
                <Text style={styles.sectionTitle}>1. Aceptación de los Términos</Text>
              </View>
              <Text style={styles.sectionText}>
                Al acceder y utilizar la aplicación móvil de Eternal Joyería, aceptas estar 
                sujeto a estos términos y condiciones. Si no estás de acuerdo con alguna 
                parte de estos términos, no debes utilizar nuestra aplicación.
              </Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="diamond" size={20} color="#e91e63" />
                <Text style={styles.sectionTitle}>2. Descripción del Servicio</Text>
              </View>
              <Text style={styles.sectionText}>
                Eternal Joyería es una plataforma de comercio electrónico que permite a los 
                usuarios explorar, seleccionar y comprar productos de joyería. Nuestros 
                servicios incluyen la visualización de productos, procesamiento de pedidos 
                y entrega de mercancías.
              </Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="person" size={20} color="#e91e63" />
                <Text style={styles.sectionTitle}>3. Cuenta de Usuario</Text>
              </View>
              <Text style={styles.sectionText}>
                Para realizar compras, debes crear una cuenta proporcionando información 
                precisa y actualizada. Eres responsable de mantener la confidencialidad 
                de tu contraseña y de todas las actividades que ocurran bajo tu cuenta.
              </Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="pricetag" size={20} color="#e91e63" />
                <Text style={styles.sectionTitle}>4. Productos y Precios</Text>
              </View>
              <Text style={styles.sectionText}>
                Todos los productos mostrados están sujetos a disponibilidad. Los precios 
                pueden cambiar sin previo aviso. Nos esforzamos por mostrar imágenes 
                precisas, pero las características reales pueden variar ligeramente.
              </Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="bag" size={20} color="#e91e63" />
                <Text style={styles.sectionTitle}>5. Proceso de Compra</Text>
              </View>
              <Text style={styles.sectionText}>
                Al realizar un pedido, confirmas que tienes la capacidad legal para 
                celebrar contratos. Recibirás una confirmación por correo electrónico 
                una vez que se procese tu pedido exitosamente.
              </Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="return-down-back" size={20} color="#e91e63" />
                <Text style={styles.sectionTitle}>6. Política de Devoluciones</Text>
              </View>
              <Text style={styles.sectionText}>
                Aceptamos devoluciones dentro de los 30 días posteriores a la recepción 
                del producto, siempre que esté en su estado original y empaquetado. 
                Los gastos de envío de devolución corren por cuenta del cliente.
              </Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="car" size={20} color="#e91e63" />
                <Text style={styles.sectionTitle}>7. Envío y Entrega</Text>
              </View>
              <Text style={styles.sectionText}>
                Los tiempos de entrega son estimados y pueden variar según la ubicación 
                y el método de envío seleccionado. No nos hacemos responsables por 
                retrasos causados por factores fuera de nuestro control.
              </Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="library" size={20} color="#e91e63" />
                <Text style={styles.sectionTitle}>8. Propiedad Intelectual</Text>
              </View>
              <Text style={styles.sectionText}>
                Todo el contenido de la aplicación, incluyendo textos, imágenes, logos 
                y software, está protegido por derechos de autor y otras leyes de 
                propiedad intelectual de Eternal Joyería.
              </Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="shield-checkmark" size={20} color="#e91e63" />
                <Text style={styles.sectionTitle}>9. Limitación de Responsabilidad</Text>
              </View>
              <Text style={styles.sectionText}>
                En ningún caso Eternal Joyería será responsable por daños indirectos, 
                incidentales o consecuentes que surjan del uso de nuestros servicios 
                o productos.
              </Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="create" size={20} color="#e91e63" />
                <Text style={styles.sectionTitle}>10. Modificaciones</Text>
              </View>
              <Text style={styles.sectionText}>
                Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                Los cambios entrarán en vigor inmediatamente después de su publicación 
                en la aplicación.
              </Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="hammer" size={20} color="#e91e63" />
                <Text style={styles.sectionTitle}>11. Ley Aplicable</Text>
              </View>
              <Text style={styles.sectionText}>
                Estos términos se rigen por las leyes de El Salvador. Cualquier disputa 
                será resuelta en los tribunales competentes de El Salvador.
              </Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="mail" size={20} color="#e91e63" />
                <Text style={styles.sectionTitle}>12. Contacto</Text>
              </View>
              <Text style={styles.sectionText}>
                Si tienes preguntas sobre estos términos y condiciones, contáctanos en:
              </Text>
              <View style={styles.contactContainer}>
                <View style={styles.contactItemEmail}>
                  <View style={styles.emailRow}>
                    <Ionicons name="mail" size={16} color="#e91e63" />
                    <Text style={styles.emailLabel}>Correo:</Text>
                  </View>
                  <Text style={styles.emailText}>
                    legal@eternaljoyeria.com
                  </Text>
                </View>
                <View style={styles.contactItem}>
                  <Ionicons name="call" size={16} color="#e91e63" />
                  <Text style={styles.contactInfo}>+503 1234-5678</Text>
                </View>
              </View>
            </View>

            {/* Espacio adicional */}
            <View style={styles.extraSpace} />
          </LinearGradient>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 25,
    backgroundColor: 'transparent',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginLeft: 15,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ad1457',
  },
  placeholder: {
    width: 45,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentGradient: {
    padding: 25,
    borderRadius: 25,
    margin: 10,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  updateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 25,
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    padding: 12,
    borderRadius: 15,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#ad1457',
    fontWeight: '500',
  },
  section: {
    marginBottom: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(233, 30, 99, 0.1)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ad1457',
  },
  sectionText: {
    fontSize: 16,
    color: '#4a148c',
    lineHeight: 24,
    fontWeight: '500',
  },
  contactContainer: {
    marginTop: 15,
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    padding: 15,
    borderRadius: 10,
    minHeight: 60,
  },
  contactInfo: {
    fontSize: 16,
    color: '#ad1457',
    fontWeight: '600',
    flex: 1,
    lineHeight: 22,
  },
  contactItemEmail: {
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    padding: 15,
    borderRadius: 10,
    minHeight: 70,
    width: '100%',
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  emailLabel: {
    fontSize: 16,
    color: '#ad1457',
    fontWeight: '600',
  },
  emailText: {
    fontSize: 15,
    color: '#ad1457',
    fontWeight: '600',
    paddingLeft: 24,
    width: '100%',
    flexWrap: 'wrap',
    lineHeight: 20,
  },
  extraSpace: {
    height: 50,
  },
});

export default TermsConditionsScreen; 