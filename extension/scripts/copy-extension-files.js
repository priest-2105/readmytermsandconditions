import { copyFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

async function copyExtensionFiles() {
  try {
    // Create dist directory if it doesn't exist
    if (!existsSync('dist')) {
      await mkdir('dist')
    }

    // Copy manifest.json
    await copyFile('manifest.json', 'dist/manifest.json')
    console.log('✓ Copied manifest.json')

    // Create icons directory in dist
    if (!existsSync('dist/icons')) {
      await mkdir('dist/icons')
    }

    // Copy icon files
    const iconFiles = ['icon16.png', 'icon48.png', 'icon128.png']
    for (const iconFile of iconFiles) {
      const sourcePath = path.join('icons', iconFile)
      const destPath = path.join('dist', 'icons', iconFile)
      
      if (existsSync(sourcePath)) {
        await copyFile(sourcePath, destPath)
        console.log(`✓ Copied ${iconFile}`)
      } else {
        console.log(`⚠ Warning: ${iconFile} not found, using placeholder`)
        // Create a simple placeholder file
        await copyFile('icons/icon16.png', destPath)
      }
    }

    console.log('✓ Extension files copied successfully!')
  } catch (error) {
    console.error('Error copying extension files:', error)
    process.exit(1)
  }
}

copyExtensionFiles() 