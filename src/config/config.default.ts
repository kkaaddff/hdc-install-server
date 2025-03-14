import { MidwayAppInfo, MidwayConfig } from '@midwayjs/core'
import fse from 'fs-extra'
import path from 'path'

export default (appInfo: MidwayAppInfo) => {
  const config = {
    // use for cookie sign key, should change to your own and keep security
    keys: '1683452916943_7754',
    koa: {
      port: 7001,
    },
  } as MidwayConfig

  config.cors = {
    credentials: true,
    allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'SonicToken', 'FTAToken', 'x-page-url'],
    origin: ({ ctx }: any) => {
      return ctx.header.origin
    },
    exposeHeaders: '*',
    keepHeadersOnError: true,
    maxAge: 6000,
  }

  const filesCachePath = path.join(appInfo.baseDir, '..', 'files-cache')
  const dbPath = path.join(appInfo.baseDir, '..', 'db')

  fse.ensureDirSync(filesCachePath)
  fse.ensureDirSync(dbPath)

  /**
   * 静态文件托管
   */
  config.staticFile = {
    buffer: true,
    dirs: {
      default: {
        prefix: '/files-cache',
        dir: filesCachePath,
      },
    },
  }

  config.cache = {
    dir: filesCachePath,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  }

  config.busboy = {
    mode: 'file',
    tmpdir: path.join(filesCachePath, 'midway-busboy-files'),
    cleanTimeout: 5 * 60 * 1000, // 5 minutes
  }
  config.typeorm = {
    dataSource: {
      default: {
        type: 'sqlite',
        database: path.join(dbPath, 'default.sqlite'),
        synchronize: true,
        logging: true,
        entities: [
          'entity', // 特定目录
          '**/*.entity.{j,t}s', // 通配加后缀匹配
        ],
      },
    },
  }
  return config
}
