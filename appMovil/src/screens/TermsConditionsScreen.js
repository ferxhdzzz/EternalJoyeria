import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TermsConditionsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Términos y Condiciones</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Última actualización: Diciembre 2024</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Aceptación de los Términos</Text>
          <Text style={styles.sectionText}>
            Al acceder y utilizar la aplicación móvil de Eternal Joyería, aceptas estar 
            sujeto a estos términos y condiciones. Si no estás de acuerdo con alguna 
            parte de estos términos, no debes utilizar nuestra aplicación.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Descripción del Servicio</Text>
          <Text style={styles.sectionText}>
            Eternal Joyería es una plataforma de comercio electrónico que permite a los 
            usuarios explorar, seleccionar y comprar productos de joyería. Nuestros 
            servicios incluyen la visualización de productos, procesamiento de pedidos 
            y entrega de mercancías.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Cuenta de Usuario</Text>
          <Text style={styles.sectionText}>
            Para realizar compras, debes crear una cuenta proporcionando información 
            precisa y actualizada. Eres responsable de mantener la confidencialidad 
            de tu contraseña y de todas las actividades que ocurran bajo tu cuenta.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Productos y Precios</Text>
          <Text style={styles.sectionText}>
            Todos los productos mostrados están sujetos a disponibilidad. Los precios 
            pueden cambiar sin previo aviso. Nos esforzamos por mostrar imágenes 
            precisas, pero las características reales pueden variar ligeramente.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Proceso de Compra</Text>
          <Text style={styles.sectionText}>
            Al realizar un pedido, confirmas que tienes la capacidad legal para 
            celebrar contratos. Recibirás una confirmación por correo electrónico 
            una vez que se procese tu pedido exitosamente.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Política de Devoluciones</Text>
          <Text style={styles.sectionText}>
            Aceptamos devoluciones dentro de los 30 días posteriores a la recepción 
            del producto, siempre que esté en su estado original y empaquetado. 
            Los gastos de envío de devolución corren por cuenta del cliente.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Envío y Entrega</Text>
          <Text style={styles.sectionText}>
            Los tiempos de entrega son estimados y pueden variar según la ubicación 
            y el método de envío seleccionado. No nos hacemos responsables por 
            retrasos causados por factores fuera de nuestro control.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Propiedad Intelectual</Text>
          <Text style={styles.sectionText}>
            Todo el contenido de la aplicación, incluyendo textos, imágenes, logos 
            y software, está protegido por derechos de autor y otras leyes de 
            propiedad intelectual de Eternal Joyería.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Limitación de Responsabilidad</Text>
          <Text style={styles.sectionText}>
            En ningún caso Eternal Joyería será responsable por daños indirectos, 
            incidentales o consecuentes que surjan del uso de nuestros servicios 
            o productos.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Modificaciones</Text>
          <Text style={styles.sectionText}>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. 
            Los cambios entrarán en vigor inmediatamente después de su publicación 
            en la aplicación.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Ley Aplicable</Text>
          <Text style={styles.sectionText}>
            Estos términos se rigen por las leyes de El Salvador. Cualquier disputa 
            será resuelta en los tribunales competentes de El Salvador.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Contacto</Text>
          <Text style={styles.sectionText}>
            Si tienes preguntas sobre estos términos y condiciones, contáctanos en:
          </Text>
          <Text style={styles.contactInfo}>Email: legal@eternaljoyeria.com</Text>
          <Text style={styles.contactInfo}>Teléfono: +503 1234-5678</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
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
  lastUpdated: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginVertical: 20,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 12,
  },
  contactInfo: {
    fontSize: 16,
    color: '#FFB6C1',
    fontWeight: '600',
    marginTop: 8,
  },
  extraSpace: {
    height: 120,
    backgroundColor: 'transparent',
  },
});

export default TermsConditionsScreen; 