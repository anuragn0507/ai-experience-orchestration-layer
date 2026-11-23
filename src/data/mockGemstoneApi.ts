const SIMULATE_API_FAILURE = false;

const delay = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export const fetchGemstoneRecommendation = async (
  mode: string,
): Promise<string> => {
  await delay(500);

  if (SIMULATE_API_FAILURE) {
    throw new Error('Gemstone recommendations are temporarily unavailable.');
  }

  return mode === 'personalized'
    ? 'Based on your profile, amethyst is your recommended gemstone.'
    : 'A gemstone recommendation is ready.';
};