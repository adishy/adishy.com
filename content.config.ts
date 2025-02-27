import { defineContentConfig, defineCollectionSource, defineCollection, z } from '@nuxt/content'
import { Client } from '@notionhq/client'

const NOTION_TOKEN = process.env.NOTION_TOKEN
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID

let notion

if (NOTION_TOKEN && NOTION_DATABASE_ID) {
  notion = new Client({ auth: NOTION_TOKEN })
  console.log('Notion source enabled')
} else {
  console.warn('⚠️ Notion source disabled: Missing environment variables NOTION_TOKEN and/or NOTION_DATABASE_ID')
}

const notionSource = defineCollectionSource({
  getKeys: async () => {
    if (!notion || !NOTION_DATABASE_ID) return []
    try {
      const response = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
        filter: {
          property: 'Status',
          select: { equals: 'Published' }
        }
      })
      return response.results.map(page => `${page.id}.json`)
    } catch (error) {
      console.error('Error in getKeys:', error)
      return []
    }
  },
  getItem: async (key) => {
    if (!notion) return null
    try {
      const pageId = key.split('.')[0]
      const pageData = await notion.pages.retrieve({ page_id: pageId })
      let data = {
        id: pageData.id,
        object: pageData.object,
        created_time: pageData.created_time,
        last_edited_time: pageData.last_edited_time,
        properties: pageData.properties,
        url: pageData.url
      }
      console.log(data)
      return data;
    } catch (error) {
      console.error('Error in getItem:', error)
      return null
    }
  }
})

const notionCollection = defineCollection({
  type: 'data',
  source: notionSource,
  schema: z.object({
    id: z.string(),
    object: z.string(),
    created_time: z.string(),
    last_edited_time: z.string(),
    properties: z.any(),
    url: z.string()
  })
})


export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**',
      schema: z.object({
        layout: z.string()
      })
    }),
    notion: notionCollection
  }
})

// import { defineContentConfig, defineCollectionSource, defineCollection, z } from '@nuxt/content'

// const hackernewsSource = defineCollectionSource({
//   getKeys: () => {
//     return fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
//       .then(res => res.json())
//       .then(data => data.map((key: string) => `${key}.json`))
//   },
//   getItem: (key: string) => {
//     const id = key.split('.')[0]
//     return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
//       .then(res => res.json())
//   },
// })

// const hackernews = defineCollection({
//   type: 'data',
//   source: hackernewsSource,
//   schema: z.object({
//     title: z.string(),
//     date: z.date(),
//     type: z.string(),
//     score: z.number(),
//     url: z.string(),
//     by: z.string(),
//   }),
// })

// export default defineContentConfig({
//   collections: {
//     hackernews,
//   },
// })