import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TermsConditionsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Términos y Condiciones</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <View style={styles.updateContainer}>
            <Text style={styles.lastUpdated}>Última actualización: Diciembre 2024</Text>
          </View>
            
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
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
                <Text style={styles.sectionTitle}>2. Descripción del Servicio</Text>
              </View>
              <Text style={styles.sectionText}>
                Eternal Joyería es una plataforma de comercio electrónico que permite a los 
                usuarios explorar, seleccionar y comprar productos de joyería. Nuestros 
                servicios incluyen la visualización de productos, procesamiento de pedidos 
                y gestión de cuentas de usuario.
              </Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
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
                <Text style={styles.sectionTitle}>4. Pagos y Precios</Text>
              </View>
              <Text style={styles.sectionText}>
                Todos los precios están expresados en la moneda local y pueden cambiar sin previo aviso. 
                Los pagos se procesan de forma segura a través de nuestros proveedores de pago autorizados.
              </Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>5. Privacidad y Seguridad</Text>
              </View>
              <Text style={styles.sectionText}>
                Nos comprometemos a proteger tu información personal de acuerdo con nuestra Política de Privacidad. 
                Utilizamos medidas de seguridad apropiadas para proteger tus datos.
              </Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
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
                <Text style={styles.sectionTitle}>11. Ley Aplicable</Text>
              </View>
              <Text style={styles.sectionText}>
                Estos términos se rigen por las leyes de El Salvador. Cualquier disputa 
                será resuelta en los tribunales competentes de El Salvador.
              </Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>12. Contacto</Text>
              </View>
              <Text style={styles.sectionText}>
                Si tienes preguntas sobre estos términos y condiciones, contáctanos en:
              </Text>
              <View style={styles.contactContainer}>
                <View style={styles.contactItem}>
                  <Text style={styles.contactInfo}>legal@eternaljoyeria.com</Text>
                </View>
                <View style={styles.contactItem}>
                  <Text style={styles.contactInfo}>+503 1234-5678</Text>
                </View>
              </View>
            </View>

          {/* Espacio adicional */}
          <View style={styles.extraSpace} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 221, 221, 0.37)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 45,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  updateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 25,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16, // Reducido de 18 a 16 (1 nivel menos)
    fontWeight: 'bold',
    color: '#2d2d2d',
  },
  sectionText: {
    fontSize: 12, // Reducido de 14 a 12 (1 nivel menos)
    color: '#666',
    lineHeight: 18, // Ajustado proporcionalmente
  },
  contactContainer: {
    marginTop: 15,
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    minHeight: 50,
  },
  contactInfo: {
    fontSize: 16,
    color: '#2d2d2d',
    fontWeight: '500',
    flex: 1,
  },
  contactItemEmail: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    minHeight: 50,
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
    color: '#2d2d2d',
    fontWeight: '600',
  },
  emailText: {
    fontSize: 15,
    color: '#2d2d2d',
    fontWeight: '500',
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