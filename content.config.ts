import { defineContentConfig, defineCollection, defineCollectionSource, z } from '@nuxt/content'
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
    console.log('🔍 [Notion Source] getKeys called')
    if (!notion || !NOTION_DATABASE_ID) {
      console.warn('🚫 [Notion Source] getKeys: Notion client or database ID not available')
      return []
    }

    try {
      console.log('📚 [Notion Source] Querying database:', NOTION_DATABASE_ID)
      const response = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
        filter: {
          property: 'Status',
          select: {
            equals: 'Published'
          }
        }
      })

      const keys = response.results.map(page => `${page.id}.md`)
      console.log('✅ [Notion Source] Found keys:', keys)
      return keys
    } catch (error) {
      console.error('❌ [Notion Source] getKeys error:', error)
      throw error
    }
  },

  getItem: async (key) => {
    console.log('🔍 [Notion Source] getItem called for:', key)
    if (!notion || !n2m) {
      console.warn('🚫 [Notion Source] getItem: Notion client not available')
      return null
    }

    try {
      const pageId = key.replace('.md', '')
      console.log('📄 [Notion Source] Fetching page:', pageId)
      
      const page = await notion.pages.retrieve({ page_id: pageId })
      const mdblocks = await n2m.pageToMarkdown(pageId)
      const markdown = n2m.toMarkdownString(mdblocks)

      const item = {
        title: page.properties.Title.title[0].plain_text,
        date: page.properties.Date?.date?.start,
        content: markdown,
        description: page.properties.Description?.rich_text?.[0]?.plain_text || '',
        slug: `/writing/${pageId}`,
        _id: pageId,
        _type: 'markdown',
        _source: 'notion'
      }

      console.log('✅ [Notion Source] Successfully processed item:', {
        id: pageId,
        title: item.title,
        slug: item.slug
      })

      return item
    } catch (error) {
      console.error('❌ [Notion Source] getItem error for key:', key, error)
      throw error
    }
  }
})

export default defineContentConfig({
  collections: {
    /**
     * This is collection for content-wind theme
     * Create `content.config.ts` in project root to overwrite this
     */
    content: defineCollection({
      type: 'page',
      source: '**',
      schema: z.object({
        layout: z.string(),
      }),
    }),

    notion: defineCollection({
      type: 'data',
      source: notionSource,
      schema: z.object({
        title: z.string(),
        date: z.string().optional(),
        content: z.string(),
        description: z.string().optional(),
        slug: z.string(),
        _id: z.string(),
        _type: z.string(),
        _source: z.string()
      })
    })
  },
})
