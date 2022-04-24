import fssync from 'fs'
import path from 'path'
import { drive_v3, google } from 'googleapis'

interface UploadResponse {
  id: string
  name: string
}

export class GoogleDrive {
  private readonly SERVICE_ACCOUNT_JSON_PATH = path.join(__dirname, 'service-account.json')
  private drive: drive_v3.Drive

  constructor () {
    const auth = new google.auth.JWT({
      keyFile: this.SERVICE_ACCOUNT_JSON_PATH,
      scopes: ['https://www.googleapis.com/auth/drive']
    })
    this.drive = google.drive({ version: 'v3', auth })
  }

  async upload (file: { path: string, name: string }, uploadTo: string): Promise<UploadResponse> {
    const res = await this.drive.files.create({
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
