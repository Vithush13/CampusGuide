import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { coverUrl } from "../src/api/openLibrary";
import { useThemeStore } from "../src/store/useThemeStore";

interface CourseCardProps {
  item: any;
  onPress: () => void;
   icon?: React.ReactNode;      // optional icon (like the heart button)
  darkMode?: boolean; 
}

export default function CourseCard({ item, onPress }: CourseCardProps) {
  const [saved, setSaved] = useState(false);
  const darkMode = useThemeStore((s) => s.darkMode);

  // Dynamic colors based on theme
  const colors = {
    card: darkMode ? "#1e1e1e" : "#fff",
    text: darkMode ? "#f5f5f5" : "#000",
    meta: darkMode ? "#f5f5f5" : "#666",
    saveBtn: darkMode ? "#333" : "#f2f2f2",
    saveBtnActive: "#4CAF50",
    saveBtnText: darkMode ? "#fff" : "#000",
    imageBg: darkMode ? "#333" : "#eee",
  };

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]} onPress={onPress}>
      {/* Book Cover */}
      <Image
        source={{ uri: coverUrl(item.cover_i, "M") || undefined }}
        style={[styles.image, { backgroundColor: colors.imageBg }]}
      />

      {/* Text Content */}
      <View style={styles.infoBox}>
        <Text numberOfLines={2} style={[styles.title, { color: colors.text }]}>
          {item.title}
        </Text>

        <Text style={[styles.meta, { color: colors.meta }]}>
          {item.author_name?.[0] || "Unknown Author"}
        </Text>

        <Text style={[styles.meta, { color: colors.meta }]}>
          Published: {item.first_publish_year || "N/A"}
        </Text>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveBtn,
            { backgroundColor: saved ? colors.saveBtnActive : colors.saveBtn },
          ]}
          onPress={() => setSaved(!saved)}
        >
          <Text style={[styles.saveBtnText, { color: colors.saveBtnText }]}>
            {saved ? "Saved ✓" : "Save"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },

  image: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginBottom: 10,
  },

  infoBox: {
    alignItems: "flex-start",
  },

  title: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
  },

  meta: {
    fontSize: 13,
    marginBottom: 3,
  },

  saveBtn: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },

  saveBtnText: {
    fontWeight: "500",
  },
});
