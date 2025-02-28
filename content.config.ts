import { defineContentConfig, defineCollectionSource, defineCollection, z } from '@nuxt/content'
import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

const NOTION_TOKEN = process.env.NOTION_TOKEN
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID

let notion: Client | undefined
let n2m: NotionToMarkdown | undefined

if (NOTION_TOKEN && NOTION_DATABASE_ID) {
  notion = new Client({ auth: NOTION_TOKEN })
  n2m = new NotionToMarkdown({ notionClient: notion })
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
      return response.results.map((page: any) => `${page.id}.json`)
    } catch (error) {
      console.error('Error in getKeys:', error)
      return []
    }
  },
  getItem: async (key: string): Promise<string> => {
    if (!notion || !n2m) return JSON.stringify(null)
    try {
      const pageId = key.split('.')[0]!
      const pageData = await notion.pages.retrieve({ page_id: pageId }) as PageObjectResponse
      const pageContent = await notion.blocks.children.list({ block_id: pageId })
      
      // Convert blocks to markdown
      const mdBlocks = await n2m.blocksToMarkdown(pageContent.results)
      const markdown = n2m.toMarkdownString(mdBlocks)

      // Extract properties with proper type handling
      const properties = pageData.properties
      const title = properties.Title?.type === 'title' 
        ? properties.Title.title[0]?.plain_text || ''
        : ''
      const description = properties.Description?.type === 'rich_text'
        ? properties.Description.rich_text[0]?.plain_text || ''
        : ''
      const date = properties.Date?.type === 'date'
        ? properties.Date.date?.start || ''
        : ''

      const data = {
        id: pageData.id,
        title,
        description,
        date,
        body: markdown.parent,
        url: pageData.url
      }
      return JSON.stringify(data)
    } catch (error) {
      console.error('Error in getItem:', error)
      return JSON.stringify(null)
    }
  }
})

const notionCollection = defineCollection({
  type: 'data',
  source: notionSource,
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    date: z.string(),
    body: z.string(),
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