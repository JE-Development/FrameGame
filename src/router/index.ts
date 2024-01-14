import { createRouter, createWebHashHistory } from 'vue-router'
import type {RouteRecordRaw} from 'vue-router';
import MainPage from "../components/MainPage.vue";
import PlayerPage from "../components/PlayerPage.vue";
import JoinWithCode from "../components/JoinWithCode.vue";
import GamePage from "@/components/GamePage.vue";
import PublicPage from "@/components/PublicPage.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'MainPage',
        component: MainPage
    },
    {
        path: '/player',
        name: 'PlayerPage',
        component: PlayerPage
    },
    {
        path: '/code/:rc',
        name: 'JoinWithCode',
        component: JoinWithCode
    },
    {
        path: '/game',
        name: 'GamePage',
        component: GamePage
    },
    {
        path: '/public',
        name: 'PublicPage',
        component: PublicPage
    },

]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router