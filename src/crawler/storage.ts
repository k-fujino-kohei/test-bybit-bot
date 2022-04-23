import tmp, { file } from 'tmp'
import fs from 'fs/promises'
import fssync from 'fs'
import path from 'path'
import { google } from 'googleapis'

interface UploadResponse {
  id: string
  name: string
}

export class GoogleDrive {
  private readonly SERVICE_ACCOUNT_JSON_PATH = path.join(__dirname, 'service-account.json')
  private auth: any

  constructor () {
    this.auth = new google.auth.JWT({
      keyFile: this.SERVICE_ACCOUNT_JSON_PATH,
      scopes: ['https://www.googleapis.com/auth/drive']
    })
  }

  async upload (file: { path: string, name: string }, uploadTo: string): Promise<UploadResponse> {
    const drive = google.drive({ version: 'v3', auth: this.auth })
    /** NOTE: `/summary/`のID */
    // const summaryId = '1VP6fXLcvINKw2BfuwU0upvDlHM9rdxbE' as const
    const res = await drive.files.create({
      resource: {
        name: file.name,
        parents: [uploadTo]
      },
      media: {
        mimeType: 'text/csv',
        body: fssync.createReadStream(file.path)
      },
      fields: 'id, name'
    })
    return res.data
  }
}
