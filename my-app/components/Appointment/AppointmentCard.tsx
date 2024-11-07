import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Appointment } from '../../types/Appointment';

interface AppointmentCardProps {
  item: Appointment;
  isEditMode?: boolean;
  isDragging?: boolean;
  onCancel?: (id: string, date: string, time: string) => void;
  canCancel?: (date: string, time: string) => boolean;
  onDragStart?: () => void;
  onReorder?: (id: string) => void;
  editMode?: boolean;
}

const AppointmentCard = ({ 
  item, 
  isEditMode, 
  isDragging,
  onCancel, 
  canCancel,
  onDragStart 
}: AppointmentCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const isCancelled = item.status === 'CANCELLED';
  const canBeCancelled = canCancel?.(item.date, item.start_time);

  const handlePress = () => {
    if (!isEditMode && !isDragging) {
      setExpanded(!expanded);
    }
  };

  return (
    <View
      style={[
        styles.appointmentItem,
        expanded && styles.expandedItem,
        isEditMode && styles.editModeItem,
        isDragging && styles.draggingItem,
        isCancelled && styles.cancelledItem
      ]}
    >
      {isEditMode && (
        <TouchableOpacity 
          style={styles.iconButton}
          onPressIn={onDragStart}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="menu" size={28} color="#666" />
        </TouchableOpacity>
      )}

      {!isEditMode && !isCancelled && canBeCancelled && (
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => onCancel?.(item.id, item.date, item.start_time)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close-circle-outline" size={28} color="#D32F2F" />
        </TouchableOpacity>
      )}

      {isCancelled && (
        <View style={styles.cancelledBadge}>
          <Text style={styles.cancelledText}>Cancelled</Text>
        </View>
      )}

      <TouchableOpacity 
        onPress={handlePress}
        disabled={isEditMode || isCancelled}
        style={styles.cardContent}
      >
        <View style={styles.appointmentHeader}>
          <View style={styles.appointmentMainInfo}>
            <Text style={styles.appointmentTime}>
              {format(new Date(`2000-01-01T${item.start_time}`), 'h:mm a')}
            </Text>
            <Text style={styles.appointmentDate}>
              {format(new Date(item.date), 'EEE, MMM dd, yyyy')}
            </Text>
          </View>
          {!isEditMode && !isCancelled && (
            <TouchableOpacity 
              style={styles.expandButton}
              onPress={handlePress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <AntDesign 
                name={expanded ? "caretup" : "caretdown"} 
                size={20} 
                color="#00796B" 
              />
            </TouchableOpacity>
          )}
        </View>

        {expanded && (
          <View style={styles.expandedContent}>
            <View style={styles.divider} />
            
            <View style={styles.detailSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="person-outline" size={24} color="#00796B" />
                <Text style={styles.sectionTitle}>Client Information</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Name:</Text>
                <Text style={styles.detailText}>{item.user_profile?.name || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailText}>{item.user_profile?.phone || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.detailSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="cut-outline" size={24} color="#00796B" />
                <Text style={styles.sectionTitle}>Service Details</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Service:</Text>
                <Text style={styles.detailText}>{item.service?.name || 'N/A'}</Text>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  appointmentItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
  },
  editModeItem: {
    backgroundColor: '#F5F5F5',
    borderLeftWidth: 4,
    borderLeftColor: '#00796B',
  },
  draggingItem: {
    opacity: 0.9,
    backgroundColor: '#F8F8F8',
    elevation: 8,
    shadowOpacity: 0.3,
    transform: [{ scale: 1.02 }],
  },
  expandedItem: {
    elevation: 4,
    shadowOpacity: 0.15,
  },
  cancelledItem: {
    opacity: 0.6,
    backgroundColor: '#F5F5F5',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingRight: 72,
  },
  appointmentMainInfo: {
    flex: 1,
    marginRight: 8,
  },
  appointmentTime: {
    fontSize: 20,
    fontWeight: '600',
    color: '#00796B',
    marginBottom: 4,
  },
  appointmentDate: {
    fontSize: 14,
    color: '#666',
  },
  iconButton: {
    position: 'absolute',
    right: 16,
    top: 12,
    zIndex: 1,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 22,
  },
  expandButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 22,
    marginLeft: 8,
  },
  cancelledBadge: {
    position: 'absolute',
    right: 16,
    top: 16,
    backgroundColor: '#D32F2F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    zIndex: 1,
  },
  cancelledText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  expandedContent: {
    backgroundColor: '#F8F8F8',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  detailSection: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00796B',
    marginLeft: 12,
    textTransform: 'uppercase',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 36,
  },
  detailLabel: {
    width: 60,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  detailText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
});

export default AppointmentCard;