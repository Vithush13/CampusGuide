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
  const loadUser = useAuthStore((s) => s.loadUser);
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

   useEffect(() => {
    loadUser(); // loads user from AsyncStorage
  }, []);

  const colors = darkMode
    ? { background: "#121212", text: "#f5f5f5", card: "#1e1e1e", input: "#222", placeholder: "#888", button: "#00bfff", buttonText: "#fff", infoText: "#ccc" }
    : { background: "#f9faff", text: "#1a1a1a", card: "#ffffff", input: "#f1f1f1", placeholder: "#aaa", button: "#0077ff", buttonText: "#fff", infoText: "#555" };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Premium Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <View style={styles.greetingWrapper}>
          <Ionicons name="person-circle-outline" size={32} color={colors.button} />
          <View style={{ marginLeft: 10 }}>
            <Text style={[styles.greeting, { color: colors.text }]}>Hello,</Text>
            <Text style={[styles.username, { color: colors.text }]}>{user?.name || "Guest"}</Text>
          </View>
        </View>
        <View style={styles.darkModeToggle}>
          <Ionicons name={darkMode ? "moon" : "sunny"} size={24} color={colors.text} />
          <Switch value={darkMode} onValueChange={toggleDarkMode} />
        </View>
      </View>

      {/* Premium Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.input }]}>
        <Ionicons name="search-outline" size={22} color={colors.placeholder} style={{ marginRight: 10 }} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search courses..."
          placeholderTextColor={colors.placeholder}
          style={[styles.input, { color: colors.text }]}
          onSubmitEditing={fetchData}
        />
        <TouchableOpacity style={[styles.searchButton, { backgroundColor: colors.button }]} onPress={fetchData}>
          <Text style={[styles.searchButtonText, { color: colors.buttonText }]}>Go</Text>
        </TouchableOpacity>
      </View>

      {/* Info Messages */}
      {loading && <Text style={[styles.infoText, { color: colors.infoText }]}>Loading courses...</Text>}
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
        contentContainerStyle={{ paddingBottom: 30, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 60 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  greetingWrapper: { flexDirection: "row", alignItems: "center" },
  greeting: { fontSize: 16, fontWeight: "500" },
  username: { fontSize: 20, fontWeight: "700" },
  darkModeToggle: { flexDirection: "row", alignItems: "center" },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  input: { flex: 1, fontSize: 16 },
  searchButton: { paddingVertical: 8, paddingHorizontal: 18, borderRadius: 10 },
  searchButtonText: { fontWeight: "600", fontSize: 15 },

  infoText: { textAlign: "center", fontSize: 15, marginVertical: 10 },
});
