<template>
  <div>
     <div class="flex h-screen overflow-hidden">

<!-- Sidebar -->
<Sidebar :sidebarOpen="sidebarOpen" @close-sidebar="sidebarOpen = false" />

<!-- Content area -->
<div class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
  
  <!-- Site header -->
  <Header :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

  <main>
    <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

      <!-- Welcome banner -->
      <WelcomeBanner />
      
      <!-- Dashboard actions -->
      <div class="sm:flex sm:justify-between sm:items-center mb-8">

        <!-- Left: Avatars -->
        <DashboardAvatars />

        <!-- Right: Actions -->
        <div class="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">

          <!-- Filter button -->
          <FilterButton align="right" />
          <!-- Datepicker built with flatpickr -->
          <Datepicker align="right" />
          <!-- Add view button -->
          <button class="btn bg-indigo-500 hover:bg-indigo-600 text-white">
              <svg class="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
              </svg>
              <span class="hidden xs:block ml-2">Add view</span>
          </button>
        </div>

      </div>



    </div>
  </main>

  <Banner />
  <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh;">
    <label
      for="file-upload"
      style="
        display: inline-block;
        padding: 10px 20px;
        cursor: pointer;
        background-color: #3498db;
        color: #fff;
        border-radius: 5px;
        font-size: 16px;
        margin-bottom: 20px;
      "
    >
      <i class="fas fa-cloud-upload-alt"></i> Choose File
    </label>
    <input
      id="file-upload"
      type="file"
      @change="onFileUpload"
      style="display: none"
    />
    <div style="display: flex; justify-content: center; width: 100%;">
      <AudioPlayer :audioSrc="audioUrl" />
    </div>
    <div style="display: flex; justify-content: center; width: 100%;">
      <TranscriptDisplay :transcriptData="transcriptData" :audioSrc="audioUrl" />
    </div>
  </div>
</div> 
<media-player title="Sprite Fight" src="https://files.vidstack.io/sprite-fight/audio.mp3">
    <media-provider></media-provider>
    <media-audio-layout></media-audio-layout>
  </media-player>
</div>

</div>
</template>

  
  <script>
import { ref } from 'vue'
import Sidebar from '../partials/Sidebar.vue'
import Header from '../partials/Header.vue'
import WelcomeBanner from '../partials/dashboard/WelcomeBanner.vue'
import DashboardAvatars from '../partials/dashboard/DashboardAvatars.vue'
import FilterButton from '../components/DropdownFilter.vue'
import Datepicker from '../components/Datepicker.vue'


import Banner from '../partials/Banner.vue'
  
  export default {
    name :'FileUpload',
    components:{
      Sidebar,
    Header,
    WelcomeBanner,
    DashboardAvatars,
    FilterButton,
    Datepicker,
  
    Banner,
    },
    setup() {

const sidebarOpen = ref(false)

return {
  sidebarOpen,
}  
},
    data() {
      return {
        audioUrl: null,
        transcriptData: null,
      };
    },

    methods: {
      async onFileUpload(event) {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append("audio", file);
        // Send file to backend API for processing with Gladia.io
        const response = await axios.post("/api/process-audio", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.audioUrl = URL.createObjectURL(file);
        this.transcriptData = response.data;
      },
    },
  };
  </script>
  
  <style scoped>
  .custom-file-input {
    width: 300px; /* Adjust width as desired */
    height: 50px; /* Adjust height as desired */
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  </style>
  