import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PrivacyPolicyScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Política de Privacidad</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Última actualización: Diciembre 2024</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Información que Recopilamos</Text>
          <Text style={styles.sectionText}>
            Recopilamos información que nos proporcionas directamente, como cuando creas una cuenta, 
            realizas una compra o te comunicas con nosotros. Esta información puede incluir:
          </Text>
          <Text style={styles.bulletPoint}>• Nombre y apellidos</Text>
          <Text style={styles.bulletPoint}>• Dirección de correo electrónico</Text>
          <Text style={styles.bulletPoint}>• Número de teléfono</Text>
          <Text style={styles.bulletPoint}>• Dirección de envío</Text>
          <Text style={styles.bulletPoint}>• Información de pago</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Cómo Utilizamos tu Información</Text>
          <Text style={styles.sectionText}>
            Utilizamos la información recopilada para:
          </Text>
          <Text style={styles.bulletPoint}>• Procesar y completar tus pedidos</Text>
          <Text style={styles.bulletPoint}>• Comunicarnos contigo sobre tu cuenta o pedidos</Text>
          <Text style={styles.bulletPoint}>• Enviar información sobre productos y promociones</Text>
          <Text style={styles.bulletPoint}>• Mejorar nuestros servicios y experiencia del usuario</Text>
          <Text style={styles.bulletPoint}>• Cumplir con obligaciones legales</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Compartir tu Información</Text>
          <Text style={styles.sectionText}>
            No vendemos, alquilamos ni compartimos tu información personal con terceros, 
            excepto en las siguientes circunstancias:
          </Text>
          <Text style={styles.bulletPoint}>• Con proveedores de servicios que nos ayudan a operar</Text>
          <Text style={styles.bulletPoint}>• Para cumplir con obligaciones legales</Text>
          <Text style={styles.bulletPoint}>• Con tu consentimiento explícito</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Seguridad de Datos</Text>
          <Text style={styles.sectionText}>
            Implementamos medidas de seguridad técnicas y organizativas apropiadas 
            para proteger tu información personal contra acceso no autorizado, 
            alteración, divulgación o destrucción.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Tus Derechos</Text>
          <Text style={styles.sectionText}>
            Tienes derecho a:
          </Text>
          <Text style={styles.bulletPoint}>• Acceder a tu información personal</Text>
          <Text style={styles.bulletPoint}>• Corregir información inexacta</Text>
          <Text style={styles.bulletPoint}>• Solicitar la eliminación de tus datos</Text>
          <Text style={styles.bulletPoint}>• Retirar tu consentimiento en cualquier momento</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Cookies y Tecnologías Similares</Text>
          <Text style={styles.sectionText}>
            Utilizamos cookies y tecnologías similares para mejorar tu experiencia, 
            analizar el tráfico del sitio y personalizar el contenido.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Cambios en esta Política</Text>
          <Text style={styles.sectionText}>
            Podemos actualizar esta política de privacidad ocasionalmente. 
            Te notificaremos sobre cualquier cambio significativo por correo electrónico 
            o mediante un aviso en nuestro sitio web.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Contacto</Text>
          <Text style={styles.sectionText}>
            Si tienes preguntas sobre esta política de privacidad o sobre cómo 
            manejamos tu información personal, contáctanos en:
          </Text>
          <Text style={styles.contactInfo}>Email: privacidad@eternaljoyeria.com</Text>
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
  bulletPoint: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginLeft: 20,
    marginBottom: 6,
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

export default PrivacyPolicyScreen; 