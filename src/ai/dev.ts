import { config } from 'dotenv';
config();

import '@/ai/flows/climate-risk-forecast.ts';
import '@/ai/flows/suggest-profitable-crops.ts';
import '@/ai/flows/match-with-market-participants.ts';
import '@/ai/flows/diagnose-plant.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/soil-analysis.ts';
