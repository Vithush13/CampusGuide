import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { coverUrl } from "../../src/api/openLibrary";
import { useFavStore } from "../../src/store/useFavStore";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons"; // npm install @expo/vector-icons

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();

  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const favs = useFavStore((s) => s.favs);
  const add = useFavStore((s) => s.addFav);
  const remove = useFavStore((s) => s.removeFav);

  const isFav = favs.some((f) => f.key === id);

  const fetchDetails = async () => {
    try {
      const res = await axios.get(`https://openlibrary.org${id}.json`);
      setBook(res.data);
    } catch (err) {
      console.error("Error loading details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4B7BE5" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <Image
          source={{
            uri: coverUrl(book?.covers?.[0], "L") || undefined,
          }}
          style={styles.bookImage}
        />

        <Text style={styles.title}>{book?.title}</Text>

        <Text style={styles.description}>
          {book?.description?.value || book?.description || "No description available."}
        </Text>

        <TouchableOpacity
          onPress={() =>
            isFav
              ? remove(id as string)
              : add({
                  key: id as string,
                  title: book.title,
                  cover_i: book.covers?.[0],
                })
          }
          style={[styles.favButton, { backgroundColor: isFav ? "#FF5C5C" : "#4B7BE5" }]}
        >
          <Ionicons
            name={isFav ? "heart" : "heart-outline"}
            size={24}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.favButtonText}>
            {isFav ? "Remove from Favourites" : "Add to Favourites"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F4FF",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F4FF",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginTop: 50,
    marginBottom: 50,
  },
  bookImage: {
    width: "100%",
    height: 320,
    borderRadius: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
    marginBottom: 20,
  },
  favButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 50
  },
  favButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
