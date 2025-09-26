import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
// import { Ionicons } from '@expo/vector-icons'; // Eliminado - no se usan iconos

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Política de Privacidad</Text>
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
              <Text style={styles.sectionTitle}>1. Información que Recopilamos</Text>
            </View>
              <Text style={styles.sectionText}>
                Recopilamos información que nos proporcionas directamente, como cuando creas una cuenta, 
                realizas una compra o te comunicas con nosotros. Esta información puede incluir:
              </Text>
              <View style={styles.bulletContainer}>
                <View style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>• Nombre y apellidos</Text>
                </View>
                <View style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>• Dirección de correo electrónico</Text>
                </View>
                <View style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>• Número de teléfono</Text>
                </View>
                <View style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>• Dirección de envío</Text>
                </View>
                <View style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>• Información de pago</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>2. Cómo Utilizamos tu Información</Text>
              </View>
              <Text style={styles.sectionText}>
                Utilizamos la información recopilada para:
              </Text>
              <View style={styles.bulletContainer}>
                <View style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>• Procesar y completar tus pedidos</Text>
                </View>
                <View style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>• Comunicarnos contigo sobre tu cuenta o pedidos</Text>
                </View>
                <View style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>• Enviar información sobre productos y promociones</Text>
                </View>
                <View style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>• Mejorar nuestros servicios y experiencia del usuario</Text>
                </View>
                <View style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>• Cumplir con obligaciones legales</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>3. Compartir tu Información</Text>
              </View>
              <Text style={styles.sectionText}>
                No vendemos, alquilamos ni compartimos tu información personal con terceros, 
                excepto en las siguientes circunstancias:
              </Text>
              <View style={styles.bulletContainer}>
                <View style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>• Con proveedores de servicios que nos ayudan a operar</Text>
                </View>
                <View style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>• Para cumplir con obligaciones legales</Text>
                </View>
                <View style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>• Con tu consentimiento explícito</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>4. Seguridad de Datos</Text>
              </View>
              <Text style={styles.sectionText}>
                Implementamos medidas de seguridad técnicas y organizativas apropiadas 
                para proteger tu información personal contra acceso no autorizado, 
                alteración, divulgación o destrucción.
              </Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>5. Tus Derechos</Text>
              </View>
              <Text style={styles.sectionText}>
                Tienes derecho a:
              </Text>
              <View style={styles.bulletContainer}>
                <View style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>• Acceder a tu información personal</Text>
                </View>
                <View style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>• Corregir información inexacta</Text>
                </View>
                <View style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>• Solicitar la eliminación de tus datos</Text>
                </View>
                <View style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>• Retirar tu consentimiento en cualquier momento</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>6. Cookies y Tecnologías Similares</Text>
              </View>
              <Text style={styles.sectionText}>
                Utilizamos cookies y tecnologías similares para mejorar tu experiencia, 
                analizar el tráfico del sitio y personalizar el contenido.
              </Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>7. Cambios en esta Política</Text>
              </View>
              <Text style={styles.sectionText}>
                Podemos actualizar esta política de privacidad ocasionalmente. 
                Te notificaremos sobre cualquier cambio significativo por correo electrónico 
                o mediante un aviso en nuestro sitio web.
              </Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>8. Contacto</Text>
              </View>
              <Text style={styles.sectionText}>
                Si tienes preguntas sobre esta política de privacidad o sobre cómo 
                manejamos tu información personal, contáctanos en:
              </Text>
              <View style={styles.contactContainer}>
                <View style={styles.contactItem}>
                  <Text style={styles.contactInfo}>privacidad@eternaljoyeria.com</Text>
                </View>
                <View style={styles.contactItem}>
                  <Text style={styles.contactInfo}>+503 1234-5678</Text>
                </View>
              </View>
            </View>

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
  backButtonText: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d2d2d',
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
    marginBottom: 15,
  },
  bulletContainer: {
    gap: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
  },
  bulletPoint: {
    fontSize: 12, // Reducido de 16 a 12 (2 niveles menos)
    color: '#2d2d2d',
    flex: 1,
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
    flexWrap: 'wrap',
    textBreakStrategy: 'simple',
    includeFontPadding: false,
  },
  contactItemEmail: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 15,
    borderRadius: 10,
    minHeight: 70,
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
    fontSize: 16,
    color: '#2d2d2d',
    fontWeight: '600',
    paddingLeft: 24,
    width: '100%',
  },
  contactItemSimple: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    minHeight: 50,
  },
  emailIcon: {
    marginRight: 6,
    marginTop: 2,
  },
  emailContainer: {
    flex: 1,
    marginLeft: 12,
  },
  emailTextSimple: {
    fontSize: 13,
    color: '#2d2d2d',
    fontWeight: '500',
    flex: 1,
  },
  extraSpace: {
    height: 50,
  },
});

export default PrivacyPolicyScreen; 