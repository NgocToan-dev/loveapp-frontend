import type { App } from 'vue'
import { vTooltip } from '@/directives/tooltip'

export default {
  install(app: App) {
    app.directive('tooltip', vTooltip)
  }
}
