import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { ExperienceDefinition } from "../domain/experience";
import { fetchMockExperiencesDefinitions } from "../data/mockExperienceApi";
import { ExperienceRuntime } from "../runtime/ExperienceRunTime";

export const ExperienceHome = () => {
  const [experiences, setExperiences] = useState<ExperienceDefinition[]>([]);
  const [selected, setSelected] = useState<ExperienceDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadExperiences = async () => {
      try {
        const definitions = await fetchMockExperiencesDefinitions();

        if (!cancelled) {
          setExperiences(definitions.filter((item) => item.enabled));
        }
      } catch (cause: unknown) {
        if (!cancelled) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Could not load experiences.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadExperiences();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.page}>
      <Text style={styles.title}>AI Experiences</Text>
      <Text style={styles.subtitle}>Choose an experience to get started.</Text>

      {loading && <ActivityIndicator />}

      {error && <Text style={styles.error}>{error}</Text>}

      {!loading &&
        experiences.map((item) => (
          <Pressable
            key={`${item.experience}/${item.version}`}
            onPress={() => setSelected(item)}
            style={({ pressed }) => [
              styles.card,
              pressed ? styles.cardPressed : undefined,
            ]}
          >
            <Text style={styles.cardTitle}>{item.experience}</Text>
            <Text style={styles.cardDetails}>
              {item.version} · {item.entryPoint}
            </Text>
          </Pressable>
        ))}

      {selected && (
        <View style={styles.runtimeCard}>
          <View style={styles.runtimeHeader}>
            <Text style={styles.cardTitle}>
              {selected.experience} experience
            </Text>

            <Pressable onPress={() => setSelected(null)}>
              <Text style={styles.close}>Close</Text>
            </Pressable>
          </View>

          <ExperienceRuntime
            key={`${selected.experience}/${selected.version}`}
            definition={selected}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 56,
    gap: 12,
    backgroundColor: "#F7F5F0",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#25231F",
  },
  subtitle: {
    color: "#6D6962",
    marginBottom: 8,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E3DA",
    gap: 6,
  },
  cardPressed: {
    opacity: 0.7,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#25231F",
  },
  cardDetails: {
    color: "#6D6962",
  },
  runtimeCard: {
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F0E9DD",
    gap: 16,
  },
  runtimeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  close: {
    color: "#8C542E",
    fontWeight: "600",
  },
  error: {
    color: "#9B352C",
  },
});
