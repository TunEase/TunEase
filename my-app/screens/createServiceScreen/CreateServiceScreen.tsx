import React, { useState,useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView,
} from "react-native";
import { supabase } from "../../services/supabaseClient";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from "../../components/Form/header";
interface Category {
  id: string;
  name: string;
}
const CreateServiceScreen: React.FC<{ route: any; navigation: any }> = ({ 
  route, 
  navigation 
}) => {
  const { businessId, id } = route.params || {};

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    service_type: "PUBLIC",
    processing_time: "",
    category_id: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const serviceTypes = [
    { label: "Public", value: "PUBLIC" },
    { label: "Private", value: "PRIVATE" },
  ];

  const processingTimeOptions = [
    "15 minutes",
    "30 minutes",
    "1 hour",
    "2 hours",
    "Same day",
    "Next day",
    "2-3 business days",
    "Custom"
  ];

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch categories');
    }
  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Service name is required";
    }
    if (!formData.category_id) {
      newErrors.category = "Category is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(parseFloat(formData.price))) {
      newErrors.price = "Price must be a valid number";
    }

    if (!formData.duration.trim()) {
      newErrors.duration = "Duration is required";
    } else if (isNaN(parseInt(formData.duration))) {
      newErrors.duration = "Duration must be a valid number";
    }

    if (!formData.processing_time) {
      newErrors.processing_time = "Processing time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addNewService = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from("services")
        .insert({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration),
          service_type: formData.service_type,
          processing_time: formData.processing_time,
          business_id: businessId,
        })
        .select("*")
        .single();

      if (error) throw error;

      navigation.navigate('UploadMedia', { 
        businessId, 
        id,
        serviceId: data.id
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };
    // Add category selection handler
    const handleCategorySelect = (categoryId: string) => {
      updateField("category_id", categoryId);
      setSelectedCategory(categoryId);
    };

  return (
    <View style={styles.container}>
      <Header
        title="Create Service"
        subtitle="Basic Information"
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.contentContainer}>
        {/* Service Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Service Name *</Text>
          <TextInput
            style={errors.name ? styles.inputError : styles.input}
            placeholder="Enter service name"
            value={formData.name}
            onChangeText={(value) => updateField("name", value)}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={errors.description ? styles.inputError : styles.input}
            placeholder="Enter service description"
            value={formData.description}
            onChangeText={(value) => updateField("description", value)}
            multiline
            numberOfLines={4}
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        {/* Price */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price *</Text>
          <TextInput
            style={errors.price ? styles.inputError : styles.input}
            placeholder="Enter price"
            value={formData.price}
            onChangeText={(value) => updateField("price", value)}
            keyboardType="decimal-pad"
          />
          {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
        </View>

        {/* Duration */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Duration (minutes) *</Text>
          <TextInput
            style={errors.duration ? styles.inputError : styles.input}
            placeholder="Enter duration in minutes"
            value={formData.duration}
            onChangeText={(value) => updateField("duration", value)}
            keyboardType="number-pad"
          />
          {errors.duration && <Text style={styles.errorText}>{errors.duration}</Text>}
        </View>

        {/* Service Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Service Type *</Text>
          <View style={styles.typeContainer}>
            {serviceTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.typeButton,
                  formData.service_type === type.value && styles.typeButtonActive
                ]}
                onPress={() => updateField("service_type", type.value)}
              >
                <Text style={[
                  styles.typeButtonText,
                  formData.service_type === type.value && styles.typeButtonTextActive
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Processing Time */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Processing Time *</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.processingTimeScroll}
          >
            {processingTimeOptions.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeButton,
                  formData.processing_time === time && styles.timeButtonActive
                ]}
                onPress={() => updateField("processing_time", time)}
              >
                <Text style={[
                  styles.timeButtonText,
                  formData.processing_time === time && styles.timeButtonTextActive
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {errors.processing_time && (
            <Text style={styles.errorText}>{errors.processing_time}</Text>
          )}
            {/* Categories */}
  <View style={styles.inputGroup}>
    <Text style={styles.label}>Service Category *</Text>
    <View style={styles.categoryContainer}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryChip,
            formData.category_id === category.id && styles.categoryChipActive
          ]}
          onPress={() => handleCategorySelect(category.id)}
        >
          <Text style={[
            styles.categoryChipText,
            formData.category_id === category.id && styles.categoryChipTextActive
          ]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
  </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={addNewService}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#D32F2F",
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 12,
    marginTop: 4,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#004D40",
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: "#004D40",
  },
  typeButtonText: {
    color: "#004D40",
    fontSize: 16,
    fontWeight: "600",
  },
  typeButtonTextActive: {
    color: "#FFFFFF",
  },
  processingTimeScroll: {
    flexGrow: 0,
    marginBottom: 10,
  },
  timeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#004D40",
    marginRight: 10,
  },
  timeButtonActive: {
    backgroundColor: "#004D40",
  },
  timeButtonText: {
    color: "#004D40",
    fontSize: 14,
    fontWeight: "500",
  },
  timeButtonTextActive: {
    color: "#FFFFFF",
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  nextButton: {
    backgroundColor: "#004D40",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  categoryScroll: {
    flexGrow: 0,
    marginBottom: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#004D40",
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  categoryButtonActive: {
    backgroundColor: "#004D40",
    borderColor: "#004D40",
  },
  categoryButtonText: {
    color: "#004D40",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  categoryButtonTextActive: {
    color: "#FFFFFF",
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 5,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#004D40",
    backgroundColor: '#FFFFFF',
  },
  categoryChipActive: {
    backgroundColor: "#004D40",
    borderColor: "#004D40",
  },
  categoryChipText: {
    color: "#004D40",
    fontSize: 14,
    fontWeight: "500",
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
  },
});
export default CreateServiceScreen;