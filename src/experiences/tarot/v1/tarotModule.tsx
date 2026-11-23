import { Button, Text, View } from "react-native";
import type {
  ExperienceModule,
  ExperienceViewProps,
} from "../../ExperienceModule";

function TarotView({ session, onComplete }: ExperienceViewProps) {
  return (
    <View>
      <Text>{session.title}</Text>
      <Text>{session.message}</Text>
      <Button title={session.actionLabel} onPress={onComplete} />
    </View>
  );
}

export const tarotV1: ExperienceModule = {
  id: "tarot",
  version: "v1",

  async load(definition) {
    const config: Record<string, unknown> = definition.config ?? {};
    const deck = config.deck;
    const maxCards = config.maxCards;

    if (typeof deck !== "string" || deck.length === 0) {
      throw new Error("Tarot config must include a deck name. ");
    }

    if (
      typeof maxCards !== "number" ||
      !Number.isInteger(maxCards) ||
      maxCards < 1
    ) {
      throw new Error("Tarot maxCards must be a positive integer.");
    }

    return {
      title: "Your tarot reading",
      message: `Using the ${deck} deck, You can draw up to ${maxCards} cards`,
      actionLabel: "Finish reading",
    };
  },
  View: TarotView,
};
