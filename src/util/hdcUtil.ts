import { exec } from 'child_process'
import { promisify } from 'util'
import { Config, Provide } from '@midwayjs/decorator'

const execAsync = promisify(exec)

@Provide()
export class HdcUtil {
  @Config('hdc')
  hdcConfig

  /**
   * Execute HDC command
   * @param args Command arguments
   * @returns Command output
   */
  async executeCommand(args: string): Promise<string> {
    const command = `${this.hdcConfig.command} ${args}`
    try {
      const { stdout, stderr } = await execAsync(command, {
        timeout: this.hdcConfig.timeout,
      })

      if (stderr) {
        console.error(`HDC command stderr: ${stderr}`)
      }

      return stdout.trim()
    } catch (error) {
      console.error(`Error executing HDC command: ${error.message}`)
      throw new Error(`HDC command failed: ${error.message}`)
    }
  }

  /**
   * Connect to a device
   * @param ip Device IP
   * @param port Device port
   */
  async connectDevice(ip: string, port: number): Promise<void> {
    await this.executeCommand(`connect ${ip}:${port}`)
  }

  /**
   * Install an application on the device
   * @param appPath Path to the application file
   * @param deviceIp Device IP
   * @param devicePort Device port
   */
  async installApp(appPath: string, deviceIp: string, devicePort: number): Promise<string> {
    // Connect to the device
    await this.connectDevice(deviceIp, devicePort)

    // Install the application
    const result = await this.executeCommand(`-t ${deviceIp}:${devicePort} install ${appPath}`)
    return result
  }

  /**
   * Disconnect from a device
   * @param ip Device IP
   * @param port Device port
   */
  async disconnectDevice(ip: string, port: number): Promise<void> {
    await this.executeCommand(`disconnect ${ip}:${port}`)
  }
}
