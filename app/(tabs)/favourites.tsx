import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useFavStore, CourseItem } from "../../src/store/useFavStore";
import { coverUrl } from "../../src/api/openLibrary";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function FavoriteScreen() {
  const favs = useFavStore((s) => s.favs);
  const removeFav = useFavStore((s) => s.removeFav);
  const router = useRouter();

  if (favs.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No favorites added yet.</Text>
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: CourseItem; index: number }) => (
    <View
      style={[
        styles.card,
        index === 0 ? { marginTop: 20 } : {}, // extra top space for first card
      ]}
    >
      <TouchableOpacity
        onPress={() => router.push({ pathname: "/details/[id]", params: { id: item.key } })}
      >
        <Image
          source={{ uri: coverUrl(item.cover_i, "M") }}
          style={styles.cover}
        />
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>

        <TouchableOpacity
          onPress={() => removeFav(item.key)}
          style={styles.removeButton}
        >
          <Ionicons name="trash-outline" size={20} color="white" />
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Heading */}
      <Text style={styles.heading}>My Favourites</Text>

      <FlatList
        data={favs}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginTop:60,
    marginLeft: 16,

  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 3,
  },
  cover: { width: 100, height: 150 },
  info: { flex: 1, padding: 12, justifyContent: "space-between" },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "red",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  removeText: { color: "white", marginLeft: 5, fontWeight: "600" },
});
