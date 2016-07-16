class SideNavUpdater {
  function

  setSideNav (sideNav) {
    this.sideNav = sideNav
  }

  function

  updateSideNav () {
    this.sideNav.forceFetch()
  }
}

export let sideNavUpdater = new SideNavUpdater()
