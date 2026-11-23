import { Button, Text, View } from 'react-native';
import type {
  ExperienceModule,
  ExperienceViewProps,
} from '../../ExperienceModule';

const ConsultationView = ({
  session,
  onComplete,
}: ExperienceViewProps) => (
  <View>
    <Text>{session.title}</Text>
    <Text>{session.message}</Text>
    <Button title={session.actionLabel} onPress={onComplete} />
  </View>
);

export const consultationV1: ExperienceModule = {
  id: 'consultation',
  version: 'v1',

  load: async (definition) => {
    const config: Record<string, unknown> = definition.config ?? {};
    const mode = config.mode;

    if (mode !== 'human_astrologer') {
      throw new Error('Unsupported consultation mode.');
    }

    return {
      title: 'Astrologer consultation',
      message: 'You can request a session with a human astrologer.',
      actionLabel: 'Request consultation',
    };
  },

  View: ConsultationView,
};