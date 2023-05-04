/* eslint-disable @typescript-eslint/no-empty-interface */
// Add data types to window.navigator ambiently for implicit use in the entire project. See https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html#-reference-types- for more info.
/// <reference types="user-agent-data-types" />

declare interface Navigator extends NavigatorOSCpu {}
declare interface WorkerNavigator extends NavigatorOSCpu {}

declare interface NavigatorOSCpu {
  oscpu: string
}
