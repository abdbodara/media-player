<template>
  <div>
    <div class="flex h-screen overflow-hidden">
      <Sidebar
        :sidebarOpen="sidebarOpen"
        @close-sidebar="sidebarOpen = false"
      />

      <div
        class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden"
      >
        <Header
          :sidebarOpen="sidebarOpen"
          @toggle-sidebar="sidebarOpen = !sidebarOpen"
        />

        <main>
          <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <WelcomeBanner />

            <div class="sm:flex sm:justify-between sm:items-center mb-8">
              <DashboardAvatars />

              <div
                class="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2"
              >
                <FilterButton align="right" />
                <Datepicker align="right" />
                <button
                  class="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                >
                  <svg
                    class="w-4 h-4 fill-current opacity-50 shrink-0"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z"
                    />
                  </svg>
                  <span class="hidden xs:block ml-2">Add view</span>
                </button>
              </div>
            </div>
          </div>
        </main>

        <Banner />

        <vidstack
          :src="audioSrc"
          controls
          @play="onPlay"
          @pause="onPause"
          @seek="onSeek"
        />

        <div v-if="words.length === 0">Please wait for response...</div>
        <div v-else>
          <div class="transcript-container">
            <div
              v-for="word in words"
              :key="word.id"
              :class="{ highlighted: word.isHighlighted }"
              class="word"
            >
              {{ word.text }}
            </div>
          </div>
        </div>
        <!-- <div
            class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden"
          >
            <media-player  
              title="Sprite Fight"
              src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
              type="audio/mp4"
            >
              <media-provider></media-provider>
              <media-audio-layout v-if="words.length !== 0"></media-audio-layout>
            </media-player>
          </div> -->
          <div class="flex justify-center items-center h-screen">
  <div style="width: 500px; height: 500px; margin-top: 70px;">
    <media-player
      title="Sprite Fight"
      src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
    >
      <media-provider></media-provider>
      <media-video-layout
        thumbnails="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
      ></media-video-layout>
    </media-player>
  </div>
</div>



      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import Sidebar from "../partials/Sidebar.vue";
import Header from "../partials/Header.vue";
import WelcomeBanner from "../partials/dashboard/WelcomeBanner.vue";
import DashboardAvatars from "../partials/dashboard/DashboardAvatars.vue";
import FilterButton from "../components/DropdownFilter.vue";
import Datepicker from "../components/Datepicker.vue";
import Banner from "../partials/Banner.vue";
import "vidstack/bundle";
import axios from "axios";

export default {
  name: "Audioplayer",
  components: {
    Sidebar,
    Header,
    WelcomeBanner,
    DashboardAvatars,
    FilterButton,
    Datepicker,
    Banner,
  },
  props: {
    audioSrc: String,
  },
  setup() {
    const sidebarOpen = ref(false);
    const audioTranscription = ref("");
    const currentTimeInSeconds = ref(0);
    const words = ref([]);
    const audioPlayer = ref(null);

    const fetchAudio = async () => {
      try {
          const response = await axios.get(
            "http://127.0.0.1:8000/video_content/"
          );
        // const result = JSON.parse(response.data);
        // console.log(result,'resultresultresult');

        audioTranscription.value =
          response.data.result.transcription.full_transcript;

        words.value = createWordObjects(
          response.data.result.transcription.utterances
        );
      } catch (error) {
        console.error("Error fetching audio", error);
      }
    };
    const createWordObjects = (utterances) => {
      return utterances.flatMap((utterance) =>
        utterance.words.map((word, index) => ({
          id: index,
          text: word.word,
          start: word.start,
          end: word.end,
          isHighlighted: false,
        }))
      );
    };

    const highlightWords = () => {
      const currentTime = currentTimeInSeconds.value;
      words.value.forEach((word) => {
        word.isHighlighted =
          currentTime >= word.start && currentTime < word.end;
      });
    };

    const updateTime = () => {
      currentTimeInSeconds.value = audioPlayer.value.currentTime;
      highlightWords();
    };
    onMounted(() => {
      audioPlayer.value = document.querySelector("video");
      if (audioPlayer.value) {
        audioPlayer.value.addEventListener("timeupdate", updateTime);
        fetchAudio();
        setInterval(() => {
          highlightWords();
        }, 1000);
      }
    });

    onUnmounted(() => {
      if (audioPlayer.value) {
        audioPlayer.value.removeEventListener("timeupdate", updateTime);
      }
    });

    return {
      audioPlayer,

      sidebarOpen,
      audioTranscription,
      currentTimeInSeconds,
      words,
      fetchAudio,
    };
  },
};
</script>

<style scoped>
.lyrics {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
}

.transcript-container {
  display: flex;
  flex-wrap: wrap;
}

.word {
  display: inline;
  margin-right: 5px;
}

.highlighted {
  background-color: yellow;
}
</style>
