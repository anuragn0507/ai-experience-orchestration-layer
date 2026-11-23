import type { ExperienceModule } from "../experiences/ExperienceModule";

export function createExperienceRegistry() {
  const modules = new Map<string, ExperienceModule>();

  function createKey(id: string, version: string) {
    return `${id}/${version}`; 
  }

  function register(module: ExperienceModule) {
    const key = createKey(module.id, module.version);
    if (modules.has(key)) {
      throw new Error(
        `Experience module with id ${module.id} and version ${module.version} is already registered.`,
      );
    }
    modules.set(key, module);
  }

  function resolve(id: string, version: string): ExperienceModule | undefined {
    return modules.get(createKey(id, version));
  }

  return{
    register,
    resolve,
  }
}
