import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import remark from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')
console.log(process.cwd());

export function getSortedPostsData() {
   // Get file names under /posts
   const fileNames = fs.readdirSync(postsDirectory)
   const allPostsData = fileNames.map(filename => {
      // remove ".md" from file namemto get id
      const id = filename.replace(/\.md$/, '')

      // read markdown file as a string
      const fullPath = path.join(postsDirectory, filename)
      const fileContents = fs.readFileSync(fullPath, 'utf8')

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents)

      // Combine the data with the id
      return ({
         id,
         ...matterResult.data
      })

   })

   // Sort posts by date
   return allPostsData.sort((a, b) => {
      if (a.date < b.date) {
         return 1
      } else {
         return -1
      }
   })
}

export function getAllPostIds() {
   const fileNames = fs.readdirSync(postsDirectory)

   // Return array
   // [{params:{id:'ssg-ssr'}},{params:{id:'pre-rendering'}}]

   return fileNames.map(fileName => {
      return ({
         params: {
            id: fileName.replace(/\.md$/, '')
         }
      })
   })
}

export async function getPostData(id) {
   const fullPath = path.join(postsDirectory, `${id}.md`)
   const fileContents = fs.readFileSync(fullPath, 'utf8')

   // use gray-matter for parse post metadata section
   const matterResult = matter(fileContents)


   // user remark to convert markdown into HTML String
   const processedContent = await remark()
      .use(html)
      .process(matterResult.content)
   const contentHtml = processedContent.toString()


   // Combine data with id and contentHtml
   return {
      id,
      contentHtml,
      ...matterResult.data
   }
}