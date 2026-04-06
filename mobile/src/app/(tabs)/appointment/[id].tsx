import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  ToastAndroid,
  Linking,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/constants/theme";
import {
  useCancelAppointment,
  useUserAppointments,
} from "@/hooks/useAppointments";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import { CustomAlert } from "@/components/ui/CustomAlert";
import { useAuth } from "@/context/AuthContext";

export default function AppointmentDetail() {
  const { id } = useLocalSearchParams();
  const safeId = Array.isArray(id) ? id[0] : id;
  const { colors } = useThemeColors();
  const router = useRouter();
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [alertConfig, setAlertConfig] = useState<{
    type: "msg" | "call" | "wa" | "cancelBtn";
    message: string;
    onCnfmTitle: string;
    errMsg?: string;
    cnfmType: "success" | "warning" | "info" | "danger";
    showConfirm?: boolean;
  }>({
    type: "call",
    message: "",
    onCnfmTitle: "",
    errMsg: "",
    showConfirm: true,
    cnfmType: "info",
  });

  const { data: appointments } = useUserAppointments();
  const { user } = useAuth();

  const appointment = appointments?.find((a) => a.id === safeId);

  if (!appointment) return null;

  const statusColor =
    appointment.status === "upcoming" ? colors.success : colors.danger;

  const cancelMutation = useCancelAppointment();

  const confirmCancel = (id: string) => {
    setSelectedId(id);
    setAlertConfig({
      type: "cancelBtn",
      onCnfmTitle: "Cancel Appointment",
      message:
        "Are you sure you want to cancel this booking? This action cannot be undone.",
      cnfmType: "warning",
      showConfirm: true,
      errMsg: "WhatsApp is not installed on this device!",
    });
    setAlertVisible(true);
  };

  const handleCancelAction = () => {
    Toast.show({
      type: "info",
      text1: "Connecting...",
      text2: "Please wait a moment",
      autoHide: false,
      props: { loading: true },
    });

    if (selectedId) {
      cancelMutation.mutate(selectedId, {
        onSuccess: () => {
          setAlertConfig({
            type: "cancelBtn",
            onCnfmTitle: "Booking Cancelled",
            message: "Your appointment has been successfully cancelled.",
            cnfmType: "success",
            showConfirm: false,
          });
          setSelectedId(null);
          setAlertVisible(false);
          Toast.show({
            type: "success",
            text1: "Your appointment has been successfully cancelled.",
            props: { loading: false },
          });
        },
        onError: (err: any) => {
          setAlertConfig({
            type: "cancelBtn",
            onCnfmTitle: "Cancellation Failed",
            message:
              err?.response?.data?.message ||
              "Something went wrong. Please try again.",
            cnfmType: "danger",
            showConfirm: false,
          });
          setAlertVisible(false);
          Toast.show({
            type: "error",
            text1:
              err?.response?.data?.message ||
              "Something went wrong. Please try again.",
            props: { loading: false },
          });
        },
      });
    }
  };

  const handleContConfirm = async (type: "msg" | "call" | "wa") => {
    setAlertVisible(false);
    const cleanNumber = (appointment.providerPhone || "+919926625429").replace(
      /[^0-9]/g,
      "",
    );
    const message = `Hello! I'm ${user?.name}, \nmessaging regarding my appointment (ID: #${safeId?.toUpperCase()}).`;
    let url = "";
    if (type === "call") {
      url = `tel:${cleanNumber}`;
    } else if (type === "wa") {
      url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    } else if (type === "msg") {
      url = `sms:${cleanNumber}?body=${encodeURIComponent(message)}`;
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          "The contact method is not available. Please try again or contact support.",
        position: "top",
        topOffset: 60,
      });
      console.error("Invalid type provided");
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Unable to open the URL. Please check your device settings.",
          position: "top",
          topOffset: 60,
        });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to open the URL!",
        position: "top",
        topOffset: 60,
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Toast.show({
      type: "success",
      text1: "ID Copied!",
      text2: "The ID is ready to paste",
      position: "top",
      topOffset: 60,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background animate-theme">
      {/* Header */}
      <View className="px-6 flex-row items-center justify-between py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-surface w-12 h-12 rounded-2xl flex-center"
        >
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-main">Appointment Detail</Text>
        <TouchableOpacity className="bg-surface w-12 h-12 rounded-2xl flex-center">
          <Ionicons name="share-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6">
        {/* Provider Profile Card */}
        <View className="bg-card rounded-[32px] p-6 border border-border/10 items-center mt-4">
          <View className="relative">
            <View className="w-24 h-24 rounded-full bg-primary/10 flex-center border-4 border-background">
              <Image
                source={{
                  uri: appointment.providerImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    appointment?.providerName || "Provider",
                  )}&background=38bdf8&color=fff&size=128`,
                }}
                className="w-24 h-24 rounded-full border-4 border-primary/20"
              />
            </View>

            <View
              style={{ backgroundColor: statusColor }}
              className="absolute bottom-1 right-1 w-6 h-6 rounded-full border-2 border-border"
            />
          </View>

          <Text className="text-main text-2xl font-bold mt-4">
            {appointment.providerName}
          </Text>
          <Text className="text-muted font-medium italic">
            {appointment.category}
          </Text>

          <View className="flex-row w-3/4 gap-3 mt-6">
            <TouchableOpacity
              onPress={() => {
                setAlertConfig({
                  type: "wa",
                  message: `Would you like to whatsapp message on ${appointment.providerName} now?`,
                  onCnfmTitle: "Message Now",
                  errMsg: "WhatsApp is not installed on this device!",
                  cnfmType: "warning",
                });
                setAlertVisible(true);
              }}
              className="bg-primary/10 flex-1 flex-center px-6 py-3 rounded-2xl flex-row items-center"
            >
              <Ionicons
                name="chatbubble-ellipses"
                size={18}
                color={colors.primary}
              />
              <Text className="text-primary font-bold ml-2">Message</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setAlertConfig({
                  type: "call",
                  message: `Would you like to dial ${appointment.providerPhone || +919926625429} now?`,
                  onCnfmTitle: "Call Now",
                  errMsg: "Phone calls are not supported on this device!",
                  cnfmType: "warning",
                });
                setAlertVisible(true);
              }}
              className="bg-surface flex-1 flex-center px-6 py-3 rounded-2xl flex-row items-center border border-border"
            >
              <Ionicons name="call" size={18} color={colors.surface} />
              <Text className="text-main font-bold ml-2">Call</Text>
            </TouchableOpacity>
          </View>
        </View>
        <CustomAlert
          visible={isAlertVisible}
          type={alertConfig.cnfmType}
          title="Provider"
          message={alertConfig.message}
          onCnfmTitle={
            alertConfig.type === "cancelBtn"
              ? cancelMutation.isPending
                ? "Cancelling..."
                : "Yes, Cancel"
              : alertConfig.onCnfmTitle
          }
          onClsTitle="Cancel"
          onClose={() => setAlertVisible(false)}
          onConfirm={() => {
            if (alertConfig.type === "cancelBtn") {
              handleCancelAction();
            } else {
              handleContConfirm(alertConfig.type);
            }
          }}
        />

        {/* Schedule Info Section */}
        <View className="mt-8">
          <Text className="text-main font-bold text-lg mb-4 ml-1">
            Schedule Info
          </Text>
          <View className="bg-surface/50 rounded-[32px] p-2 border border-border/40">
            <ScheduleCard
              icon="calendar-outline"
              title="Date"
              value={appointment.date}
              bgColor="bg-info/10"
              iconColor={colors.info}
            />
            <View className="h-[1px] bg-border/50 mx-6" />
            <ScheduleCard
              icon="time-outline"
              title="Time Slot"
              value={appointment.timeSlot}
              bgColor="bg-warning/10"
              iconColor={colors.warning}
            />
            <View className="h-[1px] bg-border/50 mx-6" />
            <ScheduleCard
              icon="shield-checkmark-outline"
              title="Booking Status"
              value={appointment.status}
              bgColor="bg-success/10"
              iconColor={statusColor}
              isStatus
            />
          </View>
        </View>

        <View className="mt-8 mb-10 px-4 py-6 bg-card border border-dashed border-border rounded-3xl flex-row justify-between items-center">
          <View>
            <Text className="text-muted text-xs uppercase font-bold tracking-tighter">
              Appointment ID
            </Text>
            <Text className="text-main font-mono font-bold text-base mt-1">
              #{safeId.slice(-8).toUpperCase()}
            </Text>
          </View>
          <TouchableOpacity
            className="bg-primary px-4 py-2 rounded-xl"
            onPress={() => copyToClipboard(safeId)}
          >
            <Text className="text-white font-bold text-xs">Copy ID</Text>
          </TouchableOpacity>
        </View>

        {/* Actions */}
        <View className="flex-row gap-4 mb-10">
          {appointment.status === "upcoming" && (
            <TouchableOpacity
              onPress={() => confirmCancel(appointment.id)}
              className="flex-1 h-16 rounded-3xl flex-center border border-danger/30 bg-danger/20 justify-center"
            >
              <Text className="text-danger font-bold text-base">Cancel</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/details/[id]",
                params: {
                  id: appointment.providerId,
                  reschedule: "true",
                  appointmentId: appointment.id,
                },
              })
            }
            className="flex-1 h-16 rounded-3xl flex-center bg-primary shadow-lg shadow-primary/30 justify-center"
          >
            <Text className="text-white font-bold text-base">Reschedule</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ScheduleCard = ({
  icon,
  title,
  value,
  bgColor,
  iconColor,
  isStatus,
}: any) => (
  <View className="flex-row items-center p-4">
    <View className={`${bgColor} w-14 h-14 rounded-2xl flex-center`}>
      <Ionicons name={icon} size={24} color={iconColor} />
    </View>
    <View className="ml-4 flex-1">
      <Text className="text-muted text-xs font-bold uppercase tracking-wider">
        {title}
      </Text>
      <Text
        className={`text-lg font-bold ${isStatus ? "capitalize" : "text-main"}`}
        style={isStatus ? { color: iconColor } : null}
      >
        {value}
      </Text>
    </View>
  </View>
);
