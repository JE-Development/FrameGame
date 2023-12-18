import { createRouter, createWebHashHistory } from 'vue-router'
import type {RouteRecordRaw} from 'vue-router';
import MainPage from "../components/MainPage.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'MainPage',
        component: MainPage
    },

]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router