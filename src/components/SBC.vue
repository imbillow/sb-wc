<template>
  <div id="container" class="min-h-screen bg-gradient-to-br from-sky-50 to-white">
    <div class="container mx-auto p-4 sm:p-8 max-w-5xl">
      <h1 class="text-3xl sm:text-4xl font-bold text-sky-900 mb-6 sm:mb-8">SBC</h1>
      <main class="bg-white rounded-xl shadow-lg">
        <section class="p-4 sm:p-8">
          <form method="post" class="space-y-6">
            <section class="grid grid-cols-1 sm:grid-cols-[140px_minmax(0,_1fr)] lg:grid-cols-[160px_minmax(0,_1fr)] gap-2 sm:gap-6">
              <label for="profile" class="text-gray-700 font-medium sm:pt-2">Profile:</label>
              <textarea id="profile" class="w-full min-h-[100px] rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500" v-model.trim="profile"></textarea>

              <label for="subs" class="text-gray-700 font-medium sm:pt-2">Subs:</label>
              <textarea id="subs" class="w-full min-h-[100px] rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                @change="e => subs = e.target.value.trim().split('\n').filter(x => x.trim() !== '')"></textarea>

              <label for="filename" class="text-gray-700 font-medium sm:pt-2">Filename:</label>
              <textarea id="filename" class="w-full min-h-[60px] rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                v-model="filename"></textarea>
            </section>

            <hr class="my-6 border-gray-200" />

            <section class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-[140px_minmax(0,_1fr)] lg:grid-cols-[160px_minmax(0,_1fr)] gap-2 sm:gap-4 items-center">
                <label for="outurl" class="text-gray-700 font-medium">URL:</label>
                <input id="outurl" type="text" class="w-full p-3 bg-gray-50 rounded-lg border-gray-300" disabled v-model="url" />
              </div>

              <div class="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-4">
                <button type="button" class="btn-secondary w-full sm:w-auto" @click="copy">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  Copy URL
                </button>
                <a :href="url" class="btn-secondary w-full sm:w-auto text-center" @click="download">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                  Download
                </a>
              </div>
            </section>

            <div class="flex justify-center mt-8">
              <button type="button" class="btn-primary w-full sm:w-auto" @click="generate">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Generate
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { digest } from '../fun';

const subs = ref([])
const profile = ref('')
const filename = ref('')
const url = ref('')

async function copy() {
  await navigator.clipboard.writeText(url.value);
  alert('copied');
}

function download() {
  Astro.redirect('/login');
}

async function generate() {
  const body = JSON.stringify({
    profile: profile.value,
    subs: subs.value,
    filename: filename.value,
  });
  const hashString = await digest(body);
  console.log(hashString);

  const res = await fetch("/profile/upload", {
    method: "POST",
    body: body,
    headers: {
      "x-content-digest": `SHA-256=${hashString}`
    }
  });
  if (res.ok) {
    const reqj = await res.json();
    url.value = reqj.url;
  } else {
    const reqj = await res.json();
    console.error(reqj.message);
  }
}

</script>

<style>
.btn-primary {
  @apply inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-200;
}

.btn-secondary {
  @apply inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-200;
}

#container {
  font-family: Inter, Roboto, "Helvetica Neue", "Arial Nova", "Nimbus Sans",
    Arial, sans-serif;
}

textarea, input[type="text"] {
  @apply transition-all duration-200;
}

textarea:focus, input[type="text"]:focus {
  @apply transform scale-[1.01];
}

.container {
  @apply transition-all duration-300 ease-in-out;
}

@media (max-width: 640px) {
  textarea, input[type="text"] {
    @apply text-base;
  }
  
  .btn-primary, .btn-secondary {
    @apply text-sm;
  }
}
</style>
