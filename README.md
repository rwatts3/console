# Graphcool Dashboard

🚀  Official source of [dashboard.graph.cool](https://dashboard.graph.cool/) written in Typescript 2 and based on React & Relay

## Changelog

### [Milestone M2](https://github.com/graphcool/dashboard/milestone/2)
* You can finally set values to **null** if they are not required!
* Want to modify a list within the dashboard? Don't every write JSON ever again! We have a new popup for that!
* If you had 20 models you needed to scroll on the side bar to get to the actions. Now the models are in an expandable list with "swooooooosh" animations!
* We heard and we knew that the Project Settings Popup wasn't pretty. So we dedicated an entirely new page for the settings! You can even create and revoke system tokens from there. That'll enable you to control your Graphcool models, relations and actions manually! 🔧
* Adding a new model doesn't give you an annoying popup. It's now all in a sleek and awesome inline design. (Yeah, we have an awesome designer 🖌)
* Unsaved changes? no they won't be lost! We will prompt you to make sure you want to discard them.
* Instead of showing everybody the hash of password fields, we now hide it behind a rows of __*__s. Double-click to reveal the hash! 🎩
* Checkout what you browser title displays when you're on the dashboard! We put an emoji in there, just to let you spot it between your 200000 tabs. #giveYourTabSomeLove
* *Fixed*: We talked with Safari and clearly communicated our definition of our relationship. Now we are on the same page everything should be rendered correctly.

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
