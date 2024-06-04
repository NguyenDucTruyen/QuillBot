import { createApp } from "vue";
import { useFavicon } from '@vueuse/core'

import Root from "./Root.vue";
import router from "./router";

import "./assets/scss/main.scss";

const icon = useFavicon()

icon.value = 'quill.svg' // change current icon

const app = createApp(Root);
app.use(router);

router.isReady().then(() => {
  app.mount("#root");
});
