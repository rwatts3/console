dashboard
=========

master | dev
--- | ---
[![CircleCI](https://circleci.com/gh/graphcool/dashboard/tree/master.svg?style=svg)](https://circleci.com/gh/graphcool/dashboard/tree/master) | [![CircleCI](https://circleci.com/gh/graphcool/dashboard/tree/dev.svg?style=svg)](https://circleci.com/gh/graphcool/dashboard/tree/dev)

## Development

```sh
npm install
npm start
```
## IDE Setup
### Webstorm
We use a different version of TypeScript than the default Webstorm TypeScript compiler. That's why you have to do the following to get rid of all TypeScript errors.
Please run `npm install` before the setup.

1. Go to the `Preferences` _(macOS: "⌘ + ,")_ window
2. In the left list menu **select** `Languages & Frameworks > TypeScript`
3. **Click** on the `Edit...` button in the `Common` Panel
4. **Select** `Custom directory`
5. **Browse** to your `project directory` and then **select** `node_modules/typescript/lib` and **click** `OK`
6. **Click** `OK` again in the `Configure TypeScript Compiler`
7. **Click** `OK` in the `Preference` window
