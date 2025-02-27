const { Client } = require('@notionhq/client')
const { NotionToMarkdown } = require('notion-to-md')
require('dotenv').config({ path: '.env.secrets' })

const NOTION_TOKEN = process.env.NOTION_TOKEN
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID

async function testNotion() {
  console.log('Environment Check:')
  console.log('NOTION_TOKEN:', NOTION_TOKEN ? '✓ Set' : '✗ Missing')
  console.log('NOTION_DATABASE_ID:', NOTION_DATABASE_ID ? '✓ Set' : '✗ Missing')
  
  if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
    console.error('❌ Missing environment variables!')
    return
  }

  const notion = new Client({ 
    auth: NOTION_TOKEN.trim().replace(/['"]/g, '')
  })

  try {
    console.log('\nTesting basic Notion access...')
    const user = await notion.users.me()
    console.log('✓ Successfully connected as:', user.name)

    console.log('\nTesting database access...')
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID.trim()
    })
    
    console.log('✓ Successfully accessed database')
    console.log(`Found ${response.results.length} pages`)
  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.code === 'unauthorized') {
      console.log('\nPossible issues:')
      console.log('1. Token might have whitespace or newlines')
      console.log('2. Token might be expired')
      console.log('3. Integration might not have been set up correctly')
    }
  }
}

testNotion() 