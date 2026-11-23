import type { ExperienceDefinition } from '../domain/experience';

const mockExperiences: ExperienceDefinition[] = [
    {
        experience:'tarot',
        version:'v1',
        entryPoint:'chat',
        enabled:true,
        config:{
            deck:'classic',
            maxCards:3,
        },
    },
    {
        experience:'gemstone',
        version:'v1',
        entryPoint:'chat',
        enabled:true,
        config:{
            recommendationMode:'personalized',
        },
    },
    {
        experience:'consultation',
        version:'v1',
        entryPoint:'chat',
        enabled:true,
        config:{
            mode:'human_astrologer',
        },
    }
]

export async function fetchMockExperiencesDefinitions():Promise<ExperienceDefinition[]>{
    await new Promise<void>((resolve)=>setTimeout(resolve,300));

    return mockExperiences; 
}