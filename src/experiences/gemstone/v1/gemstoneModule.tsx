import { Button, Text, View } from "react-native";
import type {
  ExperienceModule,
  ExperienceViewProps,
} from "../../ExperienceModule";
import { fetchGemstoneRecommendation } from "../../../data/mockGemstoneApi";

const GemstoneView = ({ session, onComplete }: ExperienceViewProps) => (
  <View>
    <Text>{session.title}</Text>
    <Text>{session.message}</Text>
    <Button title={session.actionLabel} onPress={onComplete} />
  </View>
);

export const gemstoneV1: ExperienceModule = {
  id: "gemstone",
  version: "v1",
  async load(definition) {
    const config: Record<string, unknown> = definition.config ?? {};
    const recommendationMode = config.recommendationMode;

    if (recommendationMode !== "personalized") {
      throw new Error("Unsupported gemstone recommendation mode.");
    }

    const recommendation =
      await fetchGemstoneRecommendation(recommendationMode);

    return {
      title: "Your gemstone recommendation",
      message: recommendation,
      actionLabel: "Finish recommendation",
    };
  },
  View: GemstoneView,
};
