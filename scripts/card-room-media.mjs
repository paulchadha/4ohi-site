import { readFileSync } from 'node:fs';
const handoff=JSON.parse(readFileSync(new URL('../content/card-room-media-2026-10-29.json',import.meta.url),'utf8'));
export const cardRoomMedia=Object.freeze(handoff.games);
