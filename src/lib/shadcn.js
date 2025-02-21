import * as components from '@/components/ui';

export function installShadcn(app) {
  for (const key in components) {
    app.component(key, components[key]);
  }
}
