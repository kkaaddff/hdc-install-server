/**
 * Simple lock utility to ensure only one installation can run at a time
 */
export class LockUtil {
  private static isLocked = false
  private static queue: Array<{
    resolve: (value: boolean) => void
    reject: (reason: any) => void
  }> = []

  /**
   * Acquire a lock
   * @returns Promise that resolves when the lock is acquired
   */
  static async acquireLock(timeout = 10 * 60 * 1000): Promise<boolean> {
    // If not locked, acquire immediately
    if (!this.isLocked) {
      this.isLocked = true
      return true
    }

    // Otherwise, wait for the lock to be released
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        // Remove from queue
        const index = this.queue.findIndex((item) => item.resolve === resolve)
        if (index !== -1) {
          this.queue.splice(index, 1)
        }
        reject(new Error('Lock acquisition timed out'))
      }, timeout)

      // Add to queue
      this.queue.push({
        resolve: (value) => {
          clearTimeout(timeoutId)
          resolve(value)
        },
        reject: (reason) => {
          clearTimeout(timeoutId)
          reject(reason)
        },
      })
    })
  }

  /**
   * Release the lock
   */
  static releaseLock(): void {
    if (!this.isLocked) {
      return
    }

    // If there are waiting requests, resolve the next one
    if (this.queue.length > 0) {
      const next = this.queue.shift()
      next.resolve(true)
    } else {
      this.isLocked = false
    }
  }

  /**
   * Check if the lock is currently held
   */
  static isLockHeld(): boolean {
    return this.isLocked
  }

  /**
   * Get the number of waiting requests
   */
  static getQueueLength(): number {
    return this.queue.length
  }
}
