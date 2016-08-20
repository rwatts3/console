# Graphcool Dashboard

🚀  Official source of [dashboard.graph.cool](https://dashboard.graph.cool/) written in Typescript 2 and based on React & Relay

## Changelog

### [Milestone M2](https://github.com/graphcool/dashboard/milestone/2)
* You can finally set values to `null` if they are not required by the field.
* Working with scalar list values is now a lot easier in the data browser.
* The number of models can grow pretty fast in a project which hides the rest of the side navigation. We now auto-collapse the list of models when you don't need them.
* We added a new way of authentication called "Permanent Auth Tokens" which is especially useful for server-side scripts. You can create and revoke tokens from our new project settings page. 🔑
* We simplified the process of adding a new model.
* Unsaved changes? We will prompt you to make sure you don't discard them accidentally.
* Instead of showing everybody the hash of password fields, we now hide it behind a rows of `*`s. (Double-click to reveal the hash. 🎩)
* *Fixed*: The dashboard now looks the same in Safari.

See **[here](CHANGELOG.md)** for a full list of all changes (features/bug fixes).

## Development


master | dev
--- | ---
[![CircleCI](https://circleci.com/gh/graphcool/dashboard/tree/master.svg?style=svg)](https://circleci.com/gh/graphcool/dashboard/tree/master) | [![CircleCI](https://circleci.com/gh/graphcool/dashboard/tree/dev.svg?style=svg)](https://circleci.com/gh/graphcool/dashboard/tree/dev)

```sh
# install dependencies
npm install
# run local server on :4000 using the offical Graphcool API
BACKEND_ADDR="https://api.graph.cool" npm start
```
### IDE Setup (Webstorm)

We use a different version of TypeScript than the default Webstorm TypeScript compiler. That's why you have to do the following to get rid of all TypeScript errors.
Please run `npm install` before the setup.

1. Go to the `Preferences` _(macOS: "⌘ + ,")_ window
2. In the left list menu **select** `Languages & Frameworks > TypeScript`
3. **Click** on the `Edit...` button in the `Common` Panel
4. **Select** `Custom directory`
5. **Browse** to your `project directory` and then **select** `node_modules/typescript/lib` and **click** `OK`
6. **Click** `OK` again in the `Configure TypeScript Compiler`
7. **Click** `OK` in the `Preference` window



## Help & Community [![Slack Status](https://slack.graph.cool/badge.svg)](https://slack.graph.cool)

Join our [Slack community](http://slack.graph.cool/) if you run into issues or have questions. We love talking to you!

![](http://i.imgur.com/5RHR6Ku.png)
