// THIS IS A HACK - do not copy this approach for similar situations without serious thought beforehand
class SideNavSyncer {
  setCallback (callback, callbackObj) {
    this.callback = callback
    this.callbackObj = callbackObj
  }

  notifySideNav () {
    if (this.callback && this.callbackObj && typeof this.callback === 'function') {
      this.callback.call(this.callbackObj)
    }
  }
}

export let sideNavSyncer = new SideNavSyncer()
