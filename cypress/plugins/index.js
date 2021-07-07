/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const fs = require('fs')
const path = require('path')
const convert = require('xml-js')
const { defineConfig } = require('vite')

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars

const getTemplateName = (xml) => {
  return JSON.parse(convert.xml2json(xml, { compact: true, spaces: 4 })).template.concept._text
}
module.exports = (on, config) => {
  const viteConfig = defineConfig({
    build: {
      lib: {
        entry: 'src/my-element.ts',
        formats: ['es']
      },
      rollupOptions: {
        external: /^lit-element/
      }
    }
  })
  on('task', {
    getTemplate() {
      const template = path.join(process.cwd(), 'template.opt')
      const xml = fs.readFileSync(template).toString()
      return { xml, name: getTemplateName(xml) }
    },
  })
  on('dev-server:start', (options) => {
    return startDevServer({ options, viteConfig })
  })
  return config
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
}
