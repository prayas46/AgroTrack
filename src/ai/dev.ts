import { config } from 'dotenv';
config();

import '@/ai/flows/climate-risk-forecast.ts';
import '@/ai/flows/suggest-profitable-crops.ts';
import '@/ai/flows/match-with-market-participants.ts';
import '@/ai/flows/diagnose-plant.ts';
