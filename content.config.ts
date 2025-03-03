import { defineContentConfig, defineCollectionSource, defineCollection, z } from '@nuxt/content'
import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import { marked } from 'marked'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

const NOTION_TOKEN = process.env.NOTION_TOKEN
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID

let notion: Client | undefined
let n2m: NotionToMarkdown | undefined

if (NOTION_TOKEN && NOTION_DATABASE_ID) {
  notion = new Client({ auth: NOTION_TOKEN })
  n2m = new NotionToMarkdown({ notionClient: notion })
  console.log('✅ Notion client initialized')
} else {
  console.warn('⚠️ Notion source disabled: Missing environment variables NOTION_TOKEN and/or NOTION_DATABASE_ID')
}

// Function to clean HTML by removing unnecessary newlines between tags
function cleanHtml(html: string): string {
  return html
    // Remove newlines between closing and opening tags
    .replace(/>\s*\n+\s*</g, '><')
    // Remove newlines after opening tags
    .replace(/<([^>]+)>\s*\n+/g, '<$1>')
    // Remove newlines before closing tags
    .replace(/\s*\n+\s*(<\/[^>]+>)/g, '$1')
    // Preserve single space between text content
    .replace(/>\s{2,}</g, '> <');
}

const notionSource = defineCollectionSource({
  getKeys: async () => {
    if (!notion || !NOTION_DATABASE_ID) return []
    try {
      console.log('🔍 Querying Notion database:', NOTION_DATABASE_ID)
      const response = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
        filter: {
          property: 'Status',
          select: { equals: 'Published' }
        }
      })
      console.log(`✨ Found ${response.results.length} published pages`)
      return response.results.map((page: any) => `${page.id}.json`)
    } catch (error) {
      console.error('❌ Error in getKeys:', error)
      return []
    }
  },
  getItem: async (key: string): Promise<string> => {
    if (!notion || !n2m) return JSON.stringify(null)
    try {
      const pageId = key.split('.')[0]!
      console.log(`📄 Fetching page: ${pageId}`)

      const pageData = await notion.pages.retrieve({ page_id: pageId }) as PageObjectResponse

      const pageContent = await notion.blocks.children.list({ block_id: pageId })
      
      // Convert blocks to markdown
      const mdBlocks = await n2m.blocksToMarkdown(pageContent.results)
      const markdown = await n2m.toMarkdownString(mdBlocks)
      const markdownContent = typeof markdown === 'string' ? markdown : markdown.parent

      // Extract properties with proper type handling
      const properties = pageData.properties
      const title = properties.Title?.type === 'title' 
        ? properties.Title.title[0]?.plain_text || ''
        : ''
      const description = properties.Description?.type === 'rich_text'
        ? properties.Description.rich_text[0]?.plain_text || ''
        : ''
      const postedDate = properties.Date?.type === 'date'
        ? properties.Date.date?.start || ''
        : ''

      // Parse markdown to HTML and clean it
      const parsedHtml = marked.parse(String(markdownContent || '').trim());
      const cleanedHtml = cleanHtml(parsedHtml);

      const data = {
        id: pageData.id,
        title,
        description,
        postedDate,
        body: cleanedHtml.trim(),
        url: pageData.url
      }

      console.log('✅ Processed page data:', data.title)

      return JSON.stringify(data)
    } catch (error) {
      console.error('❌ Error in getItem:', error)
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
    postedDate: z.string(),
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