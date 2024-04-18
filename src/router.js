import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from './pages/Dashboard.vue'
import FileUpload from './pages/FileUpload.vue'
import AudioPlayer from './components/AudioPlayer.vue'
import VideoPlayer from './components/VideoPlayer.vue'

const routerHistory = createWebHistory()

const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      component: Dashboard
    },
    {
      path: '/fileupload',
      component: FileUpload
    },
    {
      path: '/audioplayer',
      component: AudioPlayer
    },
    {
      path: '/videoplayer',
      component: VideoPlayer
    },
  ]
})

export default router
