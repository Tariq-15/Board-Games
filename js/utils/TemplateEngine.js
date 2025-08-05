class TemplateEngine {
    constructor() {
        this.templates = {};
        this.templateCache = {};
    }

    // Load template from file
    async loadTemplate(templateName) {
        if (this.templateCache[templateName]) {
            return this.templateCache[templateName];
        }

        // Determine the correct path based on current page location
        const currentPath = window.location.pathname;
        let templatePath;
        
        if (currentPath.includes('/pages/')) {
            // We're in a subdirectory, need to go up one level
            templatePath = `../templates/${templateName}.html`;
        } else {
            // We're in the root directory
            templatePath = `templates/${templateName}.html`;
        }

        try {
            const response = await fetch(templatePath);
            if (!response.ok) {
                throw new Error(`Failed to load template: ${templateName}`);
            }
            const template = await response.text();
            this.templateCache[templateName] = template;
            return template;
        } catch (error) {
            console.error(`Error loading template ${templateName}:`, error);
            return null;
        }
    }

    // Simple template rendering with variable replacement
    render(template, data) {
        if (!template) return '';

        let result = template;

        // Replace simple variables {{variable}}
        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            result = result.replace(regex, data[key] || '');
        });

        // Handle nested object properties {{object.property}}
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'object' && data[key] !== null) {
                Object.keys(data[key]).forEach(subKey => {
                    const regex = new RegExp(`{{${key}.${subKey}}}`, 'g');
                    result = result.replace(regex, data[key][subKey] || '');
                });
            }
        });

        return result;
    }

    // Render template with data
    async renderTemplate(templateName, data) {
        const template = await this.loadTemplate(templateName);
        if (!template) {
            console.error(`Template not found: ${templateName}`);
            return '';
        }
        return this.render(template, data);
    }

    // Render multiple items with the same template
    async renderMultiple(templateName, items, itemDataKey = 'item') {
        const template = await this.loadTemplate(templateName);
        if (!template) {
            console.error(`Template not found: ${templateName}`);
            return '';
        }

        return items.map(item => {
            const data = { [itemDataKey]: item };
            return this.render(template, data);
        }).join('');
    }

    // Preload all templates
    async preloadTemplates(templateNames) {
        const promises = templateNames.map(name => this.loadTemplate(name));
        await Promise.all(promises);
    }
} 