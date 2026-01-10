/**
 * Base TargetAdapter class for ebade.
 * Each platform (Next.js, HTML, Flutter, etc.) must implement this.
 */
export class TargetAdapter {
  constructor(colors, log) {
    this.colors = colors;
    this.log = log;
  }

  /**
   * Generates the platform-specific project structure and config files.
   */
  generateBoilerplate(config, targetPath) {
    throw new Error("generateBoilerplate() must be implemented");
  }

  /**
   * Generates a page using preferred platform syntax.
   */
  generatePage(page, design) {
    throw new Error("generatePage() must be implemented");
  }

  /**
   * Generates a component using preferred platform syntax.
   */
  generateComponent(componentName, design) {
    throw new Error("generateComponent() must be implemented");
  }

  /**
   * Generates an API route/handler.
   */
  generateApiRoute(endpoint) {
    throw new Error("generateApiRoute() must be implemented");
  }
}
