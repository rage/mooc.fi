import * as firebase from 'firebase'
import 'firebase/auth/dist/index.cjs'
import 'firebase/firestore/dist/index.cjs'
import 'firebase/database/dist/index.cjs'

import config from '../firebase.config.js'

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export const auth = firebase.auth()
export const db = firebase.database()
export default (firebase || { storage: () => ({ ref: null }) })
