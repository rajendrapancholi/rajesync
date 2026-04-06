import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/constants/theme";
import { CustomAlert } from "@/components/ui/CustomAlert";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  useUserAppointments,
  useCancelAppointment,
} from "@/hooks/useAppointments";
import { AppointmentCard } from "@/components/AppoinmentCart";
import { router } from "expo-router";

export default function Appointments() {
  const { colors } = useThemeColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "name">("newest");
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    type: "success" | "warning" | "info" | "danger";
    showConfirm: boolean;
  }>({ title: "", message: "", type: "info", showConfirm: true });

  const { data: appointments = [], isLoading, refetch } = useUserAppointments();
  const cancelMutation = useCancelAppointment();

  const confirmCancel = (id: string) => {
    setSelectedId(id);
    setAlertConfig({
      title: "Cancel Appointment",
      message:
        "Are you sure you want to cancel this booking? This action cannot be undone.",
      type: "warning",
      showConfirm: true,
    });
    setAlertVisible(true);
  };

  const handleCancelAction = () => {
    if (selectedId) {
      cancelMutation.mutate(selectedId, {
        onSuccess: () => {
          setAlertConfig({
            title: "Booking Cancelled",
            message: "Your appointment has been successfully cancelled.",
            type: "success",
            showConfirm: false,
          });
          setSelectedId(null);
        },
        onError: (err: any) => {
          setAlertConfig({
            title: "Cancellation Failed",
            message:
              err?.response?.data?.message ||
              "Something went wrong. Please try again.",
            type: "danger",
            showConfirm: false,
          });
          setAlertVisible(true);
        },
      });
    }
  };

  // const displayData = appointments.filter((item: any) =>
  //   activeTab === "Upcoming"
  //     ? item.status === "upcoming"
  //     : item.status !== "upcoming",
  // );

  const displayData = appointments
    .filter((item: any) =>
      activeTab === "Upcoming" ? item.status === "upcoming" : item.status !== "upcoming"
    )
    .filter((item: any) => {
      const search = searchQuery.toLowerCase();
      return (
        item.id.toLowerCase().includes(search) ||
        item.providerName.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search)
      );
    })
    .sort((a: any, b: any) => {
      if (sortBy === "name") {
        return a.providerName.localeCompare(b.providerName);
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  if (isLoading && appointments.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background px-5">
        <Text className="text-3xl font-bold text-main mt-6 mb-6">
          My Bookings
        </Text>
        <Skeleton width="100%" height={120} className="mb-4" radius={24} />
        <Skeleton width="100%" height={120} className="mb-4" radius={24} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background px-5">
      <Text className="text-3xl font-bold text-main mt-6 mb-6">
        My Bookings
      </Text>
      <View className="flex-row items-center bg-surface px-4 py-3 rounded-2xl border border-border mt-4 mb-4">
        <Ionicons name="search" size={20} color={colors.textMain} />
        <TextInput
          placeholder="Search by ID, Name, Category..."
          placeholderTextColor={colors.muted}
          className="flex-1 ml-3 text-main"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== "" && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={18} color={colors.textMain} />
          </TouchableOpacity>
        )}
      </View>
      <View className="flex-row gap-2 mb-6">
        <TouchableOpacity 
          onPress={() => setSortBy("newest")}
          className={`px-4 py-2 rounded-full border ${sortBy === 'newest' ? 'bg-primary border-primary' : 'border-border'}`}
        >
          <Text className={sortBy === 'newest' ? 'text-white font-bold' : 'text-muted'}>Newest</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setSortBy("name")}
          className={`px-4 py-2 rounded-full border ${sortBy === 'name' ? 'bg-primary border-primary' : 'border-border'}`}
        >
          <Text className={sortBy === 'name' ? 'text-white font-bold' : 'text-muted'}>By Name</Text>
        </TouchableOpacity>
      </View>


      {/* Tab Switcher */}
      <View className="flex-row bg-surface p-1.5 rounded-2xl border border-border mb-6">
        {["Upcoming", "Past"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-xl items-center ${
              activeTab === tab ? "bg-primary" : ""
            }`}
          >
            <Text
              className={`font-bold ${activeTab === tab ? "text-white" : "text-muted"}`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={displayData}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View>
            <AppointmentCard appointment={item} onCancel={confirmCancel} />
            {/* LINK TO DETAILS */}
            <TouchableOpacity 
              onPress={() => router.push(`/appointment/${item.id}`)}
              className="mt-[-15] mb-4 self-end mr-4"
            >
              <Text className="text-primary font-bold text-sm">View Details →</Text>
            </TouchableOpacity>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-20">
            <Ionicons
              name="calendar-clear-outline"
              size={80}
              color={colors.border}
            />
            <Text className="text-main text-xl font-bold mt-4">
              No {activeTab.toLowerCase()} bookings
            </Text>
            <Text className="text-muted text-center mt-2">
              Your scheduled services will appear here.
            </Text>
          </View>
        }
      />

      <CustomAlert
        visible={alertVisible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        showConfirm={alertConfig.showConfirm}
        onClose={() => setAlertVisible(false)}
        onConfirm={handleCancelAction}
        onCnfmTitle={cancelMutation.isPending ? "Cancelling..." : "Yes, Cancel"}
      />
    </SafeAreaView>
  );
}
