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
  console.log('✅ Notion client initialized')
} else {
  console.warn('⚠️ Notion source disabled: Missing environment variables NOTION_TOKEN and/or NOTION_DATABASE_ID')
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
      // Return markdown file names instead of JSON
      return response.results.map((page: any) => `${page.id}.md`)
    } catch (error) {
      console.error('❌ Error in getKeys:', error)
      return []
    }
  },
  getItem: async (key: string): Promise<string> => {
    if (!notion || !n2m) return ''
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
      const section = properties.Section?.type === 'select'
        ? properties.Section.select?.name || ''
        : ''
      // Extract layout with default value
      const layout = properties.Layout?.type === 'select'
        ? properties.Layout.select?.name || 'default'
        : 'default'

      // Format as a markdown file with frontmatter
      const frontmatter = `---
title: ${title}
description: ${description}
postedDate: ${postedDate}
url: ${pageData.url}
id: ${pageData.id}
section: ${section}
layout: ${layout}
---

`;

      // Return complete markdown file with frontmatter
      const content = frontmatter + (markdownContent || '').trim();
      console.log(`✅ Processed page data: [${section}][layout: ${layout}]: ${title}`)

      return content
    } catch (error) {
      console.error('❌ Error in getItem:', error)
      return ''
    }
  }
})

const notionCollection = defineCollection({
  // Use 'page' type instead of 'content'
  type: 'page',
  source: notionSource,
  // Schema for the frontmatter
  schema: z.object({
    index: z.number(),
    title: z.string(),
    description: z.string(),
    postedDate: z.string(),
    url: z.string(),
    id: z.string(),
    section: z.string(),
    layout: z.enum(['default', 'full-width', 'posts']).default('default')
  })
})

export default defineContentConfig({
  collections: {
    // Keep content collection for future use but not actively used
    content: defineCollection({
      type: 'page',
      source: '**',
      schema: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        layout: z.string().optional(),
        navigation: z.object({
          title: z.string()
        }).optional()
      })
    }),
    // Primary content source
    notion: notionCollection
  }
})