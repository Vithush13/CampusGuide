import { View, Text, TouchableOpacity, Image, StyleSheet, Switch } from "react-native";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useThemeStore } from "../../src/store/useThemeStore";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const darkMode = useThemeStore((s) => s.darkMode);
  const toggleDarkMode = useThemeStore((s) => s.toggleDarkMode);

  const colors = darkMode
    ? { background: "#121212", text: "#f5f5f5", card: "#1e1e1e", button: "#0066ff", buttonText: "#fff" }
    : { background: "#e6f0ff", text: "#333", card: "#fff", button: "#0066ff", buttonText: "#fff" };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        {user?.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <Ionicons name="person-circle" size={120} color={colors.button} style={{ marginBottom: 20 }} />
        )}
        <Text style={[styles.name, { color: colors.text }]}>{user?.name}</Text>
        <Text style={[styles.email, { color: colors.text }]}>{user?.email}</Text>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: "#ff4d4d" }]} onPress={() => { logout(); router.replace("/"); }}>
          <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  card: { width: "90%", alignItems: "center", borderRadius: 20, paddingVertical: 40, paddingHorizontal: 20, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 5 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: "#0066ff", marginBottom: 20 },
  name: { fontSize: 26, fontWeight: "700", marginBottom: 8 },
  email: { fontSize: 16, marginBottom: 30 },
  logoutButton: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 25, borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  logoutText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
