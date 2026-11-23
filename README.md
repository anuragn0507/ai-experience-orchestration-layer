# MyNaksh AI Experience Orchestration Layer

A React Native and TypeScript implementation of the MyNaksh machine-coding assignment. It demonstrates a small runtime that loads experience definitions, resolves a registered implementation by experience ID and version, and renders the selected experience.

The backend is mocked, as permitted by the assignment. The focus is on module boundaries, configuration ownership, version resolution, lifecycle handling, and isolated failures.

## Run the app

Install dependencies and start Expo from the project root:

```sh
npm install
npx expo start
```

Use `a` to open an Android emulator or `i` to open an iOS Simulator from the Expo terminal. To check TypeScript types, run the project script:

```sh
npm run typecheck
```

## Architecture

```text
Mock configuration API
        |
        v
ExperienceHome (lists enabled experiences)
        |
        v
ExperienceRuntime (lifecycle and error handling)
        |
        v
ExperienceRegistry (experience ID + version)
        |
        v
Experience module (config validation, data loading, and UI)
```

### Main boundaries

- **Domain — `src/domain/experience.ts`**: shared types for experience definitions, lifecycle states, and experience sessions. The platform treats `config` as opaque data.
- **Module contract — `src/experiences/ExperienceModule.ts`**: defines the common `load` and `View` interface every experience implements.
- **Data — `src/data/`**: mock configuration and mock APIs. These functions can later be replaced by HTTP adapters without moving experience-specific rules into the runtime.
- **Experience modules — `src/experiences/<id>/<version>/`**: Tarot, Gemstone, and Consultation own their configuration interpretation and UI.
- **Registry — `src/runtime/ExperienceRegistry.ts`**: a factory that keeps a private map of implementations and exposes registration and resolution operations.
- **Composition root — `src/runtime/registerExperienceModules.ts`**: creates the registry instance and registers the available modules.
- **Runtime host — `src/runtime/ExperienceRunTime.tsx`**: resolves the requested implementation, calls its loader, renders its view, and handles shared lifecycle and failure states.
- **Presentation — `src/presentation/ExperienceHome.tsx`**: loads enabled definitions, displays the experience list, and hosts the selected runtime.

## Data and state flow

1. `ExperienceHome` calls `fetchMockExperiencesDefinitions()`, which simulates the configuration endpoint.
2. The home screen filters out disabled definitions and lets the user select one.
3. `ExperienceRuntime` resolves the pair `experience/version` in the registry.
4. The resolved module validates and interprets its own config in `load()`, then returns an `ExperienceSession`.
5. The runtime passes the definition, session, and completion callback to that module's view.

The shared lifecycle is `initializing → loading → ready → completed`, with `failed` for errors. The runtime catches module load failures locally and ignores results from a load that finishes after the runtime has been unmounted or changed.

## Experience configuration

Configuration arrives as an optional `Record<string, unknown>`. Each module defaults a missing config to an empty object, then validates the fields it requires:

- **Tarot v1** reads `deck` and `maxCards`.
- **Gemstone v1** reads `recommendationMode`.
- **Consultation v1** reads `mode`.

This keeps experience-specific meaning out of the shared runtime.

## Versioning and registration

The registry key is `<experience>/<version>`, for example `tarot/v1`. The current project implements v1 for all three experiences. A future `tarot/v2` can be registered beside v1 under a different key; a request for an unregistered version produces an unsupported-experience error.

To add an experience:

1. Add its configuration to the mock configuration API.
2. Create a versioned module that implements `ExperienceModule`.
3. Put its config validation, data loading, and view in that module.
4. Import and register it in `registerExperienceModules.ts`.

## Failure handling demo

`src/data/mockGemstoneApi.ts` has `SIMULATE_API_FAILURE = true` by default. Selecting Gemstone makes its mock API reject. The runtime displays the error inside the selected experience, while the other experiences remain available. Set the flag to `false` to display the mock amethyst recommendation instead.

## Trade-offs and scope

- No backend server is included; configuration and API responses are mocked.
- Modules are statically imported and registered in the app bundle. Backend configuration can choose or configure an installed module, but adding executable experience code still requires shipping that code with the app.
- The UI is intentionally simple so the runtime architecture is easy to inspect.
- Production concerns such as remote schema validation, authentication, analytics, retries, and request cancellation are outside this exercise's scope.
