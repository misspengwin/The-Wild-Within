# The-Wild-Within

A cross-platform mobile fantasy RPG where real-world physical activity powers character progression and cooperative family adventures.

> Working title in-app: **Movement RPG**. Prototype — all activity data is currently **simulated** and clearly labeled as unverified.

## Tech

- Expo SDK 58, React Native 0.88, TypeScript, Expo Router
- iOS first, Android kept compatible
- Local persistence via AsyncStorage (no backend yet)

## Run it

```bash
npm install
npx expo start
```

Open the project in **Expo Go** on your phone (same Wi-Fi network as your computer).

## Project structure

```
src/
├── app/          Screens (Expo Router): welcome, choose-archetype, dashboard
├── components/   UI components (ui/ holds generic building blocks)
├── game/         Pure game rules: archetypes, progression, quests, engine
├── activity/     ActivityProvider interface + simulated provider
├── models/       TypeScript data models
├── storage/      Local save/load
├── state/        React context wiring game, activity and storage together
└── constants/    Theme, app title, resource names
```

## Milestone 1 (done)

- Welcome screen with fantasy theme
- Four archetypes: Warrior (strength), Ranger (walking/hiking/running), Druid (yoga/stretching/mobility), Elementalist (dancing/cycling/cardio) — any activity counts, matching activities earn ×1.5
- Dashboard: level, XP, energy, resources, daily activity goal
- Three introductory quests with XP and resource rewards
- Activity simulator with simulated data clearly marked

## Next

HealthKit / Health Connect providers (requires a development build), energy-powered adventures, daily quests and streaks.
