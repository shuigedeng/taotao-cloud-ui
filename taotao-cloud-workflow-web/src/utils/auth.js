import workflow from '@/utils/workflow'

export function getToken() {
  return workflow.storageGet('token')
}

export function setToken(token) {
  return workflow.storageSet({ token })
}

export function removeToken() {
  return workflow.storageRemove('token')
}

export function getLock() {
  return workflow.storageGet('lock')
}

export function setLock(lock) {
  return workflow.storageSet({ lock })
}
export function removeLock() {
  return workflow.storageRemove('lock')
}
