import { defineCollectionSource } from '@nuxt/content'
import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'

// Check for required environment variables
const NOTION_TOKEN = process.env.NOTION_TOKEN
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID

let notion, n2m

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
          status: {
            equals: 'Published'
          }
        }
      })

      console.log('Notion database query response:', response.results);
      
      return response.results.map(page => `${page.id}.md`)
    } catch (error) {
      console.error('❌ Error fetching Notion database:', error.message)
      return []
    }
  },

  getItem: async (key) => {
    if (!notion || !n2m) return null

    try {
      const pageId = key.replace('.md', '')
      const page = await notion.pages.retrieve({ page_id: pageId })
      const mdblocks = await n2m.pageToMarkdown(pageId)
      const markdown = n2m.toMarkdownString(mdblocks)

      console.log(`Fetched page ${pageId}:`, {
        title: page.properties.Title.title[0].plain_text,
        date: page.properties.Date?.date?.start,
        description: page.properties.Description?.rich_text?.[0]?.plain_text || '',
      })

      return {
        title: page.properties.Title.title[0].plain_text,
        date: page.properties.Date?.date?.start,
        content: markdown,
        description: page.properties.Description?.rich_text?.[0]?.plain_text || '',
        slug: `/writing/${pageId}`,
      }
    } catch (error) {
      console.error(`❌ Error fetching Notion page ${key}:`, error.message)
      return null
    }
  }
})

export default defineContentConfig({
  collections: {
    notion: {
      source: notionSource
    }
  }
}) 