import mjml2html from 'mjml';
import path from 'path';
import fs from 'fs';

export class EmailTemplateService {
  private templateDir: string;
  private compiledTemplates: Map<string, string>;

  constructor() {
    this.templateDir = path.join(__dirname, '../templates');
    this.compiledTemplates = new Map();
  }

  initialize() {
    const templateFiles = fs.readdirSync(this.templateDir);
    for (const file of templateFiles) {
      if (file.endsWith('.mjml')) {
        const name = path.basename(file, '.mjml');
        const content = fs.readFileSync(path.join(this.templateDir, file), 'utf-8');
        const { html } = mjml2html(content);
        this.compiledTemplates.set(name, html);
      }
    }
  }

  getTemplate(name: string): string | undefined {
    return this.compiledTemplates.get(name);
  }

  renderTemplate(name: string, variables: Record<string, string>): string {
    let html = this.compiledTemplates.get(name);
    if (!html) {
      throw new Error(`Template '${name}' not found`);
    }
    for (const [key, value] of Object.entries(variables)) {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return html;
  }
}
