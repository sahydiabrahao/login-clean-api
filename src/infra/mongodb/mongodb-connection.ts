import { MongoClient, type Collection } from 'mongodb'

export const MongoConnection = {
  client: null as MongoClient,

  async connect (url: string): Promise<void> {
    this.client = await MongoClient.connect(process.env.MONGO_URL)
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },

  map: (collection: any): any => {
    const { _id, ...accountWithoutId } = collection
    return Object.assign({}, accountWithoutId, { id: _id })
  }
}
