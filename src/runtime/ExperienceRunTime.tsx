import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { ExperienceDefinition, ExperienceLifecycle, ExperienceSession } from '../domain/experience';
import { experienceRegistry } from './registerExperienceModules';

interface ExperienceRuntimeProps {
  definition: ExperienceDefinition;
}

export const ExperienceRuntime = ({
  definition,
}: ExperienceRuntimeProps) => {
  const [status, setStatus] = useState<ExperienceLifecycle>('initializing');
  const [session, setSession] = useState<ExperienceSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  const module = experienceRegistry.resolve(
    definition.experience,
    definition.version,
  );
  const ExperienceView = module?.View;

  useEffect(() => {
    let cancelled = false;

    setStatus('loading');
    setSession(null);
    setError(null);

    if (!module) {
      setError(
        `Unsupported experience: ${definition.experience}/${definition.version}`,
      );
      setStatus('failed');
      return () => {
        cancelled = true;
      };
    }

    const loadExperience = async () => {
      try {
        const loadedSession = await module.load(definition);

        if (cancelled) return;

        setSession(loadedSession);
        setStatus('ready');
      } catch (cause: unknown) {
        if (cancelled) return;

        setError(
          cause instanceof Error
            ? cause.message
            : 'This experience could not be loaded.',
        );
        setStatus('failed');
      }
    };

    void loadExperience();

    return () => {
      cancelled = true;
    };
  }, [definition, module]);

  return (
    <View style={styles.container}>
      {(status === 'initializing' || status === 'loading') && (
        <View style={styles.message}>
          <ActivityIndicator />
          <Text>Loading experience…</Text>
        </View>
      )}

      {status === 'failed' && (
        <Text style={styles.error}>{error}</Text>
      )}

      {status === 'completed' && (
        <Text>Experience completed.</Text>
      )}

      {status === 'ready' && ExperienceView && session && (
        <ExperienceView
          definition={definition}
          session={session}
          onComplete={() => setStatus('completed')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  message: {
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  error: {
    color: '#9B352C',
  },
});