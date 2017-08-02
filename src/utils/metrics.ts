import { ITracker, Tracker, MockTracker } from 'graphcool-metrics'

let tracker: ITracker
tracker = __METRICS_ENDPOINT__ ? new Tracker(__METRICS_ENDPOINT__) : new MockTracker()

export default tracker
