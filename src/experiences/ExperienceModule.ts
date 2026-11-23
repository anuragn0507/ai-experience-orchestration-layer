import type { ComponentType } from "react";
import { ExperienceDefinition, ExperienceSession } from "../domain/experience";

export interface ExperienceViewProps {
  definition: ExperienceDefinition;
  session: ExperienceSession;
  onComplete: () => void;
}

export interface ExperienceModule {
  id: string;
  version: string;

  load: (definition: ExperienceDefinition) => Promise<ExperienceSession>;
  View: ComponentType<ExperienceViewProps>;
}
