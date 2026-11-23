
export interface ExperienceDefinition {
  experience: string;
  version: string;
  entryPoint: string;
  enabled: boolean;
  config?: Record<string, unknown>;
}

export type ExperienceLifecycle =
  | "initializing"
  | "loading"
  | "ready"
  | "completed"
  | "failed";


export interface ExperienceSession{
    title:string;
    message:string;
    actionLabel:string;
}