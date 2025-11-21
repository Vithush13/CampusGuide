import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Switch } from "react-native";
import { useEffect, useState } from "react";
import { searchBooks } from "../../src/api/openLibrary";
import CourseCard from "../../components/courseCard";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useFavStore, CourseItem } from "../../src/store/useFavStore";
import { useThemeStore } from "../../src/store/useThemeStore";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const favs = useFavStore((s) => s.favs);
  const addFav = useFavStore((s) => s.addFav);
  const removeFav = useFavStore((s) => s.removeFav);
  const darkMode = useThemeStore((s) => s.darkMode);
  const toggleDarkMode = useThemeStore((s) => s.toggleDarkMode);

  const [query, setQuery] = useState("");
  const [data, setData] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await searchBooks(query || "computer");
      const courses: CourseItem[] = (res.docs || []).map((doc: any, index: number) => ({
        key: doc.key || index.toString(),
        title: doc.title || "Untitled",
        cover_i: doc.cover_i,
        author_name: doc.author_name || ["Unknown Author"],
       first_publish_year: doc.first_publish_year || "N/A",
      }));
      setData(courses);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch courses. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const toggleFav = (item: CourseItem) => {
    const exists = favs.find((f) => f.key === item.key);
    exists ? removeFav(item.key) : addFav(item);
  };

  const colors = darkMode
    ? { background: "#121212", text: "#f5f5f5", card: "#1e1e1e", input: "#333", placeholder: "#aaa", button: "#0066ff", buttonText: "#fff", infoText: "#ccc" }
    : { background: "#e6f0ff", text: "#333", card: "#fff", input: "#fff", placeholder: "#888", button: "#0066ff", buttonText: "#fff", infoText: "#555" };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.greetingWrapper}>
          <Ionicons name="person-circle-outline" size={28} color={colors.button} />
          <Text style={[styles.greeting, { color: colors.text }]}>Welcome, {user?.name || "Guest"}</Text>
        </View>
        <View style={styles.darkModeToggle}>
          <Ionicons name={darkMode ? "moon" : "sunny"} size={24} color={colors.text} />
          <Switch value={darkMode} onValueChange={toggleDarkMode} />
        </View>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Ionicons name="search-outline" size={22} color={colors.placeholder} style={{ marginRight: 8 }} />
        <TextInput
          value={query} onChangeText={setQuery} placeholder="Search courses"
          style={[styles.input, { color: colors.text }]}
          onSubmitEditing={fetchData} placeholderTextColor={colors.placeholder}
        />
        <TouchableOpacity onPress={fetchData} style={[styles.searchButton, { backgroundColor: colors.button }]}>
          <Text style={[styles.searchButtonText, { color: colors.buttonText }]}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Info */}
      {loading && <Text style={[styles.infoText, { color: colors.infoText }]}>Loading...</Text>}
      {error && <Text style={[styles.infoText, { color: "red" }]}>{error}</Text>}
      {!loading && data.length === 0 && <Text style={[styles.infoText, { color: colors.infoText }]}>No courses found.</Text>}

      {/* Courses List */}
      <FlatList
        data={data}
        keyExtractor={(item: CourseItem) => item.key}
        renderItem={({ item }) => (
          <CourseCard
            item={item}
            onPress={() => router.push({ pathname: "/details/[id]", params: { id: item.key } })}
            icon={
              <TouchableOpacity onPress={() => toggleFav(item)}>
                <Ionicons
                  name={favs.find((f) => f.key === item.key) ? "heart" : "heart-outline"}
                  size={22}
                  color={favs.find((f) => f.key === item.key) ? "red" : colors.button}
                />
              </TouchableOpacity>
            }
            darkMode={darkMode}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 60 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  greetingWrapper: { flexDirection: "row", alignItems: "center" },
  greeting: { fontSize: 22, fontWeight: "700", marginLeft: 10 },
  darkModeToggle: { flexDirection: "row", alignItems: "center" },
  searchContainer: { flexDirection: "row", marginBottom: 20, alignItems: "center", borderRadius: 12, paddingHorizontal: 10, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  input: { flex: 1, paddingVertical: 12, paddingHorizontal: 10, fontSize: 16 },
  searchButton: { paddingVertical: 10, paddingHorizontal: 17, borderRadius: 8, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  searchButtonText: { fontWeight: "600", fontSize: 16 },
  infoText: { textAlign: "center", marginVertical: 12, fontSize: 16 },
});
