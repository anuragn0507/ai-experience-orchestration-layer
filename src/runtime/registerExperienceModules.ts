import { consultationV1 } from '../experiences/consultation/v1/consultationModule';
import { gemstoneV1 } from '../experiences/gemstone/v1/gemstoneModule';
import { tarotV1 } from '../experiences/tarot/v1/tarotModule';
import { createExperienceRegistry } from './ExperienceRegistry';

export const experienceRegistry = createExperienceRegistry();

experienceRegistry.register(tarotV1);
experienceRegistry.register(gemstoneV1);
experienceRegistry.register(consultationV1);
